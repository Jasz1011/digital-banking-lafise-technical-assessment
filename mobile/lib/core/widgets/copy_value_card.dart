import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../theme/app_colors.dart';

class CopyValueCard extends StatelessWidget {
  const CopyValueCard({
    required this.label,
    required this.value,
    this.onCopied,
    super.key,
  });

  final String label;
  final String value;
  final VoidCallback? onCopied;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(18, 14, 8, 14),
      decoration: BoxDecoration(
        color: AppColors.surfaceMuted,
        borderRadius: BorderRadius.circular(18),
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: const TextStyle(
                    color: AppColors.textTertiary,
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 4),
                SelectableText(
                  value,
                  style: const TextStyle(
                    color: AppColors.textPrimary,
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ),
          IconButton(
            tooltip: 'Copiar $label',
            onPressed: () async {
              await Clipboard.setData(ClipboardData(text: value));
              onCopied?.call();
            },
            icon: const Icon(Icons.copy_rounded, size: 20),
            color: AppColors.primaryDark,
          ),
        ],
      ),
    );
  }
}
