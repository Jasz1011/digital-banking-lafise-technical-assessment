using Banking.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Banking.Infrastructure.Persistence.Configurations;

internal sealed class CustomerConfiguration : IEntityTypeConfiguration<Customer>
{
    public void Configure(EntityTypeBuilder<Customer> builder)
    {
        builder.ToTable(
            "Customers",
            table => table.HasCheckConstraint(
                "CK_Customers_MonthlyIncome_NonNegative",
                "MonthlyIncome >= 0"));

        builder.HasKey(customer => customer.Id);

        builder.Property(customer => customer.FullName)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(customer => customer.BirthDate)
            .IsRequired();

        builder.Property(customer => customer.Gender)
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(customer => customer.MonthlyIncome)
            .HasPrecision(18, 2)
            .IsRequired();

        builder.Property(customer => customer.CreatedAt)
            .IsRequired();

        builder.HasMany(customer => customer.BankAccounts)
            .WithOne(account => account.Customer)
            .HasForeignKey(account => account.CustomerId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

