using CQRS.Queries;
using DomainModel.CQRS.Queries.GetMezziInRettangolo;
using DomainModel.Services.Configurazione;
using Microsoft.AspNetCore.Mvc;

namespace RockApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InRettangoloController : ControllerBase
    {
        private readonly IQueryHandler<GetMezziInRettangoloQuery, GetMezziInRettangoloQueryResult> handler;
        private readonly IAppConfig config;

        public InRettangoloController(IQueryHandler<GetMezziInRettangoloQuery, GetMezziInRettangoloQueryResult> handler, IAppConfig config)
        {
            this.handler = handler;
            this.config = config;
        }

        [HttpGet]
        public ActionResult<GetMezziInRettangoloQueryResult> Get([FromQuery] GetMezziInRettangoloQuery query)
        {
            return Ok(this.handler.Handle(query));
        }
    }
}
