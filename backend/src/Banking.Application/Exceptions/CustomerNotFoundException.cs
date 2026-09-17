namespace Banking.Application.Exceptions;

public sealed class CustomerNotFoundException(Guid customerId)
    : BankingApplicationException($"No se encontró el cliente con identificador '{customerId}'.");

