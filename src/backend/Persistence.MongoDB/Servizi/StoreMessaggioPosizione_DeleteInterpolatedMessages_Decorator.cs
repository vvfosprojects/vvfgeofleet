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
using System.Text;
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

        public void Store(MessaggioPosizione newMessage)
        {
            this.decorated.Store(newMessage);

            var lastThreeMessages = this.messaggiPosizioneCollection.Find(m => m.CodiceMezzo == newMessage.CodiceMezzo)
                .SortByDescending(m => m.IstanteAcquisizione)
                .ThenByDescending(m => m.Id)
                .Limit(3)
                .ToList();

            if (lastThreeMessages.Count == 3)
            {
                if (this.AllInTheSamePosition(lastThreeMessages))
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
        }

        private bool AllInTheSamePosition(IList<MessaggioPosizione> messages)
        {
            var first = messages.First();
            var allButFirst = messages.Skip(1);

            return allButFirst.All(m => this.AreCloseEnough(first.Localizzazione, m.Localizzazione));
        }

        private bool AreCloseEnough(Localizzazione loc1, Localizzazione loc2)
        {
            var distance = loc1.GetDistanceTo(loc2);
            return distance <= InterpolationThreshold_mt;
        }
    }
}
