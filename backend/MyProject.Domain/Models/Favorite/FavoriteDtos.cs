namespace MyProject.Domain.Models.Favorite
{
    public class AddFavoriteRequestDto
    {
        public int PropertyId { get; set; }
    }

    public class FavoriteStatusDto
    {
        public bool IsFavorite { get; set; }
    }
}
