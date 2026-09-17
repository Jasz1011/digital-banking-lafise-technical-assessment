using System.ComponentModel.DataAnnotations;

namespace Banking.Application.Transactions;

public sealed record DepositRequest(
    [Range(typeof(decimal), "0.0000000000000000000000000001", "79228162514264337593543950335")]
    decimal Amount);
