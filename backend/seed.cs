using Microsoft.EntityFrameworkCore;
using MyProject.DataAccess;
using MyProject.Domain.Entities;
using System;
using System.Linq;

namespace SeedData
{
    class Program
    {
        static void Main(string[] args)
        {
            var connectionString = "Server=.\\SQLEXPRESS;Database=BookingWebAppDb;Trusted_Connection=True;MultipleActiveResultSets=True;TrustServerCertificate=True;Encrypt=False";
            var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
            optionsBuilder.UseSqlServer(connectionString);

            using (var db = new AppDbContext(optionsBuilder.Options))
            {
                Console.WriteLine("Checking database...");

                var userCount = db.Users.Count();
                Console.WriteLine($"Total Users: {userCount}");

                if (userCount == 0)
                {
                    Console.WriteLine("Seeding admin user...");
                    var admin = new UserData
                    {
                        Email = "admin@booking.com",
                        Password = BCrypt.Net.BCrypt.HashPassword("admin"),
                        FullName = "Platform Admin",
                        Role = "admin",
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };
                    db.Users.Add(admin);
                    db.SaveChanges();
                    Console.WriteLine("Admin user seeded.");
                }

                var propertyCount = db.Properties.Count();
                Console.WriteLine($"Total Properties: {propertyCount}");

                if (propertyCount == 0)
                {
                    Console.WriteLine("Seeding sample properties...");
                    var owner = db.Users.First();
                    var properties = new[]
                    {
                        new PropertyData
                        {
                            OwnerId = owner.Id,
                            Host = owner.FullName,
                            Title = "Apartament Modern Centru",
                            City = "Chișinău",
                            Country = "Moldova",
                            Address = "Str. Ștefan cel Mare 1",
                            Price = 50,
                            Rating = 4.8m,
                            Reviews = 12,
                            Image = "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800",
                            IsApproved = true,
                            MaxGuests = 4,
                            Bedrooms = 2,
                            Bathrooms = 1,
                            Area = 65,
                            AvailableFrom = DateTime.UtcNow.ToString("yyyy-MM-dd"),
                            AvailableTo = DateTime.UtcNow.AddMonths(6).ToString("yyyy-MM-dd"),
                            Description = "Apartament superb în centrul orașului.",
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        },
                        new PropertyData
                        {
                            OwnerId = owner.Id,
                            Host = owner.FullName,
                            Title = "Vilă de Lux la Munte",
                            City = "Brașov",
                            Country = "România",
                            Address = "Str. Muntelui 42",
                            Price = 120,
                            Rating = 4.9m,
                            Reviews = 8,
                            Image = "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800",
                            IsApproved = true,
                            MaxGuests = 8,
                            Bedrooms = 4,
                            Bathrooms = 3,
                            Area = 200,
                            AvailableFrom = DateTime.UtcNow.ToString("yyyy-MM-dd"),
                            AvailableTo = DateTime.UtcNow.AddMonths(6).ToString("yyyy-MM-dd"),
                            Description = "Vilă spațioasă cu vedere panoramică la munte.",
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        },
                        new PropertyData
                        {
                            OwnerId = owner.Id,
                            Host = owner.FullName,
                            Title = "Studio Cochet în București",
                            City = "București",
                            Country = "România",
                            Address = "Calea Victoriei 123",
                            Price = 45,
                            Rating = 4.7m,
                            Reviews = 25,
                            Image = "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=800",
                            IsApproved = true,
                            MaxGuests = 2,
                            Bedrooms = 1,
                            Bathrooms = 1,
                            Area = 35,
                            AvailableFrom = DateTime.UtcNow.ToString("yyyy-MM-dd"),
                            AvailableTo = DateTime.UtcNow.AddMonths(12).ToString("yyyy-MM-dd"),
                            Description = "Studio modern în inima Bucureștiului.",
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        },
                        new PropertyData
                        {
                            OwnerId = owner.Id,
                            Host = owner.FullName,
                            Title = "Cabană Rustică Maramureș",
                            City = "Vișeu de Sus",
                            Country = "România",
                            Address = "Str. Principală 10",
                            Price = 75,
                            Rating = 4.95m,
                            Reviews = 15,
                            Image = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800",
                            IsApproved = true,
                            MaxGuests = 6,
                            Bedrooms = 3,
                            Bathrooms = 2,
                            Area = 120,
                            AvailableFrom = DateTime.UtcNow.ToString("yyyy-MM-dd"),
                            AvailableTo = DateTime.UtcNow.AddMonths(6).ToString("yyyy-MM-dd"),
                            Description = "Experiență tradițională autentică în Maramureș.",
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        },
                        new PropertyData
                        {
                            OwnerId = owner.Id,
                            Host = owner.FullName,
                            Title = "Apartament Vedere Mare",
                            City = "Constanța",
                            Country = "România",
                            Address = "Bulevardul Mamaia 50",
                            Price = 90,
                            Rating = 4.6m,
                            Reviews = 40,
                            Image = "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=800",
                            IsApproved = true,
                            MaxGuests = 4,
                            Bedrooms = 2,
                            Bathrooms = 1,
                            Area = 80,
                            AvailableFrom = DateTime.UtcNow.ToString("yyyy-MM-dd"),
                            AvailableTo = DateTime.UtcNow.AddMonths(3).ToString("yyyy-MM-dd"),
                            Description = "Trezește-te cu sunetul valurilor.",
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        },
                        new PropertyData
                        {
                            OwnerId = owner.Id,
                            Host = owner.FullName,
                            Title = "Pensiune Tradițională",
                            City = "Sibiu",
                            Country = "România",
                            Address = "Piața Mică 3",
                            Price = 60,
                            Rating = 4.85m,
                            Reviews = 32,
                            Image = "https://images.unsplash.com/photo-1528909514045-2f44625dcb0e?auto=format&fit=crop&q=80&w=800",
                            IsApproved = true,
                            MaxGuests = 3,
                            Bedrooms = 1,
                            Bathrooms = 1,
                            Area = 45,
                            AvailableFrom = DateTime.UtcNow.ToString("yyyy-MM-dd"),
                            AvailableTo = DateTime.UtcNow.AddMonths(8).ToString("yyyy-MM-dd"),
                            Description = "Pensiune intimă chiar în centrul istoric al Sibiului.",
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        },
                        new PropertyData
                        {
                            OwnerId = owner.Id,
                            Host = owner.FullName,
                            Title = "Loft Industrial",
                            City = "Cluj-Napoca",
                            Country = "România",
                            Address = "Str. Horea 22",
                            Price = 85,
                            Rating = 4.75m,
                            Reviews = 50,
                            Image = "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800",
                            IsApproved = true,
                            MaxGuests = 4,
                            Bedrooms = 1,
                            Bathrooms = 2,
                            Area = 90,
                            AvailableFrom = DateTime.UtcNow.ToString("yyyy-MM-dd"),
                            AvailableTo = DateTime.UtcNow.AddMonths(12).ToString("yyyy-MM-dd"),
                            Description = "Un spațiu generos și creativ în Cluj.",
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        },
                        new PropertyData
                        {
                            OwnerId = owner.Id,
                            Host = owner.FullName,
                            Title = "Casă de Vacanță pe Plajă",
                            City = "Eforie Nord",
                            Country = "România",
                            Address = "Aleea Belona 1",
                            Price = 150,
                            Rating = 4.9m,
                            Reviews = 18,
                            Image = "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800",
                            IsApproved = true,
                            MaxGuests = 10,
                            Bedrooms = 5,
                            Bathrooms = 4,
                            Area = 250,
                            AvailableFrom = DateTime.UtcNow.ToString("yyyy-MM-dd"),
                            AvailableTo = DateTime.UtcNow.AddMonths(4).ToString("yyyy-MM-dd"),
                            Description = "Lux și relaxare la malul mării.",
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        },
                        new PropertyData
                        {
                            OwnerId = owner.Id,
                            Host = owner.FullName,
                            Title = "Chalet Panoramic",
                            City = "Sinaia",
                            Country = "România",
                            Address = "Cota 1400",
                            Price = 200,
                            Rating = 5.0m,
                            Reviews = 5,
                            Image = "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=800",
                            IsApproved = true,
                            MaxGuests = 8,
                            Bedrooms = 4,
                            Bathrooms = 4,
                            Area = 300,
                            AvailableFrom = DateTime.UtcNow.ToString("yyyy-MM-dd"),
                            AvailableTo = DateTime.UtcNow.AddMonths(12).ToString("yyyy-MM-dd"),
                            Description = "Un chalet exclusivist la altitudine.",
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        },
                        new PropertyData
                        {
                            OwnerId = owner.Id,
                            Host = owner.FullName,
                            Title = "Apartament Elegant Palas",
                            City = "Iași",
                            Country = "România",
                            Address = "Str. Palat 1",
                            Price = 70,
                            Rating = 4.8m,
                            Reviews = 22,
                            Image = "https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&q=80&w=800",
                            IsApproved = true,
                            MaxGuests = 4,
                            Bedrooms = 2,
                            Bathrooms = 1,
                            Area = 75,
                            AvailableFrom = DateTime.UtcNow.ToString("yyyy-MM-dd"),
                            AvailableTo = DateTime.UtcNow.AddMonths(10).ToString("yyyy-MM-dd"),
                            Description = "Cazare premium lângă complexul Palas.",
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        },
                        new PropertyData
                        {
                            OwnerId = owner.Id,
                            Host = owner.FullName,
                            Title = "Conac Boieresc",
                            City = "Buzău",
                            Country = "România",
                            Address = "Dealul Mare",
                            Price = 110,
                            Rating = 4.9m,
                            Reviews = 14,
                            Image = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800",
                            IsApproved = true,
                            MaxGuests = 12,
                            Bedrooms = 6,
                            Bathrooms = 6,
                            Area = 500,
                            AvailableFrom = DateTime.UtcNow.ToString("yyyy-MM-dd"),
                            AvailableTo = DateTime.UtcNow.AddMonths(12).ToString("yyyy-MM-dd"),
                            Description = "Întoarce-te în timp pe domeniul acestui conac istoric.",
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        },
                        new PropertyData
                        {
                            OwnerId = owner.Id,
                            Host = owner.FullName,
                            Title = "Căsuță în Copac",
                            City = "Predeal",
                            Country = "România",
                            Address = "Pădurea Sus",
                            Price = 85,
                            Rating = 4.95m,
                            Reviews = 45,
                            Image = "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=800",
                            IsApproved = true,
                            MaxGuests = 2,
                            Bedrooms = 1,
                            Bathrooms = 1,
                            Area = 25,
                            AvailableFrom = DateTime.UtcNow.ToString("yyyy-MM-dd"),
                            AvailableTo = DateTime.UtcNow.AddMonths(6).ToString("yyyy-MM-dd"),
                            Description = "O experiență de neuitat sus, între ramuri.",
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        }
                    };
                    db.Properties.AddRange(properties);
                    db.SaveChanges();
                    Console.WriteLine("Properties seeded.");
                }
                else
                {
                    Console.WriteLine("Approving all existing properties...");
                    var props = db.Properties.Where(p => !p.IsApproved).ToList();
                    foreach (var p in props)
                    {
                        p.IsApproved = true;
                    }
                    db.SaveChanges();
                    Console.WriteLine($"{props.Count} properties approved.");
                }

                Console.WriteLine("Database check complete.");
            }
        }
    }
}
