using AutoMapper;
using Microsoft.EntityFrameworkCore;
using MyProject.DataAccess;
using MyProject.DataAccess.Context;
using MyProject.Domain.Entities;
using MyProject.Domain.Models.Property;
using MyProject.Domain.Models.Responses;

namespace MyProject.BusinessLayer.Core
{
    public class WishlistActions
    {
        private readonly IMapper _mapper;

        public WishlistActions()
        {
            _mapper = BusinessLogic.Mapper;
        }

        internal List<PropertySummaryDto> GetUserWishlistActionExecution(string userEmail)
        {
            var normalizedEmail = NormalizeEmail(userEmail);

            using (var db = new UserContext())
            {
                var user = db.Users.FirstOrDefault(u => u.Email == normalizedEmail);
                if (user == null) return new List<PropertySummaryDto>();

                var wishlistedProperties = db.Wishlists
                    .AsNoTracking()
                    .Include(w => w.Property)
                    .ThenInclude(p => p.Features)
                    .Where(w => w.UserId == user.Id && w.Property != null)
                    .Select(w => w.Property!)
                    .ToList();

                var dtos = _mapper.Map<List<PropertySummaryDto>>(wishlistedProperties);
                foreach (var dto in dtos)
                {
                    dto.IsFavorite = true;
                }

                return dtos;
            }
        }

        internal ActionResponse ToggleWishlistActionExecution(string userEmail, int propertyId)
        {
            var normalizedEmail = NormalizeEmail(userEmail);

            using (var db = new UserContext())
            {
                var user = db.Users.FirstOrDefault(u => u.Email == normalizedEmail);
                if (user == null) return Failed(404, "Utilizatorul nu a fost gasit.");

                var property = db.Properties.FirstOrDefault(p => p.Id == propertyId);
                if (property == null) return Failed(404, "Proprietatea nu a fost gasita.");

                var existingWishlist = db.Wishlists.FirstOrDefault(w => w.UserId == user.Id && w.PropertyId == propertyId);

                if (existingWishlist != null)
                {
                    db.Wishlists.Remove(existingWishlist);
                    db.SaveChanges();
                    return Success("Proprietatea a fost eliminata din favorite.");
                }
                else
                {
                    var newWishlist = new WishlistData
                    {
                        UserId = user.Id,
                        PropertyId = propertyId,
                        CreatedAt = DateTime.UtcNow
                    };
                    db.Wishlists.Add(newWishlist);
                    db.SaveChanges();
                    return Success("Proprietatea a fost adaugata la favorite.");
                }
            }
        }

        private static string NormalizeEmail(string email)
        {
            return (email ?? string.Empty).Trim().ToLowerInvariant();
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
