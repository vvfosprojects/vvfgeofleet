using CQRS.Queries;
using DomainModel.Services.Statistics;
using System;
using System.Collections.Generic;
using System.Text;

namespace DomainModel.CQRS.Queries.GetDailyStats
{
    public class GetDailyStatsQueryHandler : IQueryHandler<GetDailyStatsQuery, GetDailyStatsQueryResult>
    {
        private readonly IGetDailyStats getDailyStats;

        public GetDailyStatsQueryHandler(IGetDailyStats getDailyStats)
        {
            this.getDailyStats = getDailyStats;
        }

        public GetDailyStatsQueryResult Handle(GetDailyStatsQuery query)
        {
            return new GetDailyStatsQueryResult()
            {
                Result = getDailyStats.Get(query).Result
            };
        }
    }
}
