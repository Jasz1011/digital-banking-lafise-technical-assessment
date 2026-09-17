using Banking.Application.Abstractions.Services;
using Banking.Application.Customers;
using Microsoft.AspNetCore.Mvc;

namespace Banking.Api.Controllers;

[ApiController]
[Route("api/customers")]
[Produces("application/json")]
public sealed class CustomersController(ICustomerService customerService) : ControllerBase
{
    /// <summary>Registra el perfil de un cliente.</summary>
    [HttpPost]
    [ProducesResponseType<CustomerResponse>(StatusCodes.Status201Created)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<CustomerResponse>> Create(
        [FromBody] CreateCustomerRequest request,
        CancellationToken cancellationToken)
    {
        var response = await customerService.CreateAsync(request, cancellationToken);
        return StatusCode(StatusCodes.Status201Created, response);
    }
}
