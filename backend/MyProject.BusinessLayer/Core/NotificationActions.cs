using AutoMapper;
using Microsoft.EntityFrameworkCore;
using MyProject.DataAccess.Context;
using MyProject.Domain.Models.Notification;
using MyProject.Domain.Models.Responses;

namespace MyProject.BusinessLayer.Core
{
    public class NotificationActions
    {
        private readonly IMapper _mapper;

        public NotificationActions()
        {
            _mapper = BusinessLogic.Mapper;
        }

        internal List<NotificationDto> GetByUserActionExecution(int userId)
        {
            using (var db = new UserContext())
            {
                var notifications = db.Notifications
                    .AsNoTracking()
                    .Where(notification => notification.UserId == userId)
                    .OrderByDescending(notification => notification.CreatedAt)
                    .ToList();

                return _mapper.Map<List<NotificationDto>>(notifications);
            }
        }

        internal UnreadNotificationsCountDto GetUnreadCountActionExecution(int userId)
        {
            using (var db = new UserContext())
            {
                return new UnreadNotificationsCountDto
                {
                    Count = db.Notifications.Count(notification => notification.UserId == userId && !notification.IsRead)
                };
            }
        }

        internal ActionResponse MarkAsReadActionExecution(int id, int userId)
        {
            using (var db = new UserContext())
            {
                var notification = db.Notifications.FirstOrDefault(item => item.Id == id && item.UserId == userId);
                if (notification == null)
                {
                    return Failed(404, "Notificarea nu a fost gasita.");
                }

                notification.IsRead = true;
                db.SaveChanges();
                return Success("Notificarea a fost marcata ca citita.");
            }
        }

        internal ActionResponse MarkAllAsReadActionExecution(int userId)
        {
            using (var db = new UserContext())
            {
                var notifications = db.Notifications
                    .Where(item => item.UserId == userId && !item.IsRead)
                    .ToList();

                foreach (var notification in notifications)
                {
                    notification.IsRead = true;
                }

                db.SaveChanges();
                return Success("Toate notificarile au fost marcate ca citite.");
            }
        }

        internal ActionResponse DeleteActionExecution(int id, int userId)
        {
            using (var db = new UserContext())
            {
                var notification = db.Notifications.FirstOrDefault(item => item.Id == id && item.UserId == userId);
                if (notification == null)
                {
                    return Failed(404, "Notificarea nu a fost gasita.");
                }

                db.Notifications.Remove(notification);
                db.SaveChanges();
                return Success("Notificarea a fost stearsa.");
            }
        }

        private static ActionResponse Success(string message)
        {
            return new ActionResponse
            {
                IsSuccess = true,
                Message = message,
                StatusCode = 200
            };
        }

        private static ActionResponse Failed(int statusCode, string message)
        {
            return new ActionResponse
            {
                IsSuccess = false,
                Message = message,
                StatusCode = statusCode
            };
        }
    }
}
