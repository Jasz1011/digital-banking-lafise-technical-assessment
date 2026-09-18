import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../features/accounts/domain/bank_account.dart';
import '../features/accounts/presentation/account_created_screen.dart';
import '../features/accounts/presentation/account_detail_screen.dart';
import '../features/accounts/presentation/account_search_screen.dart';
import '../features/accounts/presentation/create_account_screen.dart';
import '../features/customers/domain/customer.dart';
import '../features/customers/presentation/create_customer_screen.dart';
import '../features/customers/presentation/customer_created_screen.dart';
import '../features/home/presentation/home_screen.dart';
import 'app_shell.dart';

final appRouter = GoRouter(
  initialLocation: '/',
  routes: [
    ShellRoute(
      builder: (context, state, child) =>
          AppShell(currentPath: state.uri.path, child: child),
      routes: [
        GoRoute(path: '/', builder: (context, state) => const HomeScreen()),
        GoRoute(
          path: '/clientes/nuevo',
          builder: (context, state) => const CreateCustomerScreen(),
        ),
        GoRoute(
          path: '/clientes/creado',
          builder: (context, state) {
            final customer = state.extra;
            return customer is Customer
                ? CustomerCreatedScreen(customer: customer)
                : const CreateCustomerScreen();
          },
        ),
        GoRoute(
          path: '/cuentas/nueva',
          builder: (context, state) => CreateAccountScreen(
            customerId: state.uri.queryParameters['customerId'] ?? '',
          ),
        ),
        GoRoute(
          path: '/cuentas/creada',
          builder: (context, state) {
            final account = state.extra;
            return account is BankAccount
                ? AccountCreatedScreen(account: account)
                : const CreateAccountScreen();
          },
        ),
        GoRoute(
          path: '/cuentas/buscar',
          builder: (context, state) => const AccountSearchScreen(),
        ),
        GoRoute(
          path: '/cuentas/:accountNumber',
          builder: (context, state) => AccountDetailScreen(
            accountNumber: state.pathParameters['accountNumber'] ?? '',
          ),
        ),
      ],
    ),
  ],
  errorBuilder: (context, state) => Scaffold(
    body: Center(
      child: TextButton(
        onPressed: () => context.go('/'),
        child: const Text('Volver al inicio'),
      ),
    ),
  ),
);
