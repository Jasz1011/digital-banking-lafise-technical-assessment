using Banking.Application.Abstractions.Persistence;
using Banking.Application.Abstractions.Services;
using Banking.Application.Accounts;
using Banking.Application.Exceptions;
using Banking.Application.Transactions;

namespace Banking.Application.Services;

public sealed class TransactionService(
    IBankAccountRepository bankAccountRepository,
    ITransactionRepository transactionRepository,
    IBankingUnitOfWork unitOfWork,
    TimeProvider timeProvider) : ITransactionService
{
    public Task<BalanceResponse> DepositAsync(
        string accountNumber,
        decimal amount,
        CancellationToken cancellationToken) =>
        ExecuteMovementAsync(accountNumber, amount, isDeposit: true, cancellationToken);

    public Task<BalanceResponse> WithdrawAsync(
        string accountNumber,
        decimal amount,
        CancellationToken cancellationToken) =>
        ExecuteMovementAsync(accountNumber, amount, isDeposit: false, cancellationToken);

    public async Task<IReadOnlyList<TransactionResponse>> GetHistoryAsync(
        string accountNumber,
        CancellationToken cancellationToken)
    {
        var normalizedAccountNumber = Normalize(accountNumber);
        if (!await bankAccountRepository.AccountNumberExistsAsync(
                normalizedAccountNumber,
                cancellationToken))
        {
            throw new BankAccountNotFoundException(normalizedAccountNumber);
        }

        var transactions = await transactionRepository.GetByAccountNumberAsync(
            normalizedAccountNumber,
            cancellationToken);

        return transactions
            .Select(transaction => new TransactionResponse(
                transaction.Id,
                transaction.Type,
                transaction.Amount,
                transaction.Timestamp,
                transaction.BalanceAfterTransaction))
            .ToList();
    }

    private Task<BalanceResponse> ExecuteMovementAsync(
        string accountNumber,
        decimal amount,
        bool isDeposit,
        CancellationToken cancellationToken) =>
        unitOfWork.ExecuteInTransactionAsync(
            async transactionCancellationToken =>
            {
                var normalizedAccountNumber = Normalize(accountNumber);
                var account = await bankAccountRepository.GetByAccountNumberAsync(
                    normalizedAccountNumber,
                    transactionCancellationToken);

                if (account is null)
                {
                    throw new BankAccountNotFoundException(normalizedAccountNumber);
                }

                var timestamp = timeProvider.GetUtcNow().UtcDateTime;
                var transaction = isDeposit
                    ? account.Deposit(amount, timestamp)
                    : account.Withdraw(amount, timestamp);

                await transactionRepository.AddAsync(transaction, transactionCancellationToken);

                return new BalanceResponse(account.AccountNumber, account.Balance);
            },
            cancellationToken);

    private static string Normalize(string accountNumber) => accountNumber.Trim().ToUpperInvariant();
}

