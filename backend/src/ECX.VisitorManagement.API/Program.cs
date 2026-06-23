using System.Text;
using ECX.VisitorManagement.API.Middleware;
using Microsoft.EntityFrameworkCore;
using ECX.VisitorManagement.Application;
using ECX.VisitorManagement.Infrastructure;
using ECX.VisitorManagement.Infrastructure.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Npgsql;
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)),
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Audience"],
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureServices(builder.Configuration);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp", policy =>
    {
        policy.WithOrigins("http://localhost:4200", "https://visitor-management-system-lime.vercel.app")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    var maxRetries = 5;
    var delay = TimeSpan.FromSeconds(3);

    for (int i = 0; i <= maxRetries; i++)
    {
        try
        {
            await context.Database.MigrateAsync();
            break;
        }
        catch (Exception ex) when (i < maxRetries)
        {
            logger.LogWarning(ex, "Database migration failed (attempt {Attempt}/{MaxRetries}). Retrying in {Delay}s...", i + 1, maxRetries, delay.TotalSeconds);
            await Task.Delay(delay);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Migration failed after {MaxRetries} attempts. Attempting reset...", maxRetries);
            try
            {
                await context.Database.ExecuteSqlRawAsync("DROP TABLE IF EXISTS \"__EFMigrationsHistory\" CASCADE");
                logger.LogInformation("Dropped corrupted __EFMigrationsHistory");
                await context.Database.MigrateAsync();
                logger.LogInformation("Re-migration successful");
            }
            catch (Exception ex2)
            {
                logger.LogError(ex2, "Migration reset also failed. Continuing startup...");
            }
        }
    }

    try
    {
        await DbSeeder.SeedAsync(context);
        logger.LogInformation("Database seeded successfully");
    }
    catch (Exception ex)
    {
        logger.LogWarning(ex, "Seeding skipped (likely already seeded)");
    }
}

app.MapGet("/health", async (ApplicationDbContext db) =>
{
    var env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "not-set";
    var hasDbUrl = !string.IsNullOrEmpty(Environment.GetEnvironmentVariable("DATABASE_URL"));
    var hasPgHost = !string.IsNullOrEmpty(Environment.GetEnvironmentVariable("PGHOST"));
    var hasPgPass = !string.IsNullOrEmpty(Environment.GetEnvironmentVariable("PGPASSWORD"));
    var dbConnected = false;
    var dbError = "";
    var roleCount = 0;
    var userCount = 0;
    var hasAdmin = false;
    var tryLoginError = "";
    try
    {
        dbConnected = await db.Database.CanConnectAsync();
        dbError = "Connected";

        if (dbConnected)
        {
            try
            {
                roleCount = await db.Roles.CountAsync();
            }
            catch (Exception ex)
            {
                dbError = ex.GetType().Name + ": " + ex.Message;

                try
                {
                    await db.Database.ExecuteSqlRawAsync("DROP TABLE IF EXISTS \"__EFMigrationsHistory\" CASCADE");
                    await context.Database.MigrateAsync();
                    await DbSeeder.SeedAsync(context);
                    dbError = "Reset and re-migrated";
                    roleCount = await db.Roles.CountAsync();
                }
                catch (Exception ex2)
                {
                    dbError = "Reset failed: " + ex2.GetType().Name + ": " + ex2.Message;
                }
            }
        }

        userCount = await db.Users.CountAsync();
        hasAdmin = await db.Users.AnyAsync(u => u.Username == "admin");
        try
        {
            var user = await db.Users.FirstOrDefaultAsync(u => u.Username == "admin" && u.IsActive);
            if (user != null)
            {
                var role = await db.Roles.FindAsync(user.RoleId);
                if (role == null) tryLoginError = "Role not found for admin user";
            }
            else
            {
                tryLoginError = "Admin user not found or inactive";
            }
        }
        catch (Exception ex)
        {
            tryLoginError = ex.GetType().Name + ": " + ex.Message;
        }
    }
    catch (Exception ex)
    {
        dbError = ex.GetType().Name + ": " + ex.Message;
    }
    return Results.Ok(new { environment = env, databaseUrl = hasDbUrl, pgHost = hasPgHost, pgPassword = hasPgPass, dbConnected, dbError, roleCount, userCount, hasAdmin, tryLoginError });
});

app.UseSwagger();
app.UseSwaggerUI();

app.UseMiddleware<ExceptionMiddleware>();

app.UseCors("AllowAngularApp");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
