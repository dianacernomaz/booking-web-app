using AutoMapper;
using Microsoft.EntityFrameworkCore;
using MyProject.DataAccess.Context;
using MyProject.Domain.Models.Favorite;
using MyProject.Domain.Models.Property;
using MyProject.Domain.Models.Responses;

namespace MyProject.BusinessLayer.Core
{
    public class FavoriteActions
    {
        private readonly IMapper _mapper;

        public FavoriteActions()
        {
            _mapper = BusinessLogic.Mapper;
        }

        internal List<PropertySummaryDto> GetByUserActionExecution(int userId)
        {
            using (var db = new UserContext())
            {
                var properties = db.Favorites
                    .AsNoTracking()
                    .Include(favorite => favorite.Property)
                    .ThenInclude(property => property!.Features)
                    .Where(favorite => favorite.UserId == userId && favorite.Property != null && favorite.Property.IsApproved)
                    .OrderByDescending(favorite => favorite.CreatedAt)
                    .Select(favorite => favorite.Property!)
                    .ToList();

                var mapped = _mapper.Map<List<PropertySummaryDto>>(properties);
                foreach (var property in mapped)
                {
                    property.IsFavorite = true;
                }

                return mapped;
            }
        }

        internal FavoriteStatusDto CheckActionExecution(int userId, int propertyId)
        {
            using (var db = new UserContext())
            {
                return new FavoriteStatusDto
                {
                    IsFavorite = db.Favorites.Any(favorite => favorite.UserId == userId && favorite.PropertyId == propertyId)
                };
            }
        }

        internal ActionResponse AddActionExecution(int userId, AddFavoriteRequestDto request)
        {
            if (request.PropertyId <= 0)
            {
                return Failed(400, "Proprietatea nu este valida.");
            }

            using (var db = new UserContext())
            {
                var propertyExists = db.Properties.Any(property => property.Id == request.PropertyId && property.IsApproved);
                if (!propertyExists)
                {
                    return Failed(404, "Proprietatea nu a fost gasita.");
                }

                var alreadyExists = db.Favorites.Any(favorite => favorite.UserId == userId && favorite.PropertyId == request.PropertyId);
                if (alreadyExists)
                {
                    return Failed(409, "Proprietatea este deja in lista de favorite.");
                }

                db.Favorites.Add(new Domain.Entities.FavoriteData
                {
                    UserId = userId,
                    PropertyId = request.PropertyId,
                    CreatedAt = DateTime.UtcNow
                });

                db.SaveChanges();
                return Success("Proprietatea a fost adaugata la favorite.");
            }
        }

        internal ActionResponse RemoveActionExecution(int userId, int propertyId)
        {
            using (var db = new UserContext())
            {
                var favorite = db.Favorites.FirstOrDefault(item => item.UserId == userId && item.PropertyId == propertyId);
                if (favorite == null)
                {
                    return Failed(404, "Proprietatea nu se afla in lista de favorite.");
                }

                db.Favorites.Remove(favorite);
                db.SaveChanges();
                return Success("Proprietatea a fost eliminata din favorite.");
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
