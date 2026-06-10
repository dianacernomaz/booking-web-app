using MyProject.BusinessLayer.Core;
using MyProject.BusinessLayer.Interfaces;
using MyProject.Domain.Models.Notification;
using MyProject.Domain.Models.Responses;

namespace MyProject.BusinessLayer.Structure
{
    public class NotificationActionExecution : NotificationActions, INotificationAction
    {
        public NotificationActionExecution()
        {
        }

        public List<NotificationDto> GetByUserAction(int userId)
        {
            return GetByUserActionExecution(userId);
        }

        public UnreadNotificationsCountDto GetUnreadCountAction(int userId)
        {
            return GetUnreadCountActionExecution(userId);
        }

        public ActionResponse MarkAsReadAction(int id, int userId)
        {
            return MarkAsReadActionExecution(id, userId);
        }

        public ActionResponse MarkAllAsReadAction(int userId)
        {
            return MarkAllAsReadActionExecution(userId);
        }

        public ActionResponse DeleteAction(int id, int userId)
        {
            return DeleteActionExecution(id, userId);
        }
    }
}
