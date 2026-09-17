using Banking.Domain.Enums;
using Banking.UnitTests.TestDoubles;

namespace Banking.UnitTests;

public sealed class TransactionHistoryTests
{
    [Fact]
    public async Task GetHistory_MultipleMovements_ReturnsChronologicalHistoricalBalances()
    {
        var fixture = new BankingServiceFixture();
        await fixture.TransactionService.DepositAsync(
            fixture.Account.AccountNumber,
            500m,
            CancellationToken.None);
        fixture.TimeProvider.Advance(TimeSpan.FromMinutes(1));
        await fixture.TransactionService.WithdrawAsync(
            fixture.Account.AccountNumber,
            200m,
            CancellationToken.None);

        var history = await fixture.TransactionService.GetHistoryAsync(
            fixture.Account.AccountNumber,
            CancellationToken.None);

        Assert.Collection(
            history,
            first =>
            {
                Assert.Equal(TransactionType.Deposit, first.Type);
                Assert.Equal(500m, first.Amount);
                Assert.Equal(1_500m, first.BalanceAfterTransaction);
            },
            second =>
            {
                Assert.Equal(TransactionType.Withdrawal, second.Type);
                Assert.Equal(200m, second.Amount);
                Assert.Equal(1_300m, second.BalanceAfterTransaction);
                Assert.True(second.Timestamp > history[0].Timestamp);
            });
    }
}

