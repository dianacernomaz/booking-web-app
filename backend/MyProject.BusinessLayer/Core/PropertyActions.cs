using AutoMapper;
using Microsoft.EntityFrameworkCore;
using MyProject.DataAccess;
using MyProject.DataAccess.Context;
using MyProject.Domain.Entities;
using MyProject.Domain.Models.Property;
using MyProject.Domain.Models.Responses;

namespace MyProject.BusinessLayer.Core
{
    public class PropertyActions
    {
        private readonly IMapper _mapper;

        public PropertyActions()
        {
            _mapper = BusinessLogic.Mapper;
        }

        internal List<PropertySummaryDto> GetAllPropertiesActionExecution()
        {
            using (var db = new PropertyContext())
            {
                var properties = QuerySummaryGraph(db)
                    .Where(p => p.IsApproved)
                    .OrderBy(property => property.Id)
                    .ToList();

                return _mapper.Map<List<PropertySummaryDto>>(properties);
            }
        }

        internal PropertyDetailDto? GetByIdActionExecution(int id)
        {
            using (var db = new PropertyContext())
            {
                var property = QueryDetailGraph(db).FirstOrDefault(candidate => candidate.Id == id);
                if (property == null)
                {
                    return null;
                }

                return _mapper.Map<PropertyDetailDto>(property);
            }
        }

        internal List<ManagedPropertyDto> GetByOwnerActionExecution(string ownerEmail)
        {
            var normalizedEmail = NormalizeEmail(ownerEmail);

            using (var db = new PropertyContext())
            {
                var properties = QueryManagedGraph(db, false)
                    .Where(property => property.Owner != null && property.Owner.Email == normalizedEmail)
                    .OrderByDescending(property => property.UpdatedAt)
                    .ToList();

                return _mapper.Map<List<ManagedPropertyDto>>(properties);
            }
        }

        internal ActionResponse<ManagedPropertyDto> CreatePropertyActionExecution(UpsertPropertyRequestDto request)
        {
            var validationError = Validate(request);
            if (validationError != null)
            {
                return Failed<ManagedPropertyDto>(400, validationError);
            }

            var normalizedEmail = NormalizeEmail(request.OwnerEmail);
            using (var db = new PropertyContext())
            {
                var owner = db.Users.FirstOrDefault(user => user.Email == normalizedEmail);
                if (owner == null)
                {
                    return Failed<ManagedPropertyDto>(404, "Utilizatorul proprietar nu a fost gasit.");
                }

                var now = DateTime.UtcNow;
                var property = new PropertyData
                {
                    OwnerId = owner.Id,
                    Owner = owner,
                    Host = string.IsNullOrWhiteSpace(request.Host) ? owner.FullName : request.Host.Trim(),
                    Title = request.Title.Trim(),
                    City = request.City.Trim(),
                    Country = request.Country.Trim(),
                    Address = request.Address.Trim(),
                    Price = request.Price,
                    Rating = 0m,
                    Reviews = 0,
                    Image = request.Image.Trim(),
                    GalleryImages = BuildGalleryImages(request.GalleryImages),
                    Features = BuildFeatures(request.Features),
                    Badge = string.IsNullOrWhiteSpace(request.Badge) ? null : request.Badge.Trim(),
                    MaxGuests = request.MaxGuests,
                    Bedrooms = request.Bedrooms,
                    Bathrooms = request.Bathrooms,
                    Area = request.Area,
                    AvailableFrom = request.AvailableFrom.Trim(),
                    AvailableTo = request.AvailableTo.Trim(),
                    Description = request.Description.Trim(),
                    DescriptionExtra = request.DescriptionExtra.Trim(),
                    Amenities = BuildAmenities(request.Features),
                    Nearby = BuildNearby(request.Address, request.City),
                    CreatedAt = now,
                    UpdatedAt = now
                };

                db.Properties.Add(property);
                db.SaveChanges();
                return Success(_mapper.Map<ManagedPropertyDto>(property), "Proprietate creata.");
            }
        }

        internal ActionResponse<ManagedPropertyDto> UpdatePropertyActionExecution(int id, UpsertPropertyRequestDto request)
        {
            var validationError = Validate(request);
            if (validationError != null)
            {
                return Failed<ManagedPropertyDto>(400, validationError);
            }

            var normalizedOwnerEmail = NormalizeEmail(request.OwnerEmail);
            using (var db = new PropertyContext())
            {
                var property = QueryManagedGraph(db, true)
                    .Include(item => item.Amenities)
                    .Include(item => item.Nearby)
                    .FirstOrDefault(item => item.Id == id);

                if (property == null)
                {
                    return Failed<ManagedPropertyDto>(404, "Proprietatea nu a fost gasita.");
                }

                if (!string.Equals(property.Owner != null ? property.Owner.Email : null, normalizedOwnerEmail, StringComparison.OrdinalIgnoreCase))
                {
                    return Failed<ManagedPropertyDto>(401, "Nu poti modifica aceasta proprietate.");
                }

                property.Host = string.IsNullOrWhiteSpace(request.Host) ? property.Host : request.Host.Trim();
                property.Title = request.Title.Trim();
                property.City = request.City.Trim();
                property.Country = request.Country.Trim();
                property.Address = request.Address.Trim();
                property.Price = request.Price;
                property.Image = request.Image.Trim();
                property.Badge = string.IsNullOrWhiteSpace(request.Badge) ? null : request.Badge.Trim();
                property.MaxGuests = request.MaxGuests;
                property.Bedrooms = request.Bedrooms;
                property.Bathrooms = request.Bathrooms;
                property.Area = request.Area;
                property.AvailableFrom = request.AvailableFrom.Trim();
                property.AvailableTo = request.AvailableTo.Trim();
                property.Description = request.Description.Trim();
                property.DescriptionExtra = request.DescriptionExtra.Trim();
                ReplaceChildren(db, property.GalleryImages, BuildGalleryImages(request.GalleryImages));
                ReplaceChildren(db, property.Features, BuildFeatures(request.Features));
                ReplaceChildren(db, property.Amenities, BuildAmenities(request.Features));
                ReplaceChildren(db, property.Nearby, BuildNearby(request.Address, request.City));
                property.UpdatedAt = DateTime.UtcNow;

                db.SaveChanges();
                return Success(_mapper.Map<ManagedPropertyDto>(property), "Proprietate actualizata.");
            }
        }

        internal ActionResponse DeletePropertyActionExecution(int id, string ownerEmail)
        {
            var normalizedOwnerEmail = NormalizeEmail(ownerEmail);
            using (var db = new PropertyContext())
            {
                var property = db.Properties
                    .Include(item => item.Owner)
                    .FirstOrDefault(item => item.Id == id);

                if (property == null)
                {
                    return Failed(404, "Proprietatea nu a fost gasita.");
                }

                if (!string.Equals(property.Owner != null ? property.Owner.Email : null, normalizedOwnerEmail, StringComparison.OrdinalIgnoreCase))
                {
                    return Failed(401, "Nu poti sterge aceasta proprietate.");
                }

                db.Properties.Remove(property);
                db.SaveChanges();
                return Success("Proprietate stearsa.");
            }
        }

        internal List<PropertySummaryDto> SearchPropertiesActionExecution(PropertySearchRequestDto request)
        {
            using (var db = new PropertyContext())
            {
                var query = QuerySummaryGraph(db);

                // Only approved properties for search
                query = query.Where(p => p.IsApproved);

                if (!string.IsNullOrWhiteSpace(request.Location))
                {
                    var loc = request.Location.Trim().ToLower();
                    query = query.Where(p => p.City.ToLower().Contains(loc) || p.Country.ToLower().Contains(loc) || p.Address.ToLower().Contains(loc));
                }

                if (request.Guests.HasValue && request.Guests > 0)
                {
                    query = query.Where(p => p.MaxGuests >= request.Guests.Value);
                }

                if (request.MinPrice.HasValue)
                {
                    query = query.Where(p => p.Price >= request.MinPrice.Value);
                }

                if (request.MaxPrice.HasValue)
                {
                    query = query.Where(p => p.Price <= request.MaxPrice.Value);
                }

                if (request.Features != null && request.Features.Any())
                {
                    foreach (var feature in request.Features)
                    {
                        query = query.Where(p => p.Features.Any(f => f.Value == feature));
                    }
                }

                var properties = query
                    .OrderByDescending(p => p.Rating)
                    .ToList();

                return _mapper.Map<List<PropertySummaryDto>>(properties);
            }
        }

        internal List<ManagedPropertyDto> GetAllForAdminActionExecution()
        {
            using (var db = new PropertyContext())
            {
                var properties = QueryManagedGraph(db, false)
                    .OrderByDescending(p => p.CreatedAt)
                    .ToList();

                return _mapper.Map<List<ManagedPropertyDto>>(properties);
            }
        }

        internal ActionResponse ApprovePropertyActionExecution(int id)
        {
            using (var db = new PropertyContext())
            {
                var property = db.Properties.FirstOrDefault(p => p.Id == id);
                if (property == null) return Failed(404, "Proprietatea nu a fost gasita.");

                property.IsApproved = true;
                db.SaveChanges();
                return Success("Proprietate aprobata.");
            }
        }

        internal ActionResponse RejectPropertyActionExecution(int id)
        {
            using (var db = new PropertyContext())
            {
                var property = db.Properties.FirstOrDefault(p => p.Id == id);
                if (property == null) return Failed(404, "Proprietatea nu a fost gasita.");

                property.IsApproved = false;
                db.SaveChanges();
                return Success("Proprietate respinsa.");
            }
        }

        internal ActionResponse UpdateAvailabilityActionExecution(int id, List<int> occupiedDays)
        {
            using (var db = new PropertyContext())
            {
                var property = db.Properties.Include(p => p.OccupiedDays).FirstOrDefault(p => p.Id == id);
                if (property == null) return Failed(404, "Proprietatea nu a fost gasita.");

                ReplaceChildren(db, property.OccupiedDays, occupiedDays.Select(day => new PropertyOccupiedDayData { Day = day }));
                db.SaveChanges();
                return Success("Disponibilitatea a fost actualizata.");
            }
        }

        private static ActionResponse Success(string message)
        {
            return new ActionResponse
            {
                IsSuccess = true,
                Message = message,
                StatusCode = 200
            };
        }

        private static ActionResponse<T> Success<T>(T data, string? message = null)
        {
            return new ActionResponse<T>
            {
                IsSuccess = true,
                Message = message,
                StatusCode = 200,
                Data = data
            };
        }

        private static ActionResponse Failed(int statusCode, string message)
        {
            return new ActionResponse
            {
                IsSuccess = false,
                Message = message,
                StatusCode = statusCode
            };
        }

        private static ActionResponse<T> Failed<T>(int statusCode, string message)
        {
            return new ActionResponse<T>
            {
                IsSuccess = false,
                Message = message,
                StatusCode = statusCode
            };
        }

        private static string? Validate(UpsertPropertyRequestDto request)
        {
            if (string.IsNullOrWhiteSpace(request.OwnerEmail)) return "Owner email este obligatoriu.";
            if (string.IsNullOrWhiteSpace(request.Host)) return "Numele gazdei este obligatoriu.";
            if (string.IsNullOrWhiteSpace(request.Title)) return "Titlul proprietatii este obligatoriu.";
            if (string.IsNullOrWhiteSpace(request.City)) return "Orasul este obligatoriu.";
            if (string.IsNullOrWhiteSpace(request.Country)) return "Tara este obligatorie.";
            if (string.IsNullOrWhiteSpace(request.Address)) return "Adresa este obligatorie.";
            if (string.IsNullOrWhiteSpace(request.Image)) return "Imaginea principala este obligatorie.";
            if (string.IsNullOrWhiteSpace(request.AvailableFrom) || string.IsNullOrWhiteSpace(request.AvailableTo))
            {
                return "Perioada de disponibilitate este obligatorie.";
            }

            if (request.Price <= 0) return "Pretul pe noapte trebuie sa fie mai mare decat 0.";
            if (request.MaxGuests < 1) return "Capacitatea minima este 1 oaspete.";
            if (request.Bedrooms < 1) return "Proprietatea trebuie sa aiba cel putin un dormitor.";
            if (request.Bathrooms < 1) return "Proprietatea trebuie sa aiba cel putin o baie.";
            if (request.Area < 10) return "Suprafata minima este 10 mp.";
            if (string.IsNullOrWhiteSpace(request.Description)) return "Descrierea este obligatorie.";

            return null;
        }

        private static IQueryable<PropertyData> QuerySummaryGraph(PropertyContext db)
        {
            return db.Properties
                .AsNoTracking()
                .Include(property => property.Features)
                .AsSplitQuery();
        }

        private static IQueryable<PropertyData> QueryManagedGraph(PropertyContext db, bool trackChanges)
        {
            var query = db.Properties
                .Include(property => property.Owner)
                .Include(property => property.GalleryImages)
                .Include(property => property.Features)
                .AsSplitQuery();

            if (!trackChanges)
            {
                query = query.AsNoTracking();
            }

            return query;
        }

        private static IQueryable<PropertyData> QueryDetailGraph(PropertyContext db)
        {
            return db.Properties
                .AsNoTracking()
                .Include(property => property.Owner)
                .Include(property => property.GalleryImages)
                .Include(property => property.Features)
                .Include(property => property.Amenities)
                .Include(property => property.OccupiedDays)
                .Include(property => property.ReviewsList)
                .Include(property => property.Nearby)
                .AsSplitQuery();
        }

        private static void ReplaceChildren<T>(PropertyContext db, ICollection<T> current, IEnumerable<T> next) where T : class
        {
            db.RemoveRange(current.ToList());
            current.Clear();

            foreach (var item in next)
            {
                current.Add(item);
            }
        }

        private static List<PropertyImageData> BuildGalleryImages(IEnumerable<string> values)
        {
            return values
                .Where(value => !string.IsNullOrWhiteSpace(value))
                .Select(value => value.Trim())
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .Select(value => new PropertyImageData { Url = value })
                .ToList();
        }

        private static List<PropertyFeatureData> BuildFeatures(IEnumerable<string> values)
        {
            return values
                .Where(value => !string.IsNullOrWhiteSpace(value))
                .Select(value => value.Trim())
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .Select(value => new PropertyFeatureData { Value = value })
                .ToList();
        }

        private static List<AmenityData> BuildAmenities(IEnumerable<string> values)
        {
            return values
                .Where(value => !string.IsNullOrWhiteSpace(value))
                .Select(value => value.Trim())
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .Select(value => new AmenityData
                {
                    Icon = "check",
                    Label = value,
                    Available = true
                })
                .ToList();
        }

        private static List<NearbyPlaceData> BuildNearby(string address, string city)
        {
            return
            [
                new NearbyPlaceData { Icon = "location", Name = address.Trim(), Dist = "La locatie" },
                new NearbyPlaceData { Icon = "city", Name = $"Centru {city.Trim()}", Dist = "1.2 km" }
            ];
        }

        private static string NormalizeEmail(string email)
        {
            return (email ?? string.Empty).Trim().ToLowerInvariant();
        }
    }
}
