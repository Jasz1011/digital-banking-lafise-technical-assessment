class BankAccount {
  const BankAccount({
    required this.id,
    required this.accountNumber,
    required this.customerId,
    required this.balance,
    required this.createdAt,
  });

  factory BankAccount.fromJson(Map<String, dynamic> json) => BankAccount(
    id: json['id'] as String,
    accountNumber: json['accountNumber'] as String,
    customerId: json['customerId'] as String,
    balance: (json['balance'] as num).toDouble(),
    createdAt: DateTime.parse(json['createdAt'] as String),
  );

  final String id;
  final String accountNumber;
  final String customerId;
  final double balance;
  final DateTime createdAt;
}

class CreateBankAccountInput {
  const CreateBankAccountInput({
    required this.customerId,
    required this.initialBalance,
  });

  final String customerId;
  final double initialBalance;

  Map<String, dynamic> toJson() => {
    'customerId': customerId.trim(),
    'initialBalance': initialBalance,
  };
}

class AccountBalance {
  const AccountBalance({required this.accountNumber, required this.balance});

  factory AccountBalance.fromJson(Map<String, dynamic> json) => AccountBalance(
    accountNumber: json['accountNumber'] as String,
    balance: (json['balance'] as num).toDouble(),
  );

  final String accountNumber;
  final double balance;
}
