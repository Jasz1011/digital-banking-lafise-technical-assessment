using Banking.Domain.Enums;

namespace Banking.Domain.Entities;

public sealed class Transaction
{
    private Transaction()
    {
    }

    private Transaction(
        Guid id,
        Guid bankAccountId,
        TransactionType type,
        decimal amount,
        DateTime timestamp,
        decimal balanceAfterTransaction)
    {
        Id = id;
        BankAccountId = bankAccountId;
        Type = type;
        Amount = amount;
        Timestamp = timestamp;
        BalanceAfterTransaction = balanceAfterTransaction;
    }

    public Guid Id { get; private set; }

    public Guid BankAccountId { get; private set; }

    public TransactionType Type { get; private set; }

    public decimal Amount { get; private set; }

    public DateTime Timestamp { get; private set; }

    public decimal BalanceAfterTransaction { get; private set; }

    public BankAccount BankAccount { get; private set; } = null!;

    internal static Transaction Create(
        Guid bankAccountId,
        TransactionType type,
        decimal amount,
        DateTime timestamp,
        decimal balanceAfterTransaction) =>
        new(
            Guid.NewGuid(),
            bankAccountId,
            type,
            amount,
            DateTime.SpecifyKind(timestamp, DateTimeKind.Utc),
            balanceAfterTransaction);
}

