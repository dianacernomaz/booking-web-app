using MyProject.Domain.Models.Property;
using MyProject.Domain.Models.Responses;

namespace MyProject.BusinessLayer.Interfaces
{
    public interface IPropertyAction
    {
        List<PropertySummaryDto> GetAllPropertiesAction();

        PropertyDetailDto? GetByIdAction(int id);

        List<ManagedPropertyDto> GetByOwnerAction(string ownerEmail);

        ActionResponse<ManagedPropertyDto> CreateAction(UpsertPropertyRequestDto request);

        ActionResponse<ManagedPropertyDto> UpdateAction(int id, UpsertPropertyRequestDto request);

        List<PropertySummaryDto> SearchPropertiesAction(PropertySearchRequestDto request);

        List<ManagedPropertyDto> GetAllForAdminAction();

        ActionResponse ApproveAction(int id);

        ActionResponse RejectAction(int id);

        ActionResponse UpdateAvailabilityAction(int id, List<int> occupiedDays);

        ActionResponse DeleteAction(int id, string ownerEmail);
    }
}
