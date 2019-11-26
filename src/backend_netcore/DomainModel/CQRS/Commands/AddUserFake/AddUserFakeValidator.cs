using System;
using System.Collections.Generic;
using System.Text;
using CQRS.Commands.Validators;
using CQRS.Validation;

namespace DomainModel.CQRS.Commands.AddUserFake
{
    public class AddUserFakeValidator : ICommandValidator<AddUserFakeCommand>
    {
        public IEnumerable<ValidationResult> Validate(AddUserFakeCommand command)
        {
            if (string.IsNullOrWhiteSpace(command.Username))
                yield return new ValidationResult("Username cannot be null or whitespace");

            if (string.IsNullOrWhiteSpace(command.Role))
                yield return new ValidationResult("Role cannot be null or whitespace");
        }
    }
}
