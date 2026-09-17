using Banking.Application.Accounts;
using Banking.Application.Exceptions;
using Banking.Application.Services;
using Banking.Domain.Entities;
using Banking.UnitTests.TestDoubles;

namespace Banking.UnitTests;

public sealed class BankAccountServiceTests
{
    [Fact]
    public async Task CreateAccount_ExistingCustomer_CreatesAccount()
    {
        var context = CreateContext();

        var response = await context.Service.CreateAsync(
            new CreateBankAccountRequest(context.Customer.Id, 500m),
            CancellationToken.None);

        Assert.Equal(context.Customer.Id, response.CustomerId);
        Assert.Single(context.Accounts.Accounts);
        Assert.Equal(1, context.UnitOfWork.SaveCount);
    }

    [Fact]
    public async Task CreateAccount_UnknownCustomer_Throws()
    {
        var context = CreateContext();

        await Assert.ThrowsAsync<CustomerNotFoundException>(() =>
            context.Service.CreateAsync(
                new CreateBankAccountRequest(Guid.NewGuid(), 500m),
                CancellationToken.None));

        Assert.Empty(context.Accounts.Accounts);
    }

    [Fact]
    public async Task CreateAccount_GeneratesAccountNumber()
    {
        var context = CreateContext();

        var response = await context.Service.CreateAsync(
            new CreateBankAccountRequest(context.Customer.Id, 500m),
            CancellationToken.None);

        Assert.Equal("ACC-20260917-4821", response.AccountNumber);
    }

    [Fact]
    public async Task CreateAccount_ValidInitialBalance_PersistsBalance()
    {
        var context = CreateContext();

        var response = await context.Service.CreateAsync(
            new CreateBankAccountRequest(context.Customer.Id, 12_750.25m),
            CancellationToken.None);

        Assert.Equal(12_750.25m, response.Balance);
        Assert.Equal(12_750.25m, context.Accounts.Accounts.Single().Balance);
    }

    [Fact]
    public async Task CreateAccount_FirstNumberCollides_GeneratesAnotherNumber()
    {
        var context = CreateContext(
            "ACC-20260917-0001",
            "ACC-20260917-0002");
        context.Accounts.Accounts.Add(BankAccount.Create(
            "ACC-20260917-0001",
            context.Customer.Id,
            0m,
            context.TimeProvider.GetUtcNow().UtcDateTime));

        var response = await context.Service.CreateAsync(
            new CreateBankAccountRequest(context.Customer.Id, 500m),
            CancellationToken.None);

        Assert.Equal("ACC-20260917-0002", response.AccountNumber);
    }

    private static TestContext CreateContext(params string[] accountNumbers)
    {
        var timeProvider = new MutableTimeProvider(
            new DateTimeOffset(2026, 9, 17, 15, 0, 0, TimeSpan.Zero));
        var customers = new InMemoryCustomerRepository();
        var accounts = new InMemoryBankAccountRepository();
        var unitOfWork = new InMemoryUnitOfWork();
        var customer = Customer.Create(
            "Carlos José López",
            new DateOnly(1985, 8, 20),
            "Masculino",
            48_000m,
            timeProvider.GetUtcNow().UtcDateTime,
            new DateOnly(2026, 9, 17));
        customers.Customers.Add(customer);

        var generatedNumbers = accountNumbers.Length == 0
            ? ["ACC-20260917-4821"]
            : accountNumbers;
        var service = new BankAccountService(
            customers,
            accounts,
            unitOfWork,
            new StubAccountNumberGenerator(generatedNumbers),
            timeProvider);

        return new TestContext(
            service,
            customers,
            accounts,
            unitOfWork,
            timeProvider,
            customer);
    }

    private sealed record TestContext(
        BankAccountService Service,
        InMemoryCustomerRepository Customers,
        InMemoryBankAccountRepository Accounts,
        InMemoryUnitOfWork UnitOfWork,
        MutableTimeProvider TimeProvider,
        Customer Customer);
}

