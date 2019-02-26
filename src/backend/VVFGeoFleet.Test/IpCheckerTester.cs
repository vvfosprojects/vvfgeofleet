//-----------------------------------------------------------------------
// <copyright file="IpCheckerTester.cs" company="CNVVF">
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

using IpTools;
using NUnit.Framework;

namespace VVFGeoFleet.Test
{
    [TestFixture]
    public class IpCheckerTester
    {
        [Test]
        public void TwoEqualIpAddressesAreContainedOneInTheOther()
        {
            var checker = new IpNetworkChecker();

            var ip = "10.0.0.222";
            var container = "10.0.0.222";

            Assert.That(checker.Check(ip, container), Is.True);
        }

        [Test]
        public void TwoDifferentIpAddressesAreContainedOneInTheOther()
        {
            var checker = new IpNetworkChecker();

            var ip = "10.0.0.222";
            var container = "10.0.0.223";

            Assert.That(checker.Check(ip, container), Is.False);
        }

        [Test]
        public void AnIpIsContainedInItsNetwork_Subnet24()
        {
            var checker = new IpNetworkChecker();

            var ip = "10.0.0.222";
            var container = "10.0.0.0/24";

            Assert.That(checker.Check(ip, container), Is.True);
        }

        [Test]
        public void AnIpIsNotContainedInAnotherNetwork()
        {
            var checker = new IpNetworkChecker();

            var ip = "10.0.1.222";
            var container = "10.0.0.0/24";

            Assert.That(checker.Check(ip, container), Is.False);
        }

        [Test]
        public void AnIpIsContainedInItsNetwork_Subnet23()
        {
            var checker = new IpNetworkChecker();

            var ip = "10.0.1.222";
            var container = "10.0.0.0/23";

            Assert.That(checker.Check(ip, container), Is.True);
        }
    }
}
