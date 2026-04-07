using MyProject.BusinessLayer.Common;
using MyProject.BusinessLayer.Core;
using MyProject.BusinessLayer.DTOs;
using MyProject.BusinessLayer.Infrastructure;
using MyProject.BusinessLayer.Interfaces;

namespace MyProject.BusinessLayer.Structure;

public sealed class PropertyActionExecution(InMemoryAppStore store) : PropertyActions(store), IPropertyAction
{
    public IReadOnlyCollection<PropertySummaryDto> GetAllSummariesAction() => GetAllSummariesExecution();

    public ServiceResult<PropertyDetailDto> GetByIdAction(int id) => GetByIdExecution(id);

    public IReadOnlyCollection<ManagedPropertyDto> GetByOwnerAction(string ownerEmail) => GetByOwnerExecution(ownerEmail);

    public ServiceResult<ManagedPropertyDto> CreateAction(UpsertPropertyRequestDto request) => CreateExecution(request);

    public ServiceResult<ManagedPropertyDto> UpdateAction(int id, UpsertPropertyRequestDto request) => UpdateExecution(id, request);

    public ServiceResult DeleteAction(int id, string ownerEmail) => DeleteExecution(id, ownerEmail);
}
