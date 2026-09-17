using Banking.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Banking.Infrastructure.Persistence;

public sealed class BankingDbContext(DbContextOptions<BankingDbContext> options) : DbContext(options)
{
    public DbSet<Customer> Customers => Set<Customer>();

    public DbSet<BankAccount> BankAccounts => Set<BankAccount>();

    public DbSet<Transaction> Transactions => Set<Transaction>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(BankingDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }
}

