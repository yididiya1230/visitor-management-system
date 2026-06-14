using Microsoft.Extensions.DependencyInjection;

namespace ECX.VisitorManagement.Application;

public static class ApplicationServiceRegistration
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddAutoMapper(typeof(ApplicationServiceRegistration).Assembly);
        return services;
    }
}
