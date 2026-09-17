using Banking.Application.Abstractions.Persistence;
using Banking.Infrastructure.Persistence;
using Banking.Infrastructure.Persistence.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Banking.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("BankingDatabase")
            ?? throw new InvalidOperationException(
                "No se configuró la cadena de conexión 'BankingDatabase'.");

        services.AddDbContext<BankingDbContext>(options => options.UseSqlite(connectionString));
        services.AddScoped<ICustomerRepository, CustomerRepository>();
        services.AddScoped<IBankAccountRepository, BankAccountRepository>();
        services.AddScoped<ITransactionRepository, TransactionRepository>();
        services.AddScoped<IBankingUnitOfWork, BankingUnitOfWork>();

        return services;
    }
}
