using System.Text.RegularExpressions;
using Banking.Application.Services;
using Banking.UnitTests.TestDoubles;

namespace Banking.UnitTests;

public sealed partial class AccountNumberGeneratorTests
{
    private readonly AccountNumberGenerator _generator = new(
        new MutableTimeProvider(
            new DateTimeOffset(2026, 9, 17, 12, 30, 0, TimeSpan.Zero)));

    [Fact]
    public void Generate_Always_StartsWithAccPrefix()
    {
        var accountNumber = _generator.Generate();

        Assert.StartsWith("ACC-", accountNumber, StringComparison.Ordinal);
    }

    [Fact]
    public void Generate_Always_ContainsCurrentDate()
    {
        var accountNumber = _generator.Generate();

        Assert.Contains("20260917", accountNumber, StringComparison.Ordinal);
    }

    [Fact]
    public void Generate_Always_HasExpectedLength()
    {
        var accountNumber = _generator.Generate();

        Assert.Equal(17, accountNumber.Length);
    }

    [Fact]
    public void Generate_Always_HasExactlyFourTrailingDigits()
    {
        var accountNumber = _generator.Generate();

        Assert.Matches(FourTrailingDigitsRegex(), accountNumber);
    }

    [Fact]
    public void Generate_Always_HasCompleteExpectedFormat()
    {
        var accountNumber = _generator.Generate();

        Assert.Matches(CompleteFormatRegex(), accountNumber);
    }

    [Fact]
    public void Generate_RepeatedCalls_ProducesBasicUniqueness()
    {
        var accountNumbers = Enumerable.Range(0, 100)
            .Select(_ => _generator.Generate())
            .ToList();

        Assert.Equal(accountNumbers.Count, accountNumbers.Distinct().Count());
    }

    [GeneratedRegex(@"\d{4}$", RegexOptions.CultureInvariant)]
    private static partial Regex FourTrailingDigitsRegex();

    [GeneratedRegex(@"^ACC-20260917-\d{4}$", RegexOptions.CultureInvariant)]
    private static partial Regex CompleteFormatRegex();
}

