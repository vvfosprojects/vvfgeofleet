using System;
using System.Collections.Generic;
using System.Text;
using CQRS.Commands.Notifiers;

namespace DomainModel.CQRS.Commands.AddUserFake
{
    public class AddUserFakeNotifier : ICommandNotifier<AddUserFakeCommand>
    {
        public void Notify(AddUserFakeCommand command)
        {
            // This implementation should notify something here.
            //
            // Note that, obviously, this class might inject
            // other services via constructor injection to carry
            // out his notification.
        }
    }
}
