using Banking.Domain.Entities;

namespace Banking.Application.Abstractions.Persistence;

public interface ICustomerRepository
{
    Task<bool> ExistsAsync(Guid customerId, CancellationToken cancellationToken);

    Task AddAsync(Customer customer, CancellationToken cancellationToken);
}

