using Banking.Application.Abstractions.Persistence;
using Banking.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Banking.Infrastructure.Persistence.Repositories;

internal sealed class TransactionRepository(BankingDbContext dbContext) : ITransactionRepository
{
    public async Task AddAsync(Transaction transaction, CancellationToken cancellationToken) =>
        await dbContext.Transactions.AddAsync(transaction, cancellationToken);

    public async Task<IReadOnlyList<Transaction>> GetByAccountNumberAsync(
        string accountNumber,
        CancellationToken cancellationToken) =>
        await dbContext.Transactions
            .AsNoTracking()
            .Where(transaction => transaction.BankAccount.AccountNumber == accountNumber)
            .OrderBy(transaction => transaction.Timestamp)
            .ThenBy(transaction => transaction.Id)
            .ToListAsync(cancellationToken);
}

