using System.Net;
using System.Net.Http.Json;
using System.Text;
using Banking.Application.Accounts;
using Banking.Application.Customers;
using Banking.Application.Transactions;
using Banking.Domain.Entities;
using Banking.Infrastructure.Persistence;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Banking.IntegrationTests;

public sealed class BankingApiTests : IAsyncLifetime
{
    private readonly BankingApiFactory _factory = new();
    private HttpClient _client = null!;

    public async Task InitializeAsync()
    {
        await _factory.InitializeDatabaseAsync();
        _client = _factory.CreateClient();
    }

    public Task DisposeAsync()
    {
        _client.Dispose();
        _factory.Dispose();
        return Task.CompletedTask;
    }

    [Fact]
    public async Task PostCustomers_ValidRequest_ReturnsCreated()
    {
        var request = new CreateCustomerRequest(
            "María-José O'Ñate",
            new DateOnly(1990, 1, 1),
            "Femenino",
            0m);

        var response = await _client.PostAsJsonAsync("/api/customers", request);

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var customer = await response.Content.ReadFromJsonAsync<CustomerResponse>();
        Assert.NotNull(customer);
        Assert.Equal(request.FullName, customer.FullName);
        Assert.Equal(0m, customer.MonthlyIncome);
    }

    [Fact]
    public async Task PostCustomers_InvalidJson_ReturnsBadRequest()
    {
        using var content = new StringContent(
            "{ \"fullName\": ",
            Encoding.UTF8,
            "application/json");

        var response = await _client.PostAsync("/api/customers", content);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var problem = await response.Content.ReadFromJsonAsync<ValidationProblemDetails>();
        Assert.NotNull(problem);
        Assert.Equal(StatusCodes.Status400BadRequest, problem.Status);
        Assert.Equal("Solicitud inválida", problem.Title);
    }

    [Fact]
    public async Task PostAccounts_MalformedCustomerId_ReturnsBadRequest()
    {
        using var content = new StringContent(
            """
            { "customerId": "not-a-guid", "initialBalance": 0 }
            """,
            Encoding.UTF8,
            "application/json");

        var response = await _client.PostAsync("/api/accounts", content);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var problem = await response.Content.ReadFromJsonAsync<ValidationProblemDetails>();
        Assert.NotNull(problem);
        Assert.Equal(StatusCodes.Status400BadRequest, problem.Status);
        Assert.Equal("Solicitud inválida", problem.Title);
    }

    [Fact]
    public async Task GetBalance_UnknownAccount_ReturnsNotFoundProblemDetails()
    {
        var response = await _client.GetAsync("/api/accounts/ACC-20260917-9999/balance");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        var problem = await response.Content.ReadFromJsonAsync<ProblemDetails>();
        Assert.NotNull(problem);
        Assert.Equal(StatusCodes.Status404NotFound, problem.Status);
        Assert.Equal("Cuenta no encontrada", problem.Title);
    }

    [Fact]
    public async Task PostWithdrawal_InsufficientFunds_ReturnsBadRequestProblemDetails()
    {
        var account = await CreateAccountAsync(100m);

        var response = await _client.PostAsJsonAsync(
            $"/api/accounts/{account.AccountNumber}/withdrawals",
            new WithdrawalRequest(100.01m));

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var problem = await response.Content.ReadFromJsonAsync<ProblemDetails>();
        Assert.NotNull(problem);
        Assert.Equal(StatusCodes.Status400BadRequest, problem.Status);
        Assert.Equal("Fondos insuficientes", problem.Title);
    }

    [Fact]
    public async Task SaveChanges_DuplicateAccountNumber_ThrowsUniqueConstraintViolation()
    {
        using var scope = _factory.Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<BankingDbContext>();
        var createdAt = new DateTime(2026, 9, 17, 15, 0, 0, DateTimeKind.Utc);
        var customer = Customer.Create(
            "Cliente de Integración",
            new DateOnly(1990, 1, 1),
            "No especificado",
            0m,
            createdAt,
            new DateOnly(2026, 9, 17));
        const string duplicateNumber = "ACC-20260917-4321";

        dbContext.Customers.Add(customer);
        dbContext.BankAccounts.Add(BankAccount.Create(
            duplicateNumber,
            customer.Id,
            0m,
            createdAt));
        await dbContext.SaveChangesAsync();

        dbContext.BankAccounts.Add(BankAccount.Create(
            duplicateNumber,
            customer.Id,
            0m,
            createdAt));

        var exception = await Assert.ThrowsAsync<DbUpdateException>(
            () => dbContext.SaveChangesAsync());
        var sqliteException = Assert.IsType<SqliteException>(exception.InnerException);
        Assert.Equal(19, sqliteException.SqliteErrorCode);
        Assert.Equal(2067, sqliteException.SqliteExtendedErrorCode);
        Assert.Contains("BankAccounts.AccountNumber", sqliteException.Message);
    }

    [Fact]
    public async Task PostCustomers_FullNameExceedsConfiguredLength_ReturnsBadRequest()
    {
        var request = new CreateCustomerRequest(
            new string('A', 201),
            new DateOnly(1990, 1, 1),
            "Femenino",
            1m);

        var response = await _client.PostAsJsonAsync("/api/customers", request);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var problem = await response.Content.ReadFromJsonAsync<ValidationProblemDetails>();
        Assert.NotNull(problem);
        Assert.Contains(nameof(CreateCustomerRequest.FullName), problem.Errors.Keys);
    }

    [Fact]
    public async Task PostCustomers_GenderExceedsConfiguredLength_ReturnsBadRequest()
    {
        var request = new CreateCustomerRequest(
            "María Elena Ruiz",
            new DateOnly(1990, 1, 1),
            new string('A', 51),
            1m);

        var response = await _client.PostAsJsonAsync("/api/customers", request);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var problem = await response.Content.ReadFromJsonAsync<ValidationProblemDetails>();
        Assert.NotNull(problem);
        Assert.Contains(nameof(CreateCustomerRequest.Gender), problem.Errors.Keys);
    }

    private async Task<BankAccountResponse> CreateAccountAsync(decimal initialBalance)
    {
        var customerRequest = new CreateCustomerRequest(
            "Cliente para cuenta",
            new DateOnly(1990, 1, 1),
            "No especificado",
            25_000m);
        var customerResponse = await _client.PostAsJsonAsync("/api/customers", customerRequest);
        customerResponse.EnsureSuccessStatusCode();
        var customer = await customerResponse.Content.ReadFromJsonAsync<CustomerResponse>();
        Assert.NotNull(customer);

        var accountResponse = await _client.PostAsJsonAsync(
            "/api/accounts",
            new CreateBankAccountRequest(customer.Id, initialBalance));
        accountResponse.EnsureSuccessStatusCode();
        var account = await accountResponse.Content.ReadFromJsonAsync<BankAccountResponse>();
        Assert.NotNull(account);
        return account;
    }
}
