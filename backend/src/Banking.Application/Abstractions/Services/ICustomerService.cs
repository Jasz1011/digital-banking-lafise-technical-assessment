using Banking.Application.Customers;

namespace Banking.Application.Abstractions.Services;

public interface ICustomerService
{
    Task<CustomerResponse> CreateAsync(
        CreateCustomerRequest request,
        CancellationToken cancellationToken);
}

