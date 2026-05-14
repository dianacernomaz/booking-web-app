using MyProject.BusinessLayer.Core;
using MyProject.BusinessLayer.Interfaces;
using MyProject.Domain.Models.Property;
using MyProject.DataAccess;
using MyProject.Domain.Models.Responses;

namespace MyProject.BusinessLayer.Structure
{
    public class PropertyActionExecution : PropertyActions, IPropertyAction
    {
        public PropertyActionExecution() { }

        public List<PropertySummaryDto> GetAllPropertiesAction(string? userEmail = null)
        {
            return GetAllPropertiesActionExecution(userEmail);
        }

        public PropertyDetailDto? GetByIdAction(int id)
        {
            return GetByIdActionExecution(id);
        }

        public List<ManagedPropertyDto> GetByOwnerAction(string ownerEmail)
        {
            return GetByOwnerActionExecution(ownerEmail);
        }

        public ActionResponse<ManagedPropertyDto> CreateAction(UpsertPropertyRequestDto request)
        {
            return CreatePropertyActionExecution(request);
        }

        public ActionResponse<ManagedPropertyDto> UpdateAction(int id, UpsertPropertyRequestDto request)
        {
            return UpdatePropertyActionExecution(id, request);
        }

        public List<PropertySummaryDto> SearchPropertiesAction(PropertySearchRequestDto request)
        {
            return SearchPropertiesActionExecution(request);
        }

        public List<ManagedPropertyDto> GetAllForAdminAction()
        {
            return GetAllForAdminActionExecution();
        }

        public ActionResponse ApproveAction(int id)
        {
            return ApprovePropertyActionExecution(id);
        }

        public ActionResponse RejectAction(int id)
        {
            return RejectPropertyActionExecution(id);
        }

        public ActionResponse UpdateAvailabilityAction(int id, List<int> occupiedDays)
        {
            return UpdateAvailabilityActionExecution(id, occupiedDays);
        }

        public ActionResponse DeleteAction(int id, string ownerEmail)
        {
            return DeletePropertyActionExecution(id, ownerEmail);
        }
    }
}
