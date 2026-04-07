namespace StayBooker.Domain.Entities;

public sealed class ManagedProperty
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
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
