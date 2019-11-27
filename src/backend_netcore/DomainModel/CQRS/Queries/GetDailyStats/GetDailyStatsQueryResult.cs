using System;
using System.Collections.Generic;
using System.Text;

namespace DomainModel.CQRS.Queries.GetDailyStats
{
    public class GetDailyStatsQueryResult
    {
        public IEnumerable<object> Result { get; set; }
    }
}
