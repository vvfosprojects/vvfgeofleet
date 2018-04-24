using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
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
