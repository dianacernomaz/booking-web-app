using MyProject.BusinessLayer.Services;

namespace MyProject.BusinessLayer;

public interface IBusinessLogic
{
    IAuthService Auth { get; }

    IPropertyService Properties { get; }

    IBookingService Bookings { get; }
}

public sealed class BusinessLogic(
    IAuthService auth,
    IPropertyService properties,
    IBookingService bookings) : IBusinessLogic
{
    public IAuthService Auth { get; } = auth;

    public IPropertyService Properties { get; } = properties;

    public IBookingService Bookings { get; } = bookings;
}
