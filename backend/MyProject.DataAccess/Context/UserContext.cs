using Microsoft.EntityFrameworkCore;
using MyProject.Domain.Entities;

namespace MyProject.DataAccess.Context;

public sealed class UserContext : DbContext
{
    public DbSet<UserData> Users => Set<UserData>();
    public DbSet<PropertyData> Properties => Set<PropertyData>();
    public DbSet<BookingData> Bookings => Set<BookingData>();
    public DbSet<NotificationData> Notifications => Set<NotificationData>();
    public DbSet<FavoriteData> Favorites => Set<FavoriteData>();
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

        modelBuilder.Entity<NotificationData>(entity =>
        {
            entity.HasKey(notification => notification.Id);
            entity.Property(notification => notification.Title).HasMaxLength(200);
            entity.Property(notification => notification.Message).HasColumnType("nvarchar(max)");
            entity.Property(notification => notification.Type).HasMaxLength(50);

            entity
                .HasOne(notification => notification.User)
                .WithMany(user => user.Notifications)
                .HasForeignKey(notification => notification.UserId)
                .OnDelete(DeleteBehavior.NoAction);
        });

        modelBuilder.Entity<FavoriteData>(entity =>
        {
            entity.HasKey(favorite => favorite.Id);
            entity.HasIndex(favorite => new { favorite.UserId, favorite.PropertyId }).IsUnique();

            entity
                .HasOne(favorite => favorite.User)
                .WithMany(user => user.Favorites)
                .HasForeignKey(favorite => favorite.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            entity
                .HasOne(favorite => favorite.Property)
                .WithMany(property => property.Favorites)
                .HasForeignKey(favorite => favorite.PropertyId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<ReviewData>(entity =>
        {
            entity.HasKey(review => review.Id);
            entity.HasIndex(review => new { review.UserId, review.PropertyId }).IsUnique();
            entity.Property(review => review.Comment).HasMaxLength(1000);

            entity
                .HasOne(review => review.User)
                .WithMany(user => user.Reviews)
                .HasForeignKey(review => review.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            entity
                .HasOne(review => review.Property)
                .WithMany(property => property.ReviewsList)
                .HasForeignKey(review => review.PropertyId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
