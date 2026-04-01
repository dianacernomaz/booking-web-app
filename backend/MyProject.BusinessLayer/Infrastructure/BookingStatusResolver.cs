namespace MyProject.BusinessLayer.Infrastructure;

internal static class BookingStatusResolver
{
    public static string Resolve(string checkIn, string checkOut, string? currentStatus)
    {
        if (string.Equals(currentStatus, "cancelled", StringComparison.OrdinalIgnoreCase))
        {
            return "cancelled";
        }

        if (!DateOnly.TryParse(checkIn, out var checkInDate) || !DateOnly.TryParse(checkOut, out var checkOutDate))
        {
            return currentStatus ?? "upcoming";
        }

        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        if (today < checkInDate)
        {
            return "upcoming";
        }

        if (today >= checkOutDate)
        {
            return "completed";
        }

        return "active";
    }
}
