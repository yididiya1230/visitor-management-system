using ECX.VisitorManagement.Domain.Entities;
using ECX.VisitorManagement.Domain.Enums;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace ECX.VisitorManagement.Infrastructure.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        if (await context.Roles.AnyAsync()) return;

        var roles = new List<Role>
        {
            new()
            {
                Id = Guid.Parse("A1B2C3D4-E5F6-7890-ABCD-EF1234567890"),
                Name = "Admin",
                Description = "System Administrator",
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = Guid.Parse("B2C3D4E5-F6A7-8901-BCDE-F12345678901"),
                Name = "Receptionist",
                Description = "Receptionist / Security Guard",
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = Guid.Parse("C3D4E5F6-A7B8-9012-CDEF-123456789012"),
                Name = "Host",
                Description = "Employee / Host",
                CreatedAt = DateTime.UtcNow
            }
        };

        await context.Roles.AddRangeAsync(roles);

        var passwordHasher = new PasswordHasher<User>();

        var adminUser = new User
        {
            Id = Guid.Parse("D4E5F6A7-B8C9-0123-DEF4-567890123456"),
            Username = "admin",
            Email = "admin@ecx.com",
            FullName = "System Administrator",
            PhoneNumber = "+251911111111",
            IsActive = true,
            RoleId = roles[0].Id,
            CreatedAt = DateTime.UtcNow
        };
        adminUser.PasswordHash = passwordHasher.HashPassword(adminUser, "Admin@123");
        await context.Users.AddAsync(adminUser);

        var receptionistUser = new User
        {
            Id = Guid.Parse("E5F6A7B8-C9D0-1234-EF56-789012345678"),
            Username = "receptionist",
            Email = "receptionist@ecx.com",
            FullName = "Default Receptionist",
            PhoneNumber = "+251922222222",
            IsActive = true,
            RoleId = roles[1].Id,
            CreatedAt = DateTime.UtcNow
        };
        receptionistUser.PasswordHash = passwordHasher.HashPassword(receptionistUser, "Receptionist@123");
        await context.Users.AddAsync(receptionistUser);

        var departments = new List<Department>
        {
            new()
            {
                Id = Guid.Parse("F6A7B8C9-D0E1-2345-F678-901234567890"),
                Name = "Information Technology",
                Description = "IT Department",
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = Guid.Parse("A7B8C9D0-E1F2-3456-7890-123456789012"),
                Name = "Human Resources",
                Description = "HR Department",
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = Guid.Parse("B8C9D0E1-F2A3-4567-8901-234567890123"),
                Name = "Security",
                Description = "Security Department",
                CreatedAt = DateTime.UtcNow
            }
        };

        await context.Departments.AddRangeAsync(departments);
        await context.SaveChangesAsync();
    }
}
