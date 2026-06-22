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
            var host = Environment.GetEnvironmentVariable("PGHOST") ?? Environment.GetEnvironmentVariable("DATABASE_URL");
            var port = Environment.GetEnvironmentVariable("PGPORT") ?? "5432";
            var db = Environment.GetEnvironmentVariable("PGDATABASE") ?? "railway";
            var user = Environment.GetEnvironmentVariable("PGUSER") ?? "postgres";
            var password = Environment.GetEnvironmentVariable("PGPASSWORD");

            if (!string.IsNullOrEmpty(host) && !string.IsNullOrEmpty(password))
            {
                connectionString = $"Host={host};Port={port};Database={db};Username={user};Password={password};SSL Mode=Require;Trust Server Certificate=true";
            }
            else
            {
                connectionString = Environment.GetEnvironmentVariable("DATABASE_URL") ?? configuration.GetConnectionString("DefaultConnection")!;
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
