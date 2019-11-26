using System;
using System.Collections.Generic;
using System.Text;
using CQRS.Queries;

namespace DomainModel.CQRS.Queries.GetIntSum
{
    public class GetIntSumQuery : IQuery<int>
    {
        public int First { get; set; }
        public int Second { get; set; }
    }
}
