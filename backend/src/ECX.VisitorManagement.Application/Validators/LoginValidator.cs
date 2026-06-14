using ECX.VisitorManagement.Application.DTOs.Auth;
using FluentValidation;

namespace ECX.VisitorManagement.Application.Validators;

public class LoginValidator : AbstractValidator<LoginRequest>
{
    public LoginValidator()
    {
        RuleFor(x => x.Username).NotEmpty();
        RuleFor(x => x.Password).NotEmpty();
    }
}
