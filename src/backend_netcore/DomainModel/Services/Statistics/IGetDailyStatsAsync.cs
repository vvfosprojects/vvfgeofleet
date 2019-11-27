using DomainModel.CQRS.Queries.GetDailyStatsAsync;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace DomainModel.Services.Statistics
{
    public interface IGetDailyStatsAsync
    {
        /// <summary>
        ///   Gets statistics on the number of inserted records day per day
        /// </summary>
        /// <param name="query">The number of past days to go behind</param>
        /// <returns>Statistics</returns>
        GetDailyStatsAsyncQueryResult GetAsync(GetDailyStatsAsyncQuery query);
    }
}
