namespace MyProject.Domain.Models.Property
{
    public class PropertySummaryDto
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;

        public string Location { get; set; } = string.Empty;

        public string City { get; set; } = string.Empty;

        public decimal Price { get; set; }

        public decimal Rating { get; set; }

        public int Reviews { get; set; }

        public string Image { get; set; } = string.Empty;

        public List<string> Features { get; set; } = [];

        public bool IsFavorite { get; set; }

        public string? Badge { get; set; }

        public int MaxGuests { get; set; }

        public string AvailableFrom { get; set; } = string.Empty;

        public string AvailableTo { get; set; } = string.Empty;
    }

    public class AmenityDto
    {
        public string Icon { get; set; } = string.Empty;

        public string Label { get; set; } = string.Empty;

        public bool Available { get; set; }
    }

    public class ReviewDto
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public int PropertyId { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Date { get; set; } = string.Empty;

        public int Rating { get; set; }

        public string Color { get; set; } = string.Empty;

        public string Text { get; set; } = string.Empty;

        public string CreatedAt { get; set; } = string.Empty;

        public string UpdatedAt { get; set; } = string.Empty;
    }

    public class NearbyPlaceDto
    {
        public string Icon { get; set; } = string.Empty;

        public string Name { get; set; } = string.Empty;

        public string Dist { get; set; } = string.Empty;
    }

    public class PropertyDetailDto
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;

        public string Location { get; set; } = string.Empty;

        public string City { get; set; } = string.Empty;

        public string Country { get; set; } = string.Empty;

        public string Address { get; set; } = string.Empty;

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

        public string AvailableFrom { get; set; } = string.Empty;

        public string AvailableTo { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public string DescriptionExtra { get; set; } = string.Empty;

        public string Host { get; set; } = string.Empty;

        public List<AmenityDto> Amenities { get; set; } = [];

        public List<int> OccupiedDays { get; set; } = [];

        public List<ReviewDto> ReviewsList { get; set; } = [];

        public List<NearbyPlaceDto> Nearby { get; set; } = [];
    }

    public class ManagedPropertyDto
    {
        public int Id { get; set; }

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

        public string CreatedAt { get; set; } = string.Empty;

        public string UpdatedAt { get; set; } = string.Empty;
    }

    public class UpsertPropertyRequestDto
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
    public class PropertySearchRequestDto
    {
        public string? Location { get; set; }

        public int? Guests { get; set; }

        public string? CheckIn { get; set; }

        public string? CheckOut { get; set; }

        public decimal? MinPrice { get; set; }

        public decimal? MaxPrice { get; set; }

        public List<string>? Features { get; set; }
    }
}
