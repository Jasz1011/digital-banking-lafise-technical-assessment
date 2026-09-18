import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter/material.dart';
import 'package:digital_banking_lafise/app/app_shell.dart';
import 'package:digital_banking_lafise/features/accounts/presentation/account_search_screen.dart';

void main() {
  testWidgets('AppShell + AccountSearchScreen does not crash', (tester) async {
    await tester.pumpWidget(
      const ProviderScope(
        child: MaterialApp(
          home: AppShell(
            currentPath: '/cuentas/buscar',
            child: AccountSearchScreen(),
          ),
        ),
      ),
    );
    await tester.pumpAndSettle();
    expect(find.byType(AccountSearchScreen), findsOneWidget);
  });
}
