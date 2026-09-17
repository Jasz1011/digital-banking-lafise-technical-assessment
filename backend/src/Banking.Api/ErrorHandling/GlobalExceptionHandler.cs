using Banking.Application.Exceptions;
using Banking.Domain.Exceptions;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace Banking.Api.ErrorHandling;

internal sealed class GlobalExceptionHandler(
    ILogger<GlobalExceptionHandler> logger) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        var (status, title, detail) = MapException(exception);

        if (status == StatusCodes.Status500InternalServerError)
        {
            logger.LogError(exception, "Error no controlado al procesar {Method} {Path}",
                httpContext.Request.Method,
                httpContext.Request.Path);
        }
        else
        {
            logger.LogInformation("Solicitud rechazada con estado {Status}: {ExceptionType}",
                status,
                exception.GetType().Name);
        }

        var problemDetails = new ProblemDetails
        {
            Type = GetProblemType(status),
            Title = title,
            Status = status,
            Detail = detail,
            Instance = httpContext.Request.Path
        };
        problemDetails.Extensions["traceId"] = httpContext.TraceIdentifier;

        httpContext.Response.StatusCode = status;
        httpContext.Response.ContentType = "application/problem+json";
        await httpContext.Response.WriteAsJsonAsync(problemDetails, cancellationToken);

        return true;
    }

    private static (int Status, string Title, string Detail) MapException(Exception exception) =>
        exception switch
        {
            CustomerNotFoundException => (
                StatusCodes.Status404NotFound,
                "Cliente no encontrado",
                exception.Message),
            BankAccountNotFoundException => (
                StatusCodes.Status404NotFound,
                "Cuenta no encontrada",
                exception.Message),
            InsufficientFundsException => (
                StatusCodes.Status400BadRequest,
                "Fondos insuficientes",
                exception.Message),
            InvalidTransactionAmountException => (
                StatusCodes.Status400BadRequest,
                "Monto inválido",
                exception.Message),
            DomainValidationException => (
                StatusCodes.Status400BadRequest,
                "Datos inválidos",
                exception.Message),
            DuplicateAccountNumberException => (
                StatusCodes.Status409Conflict,
                "Número de cuenta duplicado",
                exception.Message),
            ConcurrencyConflictException => (
                StatusCodes.Status409Conflict,
                "Conflicto de concurrencia",
                exception.Message),
            _ => (
                StatusCodes.Status500InternalServerError,
                "Error interno",
                "Ocurrió un error inesperado al procesar la solicitud.")
        };

    private static string GetProblemType(int status) => status switch
    {
        StatusCodes.Status400BadRequest =>
            "https://datatracker.ietf.org/doc/html/rfc9110#name-400-bad-request",
        StatusCodes.Status404NotFound =>
            "https://datatracker.ietf.org/doc/html/rfc9110#name-404-not-found",
        StatusCodes.Status409Conflict =>
            "https://datatracker.ietf.org/doc/html/rfc9110#name-409-conflict",
        _ => "https://datatracker.ietf.org/doc/html/rfc9110#name-500-internal-server-error"
    };
}

