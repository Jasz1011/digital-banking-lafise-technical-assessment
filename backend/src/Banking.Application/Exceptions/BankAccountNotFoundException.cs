namespace Banking.Application.Exceptions;

public sealed class BankAccountNotFoundException(string accountNumber)
    : BankingApplicationException($"No se encontró la cuenta bancaria '{accountNumber}'.");

