import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../app/providers.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/utils/formatters.dart';
import '../../../core/errors/api_error_parser.dart';
import '../../../core/widgets/financial_balance_card.dart';
import '../../transactions/domain/bank_transaction.dart';
import '../../transactions/presentation/movement_sheet.dart';
import '../../transactions/presentation/transaction_history.dart';

class AccountDetailScreen extends ConsumerWidget {
  const AccountDetailScreen({required this.accountNumber, super.key});

  final String accountNumber;

  Future<void> _openMovement(
    BuildContext context,
    WidgetRef ref,
    double balance,
    MovementKind kind,
  ) async {
    final completed = await showModalBottomSheet<bool>(
      context: context,
      isScrollControlled: true,
      useSafeArea: true,
      backgroundColor: AppColors.surface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (context) => MovementSheet(
        accountNumber: AppFormatters.account(accountNumber),
        balance: balance,
        kind: kind,
      ),
    );

    if (completed == true && context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            kind == MovementKind.deposit
                ? 'Depósito realizado. Saldo actualizado.'
                : 'Retiro realizado. Saldo actualizado.',
          ),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final normalized = AppFormatters.account(accountNumber);
    final balance = ref.watch(accountBalanceProvider(normalized));
    return balance.when(
      loading: () => const _AccountLoading(),
      error: (error, _) => _AccountError(
        error: error,
        onBack: () => context.go('/cuentas/buscar'),
        onRetry: () => ref.invalidate(accountBalanceProvider(normalized)),
      ),
      data: (data) => RefreshIndicator(
        color: AppColors.primary,
        onRefresh: () async {
          ref.invalidate(accountBalanceProvider(normalized));
          ref.invalidate(accountTransactionsProvider(normalized));
          await ref.read(accountBalanceProvider(normalized).future);
        },
        child: ListView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.fromLTRB(20, 20, 20, 38),
          children: [
            Center(
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 680),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Row(
                      children: [
                        IconButton(
                          tooltip: 'Volver a buscar',
                          onPressed: () => context.go('/cuentas/buscar'),
                          icon: const Icon(Icons.arrow_back_rounded),
                        ),
                        const SizedBox(width: 4),
                        const Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Cuenta de ahorro',
                                style: TextStyle(
                                  color: AppColors.textPrimary,
                                  fontWeight: FontWeight.w600,
                                  fontSize: 16,
                                ),
                              ),
                              Text(
                                'Desliza hacia abajo para actualizar',
                                style: TextStyle(fontSize: 10),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 14),
                    FinancialBalanceCard(
                      accountNumber: data.accountNumber,
                      balance: data.balance,
                      allowHideBalance: true,
                    ),
                    const SizedBox(height: 26),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Expanded(
                          child: _MovementAction(
                            label: 'Depositar',
                            icon: Icons.south_west_rounded,
                            color: AppColors.primaryDark,
                            background: AppColors.mint,
                            onTap: () => _openMovement(
                              context,
                              ref,
                              data.balance,
                              MovementKind.deposit,
                            ),
                          ),
                        ),
                        const SizedBox(width: 18),
                        Expanded(
                          child: _MovementAction(
                            label: 'Retirar',
                            icon: Icons.north_east_rounded,
                            color: AppColors.blue,
                            background: AppColors.cyanSoft,
                            onTap: () => _openMovement(
                              context,
                              ref,
                              data.balance,
                              MovementKind.withdrawal,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 30),
                    Container(
                      padding: const EdgeInsets.fromLTRB(18, 20, 18, 4),
                      decoration: BoxDecoration(
                        color: AppColors.surface,
                        borderRadius: BorderRadius.circular(26),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Expanded(
                                child: Text(
                                  'Movimientos recientes',
                                  style: Theme.of(
                                    context,
                                  ).textTheme.titleMedium,
                                ),
                              ),
                              IconButton(
                                tooltip: 'Actualizar movimientos',
                                onPressed: () => ref.invalidate(
                                  accountTransactionsProvider(normalized),
                                ),
                                icon: const Icon(
                                  Icons.refresh_rounded,
                                  size: 21,
                                ),
                              ),
                            ],
                          ),
                          TransactionHistory(accountNumber: normalized),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _MovementAction extends StatelessWidget {
  const _MovementAction({
    required this.label,
    required this.icon,
    required this.color,
    required this.background,
    required this.onTap,
  });

  final String label;
  final IconData icon;
  final Color color;
  final Color background;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) => Semantics(
    button: true,
    label: label,
    child: Material(
      color: Colors.transparent,
      child: InkWell(
        borderRadius: BorderRadius.circular(24),
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 18),
          decoration: BoxDecoration(
            color: background.withValues(alpha: 0.6),
            borderRadius: BorderRadius.circular(24),
            border: Border.all(color: background, width: 2),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: Colors.white,
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: color.withValues(alpha: 0.1),
                      blurRadius: 8,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Icon(icon, color: color, size: 22),
              ),
              const SizedBox(height: 12),
              Text(
                label,
                style: TextStyle(
                  color: color,
                  fontWeight: FontWeight.w700,
                  fontSize: 14,
                ),
              ),
            ],
          ),
        ),
      ),
    ),
  );
}

class _AccountLoading extends StatelessWidget {
  const _AccountLoading();

  @override
  Widget build(BuildContext context) => ListView(
    padding: const EdgeInsets.all(20),
    children: [
      const SizedBox(height: 28),
      Container(
        height: 238,
        decoration: BoxDecoration(
          color: AppColors.surfaceMuted,
          borderRadius: BorderRadius.circular(30),
        ),
      ),
      const SizedBox(height: 26),
      Row(
        children: List.generate(
          2,
          (index) => Expanded(
            child: Container(
              height: 54,
              margin: const EdgeInsets.symmetric(horizontal: 8),
              decoration: BoxDecoration(
                color: AppColors.surfaceMuted,
                borderRadius: BorderRadius.circular(24),
              ),
            ),
          ),
        ),
      ),
    ],
  );
}

class _AccountError extends StatelessWidget {
  const _AccountError({
    required this.error,
    required this.onBack,
    required this.onRetry,
  });
  final Object error;
  final VoidCallback onBack;
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    final appError = ApiErrorParser.parse(error);
    final isNotFound = appError.statusCode == 404;

    return Center(
      child: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(24, 40, 24, 40),
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 480),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Container(
                width: 120,
                height: 120,
                margin: const EdgeInsets.symmetric(horizontal: 60),
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: isNotFound ? AppColors.blueSoft : AppColors.dangerSoft,
                  boxShadow: [
                    BoxShadow(
                      color: (isNotFound ? AppColors.blue : AppColors.danger)
                          .withAlpha(20),
                      blurRadius: 40,
                      offset: const Offset(0, 10),
                    ),
                  ],
                ),
                child: Icon(
                  isNotFound
                      ? Icons.account_balance_wallet_outlined
                      : Icons.warning_rounded,
                  size: 56,
                  color: isNotFound ? AppColors.blue : AppColors.danger,
                ),
              ),
              const SizedBox(height: 32),
              Text(
                isNotFound ? 'Cuenta no encontrada' : appError.title,
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                  color: AppColors.textPrimary,
                  fontWeight: FontWeight.w800,
                  letterSpacing: -1.0,
                ),
              ),
              const SizedBox(height: 16),
              Text(
                isNotFound
                    ? 'No pudimos encontrar ninguna cuenta con el número que ingresaste. Por favor, verifica el número e inténtalo nuevamente.'
                    : appError.message,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  color: AppColors.textSecondary,
                  fontSize: 16,
                  height: 1.5,
                ),
              ),
              const SizedBox(height: 48),
              if (!isNotFound) ...[
                ElevatedButton.icon(
                  onPressed: onRetry,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    minimumSize: const Size.fromHeight(60),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20),
                    ),
                  ),
                  icon: const Icon(Icons.refresh_rounded),
                  label: const Text(
                    'Reintentar conexión',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
                  ),
                ),
                const SizedBox(height: 16),
              ],
              TextButton.icon(
                onPressed: onBack,
                style: TextButton.styleFrom(
                  foregroundColor: isNotFound
                      ? AppColors.blue
                      : AppColors.textSecondary,
                  minimumSize: const Size.fromHeight(60),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(20),
                  ),
                ),
                icon: const Icon(Icons.arrow_back_rounded),
                label: const Text(
                  'Volver al buscador',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
