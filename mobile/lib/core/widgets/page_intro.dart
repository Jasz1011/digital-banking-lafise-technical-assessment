import 'package:flutter/material.dart';

import '../theme/app_colors.dart';

class PageIntro extends StatelessWidget {
  const PageIntro({
    required this.title,
    required this.description,
    this.eyebrow,
    super.key,
  });

  final String title;
  final String description;
  final String? eyebrow;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (eyebrow != null) ...[
          Text(
            eyebrow!.toUpperCase(),
            style: const TextStyle(
              color: AppColors.primaryDark,
              fontSize: 11,
              fontWeight: FontWeight.w700,
              letterSpacing: 1.1,
            ),
          ),
          const SizedBox(height: 10),
        ],
        Text(title, style: Theme.of(context).textTheme.headlineMedium),
        const SizedBox(height: 10),
        Text(description, style: Theme.of(context).textTheme.bodyLarge),
      ],
    );
  }
}
