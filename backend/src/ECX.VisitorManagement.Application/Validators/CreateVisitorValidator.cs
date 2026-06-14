using ECX.VisitorManagement.Application.DTOs.Visitor;
using FluentValidation;

namespace ECX.VisitorManagement.Application.Validators;

public class CreateVisitorValidator : AbstractValidator<CreateVisitorRequest>
{
    public CreateVisitorValidator()
    {
        RuleFor(x => x.FirstName).NotEmpty().MaximumLength(100);
        RuleFor(x => x.LastName).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Email).EmailAddress().When(x => !string.IsNullOrEmpty(x.Email));
        RuleFor(x => x.PhoneNumber).NotEmpty().MaximumLength(20);
        RuleFor(x => x.Company).MaximumLength(200).When(x => !string.IsNullOrEmpty(x.Company));
    }
}

public class UpdateVisitorValidator : AbstractValidator<UpdateVisitorRequest>
{
    public UpdateVisitorValidator()
    {
        RuleFor(x => x.FirstName).NotEmpty().MaximumLength(100);
        RuleFor(x => x.LastName).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Email).EmailAddress().When(x => !string.IsNullOrEmpty(x.Email));
        RuleFor(x => x.PhoneNumber).NotEmpty().MaximumLength(20);
    }
}
