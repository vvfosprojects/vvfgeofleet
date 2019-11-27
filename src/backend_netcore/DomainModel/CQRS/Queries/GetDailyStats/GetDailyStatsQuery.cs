using CQRS.Queries;
using System;
using System.Collections.Generic;
using System.Text;

namespace DomainModel.CQRS.Queries.GetDailyStats
{
    public class GetDailyStatsQuery : IQuery<GetDailyStatsQueryResult>
    {
        public int HowManyDays { get; set; }
    }
}
