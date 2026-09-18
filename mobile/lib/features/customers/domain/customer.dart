class Customer {
  const Customer({
    required this.id,
    required this.fullName,
    required this.birthDate,
    required this.gender,
    required this.monthlyIncome,
    required this.createdAt,
  });

  factory Customer.fromJson(Map<String, dynamic> json) => Customer(
    id: json['id'] as String,
    fullName: json['fullName'] as String,
    birthDate: DateTime.parse(json['birthDate'] as String),
    gender: json['gender'] as String,
    monthlyIncome: (json['monthlyIncome'] as num).toDouble(),
    createdAt: DateTime.parse(json['createdAt'] as String),
  );

  final String id;
  final String fullName;
  final DateTime birthDate;
  final String gender;
  final double monthlyIncome;
  final DateTime createdAt;
}

class CreateCustomerInput {
  const CreateCustomerInput({
    required this.fullName,
    required this.birthDate,
    required this.gender,
    required this.monthlyIncome,
  });

  final String fullName;
  final DateTime birthDate;
  final String gender;
  final double monthlyIncome;

  Map<String, dynamic> toJson() => {
    'fullName': fullName.trim(),
    'birthDate': _isoDate(birthDate),
    'gender': gender.trim(),
    'monthlyIncome': monthlyIncome,
  };

  static String _isoDate(DateTime value) =>
      '${value.year.toString().padLeft(4, '0')}-${value.month.toString().padLeft(2, '0')}-${value.day.toString().padLeft(2, '0')}';
}
