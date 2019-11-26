using System;
using System.Collections.Generic;
using System.Text;
using DomainModel.CQRS.Commands.AddUserFake;
using NUnit.Framework;

namespace DomainModel.Test
{
    public class Test_AddUserFakeCommand
    {
        [Test]
        public void UserCanBeAdded()
        {
            var command = new AddUserFakeCommand()
            {
                Username = "foo",
                Role = "bar"
            };

            var handler = new AddUserFakeCommandHandler();

            handler.Handle(command);

            Assert.Pass();
        }
    }
}
