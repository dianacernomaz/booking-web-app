using MyProject.BusinessLayer.DTOs;
using MyProject.Domain.Entities;

namespace MyProject.BusinessLayer.Infrastructure;

internal static class Mappers
{
    public static SessionUserDto ToSession(UserEntity entity) => new()
    {
        Email = entity.Email,
        FullName = entity.FullName,
        Initials = BuildInitials(entity.FullName),
        Role = entity.Role
    };

    public static StoredUserDto ToStoredUser(UserEntity entity) => new()
    {
        FullName = entity.FullName,
        Email = entity.Email,
        Phone = entity.Phone,
        BirthDate = entity.BirthDate,
        City = entity.City,
        Country = entity.Country,
        Bio = entity.Bio,
        Password = entity.Password,
        Role = entity.Role
    };

    public static PropertySummaryDto ToSummary(PropertyEntity entity) => new()
    {
        Id = entity.Id,
        Title = entity.Title,
        Location = BuildLocation(entity.City, entity.Country),
        City = entity.City,
        Price = entity.Price,
        Rating = entity.Rating,
        Reviews = entity.Reviews,
        Image = entity.Image,
        Features = [.. entity.Features],
        IsFavorite = false,
        Badge = string.IsNullOrWhiteSpace(entity.Badge) ? null : entity.Badge,
        MaxGuests = entity.MaxGuests,
        AvailableFrom = entity.AvailableFrom,
        AvailableTo = entity.AvailableTo
    };

    public static PropertyDetailDto ToDetail(PropertyEntity entity) => new()
    {
        Id = entity.Id,
        Title = entity.Title,
        Location = BuildLocation(entity.City, entity.Country),
        City = entity.City,
        Country = entity.Country,
        Address = entity.Address,
        Price = entity.Price,
        PriceOriginal = Math.Round(entity.Price * 1.15m, 0),
        Rating = entity.Rating,
        Reviews = entity.Reviews,
        Images = BuildImages(entity),
        Features = [.. entity.Features],
        Badge = string.IsNullOrWhiteSpace(entity.Badge) ? null : entity.Badge,
        MaxGuests = entity.MaxGuests,
        Bedrooms = entity.Bedrooms,
        Bathrooms = entity.Bathrooms,
        Area = entity.Area,
        AvailableFrom = entity.AvailableFrom,
        AvailableTo = entity.AvailableTo,
        Description = entity.Description,
        DescriptionExtra = entity.DescriptionExtra,
        Host = entity.Host,
        Amenities = entity.Amenities.Select(ToAmenity).ToList(),
        OccupiedDays = [.. entity.OccupiedDays],
        ReviewsList = entity.ReviewsList.Select(ToReview).ToList(),
        Nearby = entity.Nearby.Select(ToNearby).ToList()
    };

    public static ManagedPropertyDto ToManaged(PropertyEntity entity) => new()
    {
        Id = entity.Id,
        OwnerEmail = entity.OwnerEmail,
        Host = entity.Host,
        Title = entity.Title,
        City = entity.City,
        Country = entity.Country,
        Address = entity.Address,
        Price = entity.Price,
        Image = entity.Image,
        GalleryImages = [.. entity.GalleryImages],
        Features = [.. entity.Features],
        Badge = string.IsNullOrWhiteSpace(entity.Badge) ? null : entity.Badge,
        MaxGuests = entity.MaxGuests,
        Bedrooms = entity.Bedrooms,
        Bathrooms = entity.Bathrooms,
        Area = entity.Area,
        AvailableFrom = entity.AvailableFrom,
        AvailableTo = entity.AvailableTo,
        Description = entity.Description,
        DescriptionExtra = entity.DescriptionExtra,
        CreatedAt = entity.CreatedAt.ToString("O"),
        UpdatedAt = entity.UpdatedAt.ToString("O")
    };

    public static BookingDto ToBooking(BookingEntity entity) => new()
    {
        Id = entity.Id,
        OwnerEmail = entity.OwnerEmail,
        PropertyId = entity.PropertyId,
        PropertyTitle = entity.PropertyTitle,
        PropertyLocation = entity.PropertyLocation,
        PropertyImage = entity.PropertyImage,
        CheckIn = entity.CheckIn,
        CheckOut = entity.CheckOut,
        Guests = entity.Guests,
        Nights = entity.Nights,
        Total = entity.Total,
        Status = BookingStatusResolver.Resolve(entity.CheckIn, entity.CheckOut, entity.Status),
        Code = entity.Code,
        CreatedAt = entity.CreatedAt.ToString("O"),
        PaymentMethod = entity.PaymentMethod,
        PaymentStatus = entity.PaymentStatus,
        PaymentLabel = entity.PaymentLabel,
        PaymentLast4 = entity.PaymentLast4,
        PaidAt = entity.PaidAt?.ToString("O")
    };

    private static AmenityDto ToAmenity(AmenityEntity entity) => new()
    {
        Icon = entity.Icon,
        Label = entity.Label,
        Available = entity.Available
    };

    private static ReviewDto ToReview(ReviewEntity entity) => new()
    {
        Name = entity.Name,
        Date = entity.Date,
        Rating = entity.Rating,
        Color = entity.Color,
        Text = entity.Text
    };

    private static NearbyPlaceDto ToNearby(NearbyPlaceEntity entity) => new()
    {
        Icon = entity.Icon,
        Name = entity.Name,
        Dist = entity.Dist
    };

    private static List<string> BuildImages(PropertyEntity entity)
    {
        var images = new List<string> { entity.Image };
        images.AddRange(entity.GalleryImages.Where(image => !string.IsNullOrWhiteSpace(image)));
        return images.Distinct().ToList();
    }

    private static string BuildLocation(string city, string country) =>
        string.Join(", ", new[] { city, country }.Where(value => !string.IsNullOrWhiteSpace(value)));

    private static string BuildInitials(string fullName)
    {
        var initials = string.Concat(
            fullName
                .Split(' ', StringSplitOptions.RemoveEmptyEntries)
                .Select(part => char.ToUpperInvariant(part[0])));

        return initials.Length >= 2 ? initials[..2] : initials.PadRight(2, 'U');
    }
}
