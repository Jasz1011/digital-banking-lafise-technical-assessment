using Banking.Domain.Entities;

namespace Banking.Application.Abstractions.Persistence;

public interface IBankAccountRepository
{
    Task<BankAccount?> GetByAccountNumberAsync(
        string accountNumber,
        CancellationToken cancellationToken);

    Task<bool> AccountNumberExistsAsync(
        string accountNumber,
        CancellationToken cancellationToken);

    Task AddAsync(BankAccount account, CancellationToken cancellationToken);
}

