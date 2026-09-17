using Banking.Application.Abstractions.Persistence;
using Banking.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Banking.Infrastructure.Persistence.Repositories;

internal sealed class CustomerRepository(BankingDbContext dbContext) : ICustomerRepository
{
    public Task<bool> ExistsAsync(Guid customerId, CancellationToken cancellationToken) =>
        dbContext.Customers.AnyAsync(
            customer => customer.Id == customerId,
            cancellationToken);

    public async Task AddAsync(Customer customer, CancellationToken cancellationToken) =>
        await dbContext.Customers.AddAsync(customer, cancellationToken);
}

