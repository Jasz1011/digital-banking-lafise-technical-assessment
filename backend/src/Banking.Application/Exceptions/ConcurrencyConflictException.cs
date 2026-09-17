namespace Banking.Application.Exceptions;

public sealed class ConcurrencyConflictException()
    : BankingApplicationException(
        "La cuenta fue modificada por otra operación. Consulte el saldo e intente nuevamente.");
