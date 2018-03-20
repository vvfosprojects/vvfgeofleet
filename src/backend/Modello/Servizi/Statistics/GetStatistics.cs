//-----------------------------------------------------------------------
// <copyright file="GetStatistics.cs" company="CNVVF">
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

namespace Modello.Servizi.Statistics
{
    internal class GetStatistics : IGetStatistics
    {
        private readonly IGetDailyStats getDailyStats;
        private readonly IGetNumberOfMessagesStoredByTimeInterval getNumberOfMessagesStoredByTimeInterval;

        public GetStatistics(
            IGetDailyStats getDailyStats,
            IGetNumberOfMessagesStoredByTimeInterval getNumberOfMessagesStoredByTimeInterval)
        {
            this.getDailyStats = getDailyStats ?? throw new ArgumentNullException(nameof(getDailyStats));
            this.getNumberOfMessagesStoredByTimeInterval = getNumberOfMessagesStoredByTimeInterval ?? throw new ArgumentNullException(nameof(getNumberOfMessagesStoredByTimeInterval));
        }

        public object Get()
        {
            var howManyDays = 30;
            var dailyStats = this.getDailyStats.Get(howManyDays);

            var numberOfMessagesStoredInTheLastMinuteTask = this.getNumberOfMessagesStoredByTimeInterval.GetAsync(DateTime.UtcNow.AddMinutes(-1), DateTime.UtcNow);
            var numberOfMessagesStoredInTheLastHourTask = this.getNumberOfMessagesStoredByTimeInterval.GetAsync(DateTime.UtcNow.AddHours(-1), DateTime.UtcNow);
            var totalNumberOfMessagesStoredTask = this.getNumberOfMessagesStoredByTimeInterval.GetAsync(DateTime.MinValue, DateTime.MaxValue);

            Task.WaitAll(
                numberOfMessagesStoredInTheLastMinuteTask,
                numberOfMessagesStoredInTheLastHourTask,
                totalNumberOfMessagesStoredTask);

            var averageNumberOfMessagesPerMinute = numberOfMessagesStoredInTheLastHourTask.Result / 60d;
            var averageNumberOfMessagesPerSecond = numberOfMessagesStoredInTheLastHourTask.Result / 60d / 60d;

            return new
            {
                DailyStats = dailyStats,
                LastNews = new
                {
                    NumberOfMessagesStoredInTheLastMinute = numberOfMessagesStoredInTheLastMinuteTask.Result,
                    NumberOfMessagesStoredInTheLastHour = numberOfMessagesStoredInTheLastHourTask.Result,
                    AverageNumberOfMessagesPerMinute = averageNumberOfMessagesPerMinute,
                    AverageNumberOfMessagesPerSecond = averageNumberOfMessagesPerSecond,
                    TotalNumberOfMessagesStored = totalNumberOfMessagesStoredTask.Result
                }
            };
        }
    }
}
