using ECX.VisitorManagement.Application.Interfaces;
using ECX.VisitorManagement.Infrastructure.Data;
using ECX.VisitorManagement.Infrastructure.Repositories;
using ECX.VisitorManagement.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace ECX.VisitorManagement.Infrastructure;

public static class InfrastructureServiceRegistration
{
    public static IServiceCollection AddInfrastructureServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Development";
        string connectionString;

        if (environment != "Development")
        {
            var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL");
            if (!string.IsNullOrEmpty(databaseUrl) && Uri.TryCreate(databaseUrl, UriKind.Absolute, out var uri))
            {
                var host = uri.Host;
                var port = uri.Port;
                var db = uri.AbsolutePath.TrimStart('/');
                var user = uri.UserInfo?.Split(':')[0];
                var password = uri.UserInfo?.Split(':')[1];
                connectionString = $"Host={host};Port={port};Database={db};Username={user};Password={password};SSL Mode=Require;Trust Server Certificate=true";
            }
            else
            {
                connectionString = configuration.GetConnectionString("DefaultConnection")!;
            }
        }
        else
        {
            connectionString = configuration.GetConnectionString("DefaultConnection")!;
        }

        if (environment == "Development")
        {
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlite(connectionString));
        }
        else
        {
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseNpgsql(connectionString));
        }

        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));

        services.AddScoped<IJwtService, JwtService>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IVisitorService, VisitorService>();
        services.AddScoped<IHostService, HostService>();
        services.AddScoped<IVisitService, VisitService>();
        services.AddScoped<IDepartmentService, DepartmentService>();
        services.AddScoped<IDashboardService, DashboardService>();
        services.AddScoped<IReportService, ReportService>();

        return services;
    }
}
