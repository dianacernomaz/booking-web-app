namespace MyProject.Domain.Entities;

public sealed class ReviewEntity
{
    public required string Name { get; set; }

    public required string Date { get; set; }

    public int Rating { get; set; }

    public required string Color { get; set; }

    public required string Text { get; set; }
}
