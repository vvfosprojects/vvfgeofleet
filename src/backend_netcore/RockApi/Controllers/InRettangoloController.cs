using CQRS.Queries;
using DomainModel.CQRS.Queries.GetMezziInRettangolo;
using Microsoft.AspNetCore.Mvc;

namespace RockApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InRettangoloController : ControllerBase
    {
        private readonly IQueryHandler<GetMezziInRettangoloQuery, GetMezziInRettangoloQueryResult> handler;

        public InRettangoloController(IQueryHandler<GetMezziInRettangoloQuery, GetMezziInRettangoloQueryResult> handler)
        {
            this.handler = handler;
        }

        [HttpGet]
        public ActionResult<GetMezziInRettangoloQueryResult> Get([FromQuery] GetMezziInRettangoloQuery query)
        {
            return Ok(this.handler.Handle(query));
        }
    }
}
