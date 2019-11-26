using DomainModel.CQRS.Queries.GetIntSum;
using NUnit.Framework;

namespace Tests
{
    public class Test_MyFakeImplementation
    {
        [Test]
        public void TheSumIsCorrect()
        {
            var handler = new GetIntSumQueryHandler();
            var query = new GetIntSumQuery() { First = 2, Second = 3 };

            var sum = handler.Handle(query);

            Assert.That(sum, Is.EqualTo(5));
        }

        [Test]
        public void WorksWithNegatives()
        {
            var handler = new GetIntSumQueryHandler();
            var query = new GetIntSumQuery() { First = -2, Second = -3 };

            var sum = handler.Handle(query);

            Assert.That(sum, Is.EqualTo(-5));
        }

        [Test]
        public void WorksWithAZero()
        {
            var handler = new GetIntSumQueryHandler();
            var query = new GetIntSumQuery() { First = 10, Second = 0 };

            var sum = handler.Handle(query);

            Assert.That(sum, Is.EqualTo(10));
        }
    }
}