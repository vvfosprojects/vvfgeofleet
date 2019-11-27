using CQRS.Queries;
using DomainModel.Services.Statistics;
using System;
using System.Collections.Generic;
using System.Text;

namespace DomainModel.CQRS.Queries.GetNumberOfMessagesStoredByTimeInterval
{
    public class GetNumberOfMessagesStoredByTimeIntervalQueryHandler : IQueryHandler<GetNumberOfMessagesStoredByTimeIntervalQuery, GetNumberOfMessagesStoredByTimeIntervalQueryResult>
    {
        private readonly IGetNumberOfMessagesStoredByTimeInterval getNumberOfMessagesStoredByTimeInterval;
        public GetNumberOfMessagesStoredByTimeIntervalQueryHandler(IGetNumberOfMessagesStoredByTimeInterval getNumberOfMessagesStoredByTimeInterval)
        {
            this.getNumberOfMessagesStoredByTimeInterval = getNumberOfMessagesStoredByTimeInterval;
        }

        public GetNumberOfMessagesStoredByTimeIntervalQueryResult Handle(GetNumberOfMessagesStoredByTimeIntervalQuery query)
        {
            return new GetNumberOfMessagesStoredByTimeIntervalQueryResult()
            { 
                MsgNum = getNumberOfMessagesStoredByTimeInterval.Get(query).MsgNum
            };
        }
    }
}
