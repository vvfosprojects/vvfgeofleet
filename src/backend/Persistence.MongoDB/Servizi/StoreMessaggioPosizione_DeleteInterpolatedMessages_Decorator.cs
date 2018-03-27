//-----------------------------------------------------------------------
// <copyright file="StoreMessaggioPosizione_DeleteInterpolatedMessages_Decorator.cs" company="CNVVF">
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
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Modello.Classi;
using Modello.Servizi.Persistence;
using MongoDB.Driver;

namespace Persistence.MongoDB.Servizi
{
    internal class StoreMessaggioPosizione_DeleteInterpolatedMessages_Decorator : IStoreMessaggioPosizione
    {
        private readonly IStoreMessaggioPosizione decorated;
        private readonly IMongoCollection<MessaggioPosizione> messaggiPosizioneCollection;

        public StoreMessaggioPosizione_DeleteInterpolatedMessages_Decorator(
            IStoreMessaggioPosizione decorated,
            IMongoCollection<MessaggioPosizione> messaggiPosizioneCollection
            )
        {
            this.decorated = decorated ?? throw new ArgumentNullException(nameof(decorated));
            this.messaggiPosizioneCollection = messaggiPosizioneCollection ?? throw new ArgumentNullException(nameof(messaggiPosizioneCollection));
            this.InterpolationThreshold_mt = 1;
        }

        /// <summary>
        ///   Interpolation works among messages below this threshold.
        /// </summary>
        public float InterpolationThreshold_mt { get; set; }

        /// <summary>
        ///   Try to interpolate the three most recent messages. Interpolation only works if the
        ///   first and the third message do not interpolate.
        /// </summary>
        /// <param name="newMessage">
        ///   The message to be stored. Storage is in charge of the decorated instance.
        /// </param>
        public void Store(MessaggioPosizione newMessage)
        {
            this.decorated.Store(newMessage);

            var lastThreeMessages = this.messaggiPosizioneCollection.Find(m => m.CodiceMezzo == newMessage.CodiceMezzo)
                .SortByDescending(m => m.IstanteAcquisizione)
                .ThenByDescending(m => m.Id)
                .Limit(3)
                .ToList();

            if ((lastThreeMessages.Count == 3) &&
                firstAndThirdMessagesDoNotInterpolate(lastThreeMessages) &&
                this.AllInTheSamePosition(lastThreeMessages))
            {
                var interpolatingMessage = lastThreeMessages[0];
                var msgToInterpolate = lastThreeMessages[1];
                var lastInterpolationData = msgToInterpolate.InterpolationData ?? new InterpolationData(0, 0, null);

                var interpolationData = new InterpolationData(
                    (int)(lastInterpolationData.Length_sec +
                        newMessage.IstanteAcquisizione.Subtract(msgToInterpolate.IstanteAcquisizione).TotalSeconds),
                    lastInterpolationData.Messages + 1,
                    msgToInterpolate.IstanteAcquisizione);

                var deleteTask = this.messaggiPosizioneCollection.DeleteOneAsync(m => m.Id == msgToInterpolate.Id);
                var updateTask = this.messaggiPosizioneCollection.UpdateOneAsync(
                    m => m.Id == interpolatingMessage.Id,
                    Builders<MessaggioPosizione>.Update.Set(m => m.InterpolationData, interpolationData));

                Task.WaitAll(deleteTask, updateTask);
            }
        }

        /// <summary>
        ///   Checks whether the list contains three messages and the first and the third do not interpolate.
        /// </summary>
        /// <param name="lastThreeMessages">The list to be checked</param>
        /// <returns>Returns true if and only if the check passes</returns>
        private bool firstAndThirdMessagesDoNotInterpolate(List<MessaggioPosizione> lastThreeMessages)
        {
            return
                (lastThreeMessages.Count == 3) &&
                (lastThreeMessages[0].InterpolationData == null) &&
                (lastThreeMessages[2].InterpolationData == null);
        }

        /// <summary>
        ///   Checks whether the list contains messages falling close one each other.
        /// </summary>
        /// <param name="messages">The messages to be checked</param>
        /// <returns>True if (and only if) the message are close enough</returns>
        private bool AllInTheSamePosition(IList<MessaggioPosizione> messages)
        {
            var first = messages.First();
            var allButFirst = messages.Skip(1);

            return allButFirst.All(m => this.AreCloseEnough(first.Localizzazione, m.Localizzazione));
        }

        /// <summary>
        ///   Checks whether two messages fall close one another.
        /// </summary>
        /// <param name="messages">The messages to be checked</param>
        /// <returns>True if (and only if) the message are close enough</returns>
        private bool AreCloseEnough(Localizzazione loc1, Localizzazione loc2)
        {
            var distance = loc1.GetDistanceTo(loc2);
            return distance <= InterpolationThreshold_mt;
        }
    }
}
