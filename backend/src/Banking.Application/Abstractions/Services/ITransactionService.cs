using Banking.Application.Accounts;
using Banking.Application.Transactions;

namespace Banking.Application.Abstractions.Services;

public interface ITransactionService
{
    Task<BalanceResponse> DepositAsync(
        string accountNumber,
        decimal amount,
        CancellationToken cancellationToken);

    Task<BalanceResponse> WithdrawAsync(
        string accountNumber,
        decimal amount,
        CancellationToken cancellationToken);

    Task<IReadOnlyList<TransactionResponse>> GetHistoryAsync(
        string accountNumber,
        CancellationToken cancellationToken);
}

