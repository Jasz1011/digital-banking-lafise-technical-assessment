using Banking.Application.Abstractions.Persistence;
using Banking.Domain.Entities;

namespace Banking.UnitTests.TestDoubles;

internal sealed class InMemoryCustomerRepository : ICustomerRepository
{
    public List<Customer> Customers { get; } = [];

    public Task<bool> ExistsAsync(Guid customerId, CancellationToken cancellationToken) =>
        Task.FromResult(Customers.Any(customer => customer.Id == customerId));

    public Task AddAsync(Customer customer, CancellationToken cancellationToken)
    {
        Customers.Add(customer);
        return Task.CompletedTask;
    }
}

internal sealed class InMemoryBankAccountRepository : IBankAccountRepository
{
    public List<BankAccount> Accounts { get; } = [];

    public Task<BankAccount?> GetByAccountNumberAsync(
        string accountNumber,
        CancellationToken cancellationToken) =>
        Task.FromResult(Accounts.SingleOrDefault(account => account.AccountNumber == accountNumber));

    public Task<bool> AccountNumberExistsAsync(
        string accountNumber,
        CancellationToken cancellationToken) =>
        Task.FromResult(Accounts.Any(account => account.AccountNumber == accountNumber));

    public Task AddAsync(BankAccount account, CancellationToken cancellationToken)
    {
        Accounts.Add(account);
        return Task.CompletedTask;
    }
}

internal sealed class InMemoryTransactionRepository(
    InMemoryBankAccountRepository bankAccountRepository) : ITransactionRepository
{
    public List<Transaction> Transactions { get; } = [];

    public Task AddAsync(Transaction transaction, CancellationToken cancellationToken)
    {
        Transactions.Add(transaction);
        return Task.CompletedTask;
    }

    public Task<IReadOnlyList<Transaction>> GetByAccountNumberAsync(
        string accountNumber,
        CancellationToken cancellationToken)
    {
        var account = bankAccountRepository.Accounts.Single(
            candidate => candidate.AccountNumber == accountNumber);
        IReadOnlyList<Transaction> result = Transactions
            .Where(transaction => transaction.BankAccountId == account.Id)
            .OrderBy(transaction => transaction.Timestamp)
            .ThenBy(transaction => transaction.Id)
            .ToList();

        return Task.FromResult(result);
    }
}

internal sealed class InMemoryUnitOfWork : IBankingUnitOfWork
{
    public int SaveCount { get; private set; }

    public Task SaveChangesAsync(CancellationToken cancellationToken)
    {
        SaveCount++;
        return Task.CompletedTask;
    }

    public async Task<T> ExecuteInTransactionAsync<T>(
        Func<CancellationToken, Task<T>> operation,
        CancellationToken cancellationToken)
    {
        var result = await operation(cancellationToken);
        SaveCount++;
        return result;
    }
}

