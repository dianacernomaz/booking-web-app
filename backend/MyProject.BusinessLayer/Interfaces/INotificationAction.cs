using MyProject.Domain.Models.Notification;
using MyProject.Domain.Models.Responses;

namespace MyProject.BusinessLayer.Interfaces
{
    public interface INotificationAction
    {
        List<NotificationDto> GetByUserAction(int userId);

        UnreadNotificationsCountDto GetUnreadCountAction(int userId);

        ActionResponse MarkAsReadAction(int id, int userId);

        ActionResponse MarkAllAsReadAction(int userId);

        ActionResponse DeleteAction(int id, int userId);
    }
}
