using System.ComponentModel.DataAnnotations;

namespace Banking.Application.Customers;

public sealed record CreateCustomerRequest(
    [Required, MaxLength(200)] string FullName,
    DateOnly BirthDate,
    [Required, MaxLength(50)] string Gender,
    [Range(typeof(decimal), "0", "79228162514264337593543950335")]
    decimal MonthlyIncome);
