using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace DomainModel.Services.Statistics
{
    public interface IGetNumberOfActiveVehiclesAsync
    {
        /// <summary>
        ///   Gets the number of vehicles stored in the database
        /// </summary>
        /// <param name="withInSeconds">Seconds to go back to consider active a vehicle</param>
        /// <returns>Number of vehicles</returns>
        Task<long> GetActiveAsync(int withInSeconds);
    }
}
