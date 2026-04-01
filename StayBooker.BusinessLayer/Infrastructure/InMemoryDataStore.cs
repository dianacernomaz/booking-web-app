using StayBooker.Domain.Entities;

namespace StayBooker.BusinessLayer.Infrastructure;

public sealed class InMemoryDataStore
{
    public InMemoryDataStore()
    {
        Users =
        [
            new User
            {
                Id = Guid.NewGuid(),
                FullName = "Admin StayBooker",
                Email = "admin@staybooker.com",
                Password = "Admin123!",
                Role = UserRole.Admin,
            },
            new User
            {
                Id = Guid.NewGuid(),
                FullName = "User StayBooker",
                Email = "user@staybooker.com",
                Password = "User123!",
                Role = UserRole.User,
            },
        ];
    }

    public List<User> Users { get; }
    public List<ManagedProperty> Properties { get; } = [];
    public int NextPropertyId { get; set; } = 7;
}
