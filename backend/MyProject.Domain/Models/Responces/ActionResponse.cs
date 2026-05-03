namespace MyProject.Domain.Models.Responses
{
    public class ActionResponse
    {
        public bool IsSuccess { get; set; }

        public int StatusCode { get; set; } = 200;

        public string? Message { get; set; }
    }

    public class ActionResponse<T> : ActionResponse
    {
        public T? Data { get; set; }
    }
}
