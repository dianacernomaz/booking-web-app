using MyProject.Domain.Entities;

namespace MyProject.BusinessLayer.Infrastructure;

public sealed class InMemoryAppStore
{
    public object SyncRoot { get; } = new();

    public List<UserEntity> Users { get; }

    public List<PropertyEntity> Properties { get; }

    public List<BookingEntity> Bookings { get; }

    public InMemoryAppStore()
    {
        Users = SeedDataFactory.CreateUsers();
        Properties = SeedDataFactory.CreateProperties();
        Bookings = [];
    }
}
