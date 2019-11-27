using DomainModel.Classes;
using System;
using System.Collections.Generic;
using System.Text;

namespace DomainModel.CQRS.Queries.GetNumberOfMessagesStoredByTimeInterval
{
    public class GetNumberOfMessagesStoredByTimeIntervalQueryResult
    {
        public MsgNum MsgNum { get; set; }
    }
}
