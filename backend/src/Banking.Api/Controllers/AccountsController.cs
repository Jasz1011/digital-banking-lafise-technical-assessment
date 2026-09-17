using Banking.Application.Abstractions.Services;
using Banking.Application.Accounts;
using Banking.Application.Transactions;
using Microsoft.AspNetCore.Mvc;

namespace Banking.Api.Controllers;

[ApiController]
[Route("api/accounts")]
[Produces("application/json")]
public sealed class AccountsController(
    IBankAccountService bankAccountService,
    ITransactionService transactionService) : ControllerBase
{
    /// <summary>Crea una cuenta para un cliente registrado.</summary>
    [HttpPost]
    [ProducesResponseType<BankAccountResponse>(StatusCodes.Status201Created)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<BankAccountResponse>> Create(
        [FromBody] CreateBankAccountRequest request,
        CancellationToken cancellationToken)
    {
        var response = await bankAccountService.CreateAsync(request, cancellationToken);
        return CreatedAtAction(
            nameof(GetBalance),
            new { accountNumber = response.AccountNumber },
            response);
    }

    /// <summary>Consulta el saldo actual por número de cuenta.</summary>
    [HttpGet("{accountNumber}/balance")]
    [ProducesResponseType<BalanceResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<BalanceResponse>> GetBalance(
        string accountNumber,
        CancellationToken cancellationToken) =>
        Ok(await bankAccountService.GetBalanceAsync(accountNumber, cancellationToken));

    /// <summary>Registra un depósito y devuelve el saldo resultante.</summary>
    [HttpPost("{accountNumber}/deposits")]
    [ProducesResponseType<BalanceResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<BalanceResponse>> Deposit(
        string accountNumber,
        [FromBody] DepositRequest request,
        CancellationToken cancellationToken) =>
        Ok(await transactionService.DepositAsync(
            accountNumber,
            request.Amount,
            cancellationToken));

    /// <summary>Registra un retiro cuando existen fondos suficientes.</summary>
    [HttpPost("{accountNumber}/withdrawals")]
    [ProducesResponseType<BalanceResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<BalanceResponse>> Withdraw(
        string accountNumber,
        [FromBody] WithdrawalRequest request,
        CancellationToken cancellationToken) =>
        Ok(await transactionService.WithdrawAsync(
            accountNumber,
            request.Amount,
            cancellationToken));

    /// <summary>Obtiene los movimientos de la cuenta en orden cronológico.</summary>
    [HttpGet("{accountNumber}/transactions")]
    [ProducesResponseType<IReadOnlyList<TransactionResponse>>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<IReadOnlyList<TransactionResponse>>> GetTransactions(
        string accountNumber,
        CancellationToken cancellationToken) =>
        Ok(await transactionService.GetHistoryAsync(accountNumber, cancellationToken));
}

