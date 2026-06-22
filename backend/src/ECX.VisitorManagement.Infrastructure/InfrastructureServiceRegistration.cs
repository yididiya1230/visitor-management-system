using System.Data.Common;
using ECX.VisitorManagement.Application.Interfaces;
using ECX.VisitorManagement.Infrastructure.Data;
using ECX.VisitorManagement.Infrastructure.Repositories;
using ECX.VisitorManagement.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Npgsql;

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
                var builder = new NpgsqlConnectionStringBuilder
                {
                    Host = uri.Host,
                    Port = uri.Port,
                    Database = uri.AbsolutePath.TrimStart('/'),
                    Username = uri.UserInfo?.Split(':')[0],
                    Password = uri.UserInfo?.Split(':')[1],
                    SslMode = SslMode.Require,
                    TrustServerCertificate = true
                };
                connectionString = builder.ConnectionString;
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
