using Banking.Domain.Exceptions;

namespace Banking.Domain.Entities;

public sealed class Customer
{
    private readonly List<BankAccount> _bankAccounts = [];

    private Customer()
    {
    }

    private Customer(
        Guid id,
        string fullName,
        DateOnly birthDate,
        string gender,
        decimal monthlyIncome,
        DateTime createdAt)
    {
        Id = id;
        FullName = fullName;
        BirthDate = birthDate;
        Gender = gender;
        MonthlyIncome = monthlyIncome;
        CreatedAt = createdAt;
    }

    public Guid Id { get; private set; }

    public string FullName { get; private set; } = string.Empty;

    public DateOnly BirthDate { get; private set; }

    public string Gender { get; private set; } = string.Empty;

    public decimal MonthlyIncome { get; private set; }

    public DateTime CreatedAt { get; private set; }

    public IReadOnlyCollection<BankAccount> BankAccounts => _bankAccounts.AsReadOnly();

    public static Customer Create(
        string fullName,
        DateOnly birthDate,
        string gender,
        decimal monthlyIncome,
        DateTime createdAt,
        DateOnly currentDate)
    {
        var normalizedName = fullName?.Trim();
        var normalizedGender = gender?.Trim();

        if (string.IsNullOrWhiteSpace(normalizedName))
        {
            throw new DomainValidationException("El nombre completo es obligatorio.");
        }

        if (birthDate == default)
        {
            throw new DomainValidationException("La fecha de nacimiento es obligatoria.");
        }

        if (birthDate > currentDate)
        {
            throw new DomainValidationException("La fecha de nacimiento no puede ser futura.");
        }

        if (string.IsNullOrWhiteSpace(normalizedGender))
        {
            throw new DomainValidationException("El género es obligatorio.");
        }

        if (monthlyIncome < 0)
        {
            throw new DomainValidationException("Los ingresos mensuales no pueden ser negativos.");
        }

        return new Customer(
            Guid.NewGuid(),
            normalizedName,
            birthDate,
            normalizedGender,
            monthlyIncome,
            DateTime.SpecifyKind(createdAt, DateTimeKind.Utc));
    }
}
