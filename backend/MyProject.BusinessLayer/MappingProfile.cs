using AutoMapper;
using MyProject.Domain.Entities;
using MyProject.Domain.Models.Booking;
using MyProject.Domain.Models.Property;
using MyProject.Domain.Models.User;

namespace MyProject.BusinessLayer
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<UserData, StoredUserDto>();
            CreateMap<UserData, SessionUserDto>()
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.Initials, opt => opt.MapFrom(src => BuildInitials(src.FullName)));

            // Property mappings
            CreateMap<PropertyData, PropertySummaryDto>()
                .ForMember(dest => dest.Location, opt => opt.MapFrom(src => src.City + ", " + src.Country))
                .ForMember(dest => dest.Features, opt => opt.MapFrom(src => src.Features.Select(f => f.Value).ToList()));

            CreateMap<PropertyData, PropertyDetailDto>()
                .ForMember(dest => dest.Location, opt => opt.MapFrom(src => src.City + ", " + src.Country))
                .ForMember(dest => dest.PriceOriginal, opt => opt.MapFrom(src => Math.Round(src.Price * 1.15m, 0)))
                .ForMember(dest => dest.Images, opt => opt.MapFrom(src => BuildImages(src)))
                .ForMember(dest => dest.Features, opt => opt.MapFrom(src => src.Features.Select(f => f.Value).ToList()))
                .ForMember(dest => dest.Host, opt => opt.MapFrom(src => src.Host))
                .ForMember(dest => dest.OccupiedDays, opt => opt.MapFrom(src => src.OccupiedDays.Select(d => d.Day).ToList()));

            CreateMap<PropertyData, ManagedPropertyDto>()
                .ForMember(dest => dest.OwnerEmail, opt => opt.MapFrom(src => src.Owner != null ? src.Owner.Email : string.Empty))
                .ForMember(dest => dest.GalleryImages, opt => opt.MapFrom(src => src.GalleryImages.Select(i => i.Url).ToList()))
                .ForMember(dest => dest.Features, opt => opt.MapFrom(src => src.Features.Select(f => f.Value).ToList()))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt.ToString("O")))
                .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => src.UpdatedAt.ToString("O")));

            // Booking mappings
            CreateMap<BookingData, BookingDto>()
                .ForMember(dest => dest.OwnerEmail, opt => opt.MapFrom(src => src.User != null ? src.User.Email : string.Empty))
                .ForMember(dest => dest.PropertyTitle, opt => opt.MapFrom(src => src.PropertyTitle))
                .ForMember(dest => dest.PropertyImage, opt => opt.MapFrom(src => src.PropertyImage))
                .ForMember(dest => dest.PropertyLocation, opt => opt.MapFrom(src => src.PropertyLocation))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => ResolveBookingStatus(src.CheckIn, src.CheckOut, src.Status)))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt.ToString("O")))
                .ForMember(dest => dest.PaidAt, opt => opt.MapFrom(src => src.PaidAt.HasValue ? src.PaidAt.Value.ToString("O") : null));

            // Nested mappings
            CreateMap<AmenityData, AmenityDto>();
            CreateMap<ReviewData, ReviewDto>();
            CreateMap<NearbyPlaceData, NearbyPlaceDto>();
        }

        private static List<string> BuildImages(PropertyData property)
        {
            var images = new List<string> { property.Image };
            if (property.GalleryImages != null)
            {
                images.AddRange(property.GalleryImages.Select(image => image.Url).Where(url => !string.IsNullOrWhiteSpace(url)));
            }
            return images.Distinct().ToList();
        }

        private static string BuildInitials(string fullName)
        {
            var initials = string.Concat(
                fullName
                    .Split(' ', StringSplitOptions.RemoveEmptyEntries)
                    .Select(part => char.ToUpperInvariant(part[0])));

            if (initials.Length >= 2)
            {
                return initials.Substring(0, 2);
            }

            return initials.PadRight(2, 'U');
        }

        private static string ResolveBookingStatus(string checkIn, string checkOut, string? currentStatus)
        {
            if (string.Equals(currentStatus, "cancelled", StringComparison.OrdinalIgnoreCase))
            {
                return "cancelled";
            }

            if (!DateOnly.TryParse(checkIn, out var checkInDate) || !DateOnly.TryParse(checkOut, out var checkOutDate))
            {
                return string.IsNullOrWhiteSpace(currentStatus) ? "upcoming" : currentStatus;
            }

            var today = DateOnly.FromDateTime(DateTime.UtcNow);
            if (today < checkInDate)
            {
                return "upcoming";
            }

            if (today >= checkOutDate)
            {
                return "completed";
            }

            return "active";
        }
    }
}
