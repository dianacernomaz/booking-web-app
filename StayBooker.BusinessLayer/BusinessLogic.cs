using StayBooker.BusinessLayer.Interfaces;

namespace StayBooker.BusinessLayer;

public sealed class BusinessLogic
{
    public BusinessLogic(IUserService users, IPropertyService properties)
    {
        Users = users;
        Properties = properties;
    }

    public IUserService Users { get; }
    public IPropertyService Properties { get; }
}
