using Banking.Application.Abstractions.Persistence;
using Banking.Application.Abstractions.Services;
using Banking.Application.Accounts;
using Banking.Application.Exceptions;
using Banking.Domain.Entities;

namespace Banking.Application.Services;

public sealed class BankAccountService(
    ICustomerRepository customerRepository,
    IBankAccountRepository bankAccountRepository,
    IBankingUnitOfWork unitOfWork,
    IAccountNumberGenerator accountNumberGenerator,
    TimeProvider timeProvider) : IBankAccountService
{
    private const int AccountNumberGenerationAttempts = 10;

    public async Task<BankAccountResponse> CreateAsync(
        CreateBankAccountRequest request,
        CancellationToken cancellationToken)
    {
        if (!await customerRepository.ExistsAsync(request.CustomerId, cancellationToken))
        {
            throw new CustomerNotFoundException(request.CustomerId);
        }

        var accountNumber = await GenerateUniqueAccountNumberAsync(cancellationToken);
        var account = BankAccount.Create(
            accountNumber,
            request.CustomerId,
            request.InitialBalance,
            timeProvider.GetUtcNow().UtcDateTime);

        await bankAccountRepository.AddAsync(account, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        return new BankAccountResponse(
            account.Id,
            account.AccountNumber,
            account.CustomerId,
            account.Balance,
            account.CreatedAt);
    }

    public async Task<BalanceResponse> GetBalanceAsync(
        string accountNumber,
        CancellationToken cancellationToken)
    {
        var normalizedAccountNumber = Normalize(accountNumber);
        var account = await bankAccountRepository.GetByAccountNumberAsync(
            normalizedAccountNumber,
            cancellationToken);

        if (account is null)
        {
            throw new BankAccountNotFoundException(normalizedAccountNumber);
        }

        return new BalanceResponse(account.AccountNumber, account.Balance);
    }

    private async Task<string> GenerateUniqueAccountNumberAsync(CancellationToken cancellationToken)
    {
        for (var attempt = 0; attempt < AccountNumberGenerationAttempts; attempt++)
        {
            var accountNumber = accountNumberGenerator.Generate();
            if (!await bankAccountRepository.AccountNumberExistsAsync(accountNumber, cancellationToken))
            {
                return accountNumber;
            }
        }

        throw new DuplicateAccountNumberException();
    }

    private static string Normalize(string accountNumber) => accountNumber.Trim().ToUpperInvariant();
}

