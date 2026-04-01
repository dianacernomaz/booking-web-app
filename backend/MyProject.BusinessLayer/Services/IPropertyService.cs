using MyProject.BusinessLayer.Common;
using MyProject.BusinessLayer.DTOs;

namespace MyProject.BusinessLayer.Services;

public interface IPropertyService
{
    IReadOnlyCollection<PropertySummaryDto> GetAllSummaries();

    ServiceResult<PropertyDetailDto> GetById(int id);

    IReadOnlyCollection<ManagedPropertyDto> GetByOwner(string ownerEmail);

    ServiceResult<ManagedPropertyDto> Create(UpsertPropertyRequestDto request);

    ServiceResult<ManagedPropertyDto> Update(int id, UpsertPropertyRequestDto request);

    ServiceResult Delete(int id, string ownerEmail);
}
