using Microsoft.EntityFrameworkCore;
using MyProject.DataAccess;
using MyProject.DataAccess.Context;
using MyProject.Domain.Entities;
using System;
using System.Linq;

namespace Seeder
{
    class Program
    {
        static void Main(string[] args)
        {
            var connectionString = "Server=localhost,1433;Database=BookingWebAppDb;User Id=SA;Password=YourStrong!Passw0rd;TrustServerCertificate=True;";
            DbSession.ConnectionString = connectionString;

            using (var db = new UserContext())
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
                        Role = "admin"
                    };
                    db.Users.Add(admin);
                    db.SaveChanges();
                    Console.WriteLine("Admin user seeded.");
                }

                Console.WriteLine("Clearing and re-seeding sample properties...");
                db.Properties.RemoveRange(db.Properties);
                db.SaveChanges();

                if (true)
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
                            Features = new List<PropertyFeatureData> { new() { Value = "Wi-Fi" }, new() { Value = "Aer condiționat" }, new() { Value = "Parcare" } },
                            GalleryImages = new List<PropertyImageData> { new() { Url = "https://images.unsplash.com/photo-1493809842364-78817add7ffb" }, new() { Url = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2" } },
                            IsApproved = true,
                            MaxGuests = 4,
                            Bedrooms = 2,
                            Bathrooms = 1,
                            Area = 65,
                            AvailableFrom = DateTime.UtcNow.ToString("yyyy-MM-dd"),
                            AvailableTo = DateTime.UtcNow.AddMonths(6).ToString("yyyy-MM-dd"),
                            Description = "Apartament superb în centrul orașului.",
                            DescriptionExtra = "Acest apartament oferă tot confortul necesar pentru o ședere relaxantă, având acces rapid la cele mai bune restaurante.",
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
                            Features = new List<PropertyFeatureData> { new() { Value = "Piscină" }, new() { Value = "Vedere la munte" }, new() { Value = "Șemineu" }, new() { Value = "Saună" } },
                            GalleryImages = new List<PropertyImageData> { new() { Url = "https://images.unsplash.com/photo-1510798831971-661eb04b3739" }, new() { Url = "https://images.unsplash.com/photo-1583608205776-bfd35f6d9f83" } },
                            IsApproved = true,
                            MaxGuests = 8,
                            Bedrooms = 4,
                            Bathrooms = 3,
                            Area = 200,
                            AvailableFrom = DateTime.UtcNow.ToString("yyyy-MM-dd"),
                            AvailableTo = DateTime.UtcNow.AddMonths(6).ToString("yyyy-MM-dd"),
                            Description = "Vilă spațioasă cu vedere panoramică la munte.",
                            DescriptionExtra = "O locație perfectă pentru escapade cu prietenii sau familia, cu un living generos și o terasă exterioară cu grătar.",
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
                            Features = new List<PropertyFeatureData> { new() { Value = "Wi-Fi rapid" }, new() { Value = "Vedere oraș" }, new() { Value = "Mașină de spălat" } },
                            GalleryImages = new List<PropertyImageData> { new() { Url = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267" } },
                            IsApproved = true,
                            MaxGuests = 2,
                            Bedrooms = 1,
                            Bathrooms = 1,
                            Area = 35,
                            AvailableFrom = DateTime.UtcNow.ToString("yyyy-MM-dd"),
                            AvailableTo = DateTime.UtcNow.AddMonths(12).ToString("yyyy-MM-dd"),
                            Description = "Studio modern în inima Bucureștiului.",
                            DescriptionExtra = "Ideal pentru călătorii de afaceri sau cupluri. Situat pe faimoasa Cale a Victoriei.",
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
                            Features = new List<PropertyFeatureData> { new() { Value = "Natură" }, new() { Value = "Tradițional" }, new() { Value = "Sobă" }, new() { Value = "Grătar" } },
                            GalleryImages = new List<PropertyImageData> { new() { Url = "https://images.unsplash.com/photo-1542718610-a1d656d1884c" } },
                            IsApproved = true,
                            MaxGuests = 6,
                            Bedrooms = 3,
                            Bathrooms = 2,
                            Area = 120,
                            AvailableFrom = DateTime.UtcNow.ToString("yyyy-MM-dd"),
                            AvailableTo = DateTime.UtcNow.AddMonths(6).ToString("yyyy-MM-dd"),
                            Description = "Experiență tradițională autentică în Maramureș.",
                            DescriptionExtra = "Bucură-te de liniște și aer curat într-o cabană rustică, construită integral din lemn.",
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
                            Features = new List<PropertyFeatureData> { new() { Value = "Vedere la mare" }, new() { Value = "Pe plajă" }, new() { Value = "Balcon" } },
                            GalleryImages = new List<PropertyImageData> { new() { Url = "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd" } },
                            IsApproved = true,
                            MaxGuests = 4,
                            Bedrooms = 2,
                            Bathrooms = 1,
                            Area = 80,
                            AvailableFrom = DateTime.UtcNow.ToString("yyyy-MM-dd"),
                            AvailableTo = DateTime.UtcNow.AddMonths(3).ToString("yyyy-MM-dd"),
                            Description = "Trezește-te cu sunetul valurilor.",
                            DescriptionExtra = "Apartament luminos, complet utilat, situat la doar 50m de plajă.",
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
                            Features = new List<PropertyFeatureData> { new() { Value = "Centru Istoric" }, new() { Value = "Mic dejun inclus" }, new() { Value = "Wi-Fi" } },
                            GalleryImages = new List<PropertyImageData> { new() { Url = "https://images.unsplash.com/photo-1555854877-bab0e564b8d5" } },
                            IsApproved = true,
                            MaxGuests = 3,
                            Bedrooms = 1,
                            Bathrooms = 1,
                            Area = 45,
                            AvailableFrom = DateTime.UtcNow.ToString("yyyy-MM-dd"),
                            AvailableTo = DateTime.UtcNow.AddMonths(8).ToString("yyyy-MM-dd"),
                            Description = "Pensiune intimă chiar în centrul istoric al Sibiului.",
                            DescriptionExtra = "Explorează orașul mergând pe jos. Camerele au grinzi originale din lemn masiv.",
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
                            Features = new List<PropertyFeatureData> { new() { Value = "Design modern" }, new() { Value = "Smart TV" }, new() { Value = "Bucătărie completă" } },
                            GalleryImages = new List<PropertyImageData> { new() { Url = "https://images.unsplash.com/photo-1586023492125-27b2c045efd7" } },
                            IsApproved = true,
                            MaxGuests = 4,
                            Bedrooms = 1,
                            Bathrooms = 2,
                            Area = 90,
                            AvailableFrom = DateTime.UtcNow.ToString("yyyy-MM-dd"),
                            AvailableTo = DateTime.UtcNow.AddMonths(12).ToString("yyyy-MM-dd"),
                            Description = "Un spațiu generos și creativ în Cluj.",
                            DescriptionExtra = "Loft pe două nivele cu geamuri uriașe, situat aproape de gară și centrul orașului.",
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
                            Features = new List<PropertyFeatureData> { new() { Value = "Piscină privată" }, new() { Value = "Ieșire pe plajă" }, new() { Value = "Șezlonguri" } },
                            GalleryImages = new List<PropertyImageData> { new() { Url = "https://images.unsplash.com/photo-1540541338287-41700207dee6" } },
                            IsApproved = true,
                            MaxGuests = 10,
                            Bedrooms = 5,
                            Bathrooms = 4,
                            Area = 250,
                            AvailableFrom = DateTime.UtcNow.ToString("yyyy-MM-dd"),
                            AvailableTo = DateTime.UtcNow.AddMonths(4).ToString("yyyy-MM-dd"),
                            Description = "Lux și relaxare la malul mării.",
                            DescriptionExtra = "Casă perfectă pentru familii numeroase, cu o curte enormă și acces direct la plajă.",
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
                            Features = new List<PropertyFeatureData> { new() { Value = "Ski in/out" }, new() { Value = "Jacuzzi exterior" }, new() { Value = "Terasă panoramică" } },
                            GalleryImages = new List<PropertyImageData> { new() { Url = "https://images.unsplash.com/photo-1521401830884-6c03c1c87ebb" } },
                            IsApproved = true,
                            MaxGuests = 8,
                            Bedrooms = 4,
                            Bathrooms = 4,
                            Area = 300,
                            AvailableFrom = DateTime.UtcNow.ToString("yyyy-MM-dd"),
                            AvailableTo = DateTime.UtcNow.AddMonths(12).ToString("yyyy-MM-dd"),
                            Description = "Un chalet exclusivist la altitudine.",
                            DescriptionExtra = "Așezat strategic lângă pârtiile de schi, oferind priveliști ce îți taie respirația.",
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
                            Features = new List<PropertyFeatureData> { new() { Value = "Loc parcare subteran" }, new() { Value = "Lângă mall" }, new() { Value = "Espressor" } },
                            GalleryImages = new List<PropertyImageData> { new() { Url = "https://images.unsplash.com/photo-1560448205-0cdcefc994ab" } },
                            IsApproved = true,
                            MaxGuests = 4,
                            Bedrooms = 2,
                            Bathrooms = 1,
                            Area = 75,
                            AvailableFrom = DateTime.UtcNow.ToString("yyyy-MM-dd"),
                            AvailableTo = DateTime.UtcNow.AddMonths(10).ToString("yyyy-MM-dd"),
                            Description = "Cazare premium lângă complexul Palas.",
                            DescriptionExtra = "Bucură-te de facilitățile orașului, cu priveliște direct către Palatul Culturii.",
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
                            Features = new List<PropertyFeatureData> { new() { Value = "Cramă" }, new() { Value = "Degustare vin" }, new() { Value = "Grădină imensă" } },
                            GalleryImages = new List<PropertyImageData> { new() { Url = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c" } },
                            IsApproved = true,
                            MaxGuests = 12,
                            Bedrooms = 6,
                            Bathrooms = 6,
                            Area = 500,
                            AvailableFrom = DateTime.UtcNow.ToString("yyyy-MM-dd"),
                            AvailableTo = DateTime.UtcNow.AddMonths(12).ToString("yyyy-MM-dd"),
                            Description = "Întoarce-te în timp pe domeniul acestui conac istoric.",
                            DescriptionExtra = "O destinație ideală pentru pasionații de vin și relaxare în natură.",
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
                            Features = new List<PropertyFeatureData> { new() { Value = "Aventură" }, new() { Value = "Hamac" }, new() { Value = "Fără TV (Digital Detox)" } },
                            GalleryImages = new List<PropertyImageData> { new() { Url = "https://images.unsplash.com/photo-1542718610-a1d656d1884c" } },
                            IsApproved = true,
                            MaxGuests = 2,
                            Bedrooms = 1,
                            Bathrooms = 1,
                            Area = 25,
                            AvailableFrom = DateTime.UtcNow.ToString("yyyy-MM-dd"),
                            AvailableTo = DateTime.UtcNow.AddMonths(6).ToString("yyyy-MM-dd"),
                            Description = "O experiență de neuitat sus, între ramuri.",
                            DescriptionExtra = "Evadează din cotidian și trezește-te direct în mijlocul pădurii. O aventură perfectă pentru cupluri.",
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        },
                        new PropertyData
                        {
                            OwnerId = owner.Id,
                            Host = owner.FullName,
                            Title = "Apartament Romantic la Turnul Eiffel",
                            City = "Paris",
                            Country = "Franța",
                            Address = "Av. Gustave Eiffel 5",
                            Price = 250,
                            Rating = 4.95m,
                            Reviews = 120,
                            Image = "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=800",
                            Features = new List<PropertyFeatureData> { new() { Value = "Vedere la Turn" }, new() { Value = "Aer romantic" }, new() { Value = "Balcon" } },
                            GalleryImages = new List<PropertyImageData> { new() { Url = "https://images.unsplash.com/photo-1502602898657-3e91760cbb34" } },
                            IsApproved = true,
                            MaxGuests = 2,
                            Bedrooms = 1,
                            Bathrooms = 1,
                            Area = 45,
                            AvailableFrom = DateTime.UtcNow.ToString("yyyy-MM-dd"),
                            AvailableTo = DateTime.UtcNow.AddMonths(12).ToString("yyyy-MM-dd"),
                            Description = "Vedere spectaculoasă chiar din patul tău.",
                            DescriptionExtra = "Situat la doar 2 pași de Turnul Eiffel, perfect pentru un weekend romantic.",
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        },
                        new PropertyData
                        {
                            OwnerId = owner.Id,
                            Host = owner.FullName,
                            Title = "Penthouse Neon în Shibuya",
                            City = "Tokyo",
                            Country = "Japonia",
                            Address = "Shibuya Crossing 12",
                            Price = 300,
                            Rating = 4.85m,
                            Reviews = 85,
                            Image = "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80&w=800",
                            Features = new List<PropertyFeatureData> { new() { Value = "Geamuri panoramice" }, new() { Value = "High Tech" }, new() { Value = "Aproape de metrou" } },
                            GalleryImages = new List<PropertyImageData> { new() { Url = "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc" } },
                            IsApproved = true,
                            MaxGuests = 4,
                            Bedrooms = 2,
                            Bathrooms = 2,
                            Area = 80,
                            AvailableFrom = DateTime.UtcNow.ToString("yyyy-MM-dd"),
                            AvailableTo = DateTime.UtcNow.AddMonths(12).ToString("yyyy-MM-dd"),
                            Description = "Bucură-te de energia inepuizabilă a metropolei japoneze.",
                            DescriptionExtra = "Un spațiu ultra-modern cu smart home control și vedere directă spre Shibuya Crossing.",
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        },
                        new PropertyData
                        {
                            OwnerId = owner.Id,
                            Host = owner.FullName,
                            Title = "Loft Manhattan Central",
                            City = "New York",
                            Country = "Statele Unite",
                            Address = "Broadway 42nd St",
                            Price = 450,
                            Rating = 4.7m,
                            Reviews = 210,
                            Image = "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80&w=800",
                            Features = new List<PropertyFeatureData> { new() { Value = "Central Park" }, new() { Value = "Vedere skyline" }, new() { Value = "Design modern" } },
                            GalleryImages = new List<PropertyImageData> { new() { Url = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267" } },
                            IsApproved = true,
                            MaxGuests = 6,
                            Bedrooms = 3,
                            Bathrooms = 2,
                            Area = 150,
                            AvailableFrom = DateTime.UtcNow.ToString("yyyy-MM-dd"),
                            AvailableTo = DateTime.UtcNow.AddMonths(12).ToString("yyyy-MM-dd"),
                            Description = "Simte pulsul orașului care nu doarme niciodată.",
                            DescriptionExtra = "Un loft iconic situat la câteva minute de Times Square și Central Park.",
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        },
                        new PropertyData
                        {
                            OwnerId = owner.Id,
                            Host = owner.FullName,
                            Title = "Vilă Zen în Junglă",
                            City = "Bali",
                            Country = "Indonezia",
                            Address = "Ubud Forest 77",
                            Price = 180,
                            Rating = 4.95m,
                            Reviews = 340,
                            Image = "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800",
                            Features = new List<PropertyFeatureData> { new() { Value = "Piscină infinită" }, new() { Value = "Meditație" }, new() { Value = "Natură sălbatică" } },
                            GalleryImages = new List<PropertyImageData> { new() { Url = "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86" } },
                            IsApproved = true,
                            MaxGuests = 4,
                            Bedrooms = 2,
                            Bathrooms = 2,
                            Area = 200,
                            AvailableFrom = DateTime.UtcNow.ToString("yyyy-MM-dd"),
                            AvailableTo = DateTime.UtcNow.AddMonths(12).ToString("yyyy-MM-dd"),
                            Description = "Refugiul tău spiritual în inima insulei zeilor.",
                            DescriptionExtra = "O vilă complet deschisă, cu o piscină infinită deasupra junglei, ideală pentru relaxare profundă.",
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        }
                    };
                    foreach (var property in properties)
                    {
                        property.Amenities = property.Features?.Select(f => new AmenityData { Icon = "check", Label = f.Value, Available = true }).ToList() ?? new List<AmenityData>();
                        property.Nearby = new List<NearbyPlaceData>
                        {
                            new NearbyPlaceData { Icon = "location", Name = property.Address, Dist = "La locație" },
                            new NearbyPlaceData { Icon = "city", Name = $"Centru {property.City}", Dist = "1.2 km" }
                        };
                    }

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
