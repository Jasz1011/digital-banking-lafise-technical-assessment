using Banking.Domain.Enums;
using Banking.Domain.Exceptions;

namespace Banking.Domain.Entities;

public sealed class BankAccount
{
    private readonly List<Transaction> _transactions = [];

    private BankAccount()
    {
    }

    private BankAccount(
        Guid id,
        string accountNumber,
        Guid customerId,
        decimal balance,
        DateTime createdAt)
    {
        Id = id;
        AccountNumber = accountNumber;
        CustomerId = customerId;
        Balance = balance;
        CreatedAt = createdAt;
        Version = Guid.NewGuid();
    }

    public Guid Id { get; private set; }

    public string AccountNumber { get; private set; } = string.Empty;

    public Guid CustomerId { get; private set; }

    public decimal Balance { get; private set; }

    public DateTime CreatedAt { get; private set; }

    public Guid Version { get; private set; }

    public Customer Customer { get; private set; } = null!;

    public IReadOnlyCollection<Transaction> Transactions => _transactions.AsReadOnly();

    public static BankAccount Create(
        string accountNumber,
        Guid customerId,
        decimal initialBalance,
        DateTime createdAt)
    {
        if (string.IsNullOrWhiteSpace(accountNumber))
        {
            throw new DomainValidationException("El número de cuenta es obligatorio.");
        }

        if (customerId == Guid.Empty)
        {
            throw new DomainValidationException("El cliente es obligatorio.");
        }

        if (initialBalance < 0)
        {
            throw new DomainValidationException("El saldo inicial no puede ser negativo.");
        }

        return new BankAccount(
            Guid.NewGuid(),
            accountNumber,
            customerId,
            initialBalance,
            DateTime.SpecifyKind(createdAt, DateTimeKind.Utc));
    }

    public Transaction Deposit(decimal amount, DateTime timestamp)
    {
        EnsurePositiveAmount(amount);

        Balance += amount;
        Version = Guid.NewGuid();

        return Transaction.Create(Id, TransactionType.Deposit, amount, timestamp, Balance);
    }

    public Transaction Withdraw(decimal amount, DateTime timestamp)
    {
        EnsurePositiveAmount(amount);

        if (Balance < amount)
        {
            throw new InsufficientFundsException();
        }

        Balance -= amount;
        Version = Guid.NewGuid();

        return Transaction.Create(Id, TransactionType.Withdrawal, amount, timestamp, Balance);
    }

    private static void EnsurePositiveAmount(decimal amount)
    {
        if (amount <= 0)
        {
            throw new InvalidTransactionAmountException();
        }
    }
}
