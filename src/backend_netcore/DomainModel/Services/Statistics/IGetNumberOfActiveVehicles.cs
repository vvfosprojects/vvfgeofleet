using System;
using System.Collections.Generic;
using System.Text;

namespace DomainModel.Services.Statistics
{
    public interface IGetNumberOfActiveVehicles
    {
        /// <summary>
        ///   Gets the number of vehicles stored in the database
        /// </summary>
        /// <param name="withInSeconds">Seconds to go back to consider active a vehicle</param>
        /// <returns>Number of vehicles</returns>
        long GetActive(int withInSeconds);
    }
}
