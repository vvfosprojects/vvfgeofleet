using CQRS.Queries;
using DomainModel.Services.Statistics;
using System;
using System.Collections.Generic;
using System.Text;

namespace DomainModel.CQRS.Queries.GetNumberOfMessagesStoredByTimeIntervalAsync
{
    public class GetNumberOfMessagesStoredByTimeIntervalAsyncQueryHandler : IQueryHandler<GetNumberOfMessagesStoredByTimeIntervalAsyncQuery, GetNumberOfMessagesStoredByTimeIntervalAsyncQueryResult>
    {
        private readonly IGetNumberOfMessagesStoredByTimeIntervalAsync getNumberOfMessagesStoredByTimeIntervalAsync;
        public GetNumberOfMessagesStoredByTimeIntervalAsyncQueryHandler(IGetNumberOfMessagesStoredByTimeIntervalAsync getNumberOfMessagesStoredByTimeIntervalAsync)
        {
            this.getNumberOfMessagesStoredByTimeIntervalAsync = getNumberOfMessagesStoredByTimeIntervalAsync;
        }

        public GetNumberOfMessagesStoredByTimeIntervalAsyncQueryResult Handle(GetNumberOfMessagesStoredByTimeIntervalAsyncQuery query)
        {
            return new GetNumberOfMessagesStoredByTimeIntervalAsyncQueryResult()
            {
                MsgNum = getNumberOfMessagesStoredByTimeIntervalAsync.GetAsync(query).MsgNum
            };
        }
    }
}
