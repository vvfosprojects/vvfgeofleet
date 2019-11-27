using CQRS.Queries;
using System;
using System.Collections.Generic;
using System.Text;

namespace DomainModel.CQRS.Queries.GetNumberOfMessagesStoredByTimeIntervalAsync
{
    public class GetNumberOfMessagesStoredByTimeIntervalAsyncQuery : IQuery <GetNumberOfMessagesStoredByTimeIntervalAsyncQueryResult>
    {
        public DateTime FromTime { get; set; }

        public DateTime ToTime { get; set; }
    }
}
