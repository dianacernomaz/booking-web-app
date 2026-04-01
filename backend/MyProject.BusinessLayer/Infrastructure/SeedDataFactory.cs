using MyProject.Domain.Entities;

namespace MyProject.BusinessLayer.Infrastructure;

internal static class SeedDataFactory
{
    public static List<UserEntity> CreateUsers() =>
    [
        new UserEntity
        {
            FullName = "Admin StayBooker",
            Email = "admin@staybooker.com",
            Password = "Admin123!",
            Role = "admin"
        },
        new UserEntity
        {
            FullName = "User StayBooker",
            Email = "user@staybooker.com",
            Password = "User123!",
            Role = "user"
        }
    ];

    public static List<PropertyEntity> CreateProperties()
    {
        var now = DateTime.UtcNow;

        return
        [
            CreateProperty(
                1,
                "Luxury Suite cu vedere la mare",
                "Bali",
                "Indonezia",
                "Jl. Pantai Kuta 12, Bali",
                200m,
                4.9m,
                128,
                "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&h=800&fit=crop",
                [
                    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&h=800&fit=crop",
                    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=800&fit=crop"
                ],
                ["WiFi", "Piscina", "Parcare"],
                null,
                4,
                2,
                2,
                120,
                "2026-02-01",
                "2026-12-31",
                "Wayan S.",
                "Suite premium chiar pe plaja, cu vedere panoramica si design tropical.",
                "Include terasa privata, mic dejun si transfer de la aeroport.",
                [
                    Amenity("🌐", "WiFi de mare viteza", true),
                    Amenity("🏊", "Piscina privata", true),
                    Amenity("🅿️", "Parcare privata", true),
                    Amenity("❄️", "Aer conditionat", true)
                ],
                [3, 4, 5, 14, 15, 22, 23],
                [
                    Review("Sophie M.", "Ianuarie 2026", 5, "#2563eb", "Priveliste excelenta si gazda foarte atenta."),
                    Review("Marco R.", "Decembrie 2025", 5, "#7c3aed", "Totul a fost impecabil si foarte relaxant."),
                    Review("Ana P.", "Noiembrie 2025", 4, "#059669", "Proprietate foarte buna, aproape de plaja.")
                ],
                [
                    Nearby("🏖️", "Plaja Kuta", "50 m"),
                    Nearby("🛒", "Supermarket", "300 m"),
                    Nearby("🍽️", "Restaurant local", "100 m")
                ],
                now.AddDays(-60)),
            CreateProperty(
                2,
                "Apartament Modern in Zona Lunitei",
                "Bucuresti",
                "Romania",
                "Str. Luntrei 8, Sector 1, Bucuresti",
                180m,
                4.7m,
                94,
                "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=800&fit=crop",
                [
                    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop",
                    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&h=800&fit=crop"
                ],
                ["WiFi", "Bucatarie", "Terasa"],
                null,
                2,
                1,
                1,
                65,
                "2026-02-01",
                "2026-12-31",
                "Andrei M.",
                "Apartament modern intr-o zona rezidentiala bine conectata.",
                "Are terasa mare, bucatarie echipata si acces rapid la metrou.",
                [
                    Amenity("🌐", "WiFi fibra optica", true),
                    Amenity("❄️", "Aer conditionat", true),
                    Amenity("🍳", "Bucatarie completa", true),
                    Amenity("📺", "Netflix inclus", true)
                ],
                [1, 2, 10, 11, 18, 19, 25],
                [
                    Review("Elena V.", "Februarie 2026", 5, "#dc2626", "Foarte curat si bine dotat."),
                    Review("Radu C.", "Ianuarie 2026", 4, "#2563eb", "Terasa este excelenta pentru city break.")
                ],
                [
                    Nearby("🚇", "Metrou Aviatorilor", "200 m"),
                    Nearby("🌳", "Parcul Herastrau", "400 m"),
                    Nearby("🍽️", "Restaurant", "150 m")
                ],
                now.AddDays(-45)),
            CreateProperty(
                3,
                "Cabana Romantica la Munte",
                "Brasov",
                "Romania",
                "Str. Poiana Mica 3, Poiana Brasov",
                145m,
                4.8m,
                203,
                "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&h=800&fit=crop",
                [
                    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&h=800&fit=crop",
                    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&h=800&fit=crop"
                ],
                ["WiFi", "Semineu", "Gradina"],
                "Nou",
                3,
                2,
                1,
                85,
                "2026-02-01",
                "2026-12-31",
                "Mihaela D.",
                "Cabana retrasa, ideala pentru cupluri si familii mici.",
                "Dispune de gradina privata, zona de gratar si acces rapid la partii.",
                [
                    Amenity("🌐", "WiFi", true),
                    Amenity("🔥", "Semineu", true),
                    Amenity("🌿", "Gradina privata", true),
                    Amenity("🅿️", "Parcare", true)
                ],
                [6, 7, 8, 13, 14, 20, 21, 27, 28],
                [
                    Review("Cristina B.", "Ianuarie 2026", 5, "#059669", "Atmosfera excelenta si foarte multa liniste."),
                    Review("Florin A.", "Decembrie 2025", 5, "#2563eb", "Perfect pentru un weekend la munte.")
                ],
                [
                    Nearby("⛷️", "Partia Ruia", "800 m"),
                    Nearby("🌲", "Trasee montane", "0 m"),
                    Nearby("🍽️", "Restaurant munte", "500 m")
                ],
                now.AddDays(-35)),
            CreateProperty(
                4,
                "Vila de Lux cu Piscina Privata",
                "Constanta",
                "Romania",
                "Strada Falezei 14, Constanta",
                399m,
                5.0m,
                87,
                "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&h=800&fit=crop",
                [
                    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&h=800&fit=crop",
                    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&h=800&fit=crop"
                ],
                ["WiFi", "Piscina", "Jacuzzi"],
                "Top",
                6,
                4,
                3,
                280,
                "2026-02-01",
                "2026-12-31",
                "Maria G.",
                "Vila premium pe malul marii, cu terasa si gradina privata.",
                "Piscina cu apa sarata, jacuzzi exterior si living foarte spatios.",
                [
                    Amenity("🌐", "WiFi de mare viteza", true),
                    Amenity("🏊", "Piscina privata", true),
                    Amenity("🛁", "Jacuzzi", true),
                    Amenity("🔥", "Semineu", true)
                ],
                [5, 6, 7, 8, 12, 13, 19, 20, 27],
                [
                    Review("Alexandru M.", "Ianuarie 2026", 5, "#2563eb", "Vila este exact ca in poze."),
                    Review("Ioana P.", "Decembrie 2025", 5, "#7c3aed", "Sejur excelent, locatia e deosebita.")
                ],
                [
                    Nearby("🏖️", "Plaja Mamaia", "150 m"),
                    Nearby("🛒", "Supermarket", "500 m"),
                    Nearby("🍽️", "Restaurant", "300 m")
                ],
                now.AddDays(-28)),
            CreateProperty(
                5,
                "Studio Cozy in Centrul Vechi",
                "Cluj-Napoca",
                "Romania",
                "Str. Memorandumului 5, Cluj-Napoca",
                110m,
                4.6m,
                57,
                "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&h=800&fit=crop",
                [
                    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=800&fit=crop",
                    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=800&fit=crop"
                ],
                ["WiFi", "Bucatarie"],
                null,
                2,
                1,
                1,
                42,
                "2026-02-01",
                "2026-12-31",
                "Bogdan P.",
                "Studio central, ideal pentru city break sau calatorii scurte.",
                "Renovat recent si aproape de principalele atractii ale orasului.",
                [
                    Amenity("🌐", "WiFi fibra optica", true),
                    Amenity("🍳", "Bucatarie compacta", true),
                    Amenity("❄️", "Aer conditionat", true),
                    Amenity("📺", "Smart TV", true)
                ],
                [4, 5, 11, 12, 18, 19],
                [
                    Review("Laura S.", "Ianuarie 2026", 5, "#dc2626", "Foarte curat si foarte bine pozitionat."),
                    Review("Vlad M.", "Decembrie 2025", 4, "#2563eb", "Bun pentru pret si locatie.")
                ],
                [
                    Nearby("🏛️", "Piata Unirii", "200 m"),
                    Nearby("🎓", "Universitate", "400 m"),
                    Nearby("🍽️", "Restaurante", "50 m")
                ],
                now.AddDays(-20)),
            CreateProperty(
                6,
                "Penthouse cu Panorama la Oras",
                "Timisoara",
                "Romania",
                "Bd. Revolutiei 31, Timisoara",
                260m,
                4.9m,
                42,
                "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop",
                [
                    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=800&fit=crop",
                    "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=1200&h=800&fit=crop"
                ],
                ["WiFi", "Terasa", "Parcare", "Jacuzzi"],
                "Premium",
                4,
                2,
                2,
                130,
                "2026-02-01",
                "2026-12-31",
                "Daniel R.",
                "Penthouse spatios cu vedere panoramica si terasa mare.",
                "Perfect pentru sejururi urbane premium, aproape de centru.",
                [
                    Amenity("🌐", "WiFi", true),
                    Amenity("☀️", "Terasa mare", true),
                    Amenity("🅿️", "Parcare", true),
                    Amenity("🛁", "Jacuzzi", true)
                ],
                [2, 3, 9, 10, 17, 18, 24],
                [
                    Review("Mihai T.", "Ianuarie 2026", 5, "#059669", "Vedere superba si apartament foarte bine dotat."),
                    Review("Sara K.", "Noiembrie 2025", 5, "#2563eb", "Terasa este piesa de rezistenta a proprietatii.")
                ],
                [
                    Nearby("🏙️", "Centru oras", "900 m"),
                    Nearby("🛒", "Supermarket", "250 m"),
                    Nearby("🍽️", "Restaurant", "120 m")
                ],
                now.AddDays(-15))
        ];
    }

    private static PropertyEntity CreateProperty(
        int id,
        string title,
        string city,
        string country,
        string address,
        decimal price,
        decimal rating,
        int reviews,
        string image,
        List<string> galleryImages,
        List<string> features,
        string? badge,
        int maxGuests,
        int bedrooms,
        int bathrooms,
        int area,
        string availableFrom,
        string availableTo,
        string host,
        string description,
        string descriptionExtra,
        List<AmenityEntity> amenities,
        List<int> occupiedDays,
        List<ReviewEntity> reviewsList,
        List<NearbyPlaceEntity> nearby,
        DateTime timestamp) =>
        new()
        {
            Id = id,
            Title = title,
            City = city,
            Country = country,
            Address = address,
            Price = price,
            Rating = rating,
            Reviews = reviews,
            Image = image,
            GalleryImages = galleryImages,
            Features = features,
            Badge = badge,
            MaxGuests = maxGuests,
            Bedrooms = bedrooms,
            Bathrooms = bathrooms,
            Area = area,
            AvailableFrom = availableFrom,
            AvailableTo = availableTo,
            Host = host,
            Description = description,
            DescriptionExtra = descriptionExtra,
            Amenities = amenities,
            OccupiedDays = occupiedDays,
            ReviewsList = reviewsList,
            Nearby = nearby,
            CreatedAt = timestamp,
            UpdatedAt = timestamp
        };

    private static AmenityEntity Amenity(string icon, string label, bool available) => new()
    {
        Icon = icon,
        Label = label,
        Available = available
    };

    private static ReviewEntity Review(string name, string date, int rating, string color, string text) => new()
    {
        Name = name,
        Date = date,
        Rating = rating,
        Color = color,
        Text = text
    };

    private static NearbyPlaceEntity Nearby(string icon, string name, string dist) => new()
    {
        Icon = icon,
        Name = name,
        Dist = dist
    };
}
