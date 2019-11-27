using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace DomainModel.CQRS.Queries.GetDailyStatsAsync
{
    public class GetDailyStatsAsyncQueryResult
    {
        public Task<IEnumerable<object>> Result { get; set; }
    }
}
