using Microsoft.Extensions.DependencyInjection;

namespace MyProject.BusinessLayer;

public static class DependencyInjection
{
    public static IServiceCollection AddBusinessLayer(this IServiceCollection services)
    {
        services.AddSingleton<BusinessLogic>();

        return services;
    }
}
