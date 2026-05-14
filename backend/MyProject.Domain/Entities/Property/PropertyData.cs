using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyProject.Domain.Entities;

public sealed class PropertyData
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int OwnerId { get; set; }

    [ForeignKey(nameof(OwnerId))]
    public UserData? Owner { get; set; }

    [Required]
    [StringLength(200)]
    public required string Host { get; set; }

    [Required]
    [StringLength(200)]
    public required string Title { get; set; }

    [Required]
    [StringLength(100)]
    public required string City { get; set; }

    [Required]
    [StringLength(100)]
    public required string Country { get; set; }

    [Required]
    [StringLength(300)]
    public required string Address { get; set; }

    [Range(0.01, double.MaxValue)]
    [Column(TypeName = "decimal(18,2)")]
    public decimal Price { get; set; }

    [Column(TypeName = "decimal(4,2)")]
    public decimal Rating { get; set; }

    public int Reviews { get; set; }

    [Required]
    public required string Image { get; set; }

    public List<PropertyImageData> GalleryImages { get; set; } = [];

    public List<PropertyFeatureData> Features { get; set; } = [];

    [StringLength(50)]
    public string? Badge { get; set; }

    public int MaxGuests { get; set; }

    public int Bedrooms { get; set; }

    public int Bathrooms { get; set; }

    public int Area { get; set; }

    [Required]
    [StringLength(30)]
    public required string AvailableFrom { get; set; }

    [Required]
    [StringLength(30)]
    public required string AvailableTo { get; set; }

    [Required]
    public required string Description { get; set; }

    [Required]
    public required string DescriptionExtra { get; set; }

    public List<AmenityData> Amenities { get; set; } = [];

    public List<PropertyOccupiedDayData> OccupiedDays { get; set; } = [];

    public List<ReviewData> ReviewsList { get; set; } = [];

    public List<NearbyPlaceData> Nearby { get; set; } = [];

    [DataType(DataType.DateTime)]
    public required DateTime CreatedAt { get; set; }

    [DataType(DataType.DateTime)]
    public required DateTime UpdatedAt { get; set; }

    public bool IsApproved { get; set; } = false;

    public List<BookingData> Bookings { get; set; } = [];

    public List<WishlistData> WishlistedBy { get; set; } = [];
}
