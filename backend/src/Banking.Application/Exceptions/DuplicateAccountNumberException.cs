namespace Banking.Application.Exceptions;

public sealed class DuplicateAccountNumberException()
    : BankingApplicationException("No fue posible generar un número de cuenta único. Intente nuevamente.");

