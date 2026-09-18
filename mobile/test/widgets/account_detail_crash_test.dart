import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter/material.dart';
import 'package:digital_banking_lafise/features/accounts/presentation/account_detail_screen.dart';

void main() {
  testWidgets('AccountDetailScreen does not crash', (tester) async {
    await tester.pumpWidget(
      const ProviderScope(
        child: MaterialApp(
          home: AccountDetailScreen(accountNumber: 'ACC-20230101-1234'),
        ),
      ),
    );
    await tester.pumpAndSettle();
    expect(find.byType(AccountDetailScreen), findsOneWidget);
  });
}
