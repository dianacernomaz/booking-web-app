using MyProject.BusinessLayer.Common;
using MyProject.BusinessLayer.DTOs;

namespace MyProject.BusinessLayer.Interfaces;

public interface IPropertyAction
{
    IReadOnlyCollection<PropertySummaryDto> GetAllSummariesAction();

    ServiceResult<PropertyDetailDto> GetByIdAction(int id);

    IReadOnlyCollection<ManagedPropertyDto> GetByOwnerAction(string ownerEmail);

    ServiceResult<ManagedPropertyDto> CreateAction(UpsertPropertyRequestDto request);

    ServiceResult<ManagedPropertyDto> UpdateAction(int id, UpsertPropertyRequestDto request);

    ServiceResult DeleteAction(int id, string ownerEmail);
}
