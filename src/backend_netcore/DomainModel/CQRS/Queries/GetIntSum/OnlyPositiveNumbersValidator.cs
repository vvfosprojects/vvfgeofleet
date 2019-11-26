using System;
using System.Collections.Generic;
using System.Text;
using CQRS.Queries;
using CQRS.Queries.Validators;
using CQRS.Validation;

namespace DomainModel.CQRS.Queries.GetIntSum
{
    public class OnlyPositiveNumbersValidator : IQueryValidator<GetIntSumQuery, int>
    {
        public IEnumerable<ValidationResult> Validate(GetIntSumQuery query)
        {
            if (query.First <= 0)
                yield return new ValidationResult("First must be positive");

            if (query.Second <= 0)
                yield return new ValidationResult("Second must be positive");
        }
    }
}
