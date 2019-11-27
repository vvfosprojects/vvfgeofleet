//-----------------------------------------------------------------------
// <copyright file="IGetDailyStats.cs" company="CNVVF">
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

using DomainModel.CQRS.Queries.GetDailyStats;
using DomainModel.CQRS.Queries.GetDailyStatsAsync;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DomainModel.Services.Statistics
{
    /// <summary>
    ///   Gets statistics on the number of inserted records day per day
    /// </summary>
    public interface IGetDailyStats
    {
        /// <summary>
        ///   Gets statistics on the number of inserted records day per day
        /// </summary>
        /// <param name="query">The number of past days to go behind</param>
        /// <returns>Statistics</returns>
        GetDailyStatsQueryResult Get(GetDailyStatsQuery query);


    }
}
