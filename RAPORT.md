# Raport implementare laborator

## 1. Structura backend .NET pe 4 straturi

Am creat in folderul [backend/MyProject.sln](/C:/Users/Asus/Desktop/booking-web-app/backend/MyProject.sln) o solutie .NET impartita in:

- [MyProject.API](/C:/Users/Asus/Desktop/booking-web-app/backend/MyProject.API)
- [MyProject.BusinessLayer](/C:/Users/Asus/Desktop/booking-web-app/backend/MyProject.BusinessLayer)
- [MyProject.DataAccess](/C:/Users/Asus/Desktop/booking-web-app/backend/MyProject.DataAccess)
- [MyProject.Domain](/C:/Users/Asus/Desktop/booking-web-app/backend/MyProject.Domain)

Referintele configurate sunt:

- `MyProject.DataAccess -> MyProject.Domain`
- `MyProject.BusinessLayer -> MyProject.DataAccess`
- `MyProject.BusinessLayer -> MyProject.Domain`
- `MyProject.API -> MyProject.BusinessLayer`
- `MyProject.API -> MyProject.DataAccess`
- `MyProject.API -> MyProject.Domain`

## 2. Implementarea BusinessLayer

In `Domain` au fost definite entitatile principale:

- `UserEntity`
- `PropertyEntity`
- `BookingEntity`
- entitati auxiliare pentru facilitati, review-uri si puncte din apropiere

In `BusinessLayer` au fost definite DTO-uri pentru:

- autentificare si profil utilizator
- proprietati publice, detaliu proprietate si proprietati gestionate de gazda
- rezervari

Au fost implementate serviciile:

- `AuthService`
- `PropertyService`
- `BookingService`

Clasa [BusinessLogic.cs](/C:/Users/Asus/Desktop/booking-web-app/backend/MyProject.BusinessLayer/BusinessLogic.cs) expune centralizat aceste servicii, iar [DependencyInjection.cs](/C:/Users/Asus/Desktop/booking-web-app/backend/MyProject.BusinessLayer/DependencyInjection.cs) le inregistreaza in containerul DI.

Persistenta este `in-memory`, initializata cu date seed inspirate din mock data-ul frontendului.

## 3. Configurarea API

In [Program.cs](/C:/Users/Asus/Desktop/booking-web-app/backend/MyProject.API/Program.cs) am configurat:

- `Controllers`
- politica `CORS` pentru frontendul Vite (`http://localhost:5173`)
- `Swagger UI`
- inregistrarea `BusinessLayer`

Controller-ele implementate sunt:

- [AuthController.cs](/C:/Users/Asus/Desktop/booking-web-app/backend/MyProject.API/Controllers/AuthController.cs)
- [UsersController.cs](/C:/Users/Asus/Desktop/booking-web-app/backend/MyProject.API/Controllers/UsersController.cs)
- [PropertiesController.cs](/C:/Users/Asus/Desktop/booking-web-app/backend/MyProject.API/Controllers/PropertiesController.cs)
- [BookingsController.cs](/C:/Users/Asus/Desktop/booking-web-app/backend/MyProject.API/Controllers/BookingsController.cs)

Codurile HTTP folosite:

- `200 OK` pentru citire si update reusit
- `201 Created` pentru creare
- `204 No Content` pentru stergere si schimbare parola
- `400 Bad Request` pentru validari
- `401 Unauthorized` pentru login/parola invalida sau acces nepermis
- `404 Not Found` pentru resurse inexistente
- `409 Conflict` pentru email duplicat

## 4. Configurarea Axios in React

In frontend am adaugat:

- [axiosClient.ts](/C:/Users/Asus/Desktop/booking-web-app/frontend/src/providers/axiosClient.ts)
- [AxiosProvider.tsx](/C:/Users/Asus/Desktop/booking-web-app/frontend/src/providers/AxiosProvider.tsx)

Acestea implementeaza:

- instanta Axios comuna
- `context`
- `hook`
- `provider`
- interceptor global de `response`

Interceptorul:

- trateaza `401` prin curatarea sesiunii locale
- emite un eveniment global cu status si mesajul erorii

## 5. Inlocuirea mock data cu backend real

Serviciile frontend actualizate:

- [authService.ts](/C:/Users/Asus/Desktop/booking-web-app/frontend/src/services/authService.ts)
- [propertyService.ts](/C:/Users/Asus/Desktop/booking-web-app/frontend/src/services/propertyService.ts)
- [bookings.ts](/C:/Users/Asus/Desktop/booking-web-app/frontend/src/lib/bookings.ts)
- [managedProperties.ts](/C:/Users/Asus/Desktop/booking-web-app/frontend/src/lib/managedProperties.ts)

Paginile refactorizate pentru a consuma API:

- [Home.tsx](/C:/Users/Asus/Desktop/booking-web-app/frontend/src/Home.tsx)
- [SearchResults.tsx](/C:/Users/Asus/Desktop/booking-web-app/frontend/src/SearchResults.tsx)
- [Propertydetail.tsx](/C:/Users/Asus/Desktop/booking-web-app/frontend/src/Propertydetail.tsx)
- [MyProfile.tsx](/C:/Users/Asus/Desktop/booking-web-app/frontend/src/MyProfile.tsx)
- [MyBookings.tsx](/C:/Users/Asus/Desktop/booking-web-app/frontend/src/MyBookings.tsx)
- [MyProperties.tsx](/C:/Users/Asus/Desktop/booking-web-app/frontend/src/MyProperties.tsx)

Interfetele TypeScript au fost pastrate compatibile cu cele folosite deja in componente.

## 6. Rulare locala

Backend:

```powershell
cd backend
dotnet run --project .\MyProject.API
```

Frontend:

```powershell
cd frontend
copy .env.example .env
npm install
npm run dev
```

URL-uri utile:

- API: `http://localhost:5128/api`
- Swagger UI: `http://localhost:5128/swagger`
- Frontend Vite: `http://localhost:5173`

## 7. Verificare

Au fost verificate cu succes:

- `dotnet build backend/MyProject.sln`
- `npm run build` in `frontend`
