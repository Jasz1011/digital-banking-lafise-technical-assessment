using Banking.Application.Services;
using Banking.Domain.Entities;

namespace Banking.UnitTests.TestDoubles;

internal sealed class BankingServiceFixture
{
    private const string DefaultAccountNumber = "ACC-20260917-4821";

    public MutableTimeProvider TimeProvider { get; } =
        new(new DateTimeOffset(2026, 9, 17, 15, 0, 0, TimeSpan.Zero));

    public InMemoryCustomerRepository Customers { get; } = new();

    public InMemoryBankAccountRepository Accounts { get; } = new();

    public InMemoryTransactionRepository Transactions { get; }

    public InMemoryUnitOfWork UnitOfWork { get; } = new();

    public TransactionService TransactionService { get; }

    public Customer Customer { get; }

    public BankAccount Account { get; }

    public BankingServiceFixture(decimal initialBalance = 1_000m)
    {
        Transactions = new InMemoryTransactionRepository(Accounts);
        TransactionService = new TransactionService(
            Accounts,
            Transactions,
            UnitOfWork,
            TimeProvider);

        Customer = Customer.Create(
            "Ana Lucía Martínez",
            new DateOnly(1990, 4, 12),
            "Femenino",
            35_000m,
            TimeProvider.GetUtcNow().UtcDateTime,
            new DateOnly(2026, 9, 17));
        Customers.Customers.Add(Customer);

        Account = BankAccount.Create(
            DefaultAccountNumber,
            Customer.Id,
            initialBalance,
            TimeProvider.GetUtcNow().UtcDateTime);
        Accounts.Accounts.Add(Account);
    }
}
