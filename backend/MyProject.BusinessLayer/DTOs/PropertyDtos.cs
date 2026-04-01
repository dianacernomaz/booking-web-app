namespace MyProject.BusinessLayer.DTOs;

public sealed class PropertySummaryDto
{
    public int Id { get; set; }

    public required string Title { get; set; }

    public required string Location { get; set; }

    public required string City { get; set; }

    public decimal Price { get; set; }

    public decimal Rating { get; set; }

    public int Reviews { get; set; }

    public required string Image { get; set; }

    public List<string> Features { get; set; } = [];

    public bool IsFavorite { get; set; }

    public string? Badge { get; set; }

    public int MaxGuests { get; set; }

    public required string AvailableFrom { get; set; }

    public required string AvailableTo { get; set; }
}

public sealed class AmenityDto
{
    public required string Icon { get; set; }

    public required string Label { get; set; }

    public bool Available { get; set; }
}

public sealed class ReviewDto
{
    public required string Name { get; set; }

    public required string Date { get; set; }

    public int Rating { get; set; }

    public required string Color { get; set; }

    public required string Text { get; set; }
}

public sealed class NearbyPlaceDto
{
    public required string Icon { get; set; }

    public required string Name { get; set; }

    public required string Dist { get; set; }
}

public sealed class PropertyDetailDto
{
    public int Id { get; set; }

    public required string Title { get; set; }

    public required string Location { get; set; }

    public required string City { get; set; }

    public required string Country { get; set; }

    public required string Address { get; set; }

    public decimal Price { get; set; }

    public decimal PriceOriginal { get; set; }

    public decimal Rating { get; set; }

    public int Reviews { get; set; }

    public List<string> Images { get; set; } = [];

    public List<string> Features { get; set; } = [];

    public string? Badge { get; set; }

    public int MaxGuests { get; set; }

    public int Bedrooms { get; set; }

    public int Bathrooms { get; set; }

    public int Area { get; set; }

    public required string AvailableFrom { get; set; }

    public required string AvailableTo { get; set; }

    public required string Description { get; set; }

    public required string DescriptionExtra { get; set; }

    public required string Host { get; set; }

    public List<AmenityDto> Amenities { get; set; } = [];

    public List<int> OccupiedDays { get; set; } = [];

    public List<ReviewDto> ReviewsList { get; set; } = [];

    public List<NearbyPlaceDto> Nearby { get; set; } = [];
}

public sealed class ManagedPropertyDto
{
    public int Id { get; set; }

    public required string OwnerEmail { get; set; }

    public required string Host { get; set; }

    public required string Title { get; set; }

    public required string City { get; set; }

    public required string Country { get; set; }

    public required string Address { get; set; }

    public decimal Price { get; set; }

    public required string Image { get; set; }

    public List<string> GalleryImages { get; set; } = [];

    public List<string> Features { get; set; } = [];

    public string? Badge { get; set; }

    public int MaxGuests { get; set; }

    public int Bedrooms { get; set; }

    public int Bathrooms { get; set; }

    public int Area { get; set; }

    public required string AvailableFrom { get; set; }

    public required string AvailableTo { get; set; }

    public required string Description { get; set; }

    public required string DescriptionExtra { get; set; }

    public required string CreatedAt { get; set; }

    public required string UpdatedAt { get; set; }
}

public sealed class UpsertPropertyRequestDto
{
    public string OwnerEmail { get; set; } = string.Empty;

    public string Host { get; set; } = string.Empty;

    public string Title { get; set; } = string.Empty;

    public string City { get; set; } = string.Empty;

    public string Country { get; set; } = string.Empty;

    public string Address { get; set; } = string.Empty;

    public decimal Price { get; set; }

    public string Image { get; set; } = string.Empty;

    public List<string> GalleryImages { get; set; } = [];

    public List<string> Features { get; set; } = [];

    public string? Badge { get; set; }

    public int MaxGuests { get; set; }

    public int Bedrooms { get; set; }

    public int Bathrooms { get; set; }

    public int Area { get; set; }

    public string AvailableFrom { get; set; } = string.Empty;

    public string AvailableTo { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string DescriptionExtra { get; set; } = string.Empty;
}
