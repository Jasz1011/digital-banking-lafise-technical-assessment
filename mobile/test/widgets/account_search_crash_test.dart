import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter/material.dart';
import 'package:digital_banking_lafise/features/accounts/presentation/account_search_screen.dart';

void main() {
  testWidgets('AccountSearchScreen does not crash', (tester) async {
    await tester.pumpWidget(
      const ProviderScope(
        child: MaterialApp(
          home: AccountSearchScreen(),
        ),
      ),
    );
    await tester.pumpAndSettle();
    expect(find.byType(AccountSearchScreen), findsOneWidget);
  });
}
