using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modello.Servizi.Statistics
{
    public interface IGetNumberOfVehicles
    {
        /// <summary>
        ///   Gets the number of vehicles stored in the database
        /// </summary>
        /// <returns>Number of vehicles</returns>
        long Get();

        /// <summary>
        ///   Gets the number of vehicles stored in the database
        /// </summary>
        /// <returns>Number of vehicles</returns>
        Task<long> GetAsync();

        /// <summary>
        ///   Gets the number of vehicles stored in the database
        /// </summary>
        /// <param name="withinSeconds">Seconds to go back to consider active a vehicle</param>
        /// <returns>Number of vehicles</returns>
        long GetActive(int withinSeconds);

        /// <summary>
        ///   Gets the number of vehicles stored in the database
        /// </summary>
        /// <param name="withinSeconds">Seconds to go back to consider active a vehicle</param>
        /// <returns>Number of vehicles</returns>
        Task<long> GetActiveAsync(int withinSeconds);
    }
}
