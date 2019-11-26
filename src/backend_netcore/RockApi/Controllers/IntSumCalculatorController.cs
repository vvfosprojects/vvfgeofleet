using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CQRS.Queries;
using DomainModel.CQRS.Queries.GetIntSum;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace RockApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IntSumCalculatorController : ControllerBase
    {
        private readonly IQueryHandler<GetIntSumQuery, int> handler;

        public IntSumCalculatorController(IQueryHandler<GetIntSumQuery, int> handler)
        {
            this.handler = handler ?? throw new ArgumentNullException(nameof(handler));
        }

        // GET api/IntSumCalculator
        [HttpGet]
        public ActionResult<int> Get([FromQuery] GetIntSumQuery query)
        {
            return this.handler.Handle(query);
        }
    }
}