namespace StayBooker.BusinessLayer.Common;

public sealed class ServiceResult<T>
{
    private ServiceResult(bool success, T? data, string? error)
    {
        Success = success;
        Data = data;
        Error = error;
    }

    public bool Success { get; }
    public T? Data { get; }
    public string? Error { get; }

    public static ServiceResult<T> Ok(T data) => new(true, data, null);
    public static ServiceResult<T> Fail(string error) => new(false, default, error);
}
