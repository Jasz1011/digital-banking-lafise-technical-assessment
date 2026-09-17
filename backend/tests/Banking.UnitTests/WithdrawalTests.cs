using Banking.Domain.Enums;
using Banking.Domain.Exceptions;
using Banking.UnitTests.TestDoubles;

namespace Banking.UnitTests;

public sealed class WithdrawalTests
{
    [Fact]
    public async Task Withdraw_ValidAmount_DecreasesBalance()
    {
        var fixture = new BankingServiceFixture();

        var response = await fixture.TransactionService.WithdrawAsync(
            fixture.Account.AccountNumber,
            350m,
            CancellationToken.None);

        Assert.Equal(650m, fixture.Account.Balance);
        Assert.Equal(650m, response.Balance);
        var transaction = Assert.Single(fixture.Transactions.Transactions);
        Assert.Equal(TransactionType.Withdrawal, transaction.Type);
        Assert.Equal(350m, transaction.Amount);
        Assert.Equal(650m, transaction.BalanceAfterTransaction);
    }

    [Fact]
    public async Task Withdraw_ExactBalance_Succeeds()
    {
        var fixture = new BankingServiceFixture();

        var response = await fixture.TransactionService.WithdrawAsync(
            fixture.Account.AccountNumber,
            1_000m,
            CancellationToken.None);

        Assert.Equal(0m, response.Balance);
        Assert.Equal(0m, fixture.Account.Balance);
        var transaction = Assert.Single(fixture.Transactions.Transactions);
        Assert.Equal(0m, transaction.BalanceAfterTransaction);
    }

    [Fact]
    public async Task Withdraw_InsufficientFunds_Throws()
    {
        var fixture = new BankingServiceFixture();

        await Assert.ThrowsAsync<InsufficientFundsException>(() =>
            fixture.TransactionService.WithdrawAsync(
                fixture.Account.AccountNumber,
                1_000.01m,
                CancellationToken.None));

        Assert.Equal(1_000m, fixture.Account.Balance);
        Assert.Empty(fixture.Transactions.Transactions);
        Assert.Equal(0, fixture.UnitOfWork.SaveCount);
    }

    [Fact]
    public async Task Withdraw_ZeroAmount_Throws()
    {
        var fixture = new BankingServiceFixture();

        await Assert.ThrowsAsync<InvalidTransactionAmountException>(() =>
            fixture.TransactionService.WithdrawAsync(
                fixture.Account.AccountNumber,
                0m,
                CancellationToken.None));

        Assert.Equal(1_000m, fixture.Account.Balance);
        Assert.Empty(fixture.Transactions.Transactions);
    }

    [Fact]
    public async Task Withdraw_NegativeAmount_Throws()
    {
        var fixture = new BankingServiceFixture();

        await Assert.ThrowsAsync<InvalidTransactionAmountException>(() =>
            fixture.TransactionService.WithdrawAsync(
                fixture.Account.AccountNumber,
                -1m,
                CancellationToken.None));

        Assert.Equal(1_000m, fixture.Account.Balance);
        Assert.Empty(fixture.Transactions.Transactions);
    }
}

