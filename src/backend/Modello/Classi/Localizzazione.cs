//-----------------------------------------------------------------------
// <copyright file="Localizzazione.cs" company="CNVVF">
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
using System.Device.Location;

namespace Modello.Classi
{
    public class Localizzazione
    {
        public string type = "Point";
        private double[] coordinates = new double[2];

        public double Lat
        {
            get { return this.coordinates[1]; }
            set { this.coordinates[1] = value; }
        }

        public double Lon
        {
            get { return this.coordinates[0]; }
            set { coordinates[0] = value; }
        }

        /// <summary>
        ///   The distance between the two coordinates, in meters.
        /// </summary>
        /// <param name="loc">The second location</param>
        /// <returns>The distance in meters</returns>
        public double GetDistanceTo(Localizzazione loc)
        {
            var coord1 = new GeoCoordinate(this.Lat, this.Lon);
            var coord2 = new GeoCoordinate(loc.Lat, loc.Lon);

            var distance = coord1.GetDistanceTo(coord2);
            return distance;
        }
    }
}
