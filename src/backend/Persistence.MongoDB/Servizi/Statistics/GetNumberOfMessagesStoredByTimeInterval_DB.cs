//-----------------------------------------------------------------------
// <copyright file="GetNumberOfMessagesStoredByTimeInterval_DB.cs" company="CNVVF">
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
using Modello.Servizi.Statistics;
using MongoDB.Driver;

namespace Persistence.MongoDB.Servizi.Statistics
{
    public class GetNumberOfMessagesStoredByTimeInterval_DB : IGetNumberOfMessagesStoredByTimeInterval
    {
        private readonly IMongoCollection<MessaggioPosizione> messaggiPosizioneCollection;

        public GetNumberOfMessagesStoredByTimeInterval_DB(IMongoCollection<MessaggioPosizione> messaggiPosizioneCollection)
        {
            this.messaggiPosizioneCollection = messaggiPosizioneCollection ?? throw new ArgumentNullException(nameof(messaggiPosizioneCollection));
        }

        public long Get(DateTime fromTime, DateTime toTime)
        {
            return this.GetAsync(fromTime, toTime).Result;
        }

        public Task<long> GetAsync(DateTime fromTime, DateTime toTime)
        {
            return this.messaggiPosizioneCollection.Find(m =>
                m.IstanteArchiviazione >= fromTime &&
                m.IstanteArchiviazione <= toTime)
            .CountAsync();
        }
    }
}
