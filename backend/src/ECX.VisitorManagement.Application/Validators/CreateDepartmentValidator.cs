using ECX.VisitorManagement.Application.DTOs.Department;
using FluentValidation;

namespace ECX.VisitorManagement.Application.Validators;

public class CreateDepartmentValidator : AbstractValidator<CreateDepartmentRequest>
{
    public CreateDepartmentValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
    }
}
