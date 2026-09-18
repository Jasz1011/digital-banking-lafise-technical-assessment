using Banking.Domain.Entities;
using Banking.Domain.Exceptions;

namespace Banking.UnitTests;

public sealed class CustomerValidationTests
{
    private static readonly DateTime CreatedAt =
        new(2026, 9, 17, 15, 0, 0, DateTimeKind.Utc);
    private static readonly DateOnly CurrentDate = new(2026, 9, 17);

    [Fact]
    public void Create_EmptyFullName_Throws()
    {
        Assert.Throws<DomainValidationException>(() => Customer.Create(
            string.Empty,
            new DateOnly(1990, 1, 1),
            "Femenino",
            20_000m,
            CreatedAt,
            CurrentDate));
    }

    [Fact]
    public void Create_WhitespaceFullName_Throws()
    {
        Assert.Throws<DomainValidationException>(() => Customer.Create(
            "   ",
            new DateOnly(1990, 1, 1),
            "Femenino",
            20_000m,
            CreatedAt,
            CurrentDate));
    }

    [Fact]
    public void Create_NameWithNicaraguanCharacters_Succeeds()
    {
        var customer = Customer.Create(
            "  María-José O'Ñate  ",
            new DateOnly(1990, 1, 1),
            "Femenino",
            20_000m,
            CreatedAt,
            CurrentDate);

        Assert.Equal("María-José O'Ñate", customer.FullName);
    }

    [Fact]
    public void Create_FutureBirthDate_Throws()
    {
        Assert.Throws<DomainValidationException>(() => Customer.Create(
            "María Elena Ruiz",
            CurrentDate.AddDays(1),
            "Femenino",
            20_000m,
            CreatedAt,
            CurrentDate));
    }

    [Fact]
    public void Create_MissingBirthDate_Throws()
    {
        Assert.Throws<DomainValidationException>(() => Customer.Create(
            "María Elena Ruiz",
            default,
            "Femenino",
            20_000m,
            CreatedAt,
            CurrentDate));
    }

    [Fact]
    public void Create_NegativeMonthlyIncome_Throws()
    {
        Assert.Throws<DomainValidationException>(() => Customer.Create(
            "María Elena Ruiz",
            new DateOnly(1990, 1, 1),
            "Femenino",
            -0.01m,
            CreatedAt,
            CurrentDate));
    }

    [Fact]
    public void Create_ZeroMonthlyIncome_Succeeds()
    {
        var customer = Customer.Create(
            "María Elena Ruiz",
            new DateOnly(1990, 1, 1),
            "Femenino",
            0m,
            CreatedAt,
            CurrentDate);

        Assert.Equal(0m, customer.MonthlyIncome);
    }

    [Fact]
    public void Create_EmptyGender_Throws()
    {
        Assert.Throws<DomainValidationException>(() => Customer.Create(
            "María Elena Ruiz",
            new DateOnly(1990, 1, 1),
            string.Empty,
            20_000m,
            CreatedAt,
            CurrentDate));
    }
}
