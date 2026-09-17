using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Banking.Infrastructure.Persistence;

public sealed class BankingDbContextFactory : IDesignTimeDbContextFactory<BankingDbContext>
{
    public BankingDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<BankingDbContext>();
        optionsBuilder.UseSqlite("Data Source=banking.db");
        return new BankingDbContext(optionsBuilder.Options);
    }
}

