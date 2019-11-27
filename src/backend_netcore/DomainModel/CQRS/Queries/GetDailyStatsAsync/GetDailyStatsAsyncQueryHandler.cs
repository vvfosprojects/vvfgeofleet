using CQRS.Queries;
using DomainModel.Services.Statistics;
using System;
using System.Collections.Generic;
using System.Text;

namespace DomainModel.CQRS.Queries.GetDailyStatsAsync
{
    public class GetDailyStatsAsyncQueryHandler : IQueryHandler<GetDailyStatsAsyncQuery, GetDailyStatsAsyncQueryResult>
    {
        private readonly IGetDailyStatsAsync getDailyStatsAsync;
        public GetDailyStatsAsyncQueryHandler(IGetDailyStatsAsync getDailyStatsAsync)
        {
            this.getDailyStatsAsync = getDailyStatsAsync;
        }

        public GetDailyStatsAsyncQueryResult Handle(GetDailyStatsAsyncQuery query)
        {
            return new GetDailyStatsAsyncQueryResult()
            {
                Result = getDailyStatsAsync.GetAsync(query).Result
            };
        }
    }
}
