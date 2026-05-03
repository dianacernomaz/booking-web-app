using Microsoft.EntityFrameworkCore;
using MyProject.Domain.Entities;

namespace MyProject.DataAccess.Context;

public sealed class UserContext : DbContext
{
    public DbSet<UserData> Users => Set<UserData>();
    public DbSet<PropertyData> Properties => Set<PropertyData>();
    public DbSet<BookingData> Bookings => Set<BookingData>();
    public DbSet<PropertyImageData> PropertyImages => Set<PropertyImageData>();
    public DbSet<PropertyFeatureData> PropertyFeatures => Set<PropertyFeatureData>();
    public DbSet<PropertyOccupiedDayData> PropertyOccupiedDays => Set<PropertyOccupiedDayData>();
    public DbSet<AmenityData> Amenities => Set<AmenityData>();
    public DbSet<ReviewData> Reviews => Set<ReviewData>();
    public DbSet<NearbyPlaceData> NearbyPlaces => Set<NearbyPlaceData>();

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            var connStr = string.IsNullOrEmpty(DbSession.ConnectionString) 
                ? "Server=.\\SQLEXPRESS;Database=BookingWebAppDb;Trusted_Connection=True;MultipleActiveResultSets=True;TrustServerCertificate=True;Encrypt=False" 
                : DbSession.ConnectionString;
            optionsBuilder.UseSqlServer(connStr);
        }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<UserData>(entity =>
        {
            entity.HasKey(user => user.Id);
            entity.HasIndex(user => user.Email).IsUnique();
            entity.Property(user => user.Email).HasMaxLength(256);
            entity.Property(user => user.FullName).HasMaxLength(200);
            entity.Property(user => user.Password).HasMaxLength(200);
            entity.Property(user => user.Role).HasMaxLength(50);
        });

        modelBuilder.Entity<BookingData>(entity => { entity.HasOne(booking => booking.User).WithMany(user => user.Bookings).HasForeignKey(booking => booking.UserId).OnDelete(DeleteBehavior.NoAction); });
    }
}
