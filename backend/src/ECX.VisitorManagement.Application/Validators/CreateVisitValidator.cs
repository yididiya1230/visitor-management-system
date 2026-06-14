using ECX.VisitorManagement.Application.DTOs.Visit;
using FluentValidation;

namespace ECX.VisitorManagement.Application.Validators;

public class CreateVisitValidator : AbstractValidator<CreateVisitRequest>
{
    public CreateVisitValidator()
    {
        RuleFor(x => x.VisitorId).NotEmpty();
        RuleFor(x => x.HostId).NotEmpty();
        RuleFor(x => x.Purpose).NotEmpty().MaximumLength(500);
    }
}
