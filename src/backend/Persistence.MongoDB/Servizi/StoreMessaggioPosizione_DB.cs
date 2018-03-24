//-----------------------------------------------------------------------
// <copyright file="StoreMessaggioPosizione_DB.cs" company="CNVVF">
// Copyright (C) 2017 - CNVVF
//
// This file is part of VVFGeoFleet.
// VVFGeoFleet is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// SOVVF is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see http://www.gnu.org/licenses/.
// </copyright>
//-----------------------------------------------------------------------
using System;
using System.Linq;
using System.Threading.Tasks;
using log4net;
using Modello.Classi;
using Modello.Servizi.Persistence;
using MongoDB.Driver;

namespace Persistence.MongoDB.Servizi
{
    internal class StoreMessaggioPosizione_DB : IStoreMessaggioPosizione
    {
        private static readonly ILog log = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        private readonly IMongoCollection<MessaggioPosizione> messaggiPosizioneCollection;

        public StoreMessaggioPosizione_DB(IMongoCollection<MessaggioPosizione> messaggiPosizioneCollection)
        {
            this.messaggiPosizioneCollection = messaggiPosizioneCollection ?? throw new ArgumentNullException(nameof(messaggiPosizioneCollection));
        }

        public void Store(MessaggioPosizione newMessage)
        {
            if (!string.IsNullOrWhiteSpace(newMessage.Id))
                throw new ArgumentException("Must be null", nameof(MessaggioPosizione.Id));

            //fetch time and id of the last stored message for this vehicle
            var filter = Builders<MessaggioPosizione>.Filter
                .And(
                    Builders<MessaggioPosizione>.Filter.Eq(m => m.Ultimo, true),
                    Builders<MessaggioPosizione>.Filter.Eq(m => m.CodiceMezzo, newMessage.CodiceMezzo)
                );

            var lastStoredMessageData = this.messaggiPosizioneCollection.Find(filter)
                .Sort(Builders<MessaggioPosizione>.Sort.Descending(m => m.IstanteAcquisizione))
                .Project(m => new
                {
                    msgTime = m.IstanteAcquisizione,
                    msgId = m.Id
                })
                .ToList();

            //Check whether more messages are marked as last (it's an anomaly). In case, fix.
            if (lastStoredMessageData.Count >= 2)
            {
                var idsToReset = lastStoredMessageData.Skip(1).Select(m => m.msgId);
                log.Warn($"More messages found marked as last. vehicleCode: { newMessage.CodiceMezzo } ids: { string.Join(", ", idsToReset) } ");
                this.messaggiPosizioneCollection.UpdateManyAsync(
                    Builders<MessaggioPosizione>.Filter.In(m => m.Id, idsToReset),
                    Builders<MessaggioPosizione>.Update.Set(m => m.Ultimo, false));
                log.Info($"Anomalous ids have been reset. Anomaly fixed.");
            }

            var noLastMessage = !lastStoredMessageData.Any();

            if (noLastMessage)
                this.InsertAsFirstMessage(newMessage);
            else
            {
                var singleLastStoredMessageData = lastStoredMessageData[0];
                var newMessageIsMoreRecent = newMessage.IstanteAcquisizione >= singleLastStoredMessageData.msgTime;

                if (newMessageIsMoreRecent)
                {
                    this.InsertMoreRecentMessage(newMessage, singleLastStoredMessageData.msgId);
                }
                else
                {
                    this.InsertLessRecentMessage(newMessage);
                }
            }
        }

        /// <summary>
        ///   Insert the first message for a vehicle
        /// </summary>
        /// <param name="newMessage">The message to be inserted</param>
        private void InsertAsFirstMessage(MessaggioPosizione newMessage)
        {
            newMessage.Ultimo = true;
            newMessage.IstanteArchiviazione = DateTime.UtcNow;
            this.messaggiPosizioneCollection.InsertOne(newMessage);
        }

        /// <summary>
        ///   Insert a message when there are more recent messages already stored.
        /// </summary>
        /// <param name="newMessage">The message to be inserted</param>
        private void InsertLessRecentMessage(MessaggioPosizione newMessage)
        {
            newMessage.Ultimo = false;
            newMessage.IstanteArchiviazione = DateTime.UtcNow;
            this.messaggiPosizioneCollection.InsertOne(newMessage);
        }

        /// <summary>
        ///   Insert a message when it is the more recent message.
        /// </summary>
        /// <param name="newMessage">The message to be inserted</param>
        private void InsertMoreRecentMessage(MessaggioPosizione newMessage, string lastStoredMsgId)
        {
            newMessage.Ultimo = true;
            newMessage.IstanteArchiviazione = DateTime.UtcNow;
            var insertTask = this.messaggiPosizioneCollection.InsertOneAsync(newMessage);

            var updateTask = this.messaggiPosizioneCollection.UpdateOneAsync(
                m => m.Id == lastStoredMsgId,
                Builders<MessaggioPosizione>.Update.Set(m => m.Ultimo, false));

            Task.WaitAll(insertTask, updateTask);
        }
    }
}
