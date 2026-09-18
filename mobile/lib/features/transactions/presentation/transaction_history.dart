import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../app/providers.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/utils/formatters.dart';
import '../../../core/widgets/async_error_card.dart';
import '../domain/bank_transaction.dart';

class TransactionHistory extends ConsumerWidget {
  const TransactionHistory({required this.accountNumber, super.key});

  final String accountNumber;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final transactions = ref.watch(accountTransactionsProvider(accountNumber));
    return transactions.when(
      loading: () => const _HistoryLoading(),
      error: (error, _) => AsyncErrorCard(
        error: error,
        onRetry: () =>
            ref.invalidate(accountTransactionsProvider(accountNumber)),
      ),
      data: (items) {
        if (items.isEmpty) return const _EmptyHistory();
        return Column(
          children: [
            for (var index = 0; index < items.length; index++) ...[
              _TransactionRow(transaction: items[index]),
              if (index != items.length - 1)
                const Divider(height: 1, indent: 58),
            ],
          ],
        );
      },
    );
  }
}

class _TransactionRow extends StatelessWidget {
  const _TransactionRow({required this.transaction});

  final BankTransaction transaction;

  @override
  Widget build(BuildContext context) {
    final isDeposit = transaction.type == TransactionType.deposit;
    return Semantics(
      label:
          '${isDeposit ? 'Depósito' : 'Retiro'}, ${AppFormatters.currency(transaction.amount)}, saldo posterior ${AppFormatters.currency(transaction.balanceAfterTransaction)}',
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 20),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: isDeposit ? AppColors.mint : AppColors.blueSoft,
                borderRadius: BorderRadius.circular(16),
              ),
              child: Icon(
                isDeposit ? Icons.south_west_rounded : Icons.north_east_rounded,
                color: isDeposit ? AppColors.success : AppColors.blue,
                size: 22,
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    isDeposit ? 'Depósito a cuenta' : 'Retiro de cuenta',
                    style: const TextStyle(
                      color: AppColors.textPrimary,
                      fontWeight: FontWeight.w700,
                      fontSize: 15,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    AppFormatters.dateTime(transaction.timestamp),
                    style: const TextStyle(
                      color: AppColors.textSecondary,
                      fontSize: 12,
                    ),
                  ),
                  const SizedBox(height: 6),
                  InkWell(
                    borderRadius: BorderRadius.circular(8),
                    onTap: () async {
                      await Clipboard.setData(
                        ClipboardData(text: transaction.transactionId),
                      );
                      if (context.mounted) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Referencia copiada.')),
                        );
                      }
                    },
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        color: AppColors.surfaceMuted,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            'Ref. ${AppFormatters.transactionReference(transaction.transactionId)}',
                            style: const TextStyle(
                              color: AppColors.textTertiary,
                              fontSize: 11,
                              fontFamily: 'monospace',
                            ),
                          ),
                          const SizedBox(width: 6),
                          const Icon(
                            Icons.copy_rounded,
                            size: 12,
                            color: AppColors.textTertiary,
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 12),
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(
                  '${isDeposit ? '+' : '-'}${AppFormatters.currency(transaction.amount)}',
                  style: TextStyle(
                    color: isDeposit
                        ? AppColors.success
                        : AppColors.textPrimary,
                    fontWeight: FontWeight.w700,
                    fontSize: 15,
                    letterSpacing: -0.3,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  AppFormatters.currency(transaction.balanceAfterTransaction),
                  style: const TextStyle(
                    color: AppColors.textSecondary,
                    fontSize: 12,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _EmptyHistory extends StatelessWidget {
  const _EmptyHistory();

  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.symmetric(vertical: 30),
    child: Column(
      children: [
        Container(
          width: 52,
          height: 52,
          decoration: const BoxDecoration(
            color: AppColors.surfaceMuted,
            shape: BoxShape.circle,
          ),
          child: const Icon(
            Icons.history_rounded,
            color: AppColors.textTertiary,
          ),
        ),
        const SizedBox(height: 13),
        const Text(
          'Aún no hay movimientos',
          style: TextStyle(
            color: AppColors.textPrimary,
            fontWeight: FontWeight.w600,
          ),
        ),
        const SizedBox(height: 4),
        const Text('Tus depósitos y retiros aparecerán aquí.'),
      ],
    ),
  );
}

class _HistoryLoading extends StatelessWidget {
  const _HistoryLoading();

  @override
  Widget build(BuildContext context) => Column(
    children: List.generate(
      3,
      (index) => const Padding(
        padding: EdgeInsets.symmetric(vertical: 14),
        child: Row(
          children: [
            _Skeleton(width: 44, height: 44, radius: 22),
            SizedBox(width: 14),
            Expanded(
              child: _Skeleton(width: double.infinity, height: 38, radius: 10),
            ),
          ],
        ),
      ),
    ),
  );
}

class _Skeleton extends StatelessWidget {
  const _Skeleton({
    required this.width,
    required this.height,
    required this.radius,
  });
  final double width;
  final double height;
  final double radius;

  @override
  Widget build(BuildContext context) => Container(
    width: width,
    height: height,
    decoration: BoxDecoration(
      color: AppColors.surfaceMuted,
      borderRadius: BorderRadius.circular(radius),
    ),
  );
}
