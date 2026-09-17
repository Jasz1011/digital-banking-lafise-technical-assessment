using Banking.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Banking.Infrastructure.Persistence.Configurations;

internal sealed class BankAccountConfiguration : IEntityTypeConfiguration<BankAccount>
{
    public void Configure(EntityTypeBuilder<BankAccount> builder)
    {
        builder.ToTable(
            "BankAccounts",
            table => table.HasCheckConstraint(
                "CK_BankAccounts_Balance_NonNegative",
                "Balance >= 0"));

        builder.HasKey(account => account.Id);

        builder.Property(account => account.AccountNumber)
            .HasMaxLength(17)
            .IsRequired();

        builder.HasIndex(account => account.AccountNumber)
            .IsUnique();

        builder.Property(account => account.Balance)
            .HasPrecision(18, 2)
            .IsRequired();

        builder.Property(account => account.CreatedAt)
            .IsRequired();

        builder.Property(account => account.Version)
            .IsConcurrencyToken()
            .IsRequired();

        builder.HasMany(account => account.Transactions)
            .WithOne(transaction => transaction.BankAccount)
            .HasForeignKey(transaction => transaction.BankAccountId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

