namespace Banking.Application.Accounts;

public sealed record BankAccountResponse(
    Guid Id,
    string AccountNumber,
    Guid CustomerId,
    decimal Balance,
    DateTime CreatedAt);

