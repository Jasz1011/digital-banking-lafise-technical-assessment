using Banking.Application.Abstractions.Services;

namespace Banking.UnitTests.TestDoubles;

internal sealed class StubAccountNumberGenerator(params string[] accountNumbers)
    : IAccountNumberGenerator
{
    private readonly Queue<string> _accountNumbers = new(accountNumbers);

    public string Generate() => _accountNumbers.Dequeue();
}

