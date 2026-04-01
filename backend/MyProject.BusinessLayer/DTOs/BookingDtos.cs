namespace MyProject.BusinessLayer.DTOs;

public sealed class BookingDto
{
    public required string Id { get; set; }

    public required string OwnerEmail { get; set; }

    public int PropertyId { get; set; }

    public required string PropertyTitle { get; set; }

    public required string PropertyLocation { get; set; }

    public required string PropertyImage { get; set; }

    public required string CheckIn { get; set; }

    public required string CheckOut { get; set; }

    public int Guests { get; set; }

    public int Nights { get; set; }

    public decimal Total { get; set; }

    public required string Status { get; set; }

    public required string Code { get; set; }

    public required string CreatedAt { get; set; }

    public string? PaymentMethod { get; set; }

    public string? PaymentStatus { get; set; }

    public string? PaymentLabel { get; set; }

    public string? PaymentLast4 { get; set; }

    public string? PaidAt { get; set; }
}

public sealed class CreateBookingRequestDto
{
    public required string OwnerEmail { get; set; }

    public int PropertyId { get; set; }

    public required string PropertyTitle { get; set; }

    public required string PropertyLocation { get; set; }

    public required string PropertyImage { get; set; }

    public required string CheckIn { get; set; }

    public required string CheckOut { get; set; }

    public int Guests { get; set; }

    public int Nights { get; set; }

    public decimal Total { get; set; }

    public required string Code { get; set; }

    public string? PaymentMethod { get; set; }

    public string? PaymentStatus { get; set; }

    public string? PaymentLabel { get; set; }

    public string? PaymentLast4 { get; set; }

    public string? PaidAt { get; set; }
}
