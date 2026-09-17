using Banking.Application.Accounts;

namespace Banking.Application.Abstractions.Services;

public interface IBankAccountService
{
    Task<BankAccountResponse> CreateAsync(
        CreateBankAccountRequest request,
        CancellationToken cancellationToken);

    Task<BalanceResponse> GetBalanceAsync(
        string accountNumber,
        CancellationToken cancellationToken);
}

