import 'package:digital_banking_lafise/core/theme/app_theme.dart';
import 'package:digital_banking_lafise/features/accounts/presentation/account_search_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets(
    'account search shows inline error for malformed account number',
    (tester) async {
      await tester.pumpWidget(
        ProviderScope(
          child: MaterialApp(
            theme: AppTheme.light,
            home: const Scaffold(body: AccountSearchScreen()),
          ),
        ),
      );

      await tester.enterText(
        find.byKey(const Key('accountNumberField')),
        '4821',
      );
      await tester.tap(find.byKey(const Key('searchAccountButton')));
      await tester.pump();

      expect(find.text('Usa el formato ACC-YYYYMMDD-XXXX.'), findsOneWidget);
    },
  );
}
