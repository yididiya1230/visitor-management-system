using ECX.VisitorManagement.Application.DTOs.Auth;
using ECX.VisitorManagement.Application.Interfaces;
using ECX.VisitorManagement.Domain.Entities;
using ECX.VisitorManagement.Domain.Enums;
using Microsoft.AspNetCore.Identity;

namespace ECX.VisitorManagement.Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IJwtService _jwtService;
    private readonly PasswordHasher<User> _passwordHasher;

    public AuthService(IUnitOfWork unitOfWork, IJwtService jwtService)
    {
        _unitOfWork = unitOfWork;
        _jwtService = jwtService;
        _passwordHasher = new PasswordHasher<User>();
    }

    public async Task<LoginResponse> LoginAsync(LoginRequest request)
    {
        var user = await _unitOfWork.Users.FindSingleAsync(u =>
            u.Username == request.Username && u.IsActive);

        if (user == null)
            throw new UnauthorizedAccessException("Invalid username or password");

        var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);
        if (result == PasswordVerificationResult.Failed)
            throw new UnauthorizedAccessException("Invalid username or password");

        var role = await _unitOfWork.Roles.GetByIdAsync(user.RoleId);
        user.Role = role!;

        var (token, expiration) = _jwtService.GenerateToken(user);
        var refreshToken = _jwtService.GenerateRefreshToken();

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
        _unitOfWork.Users.Update(user);
        await _unitOfWork.SaveChangesAsync();

        return new LoginResponse
        {
            Token = token,
            RefreshToken = refreshToken,
            Expiration = expiration,
            FullName = user.FullName,
            Role = role!.Name,
            UserId = user.Id
        };
    }

    public async Task<LoginResponse> RegisterAsync(RegisterRequest request)
    {
        var existingUser = await _unitOfWork.Users
            .FindSingleAsync(u => u.Username == request.Username || u.Email == request.Email);

        if (existingUser != null)
            throw new InvalidOperationException("Username or email already exists");

        var role = await _unitOfWork.Roles
            .FindSingleAsync(r => r.Name == request.RoleName);

        if (role == null)
            throw new InvalidOperationException($"Role '{request.RoleName}' not found");

        var user = new User
        {
            Id = Guid.NewGuid(),
            Username = request.Username,
            Email = request.Email,
            FullName = request.FullName,
            PhoneNumber = request.PhoneNumber,
            IsActive = true,
            RoleId = role.Id,
            CreatedAt = DateTime.UtcNow
        };

        user.PasswordHash = _passwordHasher.HashPassword(user, request.Password);

        await _unitOfWork.Users.AddAsync(user);
        await _unitOfWork.SaveChangesAsync();

        user.Role = role;
        var (token, expiration) = _jwtService.GenerateToken(user);
        var refreshToken = _jwtService.GenerateRefreshToken();

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
        _unitOfWork.Users.Update(user);
        await _unitOfWork.SaveChangesAsync();

        return new LoginResponse
        {
            Token = token,
            RefreshToken = refreshToken,
            Expiration = expiration,
            FullName = user.FullName,
            Role = role.Name,
            UserId = user.Id
        };
    }

    public async Task<LoginResponse> RefreshTokenAsync(RefreshTokenRequest request)
    {
        var user = await _unitOfWork.Users
            .FindSingleAsync(u => u.RefreshToken == request.RefreshToken);

        if (user == null || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
            throw new UnauthorizedAccessException("Invalid or expired refresh token");

        var role = await _unitOfWork.Roles.GetByIdAsync(user.RoleId);
        user.Role = role!;

        var (token, expiration) = _jwtService.GenerateToken(user);
        var newRefreshToken = _jwtService.GenerateRefreshToken();

        user.RefreshToken = newRefreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
        _unitOfWork.Users.Update(user);
        await _unitOfWork.SaveChangesAsync();

        return new LoginResponse
        {
            Token = token,
            RefreshToken = newRefreshToken,
            Expiration = expiration,
            FullName = user.FullName,
            Role = role!.Name,
            UserId = user.Id
        };
    }

    public async Task LogoutAsync(Guid userId)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(userId);
        if (user != null)
        {
            user.RefreshToken = null;
            user.RefreshTokenExpiryTime = null;
            _unitOfWork.Users.Update(user);
            await _unitOfWork.SaveChangesAsync();
        }
    }
}
