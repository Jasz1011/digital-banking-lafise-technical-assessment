using Banking.Application.Abstractions.Persistence;
using Banking.Application.Abstractions.Services;
using Banking.Application.Customers;
using Banking.Domain.Entities;

namespace Banking.Application.Services;

public sealed class CustomerService(
    ICustomerRepository customerRepository,
    IBankingUnitOfWork unitOfWork,
    TimeProvider timeProvider) : ICustomerService
{
    public async Task<CustomerResponse> CreateAsync(
        CreateCustomerRequest request,
        CancellationToken cancellationToken)
    {
        var createdAt = timeProvider.GetUtcNow().UtcDateTime;
        var currentDate = DateOnly.FromDateTime(timeProvider.GetLocalNow().DateTime);
        var customer = Customer.Create(
            request.FullName,
            request.BirthDate,
            request.Gender,
            request.MonthlyIncome,
            createdAt,
            currentDate);

        await customerRepository.AddAsync(customer, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        return new CustomerResponse(
            customer.Id,
            customer.FullName,
            customer.BirthDate,
            customer.Gender,
            customer.MonthlyIncome,
            customer.CreatedAt);
    }
}

