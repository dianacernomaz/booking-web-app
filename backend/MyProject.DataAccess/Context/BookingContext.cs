using Microsoft.EntityFrameworkCore;
using MyProject.Domain.Entities;

namespace MyProject.DataAccess.Context;

public sealed class BookingContext : DbContext
{
    public DbSet<BookingData> Bookings => Set<BookingData>();
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

        modelBuilder.Entity<WishlistData>(entity =>
        {
            entity.HasKey(w => w.Id);
            entity.HasOne(w => w.User).WithMany(u => u.Wishlists).HasForeignKey(w => w.UserId).OnDelete(DeleteBehavior.NoAction);
            entity.HasOne(w => w.Property).WithMany(p => p.WishlistedBy).HasForeignKey(w => w.PropertyId).OnDelete(DeleteBehavior.Cascade);
        });
    }
}
