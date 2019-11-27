using CQRS.Queries;
using System;
using System.Collections.Generic;
using System.Text;

namespace DomainModel.CQRS.Queries.GetNumberOfMessagesStoredByTimeInterval
{
    public class GetNumberOfMessagesStoredByTimeIntervalQuery : IQuery<GetNumberOfMessagesStoredByTimeIntervalQueryResult>
    {
        public DateTime FromTime { get; set; }

        public DateTime ToTime { get; set; }
    }
}
