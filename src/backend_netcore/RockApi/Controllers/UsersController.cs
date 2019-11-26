using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CQRS.Commands;
using DomainModel.CQRS.Commands.AddUserFake;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace RockApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ICommandHandler<AddUserFakeCommand> handler;

        public UsersController(ICommandHandler<AddUserFakeCommand> handler)
        {
            this.handler = handler ?? throw new ArgumentNullException(nameof(handler));
        }

        // POST: api/Users
        [HttpPost]
        public void Post([FromBody] AddUserFakeCommand command)
        {
            handler.Handle(command);
        }
    }
}
