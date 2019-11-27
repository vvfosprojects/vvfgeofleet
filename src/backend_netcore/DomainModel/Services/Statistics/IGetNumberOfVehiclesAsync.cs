using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace DomainModel.Services.Statistics
{
    public interface IGetNumberOfVehiclesAsync
    {
        /// <summary>
        ///   Gets the number of vehicles stored in the database
        /// </summary>
        /// <returns>Number of vehicles</returns>
        Task<long> GetAsync();
    }
}
