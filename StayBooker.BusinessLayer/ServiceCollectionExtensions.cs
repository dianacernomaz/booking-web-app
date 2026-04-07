using Microsoft.Extensions.DependencyInjection;
using StayBooker.BusinessLayer.Infrastructure;
using StayBooker.BusinessLayer.Interfaces;
using StayBooker.BusinessLayer.Services;

namespace StayBooker.BusinessLayer;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddBusinessLayer(this IServiceCollection services)
    {
        services.AddSingleton<InMemoryDataStore>();
        services.AddSingleton<IUserService, UserService>();
        services.AddSingleton<IPropertyService, PropertyService>();
        services.AddSingleton<BusinessLogic>();
        return services;
    }
}
