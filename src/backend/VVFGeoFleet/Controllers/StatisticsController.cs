//-----------------------------------------------------------------------
// <copyright file="StatisticsController.cs" company="CNVVF">
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
using System.Diagnostics;
using System.Threading.Tasks;
using System.Web.Http;
using log4net;
using Modello.Servizi.Statistics;

namespace VVFGeoFleet.Controllers
{
    public class StatisticsController : ApiController
    {
        private static readonly ILog log = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        private readonly IGetStatistics getStatistics;

        public StatisticsController(IGetStatistics getStatistics)
        {
            this.getStatistics = getStatistics ?? throw new ArgumentNullException(nameof(getStatistics));
        }

        public async Task<object> Get()
        {
            var sw = new Stopwatch();
            sw.Start();
            var result = await this.getStatistics.GetAsync();
            sw.Stop();
            log.Info($"Statistics computed in { sw.ElapsedMilliseconds } msec");

            return result;
        }
    }
}
