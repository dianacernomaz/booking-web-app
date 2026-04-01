using Microsoft.Extensions.DependencyInjection;
using MyProject.BusinessLayer.Infrastructure;
using MyProject.BusinessLayer.Services;

namespace MyProject.BusinessLayer;

public static class DependencyInjection
{
    public static IServiceCollection AddBusinessLayer(this IServiceCollection services)
    {
        services.AddSingleton<InMemoryAppStore>();
        services.AddSingleton<IAuthService, AuthService>();
        services.AddSingleton<IPropertyService, PropertyService>();
        services.AddSingleton<IBookingService, BookingService>();
        services.AddSingleton<IBusinessLogic, BusinessLogic>();

        return services;
    }
}
