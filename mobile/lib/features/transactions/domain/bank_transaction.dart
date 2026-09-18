enum TransactionType { deposit, withdrawal }

class BankTransaction {
  const BankTransaction({
    required this.transactionId,
    required this.type,
    required this.amount,
    required this.timestamp,
    required this.balanceAfterTransaction,
  });

  factory BankTransaction.fromJson(Map<String, dynamic> json) =>
      BankTransaction(
        transactionId: json['transactionId'] as String,
        type: (json['type'] as String) == 'Deposit'
            ? TransactionType.deposit
            : TransactionType.withdrawal,
        amount: (json['amount'] as num).toDouble(),
        timestamp: DateTime.parse(json['timestamp'] as String),
        balanceAfterTransaction: (json['balanceAfterTransaction'] as num)
            .toDouble(),
      );

  final String transactionId;
  final TransactionType type;
  final double amount;
  final DateTime timestamp;
  final double balanceAfterTransaction;
}

enum MovementKind { deposit, withdrawal }
