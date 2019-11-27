using CQRS.Queries;
using DomainModel.CQRS.Queries.GetDailyStatsAsync;

namespace DomainModel.CQRS.Queries.GetDailyStatsAsync
{
    public class GetDailyStatsAsyncQuery : IQuery<GetDailyStatsAsyncQueryResult>
    {
        public int HowManyDays { get; set; }
    }
}
