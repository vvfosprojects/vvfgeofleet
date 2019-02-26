//-----------------------------------------------------------------------
// <copyright file="GetNumberOfVehicles_DB.cs" company="CNVVF">
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
using System.Threading.Tasks;
using Modello.Classi;
using Modello.Servizi.Statistics;
using MongoDB.Driver;

namespace Persistence.MongoDB.Servizi.Statistics
{
    internal class GetNumberOfVehicles_DB : IGetNumberOfVehicles
    {
        private readonly IMongoCollection<MessaggioPosizione> messaggiPosizioneCollection;

        public GetNumberOfVehicles_DB(IMongoCollection<MessaggioPosizione> messaggiPosizioneCollection)
        {
            this.messaggiPosizioneCollection = messaggiPosizioneCollection ?? throw new ArgumentNullException(nameof(messaggiPosizioneCollection));
        }

        public long Get()
        {
            return this.GetAsync().Result;
        }

        public long GetActive(int withinSeconds)
        {
            return this.GetActiveAsync(withinSeconds).Result;
        }

        public Task<long> GetActiveAsync(int withinSeconds)
        {
            return this.messaggiPosizioneCollection.CountAsync(m =>
                m.Ultimo &&
                m.IstanteAcquisizione >= DateTime.UtcNow.AddSeconds(-withinSeconds));
        }

        public Task<long> GetAsync()
        {
            return this.messaggiPosizioneCollection.CountAsync(m => m.Ultimo);
        }
    }
}
