using System;
using System.Collections.Generic;
using System.Text;

namespace DomainModel.CQRS.Commands.AddUserFake
{
    public class AddUserFakeCommand
    {
        public string Username { get; set; }
        public string Role { get; set; }
    }
}
