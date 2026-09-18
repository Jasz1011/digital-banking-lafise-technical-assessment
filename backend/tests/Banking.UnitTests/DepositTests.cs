using Banking.Domain.Enums;
using Banking.Domain.Exceptions;
using Banking.Application.Exceptions;
using Banking.UnitTests.TestDoubles;

namespace Banking.UnitTests;

public sealed class DepositTests
{
    [Fact]
    public async Task Deposit_ValidAmount_IncreasesBalance()
    {
        var fixture = new BankingServiceFixture();

        var response = await fixture.TransactionService.DepositAsync(
            fixture.Account.AccountNumber,
            250m,
            CancellationToken.None);

        Assert.Equal(1_250m, fixture.Account.Balance);
        Assert.Equal(1_250m, response.Balance);
        var transaction = Assert.Single(fixture.Transactions.Transactions);
        Assert.Equal(TransactionType.Deposit, transaction.Type);
        Assert.Equal(250m, transaction.Amount);
        Assert.Equal(1_250m, transaction.BalanceAfterTransaction);
        Assert.Equal(1, fixture.UnitOfWork.SaveCount);
    }

    [Fact]
    public async Task Deposit_ZeroAmount_Throws()
    {
        var fixture = new BankingServiceFixture();

        await Assert.ThrowsAsync<InvalidTransactionAmountException>(() =>
            fixture.TransactionService.DepositAsync(
                fixture.Account.AccountNumber,
                0m,
                CancellationToken.None));

        Assert.Equal(1_000m, fixture.Account.Balance);
        Assert.Empty(fixture.Transactions.Transactions);
    }

    [Fact]
    public async Task Deposit_NegativeAmount_Throws()
    {
        var fixture = new BankingServiceFixture();

        await Assert.ThrowsAsync<InvalidTransactionAmountException>(() =>
            fixture.TransactionService.DepositAsync(
                fixture.Account.AccountNumber,
                -100m,
                CancellationToken.None));

        Assert.Equal(1_000m, fixture.Account.Balance);
        Assert.Empty(fixture.Transactions.Transactions);
    }

    [Fact]
    public async Task Deposit_UnknownAccount_Throws()
    {
        var fixture = new BankingServiceFixture();

        await Assert.ThrowsAsync<BankAccountNotFoundException>(() =>
            fixture.TransactionService.DepositAsync(
                "ACC-20260917-9999",
                100m,
                CancellationToken.None));

        Assert.Equal(1_000m, fixture.Account.Balance);
        Assert.Empty(fixture.Transactions.Transactions);
        Assert.Equal(0, fixture.UnitOfWork.SaveCount);
    }
}
