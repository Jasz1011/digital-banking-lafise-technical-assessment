using Banking.Domain.Entities;

namespace Banking.Application.Abstractions.Persistence;

public interface ITransactionRepository
{
    Task AddAsync(Transaction transaction, CancellationToken cancellationToken);

    Task<IReadOnlyList<Transaction>> GetByAccountNumberAsync(
        string accountNumber,
        CancellationToken cancellationToken);
}

