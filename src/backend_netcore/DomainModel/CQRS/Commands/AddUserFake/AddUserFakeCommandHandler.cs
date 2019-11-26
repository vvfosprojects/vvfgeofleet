using System;
using System.Collections.Generic;
using System.Text;
using CQRS.Commands;

namespace DomainModel.CQRS.Commands.AddUserFake
{
    public class AddUserFakeCommandHandler : ICommandHandler<AddUserFakeCommand>
    {
        public void Handle(AddUserFakeCommand command)
        {
            // Here the user should be added.
            //
            // A good strategy consists in injecting the class
            // providing the service, e.g. a class encapsulating
            // the database query, located in the persistence
            // layer and implemented by a class library explicitely
            // aimed at providing the persistence services against
            // the chosen database technology (e.g. relational
            // database, document database, etc.).
            //
            // In this fake implementation we simply do nothing.
        }
    }
}
