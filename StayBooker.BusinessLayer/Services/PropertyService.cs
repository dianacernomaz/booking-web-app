using StayBooker.BusinessLayer.Common;
using StayBooker.BusinessLayer.DTOs.Properties;
using StayBooker.BusinessLayer.Infrastructure;
using StayBooker.BusinessLayer.Interfaces;
using StayBooker.Domain.Entities;

namespace StayBooker.BusinessLayer.Services;

public sealed class PropertyService : IPropertyService
{
    private readonly InMemoryDataStore _store;

    public PropertyService(InMemoryDataStore store)
    {
        _store = store;
    }

    public Task<IReadOnlyCollection<ManagedPropertyDto>> GetAllAsync(string? ownerEmail = null)
    {
        var query = _store.Properties.AsEnumerable();
        if (!string.IsNullOrWhiteSpace(ownerEmail))
        {
            var normalized = NormalizeEmail(ownerEmail);
            query = query.Where(property => NormalizeEmail(property.OwnerEmail) == normalized);
        }

        var data = query
            .OrderByDescending(property => property.UpdatedAt)
            .Select(ToDto)
            .ToArray();

        return Task.FromResult<IReadOnlyCollection<ManagedPropertyDto>>(data);
    }

    public Task<ManagedPropertyDto?> GetByIdAsync(int id)
    {
        var property = _store.Properties.FirstOrDefault(candidate => candidate.Id == id);
        return Task.FromResult(property is null ? null : ToDto(property));
    }

    public Task<ServiceResult<ManagedPropertyDto>> CreateAsync(UpsertManagedPropertyDto request)
    {
        var validation = Validate(request);
        if (validation is not null)
        {
            return Task.FromResult(ServiceResult<ManagedPropertyDto>.Fail(validation));
        }

        var now = DateTime.UtcNow;
        var property = new ManagedProperty
        {
            Id = _store.NextPropertyId++,
            OwnerEmail = NormalizeEmail(request.OwnerEmail),
            Host = request.Host.Trim(),
            Title = request.Title.Trim(),
            City = request.City.Trim(),
            Country = request.Country.Trim(),
            Address = request.Address.Trim(),
            Price = request.Price,
            Image = request.Image.Trim(),
            GalleryImages = request.GalleryImages.Where(value => !string.IsNullOrWhiteSpace(value)).Select(value => value.Trim()).ToList(),
            Features = request.Features.Where(value => !string.IsNullOrWhiteSpace(value)).Select(value => value.Trim()).ToList(),
            Badge = string.IsNullOrWhiteSpace(request.Badge) ? null : request.Badge.Trim(),
            MaxGuests = request.MaxGuests,
            Bedrooms = request.Bedrooms,
            Bathrooms = request.Bathrooms,
            Area = request.Area,
            AvailableFrom = request.AvailableFrom,
            AvailableTo = request.AvailableTo,
            Description = request.Description.Trim(),
            DescriptionExtra = request.DescriptionExtra.Trim(),
            CreatedAt = now,
            UpdatedAt = now,
        };

        _store.Properties.Add(property);
        return Task.FromResult(ServiceResult<ManagedPropertyDto>.Ok(ToDto(property)));
    }

    public Task<ServiceResult<ManagedPropertyDto>> UpdateAsync(int id, UpsertManagedPropertyDto request)
    {
        var validation = Validate(request);
        if (validation is not null)
        {
            return Task.FromResult(ServiceResult<ManagedPropertyDto>.Fail(validation));
        }

        var property = _store.Properties.FirstOrDefault(candidate => candidate.Id == id);
        if (property is null)
        {
            return Task.FromResult(ServiceResult<ManagedPropertyDto>.Fail("Proprietatea nu a fost gasita."));
        }

        property.OwnerEmail = NormalizeEmail(request.OwnerEmail);
        property.Host = request.Host.Trim();
        property.Title = request.Title.Trim();
        property.City = request.City.Trim();
        property.Country = request.Country.Trim();
        property.Address = request.Address.Trim();
        property.Price = request.Price;
        property.Image = request.Image.Trim();
        property.GalleryImages = request.GalleryImages.Where(value => !string.IsNullOrWhiteSpace(value)).Select(value => value.Trim()).ToList();
        property.Features = request.Features.Where(value => !string.IsNullOrWhiteSpace(value)).Select(value => value.Trim()).ToList();
        property.Badge = string.IsNullOrWhiteSpace(request.Badge) ? null : request.Badge.Trim();
        property.MaxGuests = request.MaxGuests;
        property.Bedrooms = request.Bedrooms;
        property.Bathrooms = request.Bathrooms;
        property.Area = request.Area;
        property.AvailableFrom = request.AvailableFrom;
        property.AvailableTo = request.AvailableTo;
        property.Description = request.Description.Trim();
        property.DescriptionExtra = request.DescriptionExtra.Trim();
        property.UpdatedAt = DateTime.UtcNow;

        return Task.FromResult(ServiceResult<ManagedPropertyDto>.Ok(ToDto(property)));
    }

    public Task<bool> DeleteAsync(int id, string ownerEmail)
    {
        var property = _store.Properties.FirstOrDefault(candidate =>
            candidate.Id == id &&
            NormalizeEmail(candidate.OwnerEmail) == NormalizeEmail(ownerEmail));

        if (property is null)
        {
            return Task.FromResult(false);
        }

        _store.Properties.Remove(property);
        return Task.FromResult(true);
    }

    private static string? Validate(UpsertManagedPropertyDto request)
    {
        if (string.IsNullOrWhiteSpace(request.OwnerEmail)) return "OwnerEmail este obligatoriu.";
        if (string.IsNullOrWhiteSpace(request.Host)) return "Host este obligatoriu.";
        if (string.IsNullOrWhiteSpace(request.Title)) return "Titlul este obligatoriu.";
        if (string.IsNullOrWhiteSpace(request.City)) return "Orasul este obligatoriu.";
        if (string.IsNullOrWhiteSpace(request.Country)) return "Tara este obligatorie.";
        if (string.IsNullOrWhiteSpace(request.Address)) return "Adresa este obligatorie.";
        if (request.Price <= 0) return "Pretul trebuie sa fie mai mare decat 0.";
        if (string.IsNullOrWhiteSpace(request.Image)) return "Imaginea principala este obligatorie.";
        if (request.MaxGuests < 1) return "Capacitatea minima este 1 oaspete.";
        if (request.Bedrooms < 1) return "Proprietatea trebuie sa aiba cel putin un dormitor.";
        if (request.Bathrooms < 1) return "Proprietatea trebuie sa aiba cel putin o baie.";
        if (request.Area < 10) return "Suprafata minima este 10 m2.";
        if (string.IsNullOrWhiteSpace(request.AvailableFrom) || string.IsNullOrWhiteSpace(request.AvailableTo)) return "Perioada de disponibilitate este obligatorie.";
        if (DateOnly.Parse(request.AvailableTo) < DateOnly.Parse(request.AvailableFrom)) return "Data de final trebuie sa fie dupa data de inceput.";
        if (string.IsNullOrWhiteSpace(request.Description)) return "Descrierea este obligatorie.";
        return null;
    }

    private static string NormalizeEmail(string email) => email.Trim().ToLowerInvariant();

    private static ManagedPropertyDto ToDto(ManagedProperty property)
    {
        return new ManagedPropertyDto
        {
            Id = property.Id,
            OwnerEmail = property.OwnerEmail,
            Host = property.Host,
            Title = property.Title,
            City = property.City,
            Country = property.Country,
            Address = property.Address,
            Price = property.Price,
            Image = property.Image,
            GalleryImages = [.. property.GalleryImages],
            Features = [.. property.Features],
            Badge = property.Badge,
            MaxGuests = property.MaxGuests,
            Bedrooms = property.Bedrooms,
            Bathrooms = property.Bathrooms,
            Area = property.Area,
            AvailableFrom = property.AvailableFrom,
            AvailableTo = property.AvailableTo,
            Description = property.Description,
            DescriptionExtra = property.DescriptionExtra,
            CreatedAt = property.CreatedAt.ToString("O"),
            UpdatedAt = property.UpdatedAt.ToString("O"),
        };
    }
}
