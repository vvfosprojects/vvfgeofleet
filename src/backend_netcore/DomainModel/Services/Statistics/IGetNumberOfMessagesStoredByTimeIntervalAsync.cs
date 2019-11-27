using DomainModel.Classes;
using DomainModel.CQRS.Queries.GetNumberOfMessagesStoredByTimeIntervalAsync;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace DomainModel.Services.Statistics
{
    public interface IGetNumberOfMessagesStoredByTimeIntervalAsync
    {
        /// <summary>
        ///   Gets the number of messages stored.
        /// </summary>
        /// <param name="query.fromTime">Start of time interval</param>
        /// <param name="query.toTime">End of time interval</param>
        /// <returns>Information about number of messages</returns>
        GetNumberOfMessagesStoredByTimeIntervalAsyncQueryResult GetAsync(GetNumberOfMessagesStoredByTimeIntervalAsyncQuery query);
    }
}
