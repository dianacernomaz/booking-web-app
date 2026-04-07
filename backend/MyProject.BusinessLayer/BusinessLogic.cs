using MyProject.BusinessLayer.Infrastructure;
using MyProject.BusinessLayer.Interfaces;
using MyProject.BusinessLayer.Structure;

namespace MyProject.BusinessLayer;

public sealed class BusinessLogic
{
    private static readonly InMemoryAppStore SharedStore = new();

    public IAuthAction AuthAction()
    {
        return new AuthActionExecution(SharedStore);
    }

    public IPropertyAction PropertyAction()
    {
        return new PropertyActionExecution(SharedStore);
    }

    public IBookingAction BookingAction()
    {
        return new BookingActionExecution(SharedStore);
    }
}
