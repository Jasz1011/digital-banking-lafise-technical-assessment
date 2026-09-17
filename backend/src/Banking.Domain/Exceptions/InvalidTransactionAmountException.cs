namespace Banking.Domain.Exceptions;

public sealed class InvalidTransactionAmountException()
    : DomainException("El monto de la transacción debe ser mayor que cero.");

