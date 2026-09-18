import 'package:flutter/material.dart';

import '../errors/api_error_parser.dart';
import '../theme/app_colors.dart';

class AsyncErrorCard extends StatelessWidget {
  const AsyncErrorCard({
    required this.error,
    this.onRetry,
    this.compact = false,
    super.key,
  });

  final Object error;
  final VoidCallback? onRetry;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final appError = ApiErrorParser.parse(error);
    return Semantics(
      liveRegion: true,
      child: Container(
        width: double.infinity,
        padding: EdgeInsets.all(compact ? 16 : 20),
        decoration: BoxDecoration(
          color: AppColors.dangerSoft,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: AppColors.danger.withValues(alpha: .14)),
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Icon(Icons.error_outline_rounded, color: AppColors.danger),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    appError.title,
                    style: const TextStyle(
                      color: AppColors.textPrimary,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    appError.message,
                    style: const TextStyle(color: AppColors.textSecondary),
                  ),
                  if (appError.validationMessages.length > 1) ...[
                    const SizedBox(height: 8),
                    for (final message in appError.validationMessages.skip(1))
                      Text('• $message', style: const TextStyle(fontSize: 12)),
                  ],
                  if (onRetry != null) ...[
                    const SizedBox(height: 8),
                    TextButton(
                      onPressed: onRetry,
                      child: const Text('Reintentar'),
                    ),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
