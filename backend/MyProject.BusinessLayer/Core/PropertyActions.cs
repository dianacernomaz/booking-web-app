using MyProject.BusinessLayer.Common;
using MyProject.BusinessLayer.DTOs;
using MyProject.BusinessLayer.Infrastructure;
using MyProject.Domain.Entities;

namespace MyProject.BusinessLayer.Core;

public class PropertyActions(InMemoryAppStore store)
{
    protected IReadOnlyCollection<PropertySummaryDto> GetAllSummariesExecution()
    {
        lock (store.SyncRoot)
        {
            return store.Properties
                .OrderBy(property => property.Id)
                .Select(Mappers.ToSummary)
                .ToArray();
        }
    }

    protected ServiceResult<PropertyDetailDto> GetByIdExecution(int id)
    {
        lock (store.SyncRoot)
        {
            var property = store.Properties.FirstOrDefault(candidate => candidate.Id == id);
            return property is null
                ? ServiceResult<PropertyDetailDto>.Failure(ServiceErrorType.NotFound, "Proprietatea nu a fost gasita.")
                : ServiceResult<PropertyDetailDto>.Success(Mappers.ToDetail(property));
        }
    }

    protected IReadOnlyCollection<ManagedPropertyDto> GetByOwnerExecution(string ownerEmail)
    {
        var normalizedEmail = NormalizeEmail(ownerEmail);

        lock (store.SyncRoot)
        {
            return store.Properties
                .Where(property => string.Equals(property.OwnerEmail, normalizedEmail, StringComparison.OrdinalIgnoreCase))
                .OrderByDescending(property => property.UpdatedAt)
                .Select(Mappers.ToManaged)
                .ToArray();
        }
    }

    protected ServiceResult<ManagedPropertyDto> CreateExecution(UpsertPropertyRequestDto request)
    {
        var validationError = Validate(request);
        if (validationError is not null)
        {
            return ServiceResult<ManagedPropertyDto>.Failure(ServiceErrorType.Validation, validationError);
        }

        lock (store.SyncRoot)
        {
            var now = DateTime.UtcNow;
            var entity = new PropertyEntity
            {
                Id = store.Properties.Count == 0 ? 1 : store.Properties.Max(property => property.Id) + 1,
                OwnerEmail = NormalizeEmail(request.OwnerEmail),
                Host = request.Host.Trim(),
                Title = request.Title.Trim(),
                City = request.City.Trim(),
                Country = request.Country.Trim(),
                Address = request.Address.Trim(),
                Price = request.Price,
                Rating = 0m,
                Reviews = 0,
                Image = request.Image.Trim(),
                GalleryImages = request.GalleryImages.Where(value => !string.IsNullOrWhiteSpace(value)).ToList(),
                Features = request.Features.Where(value => !string.IsNullOrWhiteSpace(value)).ToList(),
                Badge = string.IsNullOrWhiteSpace(request.Badge) ? null : request.Badge.Trim(),
                MaxGuests = request.MaxGuests,
                Bedrooms = request.Bedrooms,
                Bathrooms = request.Bathrooms,
                Area = request.Area,
                AvailableFrom = request.AvailableFrom,
                AvailableTo = request.AvailableTo,
                Description = request.Description.Trim(),
                DescriptionExtra = request.DescriptionExtra.Trim(),
                Amenities = request.Features
                    .Where(value => !string.IsNullOrWhiteSpace(value))
                    .Distinct()
                    .Select(feature => new AmenityEntity
                    {
                        Icon = "✓",
                        Label = feature.Trim(),
                        Available = true
                    })
                    .ToList(),
                Nearby =
                [
                    new NearbyPlaceEntity { Icon = "📍", Name = request.Address.Trim(), Dist = "La locatie" },
                    new NearbyPlaceEntity { Icon = "🏙️", Name = $"Centru {request.City.Trim()}", Dist = "1.2 km" }
                ],
                CreatedAt = now,
                UpdatedAt = now
            };

            store.Properties.Add(entity);
            return ServiceResult<ManagedPropertyDto>.Success(Mappers.ToManaged(entity));
        }
    }

    protected ServiceResult<ManagedPropertyDto> UpdateExecution(int id, UpsertPropertyRequestDto request)
    {
        var validationError = Validate(request);
        if (validationError is not null)
        {
            return ServiceResult<ManagedPropertyDto>.Failure(ServiceErrorType.Validation, validationError);
        }

        var normalizedOwnerEmail = NormalizeEmail(request.OwnerEmail);

        lock (store.SyncRoot)
        {
            var entity = store.Properties.FirstOrDefault(property => property.Id == id);
            if (entity is null)
            {
                return ServiceResult<ManagedPropertyDto>.Failure(ServiceErrorType.NotFound, "Proprietatea nu a fost gasita.");
            }

            if (!string.Equals(entity.OwnerEmail, normalizedOwnerEmail, StringComparison.OrdinalIgnoreCase))
            {
                return ServiceResult<ManagedPropertyDto>.Failure(ServiceErrorType.Unauthorized, "Nu poti modifica aceasta proprietate.");
            }

            entity.OwnerEmail = normalizedOwnerEmail;
            entity.Host = request.Host.Trim();
            entity.Title = request.Title.Trim();
            entity.City = request.City.Trim();
            entity.Country = request.Country.Trim();
            entity.Address = request.Address.Trim();
            entity.Price = request.Price;
            entity.Image = request.Image.Trim();
            entity.GalleryImages = request.GalleryImages.Where(value => !string.IsNullOrWhiteSpace(value)).ToList();
            entity.Features = request.Features.Where(value => !string.IsNullOrWhiteSpace(value)).ToList();
            entity.Badge = string.IsNullOrWhiteSpace(request.Badge) ? null : request.Badge.Trim();
            entity.MaxGuests = request.MaxGuests;
            entity.Bedrooms = request.Bedrooms;
            entity.Bathrooms = request.Bathrooms;
            entity.Area = request.Area;
            entity.AvailableFrom = request.AvailableFrom;
            entity.AvailableTo = request.AvailableTo;
            entity.Description = request.Description.Trim();
            entity.DescriptionExtra = request.DescriptionExtra.Trim();
            entity.Amenities = request.Features
                .Where(value => !string.IsNullOrWhiteSpace(value))
                .Distinct()
                .Select(feature => new AmenityEntity
                {
                    Icon = "✓",
                    Label = feature.Trim(),
                    Available = true
                })
                .ToList();
            entity.Nearby =
            [
                new NearbyPlaceEntity { Icon = "📍", Name = request.Address.Trim(), Dist = "La locatie" },
                new NearbyPlaceEntity { Icon = "🏙️", Name = $"Centru {request.City.Trim()}", Dist = "1.2 km" }
            ];
            entity.UpdatedAt = DateTime.UtcNow;

            return ServiceResult<ManagedPropertyDto>.Success(Mappers.ToManaged(entity));
        }
    }

    protected ServiceResult DeleteExecution(int id, string ownerEmail)
    {
        var normalizedOwnerEmail = NormalizeEmail(ownerEmail);

        lock (store.SyncRoot)
        {
            var entity = store.Properties.FirstOrDefault(property => property.Id == id);
            if (entity is null)
            {
                return ServiceResult.Failure(ServiceErrorType.NotFound, "Proprietatea nu a fost gasita.");
            }

            if (!string.Equals(entity.OwnerEmail, normalizedOwnerEmail, StringComparison.OrdinalIgnoreCase))
            {
                return ServiceResult.Failure(ServiceErrorType.Unauthorized, "Nu poti sterge aceasta proprietate.");
            }

            store.Properties.Remove(entity);
            return ServiceResult.Success();
        }
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

    private static string NormalizeEmail(string email) => email.Trim().ToLowerInvariant();
}
