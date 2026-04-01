namespace MyProject.BusinessLayer.Common;

public class ServiceResult
{
    public bool Succeeded { get; init; }

    public string? Error { get; init; }

    public ServiceErrorType ErrorType { get; init; }

    public static ServiceResult Success() => new()
    {
        Succeeded = true
    };

    public static ServiceResult Failure(ServiceErrorType errorType, string error) => new()
    {
        Error = error,
        ErrorType = errorType
    };
}

public sealed class ServiceResult<T> : ServiceResult
{
    public T? Value { get; init; }

    public static ServiceResult<T> Success(T value) => new()
    {
        Succeeded = true,
        Value = value
    };

    public new static ServiceResult<T> Failure(ServiceErrorType errorType, string error) => new()
    {
        Error = error,
        ErrorType = errorType
    };
}
