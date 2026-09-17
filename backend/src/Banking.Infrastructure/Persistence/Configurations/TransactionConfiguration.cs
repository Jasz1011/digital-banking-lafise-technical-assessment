using Banking.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Banking.Infrastructure.Persistence.Configurations;

internal sealed class TransactionConfiguration : IEntityTypeConfiguration<Transaction>
{
    public void Configure(EntityTypeBuilder<Transaction> builder)
    {
        builder.ToTable(
            "Transactions",
            table =>
            {
                table.HasCheckConstraint("CK_Transactions_Amount_Positive", "Amount > 0");
                table.HasCheckConstraint(
                    "CK_Transactions_BalanceAfter_NonNegative",
                    "BalanceAfterTransaction >= 0");
            });

        builder.HasKey(transaction => transaction.Id);

        builder.Property(transaction => transaction.Type)
            .HasConversion<string>()
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(transaction => transaction.Amount)
            .HasPrecision(18, 2)
            .IsRequired();

        builder.Property(transaction => transaction.Timestamp)
            .IsRequired();

        builder.Property(transaction => transaction.BalanceAfterTransaction)
            .HasPrecision(18, 2)
            .IsRequired();

        builder.HasIndex(transaction => new { transaction.BankAccountId, transaction.Timestamp });
    }
}

