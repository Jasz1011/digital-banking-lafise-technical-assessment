namespace Banking.Domain.Exceptions;

public sealed class InsufficientFundsException()
    : DomainException("La cuenta no dispone de fondos suficientes para completar el retiro.");

