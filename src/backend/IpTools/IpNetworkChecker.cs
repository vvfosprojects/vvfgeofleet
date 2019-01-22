//-----------------------------------------------------------------------
// <copyright file="IpNetworkChecker.cs" company="CNVVF">
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

using System;
using System.Linq;
using System.Net;

namespace IpTools
{
    public class IpNetworkChecker
    {
        /// <summary>
        ///   Checks if an ipAddress is contained withina container
        /// </summary>
        /// <param name="ipAddress">The ipAddress to be checked</param>
        /// <param name="container">
        ///   The container. Can be a plain ip address or a network represented in CIDR format (e.g. 10.0.0.0/24)
        /// </param>
        /// <returns>True if (and only if) ip address is contained in the container</returns>
        public bool Check(string ipAddress, string container)
        {
            if (this.IsNetwork(container))
                return this.IsInRange(ipAddress, container);

            return ipAddress == container;
        }

        // true if ipAddress falls inside the CIDR range, example bool result =
        // IsInRange("10.50.30.7", "10.0.0.0/8"); https://stackoverflow.com/a/17210019/1045789
        private bool IsInRange(string ipAddress, string cidrMaskStr)
        {
            var parts = cidrMaskStr.Split('/');

            var IP_addr = BitConverter.ToInt32(IPAddress.Parse(parts[0]).GetAddressBytes(), 0);
            var cidrAddr = BitConverter.ToInt32(IPAddress.Parse(ipAddress).GetAddressBytes(), 0);
            var cidrMask = IPAddress.HostToNetworkOrder(-1 << (32 - int.Parse(parts[1])));

            return ((IP_addr & cidrMask) == (cidrAddr & cidrMask));
        }

        private bool IsIpAddress(string toBeChecked)
        {
            var octectsStr = toBeChecked.Split('.');

            if (octectsStr.Length != 4)
                return false;

            var octects = octectsStr.Select(o => Convert.ToByte(o));

            if (octects.Any(o => o < 0 && o > 255))
                return false;

            return true;
        }

        private bool IsNetwork(string toBeChecked)
        {
            var parts = toBeChecked.Split('/');

            if (parts.Length != 2)
                return false;

            if (!this.IsIpAddress(parts[0]))
                return false;

            var maskLen = Convert.ToByte(parts[1]);

            if (maskLen < 1 || maskLen > 31)
                return false;

            return true;
        }
    }
}
