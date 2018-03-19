//-----------------------------------------------------------------------
// <copyright file="StoreMessaggioPosizione_LogTooHighVelocities_Decorator.cs" company="CNVVF">
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
using log4net;
using Modello.Classi;
using Modello.Servizi.Persistence;
using MongoDB.Driver;

namespace Persistence.MongoDB.Servizi
{
    internal class StoreMessaggioPosizione_LogTooHighVelocities_Decorator : IStoreMessaggioPosizione
    {
        private static readonly ILog log = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        private readonly IStoreMessaggioPosizione decorated;
        private readonly IMongoCollection<MessaggioPosizione> messaggiPosizioneCollection;

        public StoreMessaggioPosizione_LogTooHighVelocities_Decorator(
            IStoreMessaggioPosizione decorated,
            IMongoCollection<MessaggioPosizione> messaggiPosizioneCollection
            )
        {
            this.decorated = decorated ?? throw new ArgumentNullException(nameof(decorated));
            this.messaggiPosizioneCollection = messaggiPosizioneCollection ?? throw new ArgumentNullException(nameof(messaggiPosizioneCollection));
            this.VelocityThreshold_Kmh = 500;
        }

        /// <summary>
        ///   Threshold beyond which velocities are logged
        /// </summary>
        public float VelocityThreshold_Kmh { get; set; }

        public void Store(MessaggioPosizione newMessage)
        {
            this.decorated.Store(newMessage);

            var lastTwoMessages = this.messaggiPosizioneCollection.Find(m => m.CodiceMezzo == newMessage.CodiceMezzo)
                .SortByDescending(m => m.IstanteAcquisizione)
                .Limit(2)
                .ToList();

            if (lastTwoMessages.Count == 2)
            {
                var mostRecentMsg = lastTwoMessages[0];
                var lessRecentMsg = lastTwoMessages[1];
                var distance_km = mostRecentMsg.Localizzazione.GetDistanceTo(lessRecentMsg.Localizzazione) / 1e3;
                var hours = mostRecentMsg.IstanteAcquisizione.Subtract(lessRecentMsg.IstanteAcquisizione).TotalHours;
                var velocity_Kmh = distance_km / hours;

                if (velocity_Kmh >= this.VelocityThreshold_Kmh)
                    log.Warn($"Too high velocity for vehicle { mostRecentMsg.CodiceMezzo }: { (int)velocity_Kmh }Km/h registered at { mostRecentMsg.IstanteAcquisizione.ToString("yyyyMMddHHmmss") }. Message ids: { mostRecentMsg.Id }, { lessRecentMsg.Id }");
            }
        }
    }
}
