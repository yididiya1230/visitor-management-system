using ECX.VisitorManagement.Domain.Entities;

namespace ECX.VisitorManagement.Application.Interfaces;

public interface IJwtService
{
    (string token, DateTime expiration) GenerateToken(User user);
    string GenerateRefreshToken();
    Guid? ValidateToken(string token);
}
