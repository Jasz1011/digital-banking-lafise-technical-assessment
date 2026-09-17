using System.ComponentModel.DataAnnotations;

namespace Banking.Application.Accounts;

public sealed record CreateBankAccountRequest(
    Guid CustomerId,
    [Range(typeof(decimal), "0", "79228162514264337593543950335")]
    decimal InitialBalance);
