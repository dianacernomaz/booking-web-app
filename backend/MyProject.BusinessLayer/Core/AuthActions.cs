using AutoMapper;
using Microsoft.EntityFrameworkCore;
using MyProject.DataAccess;
using MyProject.DataAccess.Context;
using MyProject.Domain.Entities;
using MyProject.Domain.Models.Responses;
using MyProject.Domain.Models.User;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace MyProject.BusinessLayer.Core
{
    public class AuthActions
    {
        private readonly IMapper _mapper;

        public AuthActions()
        {
            _mapper = BusinessLogic.Mapper;
        }

        internal ActionResponse<SessionUserDto> LoginActionExecution(LoginRequestDto request)
        {
            var normalizedEmail = NormalizeEmail(request.Email);
            using (var db = new UserContext())
            {
                var user = db.Users.FirstOrDefault(candidate => candidate.Email == normalizedEmail);
                if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
                {
                    return Failed<SessionUserDto>(401, "Email sau parola incorecta.");
                }

                var response = _mapper.Map<SessionUserDto>(user);
                response.Token = GenerateJwtToken(user);
                return Success(response);
            }
        }

        internal ActionResponse<SessionUserDto> RegisterActionExecution(RegisterRequestDto request)
        {
            var normalizedEmail = NormalizeEmail(request.Email);
            if (string.IsNullOrWhiteSpace(request.FullName) ||
                string.IsNullOrWhiteSpace(normalizedEmail) ||
                string.IsNullOrWhiteSpace(request.Password))
            {
                return Failed<SessionUserDto>(400, "Full name, email si parola sunt obligatorii.");
            }

            using (var db = new UserContext())
            {
                var user = db.Users.FirstOrDefault(candidate => candidate.Email == normalizedEmail);
                if (user != null)
                {
                    return Failed<SessionUserDto>(409, "Exista deja un cont cu acest email.");
                }

                user = new UserData
                {
                    FullName = request.FullName.Trim(),
                    Email = normalizedEmail,
                    Phone = (request.Phone ?? string.Empty).Trim(),
                    BirthDate = (request.BirthDate ?? string.Empty).Trim(),
                    Password = BCrypt.Net.BCrypt.HashPassword(request.Password),
                    Role = "user"
                };

                try
                {
                    db.Users.Add(user);
                    db.SaveChanges();

                    var response = _mapper.Map<SessionUserDto>(user);
                    response.Token = GenerateJwtToken(user);
                    return Success(response, "Cont creat cu succes.");
                }
                catch (DbUpdateException)
                {
                    return Failed<SessionUserDto>(409, "Exista deja un cont cu acest email.");
                }
            }
        }

        internal StoredUserDto? GetCurrentUserActionExecution(string email)
        {
            var normalizedEmail = NormalizeEmail(email);
            using (var db = new UserContext())
            {
                var user = db.Users.FirstOrDefault(candidate => candidate.Email == normalizedEmail);

                if (user == null)
                {
                    return null;
                }

                return _mapper.Map<StoredUserDto>(user);
            }
        }

        internal ActionResponse<StoredUserDto> UpdateProfileActionExecution(UpdateUserProfileRequestDto request)
        {
            var currentEmail = NormalizeEmail(request.CurrentEmail);
            var nextEmail = NormalizeEmail(request.Email);
            using (var db = new UserContext())
            {
                var user = db.Users
                    .Include(candidate => candidate.Properties)
                    .FirstOrDefault(candidate => candidate.Email == currentEmail);

                if (user == null)
                {
                    return Failed<StoredUserDto>(404, "Nu exista utilizator autentificat.");
                }

                var duplicate = db.Users.FirstOrDefault(candidate =>
                    candidate.Email == nextEmail &&
                    candidate.Id != user.Id);

                if (duplicate != null)
                {
                    return Failed<StoredUserDto>(409, "Email-ul este deja folosit de alt cont.");
                }

                user.FullName = request.FullName.Trim();
                user.Email = nextEmail;
                user.Phone = (request.Phone ?? string.Empty).Trim();
                user.City = (request.City ?? string.Empty).Trim();
                user.Country = (request.Country ?? string.Empty).Trim();
                user.Bio = (request.Bio ?? string.Empty).Trim();

                foreach (var property in user.Properties)
                {
                    property.Host = user.FullName;
                    property.UpdatedAt = DateTime.UtcNow;
                }

                try
                {
                    db.SaveChanges();
                    return Success(_mapper.Map<StoredUserDto>(user), "Profil actualizat.");
                }
                catch (DbUpdateException)
                {
                    return Failed<StoredUserDto>(409, "Email-ul este deja folosit de alt cont.");
                }
            }
        }

        internal ActionResponse ChangePasswordActionExecution(ChangePasswordRequestDto request)
        {
            var normalizedEmail = NormalizeEmail(request.Email);
            using (var db = new UserContext())
            {
                var user = db.Users.FirstOrDefault(candidate => candidate.Email == normalizedEmail);

                if (user == null)
                {
                    return Failed(404, "Nu exista utilizator autentificat.");
                }

                if (!BCrypt.Net.BCrypt.Verify(request.CurrentPassword, user.Password))
                {
                    return Failed(401, "Parola curenta este incorecta.");
                }

                user.Password = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
                db.SaveChanges();
                return Success("Parola a fost schimbata.");
            }
        }

        internal List<StoredUserDto> GetAllUsersActionExecution()
        {
            using (var db = new UserContext())
            {
                var users = db.Users
                    .AsNoTracking()
                    .OrderBy(u => u.FullName)
                    .ToList();

                return _mapper.Map<List<StoredUserDto>>(users);
            }
        }

        internal ActionResponse UpdateUserRoleActionExecution(string email, string role)
        {
            using (var db = new UserContext())
            {
                var user = db.Users.FirstOrDefault(u => u.Email == NormalizeEmail(email));
                if (user == null) return Failed(404, "Utilizatorul nu a fost gasit.");

                user.Role = role.ToLower();
                db.SaveChanges();
                return Success("Rolul utilizatorului a fost actualizat.");
            }
        }

        internal ActionResponse DeleteUserActionExecution(string email)
        {
            var normalizedEmail = NormalizeEmail(email);
            using (var db = new UserContext())
            {
                var user = db.Users
                    .Include(candidate => candidate.Properties)
                    .Include(candidate => candidate.Bookings)
                    .FirstOrDefault(candidate => candidate.Email == normalizedEmail);

                if (user == null)
                {
                    return Failed(404, "Utilizatorul nu a fost gasit.");
                }

                db.Bookings.RemoveRange(user.Bookings);
                db.Properties.RemoveRange(user.Properties);
                db.Users.Remove(user);
                db.SaveChanges();
                return Success("Utilizatorul a fost sters.");
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

        private static ActionResponse<T> Success<T>(T data, string? message = null)
        {
            return new ActionResponse<T>
            {
                IsSuccess = true,
                Message = message,
                StatusCode = 200,
                Data = data
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

        private static ActionResponse<T> Failed<T>(int statusCode, string message)
        {
            return new ActionResponse<T>
            {
                IsSuccess = false,
                Message = message,
                StatusCode = statusCode
            };
        }

        private string GenerateJwtToken(UserData user)
        {
            var config = new ConfigurationBuilder()
                .SetBasePath(AppDomain.CurrentDomain.BaseDirectory)
                .AddJsonFile("appsettings.json")
                .Build();

            var jwtSettings = config.GetSection("Jwt");
            var key = Encoding.ASCII.GetBytes(jwtSettings["Key"]!);

            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Name, user.Email),
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Role, user.Role),
                    new Claim("userId", user.Id.ToString()),
                    new Claim("role", user.Role),
                    new Claim("fullName", user.FullName)
                }),
                Expires = DateTime.UtcNow.AddMinutes(double.Parse(jwtSettings["ExpiryMinutes"]!)),
                Issuer = jwtSettings["Issuer"],
                Audience = jwtSettings["Audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        private static string NormalizeEmail(string email)
        {
            return (email ?? string.Empty).Trim().ToLowerInvariant();
        }
    }
}
