using System.Globalization;
using System.Security.Cryptography;
using Banking.Application.Abstractions.Services;
using Banking.Application.Exceptions;

namespace Banking.Application.Services;

public sealed class AccountNumberGenerator(TimeProvider timeProvider) : IAccountNumberGenerator
{
    private const int NumberSpace = 10_000;
    private readonly Lock _lock = new();
    private readonly HashSet<int> _issuedSuffixes = [];
    private DateOnly _activeDate;

    public string Generate()
    {
        var today = DateOnly.FromDateTime(timeProvider.GetLocalNow().DateTime);

        lock (_lock)
        {
            if (_activeDate != today)
            {
                _activeDate = today;
                _issuedSuffixes.Clear();
            }

            if (_issuedSuffixes.Count >= NumberSpace)
            {
                throw new DuplicateAccountNumberException();
            }

            int suffix;
            do
            {
                suffix = RandomNumberGenerator.GetInt32(NumberSpace);
            }
            while (!_issuedSuffixes.Add(suffix));

            return string.Create(
                CultureInfo.InvariantCulture,
                $"ACC-{today:yyyyMMdd}-{suffix:D4}");
        }
    }
}

