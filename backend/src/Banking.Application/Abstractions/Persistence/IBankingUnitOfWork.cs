namespace Banking.Application.Abstractions.Persistence;

public interface IBankingUnitOfWork
{
    Task SaveChangesAsync(CancellationToken cancellationToken);

    Task<T> ExecuteInTransactionAsync<T>(
        Func<CancellationToken, Task<T>> operation,
        CancellationToken cancellationToken);
}

