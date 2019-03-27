//-----------------------------------------------------------------------
// <copyright file="IGetNumberOfVehicles.cs" company="CNVVF">
// Copyright (C) 2017 - CNVVF
//
// This file is part of VVFGeoFleet.
// VVFGeoFleet is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// SOVVF is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see http://www.gnu.org/licenses/.
// </copyright>
//-----------------------------------------------------------------------

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
