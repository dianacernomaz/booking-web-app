using StayBooker.BusinessLayer.Common;
using StayBooker.BusinessLayer.DTOs.Properties;

namespace StayBooker.BusinessLayer.Interfaces;

public interface IPropertyService
{
    Task<IReadOnlyCollection<ManagedPropertyDto>> GetAllAsync(string? ownerEmail = null);
    Task<ManagedPropertyDto?> GetByIdAsync(int id);
    Task<ServiceResult<ManagedPropertyDto>> CreateAsync(UpsertManagedPropertyDto request);
    Task<ServiceResult<ManagedPropertyDto>> UpdateAsync(int id, UpsertManagedPropertyDto request);
    Task<bool> DeleteAsync(int id, string ownerEmail);
}
