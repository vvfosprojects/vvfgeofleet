//-----------------------------------------------------------------------
// <copyright file="GetDailyStats_DB.cs" company="CNVVF">
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
using Modello.Servizi.Statistics;
using MongoDB.Driver;

namespace Persistence.MongoDB.Servizi.Statistics
{
    internal class GetDailyStats_DB : IGetDailyStats
    {
        private readonly IMongoCollection<MessaggioPosizione> messaggiPosizioneCollection;

        public GetDailyStats_DB(IMongoCollection<MessaggioPosizione> messaggiPosizioneCollection)
        {
            this.messaggiPosizioneCollection = messaggiPosizioneCollection ?? throw new ArgumentNullException(nameof(messaggiPosizioneCollection));
        }

        public IEnumerable<object> Get(int howManyDays)
        {
            return this.GetAsync(howManyDays).Result;
        }

        public async Task<IEnumerable<object>> GetAsync(int howManyDays)
        {
            return await this.messaggiPosizioneCollection.Aggregate()
                .Match(m => m.IstanteArchiviazione >= DateTime.UtcNow.Date.AddDays(-howManyDays))
                .Group(m => new
                {
                    year = m.IstanteArchiviazione.Year,
                    month = m.IstanteArchiviazione.Month,
                    day = m.IstanteArchiviazione.Day
                },
                    g => new
                    {
                        key = g.Key,
                        Net = g.Count(),
                        WithInterpolation = g.Sum(m => 1 + (m.InterpolationData != null ? m.InterpolationData.Messages : 0))
                    })
                .SortByDescending(r => r.key.year)
                .ThenByDescending(r => r.key.month)
                .ThenByDescending(r => r.key.day)
                .ToListAsync();
        }
    }
}
