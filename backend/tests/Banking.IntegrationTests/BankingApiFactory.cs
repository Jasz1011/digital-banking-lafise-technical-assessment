using Banking.Infrastructure.Persistence;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace Banking.IntegrationTests;

internal sealed class BankingApiFactory : WebApplicationFactory<Program>
{
    private readonly string _databasePath = Path.Combine(
        Path.GetTempPath(),
        $"banking-integration-{Guid.NewGuid():N}.db");

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");
        builder.ConfigureServices(services =>
        {
            services.RemoveAll<BankingDbContext>();
            services.RemoveAll<DbContextOptions<BankingDbContext>>();
            services.AddDbContext<BankingDbContext>(options => options.UseSqlite(
                $"Data Source={_databasePath};Pooling=False"));
        });
    }

    public async Task InitializeDatabaseAsync()
    {
        using var scope = Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<BankingDbContext>();
        await dbContext.Database.MigrateAsync();
    }

    protected override void Dispose(bool disposing)
    {
        base.Dispose(disposing);

        if (File.Exists(_databasePath))
        {
            File.Delete(_databasePath);
        }
    }
}
