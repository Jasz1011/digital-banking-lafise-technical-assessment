namespace Banking.Application.Customers;

public sealed record CustomerResponse(
    Guid Id,
    string FullName,
    DateOnly BirthDate,
    string Gender,
    decimal MonthlyIncome,
    DateTime CreatedAt);

