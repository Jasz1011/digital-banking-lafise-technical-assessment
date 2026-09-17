using Banking.Application.Abstractions.Persistence;
using Banking.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Banking.Infrastructure.Persistence.Repositories;

internal sealed class BankAccountRepository(BankingDbContext dbContext) : IBankAccountRepository
{
    public Task<BankAccount?> GetByAccountNumberAsync(
        string accountNumber,
        CancellationToken cancellationToken) =>
        dbContext.BankAccounts.SingleOrDefaultAsync(
            account => account.AccountNumber == accountNumber,
            cancellationToken);

    public Task<bool> AccountNumberExistsAsync(
        string accountNumber,
        CancellationToken cancellationToken) =>
        dbContext.BankAccounts.AnyAsync(
            account => account.AccountNumber == accountNumber,
            cancellationToken);

    public async Task AddAsync(BankAccount account, CancellationToken cancellationToken) =>
        await dbContext.BankAccounts.AddAsync(account, cancellationToken);
}

