using AutoMapper;
using Microsoft.EntityFrameworkCore;
using MyProject.DataAccess.Context;
using MyProject.Domain.Entities;
using MyProject.Domain.Models.Responses;
using MyProject.Domain.Models.Review;

namespace MyProject.BusinessLayer.Core
{
    public class ReviewActions
    {
        private readonly IMapper _mapper;

        public ReviewActions()
        {
            _mapper = BusinessLogic.Mapper;
        }

        internal List<ReviewDto> GetByPropertyActionExecution(int propertyId)
        {
            using (var db = new UserContext())
            {
                var reviews = db.Reviews
                    .AsNoTracking()
                    .Include(review => review.User)
                    .Where(review => review.PropertyId == propertyId)
                    .OrderByDescending(review => review.UpdatedAt)
                    .ToList();

                return _mapper.Map<List<ReviewDto>>(reviews);
            }
        }

        internal ReviewAverageDto GetAverageActionExecution(int propertyId)
        {
            using (var db = new UserContext())
            {
                var reviews = db.Reviews
                    .AsNoTracking()
                    .Where(review => review.PropertyId == propertyId)
                    .ToList();

                if (reviews.Count == 0)
                {
                    return new ReviewAverageDto();
                }

                return new ReviewAverageDto
                {
                    Count = reviews.Count,
                    Rating = Math.Round(reviews.Average(review => (decimal)review.Rating), 2)
                };
            }
        }

        internal ReviewStatusDto CheckActionExecution(int userId, int propertyId)
        {
            using (var db = new UserContext())
            {
                var review = db.Reviews
                    .AsNoTracking()
                    .Include(item => item.User)
                    .FirstOrDefault(item => item.UserId == userId && item.PropertyId == propertyId);

                return new ReviewStatusDto
                {
                    HasReviewed = review != null,
                    Review = review != null ? _mapper.Map<ReviewDto>(review) : null
                };
            }
        }

        internal ActionResponse AddActionExecution(int userId, UpsertReviewRequestDto request)
        {
            var validationError = Validate(request);
            if (validationError != null)
            {
                return Failed(400, validationError);
            }

            using (var db = new UserContext())
            {
                var property = db.Properties.FirstOrDefault(item => item.Id == request.PropertyId && item.IsApproved);
                if (property == null)
                {
                    return Failed(404, "Proprietatea nu a fost gasita.");
                }

                var alreadyExists = db.Reviews.Any(review => review.UserId == userId && review.PropertyId == request.PropertyId);
                if (alreadyExists)
                {
                    return Failed(409, "Ai deja un review pentru aceasta proprietate.");
                }

                var now = DateTime.UtcNow;
                db.Reviews.Add(new ReviewData
                {
                    UserId = userId,
                    PropertyId = request.PropertyId,
                    Rating = request.Rating,
                    Comment = request.Comment.Trim(),
                    CreatedAt = now,
                    UpdatedAt = now
                });

                db.SaveChanges();
                RefreshPropertyReviewStats(db, request.PropertyId);
                db.SaveChanges();
                return Success("Review-ul a fost adaugat.");
            }
        }

        internal ActionResponse UpdateActionExecution(int id, int userId, UpsertReviewRequestDto request)
        {
            var validationError = Validate(request);
            if (validationError != null)
            {
                return Failed(400, validationError);
            }

            using (var db = new UserContext())
            {
                var review = db.Reviews.FirstOrDefault(item => item.Id == id);
                if (review == null)
                {
                    return Failed(404, "Review-ul nu a fost gasit.");
                }

                if (review.UserId != userId)
                {
                    return Failed(401, "Nu poti modifica acest review.");
                }

                if (review.PropertyId != request.PropertyId)
                {
                    return Failed(400, "Proprietatea review-ului nu este valida.");
                }

                review.Rating = request.Rating;
                review.Comment = request.Comment.Trim();
                review.UpdatedAt = DateTime.UtcNow;

                db.SaveChanges();
                RefreshPropertyReviewStats(db, review.PropertyId);
                db.SaveChanges();
                return Success("Review-ul a fost actualizat.");
            }
        }

        internal ActionResponse DeleteActionExecution(int id, int userId)
        {
            using (var db = new UserContext())
            {
                var review = db.Reviews.FirstOrDefault(item => item.Id == id);
                if (review == null)
                {
                    return Failed(404, "Review-ul nu a fost gasit.");
                }

                if (review.UserId != userId)
                {
                    return Failed(401, "Nu poti sterge acest review.");
                }

                var propertyId = review.PropertyId;
                db.Reviews.Remove(review);
                db.SaveChanges();
                RefreshPropertyReviewStats(db, propertyId);
                db.SaveChanges();
                return Success("Review-ul a fost sters.");
            }
        }

        private static string? Validate(UpsertReviewRequestDto request)
        {
            if (request.PropertyId <= 0) return "Proprietatea nu este valida.";
            if (request.Rating < 1 || request.Rating > 5) return "Rating-ul trebuie sa fie intre 1 si 5.";
            if (string.IsNullOrWhiteSpace(request.Comment)) return "Comentariul este obligatoriu.";
            if (request.Comment.Trim().Length > 1000) return "Comentariul nu poate depasi 1000 de caractere.";

            return null;
        }

        private static void RefreshPropertyReviewStats(UserContext db, int propertyId)
        {
            var property = db.Properties.FirstOrDefault(item => item.Id == propertyId);
            if (property == null)
            {
                return;
            }

            var reviews = db.Reviews
                .Where(review => review.PropertyId == propertyId)
                .ToList();

            property.Reviews = reviews.Count;
            property.Rating = reviews.Count == 0
                ? 0m
                : Math.Round(reviews.Average(review => (decimal)review.Rating), 2);
            property.UpdatedAt = DateTime.UtcNow;
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
