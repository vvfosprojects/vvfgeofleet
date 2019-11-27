using DomainModel.Classes;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace DomainModel.CQRS.Queries.GetNumberOfMessagesStoredByTimeIntervalAsync
{
    public class GetNumberOfMessagesStoredByTimeIntervalAsyncQueryResult
    {
        public Task<MsgNum> MsgNum { get; set; }
    }
}
