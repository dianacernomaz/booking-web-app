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

                    // Ensure admin password meets new validation rules
                    var adminUser = db.Users.FirstOrDefault(u => u.Email == "admin@booking.com");
                    if (adminUser != null)
                    {
                        adminUser.Password = BCrypt.Net.BCrypt.HashPassword("Admin123!");
                        db.SaveChanges();
                    }
                }

                Console.WriteLine("Clearing and re-seeding sample properties...");

                    // Ensure admin password meets validation rules even if admin already exists
                    var existingAdmin = db.Users.FirstOrDefault(u => u.Email == "admin@booking.com");
                    if (existingAdmin != null)
                    {
                        existingAdmin.Password = BCrypt.Net.BCrypt.HashPassword("Admin123!");
                        db.SaveChanges();
                    }
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
                            Title = "Penthouse Riverside",
                            City = "Timisoara",
                            Country = "Romania",
                            Address = "Splaiul Nistrului 18",
                            Price = 95,
                            Rating = 4.88m,
                            Reviews = 27,
                            Image = "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=800",
                            Features = new List<PropertyFeatureData> { new() { Value = "River view" }, new() { Value = "Private terrace" }, new() { Value = "Smart check-in" } },
                            GalleryImages = new List<PropertyImageData> { new() { Url = "https://images.unsplash.com/photo-1484154218962-a197022b5858" } },
                            IsApproved = true,
                            MaxGuests = 4,
                            Bedrooms = 2,
                            Bathrooms = 2,
                            Area = 110,
                            AvailableFrom = DateTime.UtcNow.ToString("yyyy-MM-dd"),
                            AvailableTo = DateTime.UtcNow.AddMonths(9).ToString("yyyy-MM-dd"),
                            Description = "Penthouse modern cu terasa si vedere spre rau.",
                            DescriptionExtra = "Potrivit pentru city break sau deplasari business, cu zona de lounge generoasa si acces rapid catre centru.",
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        },
                        new PropertyData
                        {
                            OwnerId = owner.Id,
                            Host = owner.FullName,
                            Title = "Boutique Loft Republicii",
                            City = "Oradea",
                            Country = "Romania",
                            Address = "Str. Republicii 44",
                            Price = 68,
                            Rating = 4.82m,
                            Reviews = 31,
                            Image = "https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&q=80&w=800",
                            Features = new List<PropertyFeatureData> { new() { Value = "Historic center" }, new() { Value = "Coffee bar" }, new() { Value = "Self check-in" } },
                            GalleryImages = new List<PropertyImageData> { new() { Url = "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85" } },
                            IsApproved = true,
                            MaxGuests = 3,
                            Bedrooms = 1,
                            Bathrooms = 1,
                            Area = 58,
                            AvailableFrom = DateTime.UtcNow.ToString("yyyy-MM-dd"),
                            AvailableTo = DateTime.UtcNow.AddMonths(11).ToString("yyyy-MM-dd"),
                            Description = "Loft elegant in apropierea cladirilor Art Nouveau din Oradea.",
                            DescriptionExtra = "Interior luminos, finisaje premium si multe cafenele la cativa pasi de locatie.",
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        },
                        new PropertyData
                        {
                            OwnerId = owner.Id,
                            Host = owner.FullName,
                            Title = "Retreat Delta Escape",
                            City = "Murighiol",
                            Country = "Romania",
                            Address = "Str. Portului 7",
                            Price = 130,
                            Rating = 4.93m,
                            Reviews = 16,
                            Image = "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=800",
                            Features = new List<PropertyFeatureData> { new() { Value = "Boat trips" }, new() { Value = "Fishing dock" }, new() { Value = "Breakfast included" } },
                            GalleryImages = new List<PropertyImageData> { new() { Url = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e" } },
                            IsApproved = true,
                            MaxGuests = 6,
                            Bedrooms = 3,
                            Bathrooms = 2,
                            Area = 140,
                            AvailableFrom = DateTime.UtcNow.ToString("yyyy-MM-dd"),
                            AvailableTo = DateTime.UtcNow.AddMonths(7).ToString("yyyy-MM-dd"),
                            Description = "Refugiu linistit aproape de canalele Deltei Dunarii.",
                            DescriptionExtra = "Locatie excelenta pentru natura, plimbari cu barca si seri relaxante pe ponton.",
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        },
                        new PropertyData
                        {
                            OwnerId = owner.Id,
                            Host = owner.FullName,
                            Title = "Apartment Citadel View",
                            City = "Alba Iulia",
                            Country = "Romania",
                            Address = "Str. Mihai Viteazul 12",
                            Price = 58,
                            Rating = 4.79m,
                            Reviews = 24,
                            Image = "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&q=80&w=800",
                            Features = new List<PropertyFeatureData> { new() { Value = "City walls view" }, new() { Value = "Work desk" }, new() { Value = "Private parking" } },
                            GalleryImages = new List<PropertyImageData> { new() { Url = "https://images.unsplash.com/photo-1494526585095-c41746248156" } },
                            IsApproved = true,
                            MaxGuests = 4,
                            Bedrooms = 2,
                            Bathrooms = 1,
                            Area = 72,
                            AvailableFrom = DateTime.UtcNow.ToString("yyyy-MM-dd"),
                            AvailableTo = DateTime.UtcNow.AddMonths(10).ToString("yyyy-MM-dd"),
                            Description = "Apartament confortabil cu vedere catre Cetatea Alba Carolina.",
                            DescriptionExtra = "Bun pentru familii si turisti care vor sa exploreze orasul vechi pe jos.",
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        },
                        new PropertyData
                        {
                            OwnerId = owner.Id,
                            Host = owner.FullName,
                            Title = "Garden House Craiova",
                            City = "Craiova",
                            Country = "Romania",
                            Address = "Str. Teilor 9",
                            Price = 77,
                            Rating = 4.84m,
                            Reviews = 19,
                            Image = "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=800",
                            Features = new List<PropertyFeatureData> { new() { Value = "Private yard" }, new() { Value = "BBQ area" }, new() { Value = "Family friendly" } },
                            GalleryImages = new List<PropertyImageData> { new() { Url = "https://images.unsplash.com/photo-1570129477492-45c003edd2be" } },
                            IsApproved = true,
                            MaxGuests = 5,
                            Bedrooms = 2,
                            Bathrooms = 2,
                            Area = 98,
                            AvailableFrom = DateTime.UtcNow.ToString("yyyy-MM-dd"),
                            AvailableTo = DateTime.UtcNow.AddMonths(8).ToString("yyyy-MM-dd"),
                            Description = "Casa primitoare cu gradina si terasa privata.",
                            DescriptionExtra = "Ideala pentru familii sau grupuri mici care vor mai mult spatiu si liniste.",
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        },
                        new PropertyData
                        {
                            OwnerId = owner.Id,
                            Host = owner.FullName,
                            Title = "Lake Cabin Colibita",
                            City = "Colibita",
                            Country = "Romania",
                            Address = "Drumul Lacului 5",
                            Price = 145,
                            Rating = 4.97m,
                            Reviews = 13,
                            Image = "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=800",
                            Features = new List<PropertyFeatureData> { new() { Value = "Lake access" }, new() { Value = "Hot tub" }, new() { Value = "Mountain view" } },
                            GalleryImages = new List<PropertyImageData> { new() { Url = "https://images.unsplash.com/photo-1506744038136-46273834b3fb" } },
                            IsApproved = true,
                            MaxGuests = 6,
                            Bedrooms = 3,
                            Bathrooms = 2,
                            Area = 160,
                            AvailableFrom = DateTime.UtcNow.ToString("yyyy-MM-dd"),
                            AvailableTo = DateTime.UtcNow.AddMonths(12).ToString("yyyy-MM-dd"),
                            Description = "Cabana premium pe malul lacului Colibita.",
                            DescriptionExtra = "Perfecta pentru weekenduri lungi, cu panorama superba si acces rapid la trasee montane.",
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        },
                        new PropertyData
                        {
                            OwnerId = owner.Id,
                            Host = owner.FullName,
                            Title = "Old Town Suite Brasov",
                            City = "Brasov",
                            Country = "Romania",
                            Address = "Str. Muresenilor 21",
                            Price = 88,
                            Rating = 4.91m,
                            Reviews = 37,
                            Image = "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=800",
                            Features = new List<PropertyFeatureData> { new() { Value = "Old town location" }, new() { Value = "Balcony" }, new() { Value = "Espresso machine" } },
                            GalleryImages = new List<PropertyImageData> { new() { Url = "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688" } },
                            IsApproved = true,
                            MaxGuests = 4,
                            Bedrooms = 2,
                            Bathrooms = 1,
                            Area = 82,
                            AvailableFrom = DateTime.UtcNow.ToString("yyyy-MM-dd"),
                            AvailableTo = DateTime.UtcNow.AddMonths(9).ToString("yyyy-MM-dd"),
                            Description = "Suite eleganta in centrul vechi al Brasovului.",
                            DescriptionExtra = "La cateva minute de Piata Sfatului, cu interior cald si dotari moderne.",
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        },
                        new PropertyData
                        {
                            OwnerId = owner.Id,
                            Host = owner.FullName,
                            Title = "Panorama Flat Piatra Neamt",
                            City = "Piatra Neamt",
                            Country = "Romania",
                            Address = "Bd. Decebal 33",
                            Price = 63,
                            Rating = 4.77m,
                            Reviews = 21,
                            Image = "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?auto=format&fit=crop&q=80&w=800",
                            Features = new List<PropertyFeatureData> { new() { Value = "Panoramic windows" }, new() { Value = "Fast Wi-Fi" }, new() { Value = "Near gondola" } },
                            GalleryImages = new List<PropertyImageData> { new() { Url = "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85" } },
                            IsApproved = true,
                            MaxGuests = 3,
                            Bedrooms = 1,
                            Bathrooms = 1,
                            Area = 60,
                            AvailableFrom = DateTime.UtcNow.ToString("yyyy-MM-dd"),
                            AvailableTo = DateTime.UtcNow.AddMonths(10).ToString("yyyy-MM-dd"),
                            Description = "Apartament luminos cu vedere spre dealurile orasului.",
                            DescriptionExtra = "Potrivit pentru cupluri sau remote work, cu acces bun catre centru si telegondola.",
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        },
                        new PropertyData
                        {
                            OwnerId = owner.Id,
                            Host = owner.FullName,
                            Title = "Paris Left Bank Apartment",
                            City = "Paris",
                            Country = "France",
                            Address = "Rue du Bac 14",
                            Price = 165,
                            Rating = 4.92m,
                            Reviews = 29,
                            Image = "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800",
                            Features = new List<PropertyFeatureData> { new() { Value = "Balcony" }, new() { Value = "Eiffel nearby" }, new() { Value = "Metro access" } },
                            GalleryImages = new List<PropertyImageData> { new() { Url = "https://images.unsplash.com/photo-1499856871958-5b9627545d1a" } },
                            IsApproved = true,
                            MaxGuests = 4,
                            Bedrooms = 2,
                            Bathrooms = 1,
                            Area = 78,
                            AvailableFrom = DateTime.UtcNow.ToString("yyyy-MM-dd"),
                            AvailableTo = DateTime.UtcNow.AddMonths(10).ToString("yyyy-MM-dd"),
                            Description = "Apartament elegant in inima Parisului, aproape de Sena.",
                            DescriptionExtra = "Ideal pentru city break, cu acces rapid la muzee, cafenele si cele mai cunoscute atractii ale orasului.",
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        },
                        new PropertyData
                        {
                            OwnerId = owner.Id,
                            Host = owner.FullName,
                            Title = "Manhattan Skyline Loft",
                            City = "New York",
                            Country = "United States",
                            Address = "W 34th Street 210",
                            Price = 220,
                            Rating = 4.89m,
                            Reviews = 41,
                            Image = "https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?auto=format&fit=crop&q=80&w=800",
                            Features = new List<PropertyFeatureData> { new() { Value = "Skyline view" }, new() { Value = "Elevator" }, new() { Value = "Central location" } },
                            GalleryImages = new List<PropertyImageData> { new() { Url = "https://images.unsplash.com/photo-1534430480872-3498386e7856" } },
                            IsApproved = true,
                            MaxGuests = 5,
                            Bedrooms = 2,
                            Bathrooms = 2,
                            Area = 95,
                            AvailableFrom = DateTime.UtcNow.ToString("yyyy-MM-dd"),
                            AvailableTo = DateTime.UtcNow.AddMonths(12).ToString("yyyy-MM-dd"),
                            Description = "Loft modern cu vedere spectaculoasa asupra Manhattanului.",
                            DescriptionExtra = "Perfect pentru calatorii urbane, aproape de Broadway, Hudson Yards si principalele linii de transport.",
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        },
                        new PropertyData
                        {
                            OwnerId = owner.Id,
                            Host = owner.FullName,
                            Title = "Tokyo Shibuya Studio",
                            City = "Tokyo",
                            Country = "Japan",
                            Address = "Shibuya 2-11-7",
                            Price = 140,
                            Rating = 4.94m,
                            Reviews = 35,
                            Image = "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=800",
                            Features = new List<PropertyFeatureData> { new() { Value = "Shibuya crossing" }, new() { Value = "Fast Wi-Fi" }, new() { Value = "Compact kitchen" } },
                            GalleryImages = new List<PropertyImageData> { new() { Url = "https://images.unsplash.com/photo-1503899036084-c55cdd92da26" } },
                            IsApproved = true,
                            MaxGuests = 2,
                            Bedrooms = 1,
                            Bathrooms = 1,
                            Area = 42,
                            AvailableFrom = DateTime.UtcNow.ToString("yyyy-MM-dd"),
                            AvailableTo = DateTime.UtcNow.AddMonths(9).ToString("yyyy-MM-dd"),
                            Description = "Studio confortabil in Shibuya, aproape de cele mai populare zone din Tokyo.",
                            DescriptionExtra = "Bun pentru cupluri sau solo travelers care vor acces rapid la metrou, restaurante si viata de noapte.",
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        },
                        new PropertyData
                        {
                            OwnerId = owner.Id,
                            Host = owner.FullName,
                            Title = "Bali Jungle Villa",
                            City = "Bali",
                            Country = "Indonesia",
                            Address = "Ubud Green Valley 8",
                            Price = 185,
                            Rating = 4.97m,
                            Reviews = 26,
                            Image = "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=800",
                            Features = new List<PropertyFeatureData> { new() { Value = "Private pool" }, new() { Value = "Rice terrace view" }, new() { Value = "Outdoor shower" } },
                            GalleryImages = new List<PropertyImageData> { new() { Url = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e" } },
                            IsApproved = true,
                            MaxGuests = 6,
                            Bedrooms = 3,
                            Bathrooms = 3,
                            Area = 170,
                            AvailableFrom = DateTime.UtcNow.ToString("yyyy-MM-dd"),
                            AvailableTo = DateTime.UtcNow.AddMonths(11).ToString("yyyy-MM-dd"),
                            Description = "Vila tropicala in Bali, inconjurata de vegetatie si liniste.",
                            DescriptionExtra = "Locatie potrivita pentru relaxare, yoga si escapade exotice, cu piscina privata si terasa generoasa.",
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
