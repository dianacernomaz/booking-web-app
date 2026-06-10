using Microsoft.EntityFrameworkCore;
using MyProject.Domain.Entities;

namespace MyProject.DataAccess.Context;

public sealed class PropertyContext : DbContext
{
    public DbSet<PropertyData> Properties => Set<PropertyData>();
    public DbSet<UserData> Users => Set<UserData>();
    public DbSet<PropertyImageData> PropertyImages => Set<PropertyImageData>();
    public DbSet<PropertyFeatureData> PropertyFeatures => Set<PropertyFeatureData>();
    public DbSet<PropertyOccupiedDayData> PropertyOccupiedDays => Set<PropertyOccupiedDayData>();
    public DbSet<AmenityData> Amenities => Set<AmenityData>();
    public DbSet<ReviewData> Reviews => Set<ReviewData>();
    public DbSet<NearbyPlaceData> NearbyPlaces => Set<NearbyPlaceData>();
    public DbSet<FavoriteData> Favorites => Set<FavoriteData>();

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
        modelBuilder.Entity<PropertyData>(entity =>
        {
            entity.HasKey(property => property.Id);
            entity.Property(property => property.Host).HasMaxLength(200);
            entity.Property(property => property.Title).HasMaxLength(200);
            entity.Property(property => property.City).HasMaxLength(100);
            entity.Property(property => property.Country).HasMaxLength(100);
            entity.Property(property => property.Address).HasMaxLength(300);
            entity.Property(property => property.Price).HasPrecision(18, 2);
            entity.Property(property => property.Rating).HasPrecision(4, 2);
            entity.Property(property => property.Image).HasColumnType("nvarchar(max)");
            entity.Property(property => property.Badge).HasMaxLength(50);
            entity.Property(property => property.AvailableFrom).HasMaxLength(30);
            entity.Property(property => property.AvailableTo).HasMaxLength(30);

            entity
                .HasOne(property => property.Owner)
                .WithMany(user => user.Properties)
                .HasForeignKey(property => property.OwnerId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<PropertyImageData>(entity =>
        {
            entity.HasKey(image => image.Id);
            entity.Property(image => image.Url).HasColumnType("nvarchar(max)");
            entity
                .HasOne(image => image.Property)
                .WithMany(property => property.GalleryImages)
                .HasForeignKey(image => image.PropertyId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<PropertyFeatureData>(entity =>
        {
            entity.HasKey(feature => feature.Id);
            entity.Property(feature => feature.Value).HasMaxLength(100);
            entity
                .HasOne(feature => feature.Property)
                .WithMany(property => property.Features)
                .HasForeignKey(feature => feature.PropertyId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<PropertyOccupiedDayData>(entity =>
        {
            entity.HasKey(day => day.Id);
            entity
                .HasOne(day => day.Property)
                .WithMany(property => property.OccupiedDays)
                .HasForeignKey(day => day.PropertyId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<AmenityData>(entity =>
        {
            entity.HasKey(amenity => amenity.Id);
            entity.Property(amenity => amenity.Icon).HasMaxLength(50);
            entity.Property(amenity => amenity.Label).HasMaxLength(150);
            entity
                .HasOne(amenity => amenity.Property)
                .WithMany(property => property.Amenities)
                .HasForeignKey(amenity => amenity.PropertyId)
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

        modelBuilder.Entity<NearbyPlaceData>(entity =>
        {
            entity.HasKey(nearby => nearby.Id);
            entity.Property(nearby => nearby.Icon).HasMaxLength(50);
            entity.Property(nearby => nearby.Name).HasMaxLength(150);
            entity.Property(nearby => nearby.Dist).HasMaxLength(50);
            entity
                .HasOne(nearby => nearby.Property)
                .WithMany(property => property.Nearby)
                .HasForeignKey(nearby => nearby.PropertyId)
                .OnDelete(DeleteBehavior.Cascade);
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
    }
}
