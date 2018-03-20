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
        private readonly IGetNumberOfVehicles getNumberOfVehicles;

        public GetStatistics(
            IGetDailyStats getDailyStats,
            IGetNumberOfMessagesStoredByTimeInterval getNumberOfMessagesStoredByTimeInterval,
            IGetNumberOfVehicles getNumberOfVehicles)
        {
            this.getDailyStats = getDailyStats ?? throw new ArgumentNullException(nameof(getDailyStats));
            this.getNumberOfMessagesStoredByTimeInterval = getNumberOfMessagesStoredByTimeInterval ?? throw new ArgumentNullException(nameof(getNumberOfMessagesStoredByTimeInterval));
            this.getNumberOfVehicles = getNumberOfVehicles ?? throw new ArgumentNullException(nameof(getNumberOfVehicles));
        }

        public object Get()
        {
            const int howManyDays = 30;
            const int vehiclesActiveWithinSeconds = 60 * 60 * 24;
            var dailyStats = this.getDailyStats.Get(howManyDays);

            var numberOfMessagesStoredInTheLastMinuteTask = this.getNumberOfMessagesStoredByTimeInterval.GetAsync(DateTime.UtcNow.AddMinutes(-1), DateTime.UtcNow);
            var numberOfMessagesStoredInTheLastHourTask = this.getNumberOfMessagesStoredByTimeInterval.GetAsync(DateTime.UtcNow.AddHours(-1), DateTime.UtcNow);
            var totalNumberOfMessagesStoredTask = this.getNumberOfMessagesStoredByTimeInterval.GetAsync(DateTime.MinValue, DateTime.MaxValue);
            var numberOfVehiclesTask = this.getNumberOfVehicles.GetAsync();
            var numberOfActiveVehiclesTask = this.getNumberOfVehicles.GetActiveAsync(vehiclesActiveWithinSeconds);

            Task.WaitAll(
                numberOfMessagesStoredInTheLastMinuteTask,
                numberOfMessagesStoredInTheLastHourTask,
                totalNumberOfMessagesStoredTask,
                numberOfVehiclesTask,
                numberOfActiveVehiclesTask);

            var averageNumberOfMessagesPerMinute = numberOfMessagesStoredInTheLastHourTask.Result / 60d;
            var averageNumberOfMessagesPerSecond = numberOfMessagesStoredInTheLastHourTask.Result / 60d / 60d;

            return new
            {
                LastNews = new
                {
                    NumberOfMessagesStoredInTheLastMinute = numberOfMessagesStoredInTheLastMinuteTask.Result,
                    NumberOfMessagesStoredInTheLastHour = numberOfMessagesStoredInTheLastHourTask.Result,
                    AverageNumberOfMessagesPerMinute = averageNumberOfMessagesPerMinute,
                    AverageNumberOfMessagesPerSecond = averageNumberOfMessagesPerSecond,
                    TotalNumberOfMessagesStored = totalNumberOfMessagesStoredTask.Result,
                    NumberOfVehicles = numberOfVehiclesTask.Result,
                    NumberOfActiveVehicles = numberOfActiveVehiclesTask.Result,
                },
                DailyStats = dailyStats
            };
        }
    }
}
