namespace MyProject.Domain.Models.Booking
{
    public class BookingDto
    {
        public string Id { get; set; } = string.Empty;

        public string OwnerEmail { get; set; } = string.Empty;

        public int PropertyId { get; set; }

        public string PropertyTitle { get; set; } = string.Empty;

        public string PropertyLocation { get; set; } = string.Empty;

        public string PropertyImage { get; set; } = string.Empty;

        public string CheckIn { get; set; } = string.Empty;

        public string CheckOut { get; set; } = string.Empty;

        public int Guests { get; set; }

        public int Nights { get; set; }

        public decimal Total { get; set; }

        public string Status { get; set; } = string.Empty;

        public string Code { get; set; } = string.Empty;

        public string CreatedAt { get; set; } = string.Empty;

        public string? PaymentMethod { get; set; }

        public string? PaymentStatus { get; set; }

        public string? PaymentLabel { get; set; }

        public string? PaymentLast4 { get; set; }

        public string? PaidAt { get; set; }
    }

    public class CreateBookingRequestDto
    {
        public string OwnerEmail { get; set; } = string.Empty;

        public int PropertyId { get; set; }

        public string PropertyTitle { get; set; } = string.Empty;

        public string PropertyLocation { get; set; } = string.Empty;

        public string PropertyImage { get; set; } = string.Empty;

        public string CheckIn { get; set; } = string.Empty;

        public string CheckOut { get; set; } = string.Empty;

        public int Guests { get; set; }

        public int Nights { get; set; }

        public decimal Total { get; set; }

        public string Code { get; set; } = string.Empty;

        public string? PaymentMethod { get; set; }

        public string? PaymentStatus { get; set; }

        public string? PaymentLabel { get; set; }

        public string? PaymentLast4 { get; set; }

        public string? PaidAt { get; set; }
    }
    public class PlatformStatsDto
    {
        public int TotalUsers { get; set; }

        public int TotalProperties { get; set; }

        public int PendingProperties { get; set; }

        public int TotalBookings { get; set; }

        public decimal TotalRevenue { get; set; }
    }
}
