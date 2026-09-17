using Banking.Domain.Enums;

namespace Banking.Application.Transactions;

public sealed record TransactionResponse(
    Guid TransactionId,
    TransactionType Type,
    decimal Amount,
    DateTime Timestamp,
    decimal BalanceAfterTransaction);

