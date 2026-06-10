namespace MyProject.Domain.Models.Review
{
    public class ReviewDto
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public int PropertyId { get; set; }

        public string UserName { get; set; } = string.Empty;

        public int Rating { get; set; }

        public string Comment { get; set; } = string.Empty;

        public string CreatedAt { get; set; } = string.Empty;

        public string UpdatedAt { get; set; } = string.Empty;
    }

    public class UpsertReviewRequestDto
    {
        public int PropertyId { get; set; }

        public int Rating { get; set; }

        public string Comment { get; set; } = string.Empty;
    }

    public class ReviewAverageDto
    {
        public decimal Rating { get; set; }

        public int Count { get; set; }
    }

    public class ReviewStatusDto
    {
        public bool HasReviewed { get; set; }

        public ReviewDto? Review { get; set; }
    }
}
