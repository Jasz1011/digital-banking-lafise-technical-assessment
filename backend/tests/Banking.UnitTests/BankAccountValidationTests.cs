using Banking.Domain.Entities;
using Banking.Domain.Exceptions;

namespace Banking.UnitTests;

public sealed class BankAccountValidationTests
{
    [Fact]
    public void Create_NegativeInitialBalance_Throws()
    {
        Assert.Throws<DomainValidationException>(() => BankAccount.Create(
            "ACC-20260917-4821",
            Guid.NewGuid(),
            -0.01m,
            new DateTime(2026, 9, 17, 15, 0, 0, DateTimeKind.Utc)));
    }
}
