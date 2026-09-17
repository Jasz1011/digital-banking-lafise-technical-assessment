using Banking.Application.Abstractions.Persistence;
using Banking.Application.Exceptions;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

namespace Banking.Infrastructure.Persistence;

internal sealed class BankingUnitOfWork(BankingDbContext dbContext) : IBankingUnitOfWork
{
    public Task SaveChangesAsync(CancellationToken cancellationToken) =>
        SaveChangesCoreAsync(cancellationToken);

    public async Task<T> ExecuteInTransactionAsync<T>(
        Func<CancellationToken, Task<T>> operation,
        CancellationToken cancellationToken)
    {
        await using var databaseTransaction = await dbContext.Database.BeginTransactionAsync(
            cancellationToken);

        try
        {
            var result = await operation(cancellationToken);
            await SaveChangesCoreAsync(cancellationToken);
            await databaseTransaction.CommitAsync(cancellationToken);
            return result;
        }
        catch
        {
            await databaseTransaction.RollbackAsync(CancellationToken.None);
            throw;
        }
    }

    private async Task SaveChangesCoreAsync(CancellationToken cancellationToken)
    {
        try
        {
            await dbContext.SaveChangesAsync(cancellationToken);
        }
        catch (DbUpdateConcurrencyException)
        {
            throw new ConcurrencyConflictException();
        }
        catch (DbUpdateException exception) when (IsAccountNumberUniqueViolation(exception))
        {
            throw new DuplicateAccountNumberException();
        }
    }

    private static bool IsAccountNumberUniqueViolation(DbUpdateException exception) =>
        exception.InnerException is SqliteException
        {
            SqliteErrorCode: 19,
            SqliteExtendedErrorCode: 2067
        } sqliteException &&
        sqliteException.Message.Contains(
            "BankAccounts.AccountNumber",
            StringComparison.OrdinalIgnoreCase);
}
