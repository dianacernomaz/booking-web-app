using Microsoft.EntityFrameworkCore;
using MyProject.Domain.Entities;

namespace MyProject.DataAccess.Context;

public sealed class BookingContext : DbContext
{
    public DbSet<BookingData> Bookings => Set<BookingData>();
    public DbSet<NotificationData> Notifications => Set<NotificationData>();
    public DbSet<FavoriteData> Favorites => Set<FavoriteData>();
    public DbSet<ReviewData> Reviews => Set<ReviewData>();
    public DbSet<UserData> Users => Set<UserData>();
    public DbSet<PropertyData> Properties => Set<PropertyData>();
    public DbSet<WishlistData> Wishlists => Set<WishlistData>();

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
        modelBuilder.Entity<BookingData>(entity =>
        {
            entity.HasKey(booking => booking.Id);
            entity.Property(booking => booking.Id).HasMaxLength(64);
            entity.Property(booking => booking.Total).HasPrecision(18, 2);
            entity.Property(booking => booking.PropertyTitle).HasMaxLength(200);
            entity.Property(booking => booking.PropertyLocation).HasMaxLength(200);
            entity.Property(booking => booking.PropertyImage).HasColumnType("nvarchar(max)");
            entity.Property(booking => booking.CheckIn).HasMaxLength(30);
            entity.Property(booking => booking.CheckOut).HasMaxLength(30);
            entity.Property(booking => booking.Status).HasMaxLength(50);
            entity.Property(booking => booking.Code).HasMaxLength(100);
            entity.Property(booking => booking.PaymentMethod).HasMaxLength(100);
            entity.Property(booking => booking.PaymentStatus).HasMaxLength(100);
            entity.Property(booking => booking.PaymentLabel).HasMaxLength(100);
            entity.Property(booking => booking.PaymentLast4).HasMaxLength(10);

            entity
                .HasOne(booking => booking.User)
                .WithMany(user => user.Bookings)
                .HasForeignKey(booking => booking.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            entity
                .HasOne(booking => booking.Property)
                .WithMany(property => property.Bookings)
                .HasForeignKey(booking => booking.PropertyId)
                .OnDelete(DeleteBehavior.Cascade);
        });

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
