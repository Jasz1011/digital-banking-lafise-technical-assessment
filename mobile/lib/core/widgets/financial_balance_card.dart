import 'package:flutter/material.dart';

import '../theme/app_colors.dart';
import '../utils/formatters.dart';

class FinancialBalanceCard extends StatefulWidget {
  const FinancialBalanceCard({
    required this.accountNumber,
    required this.balance,
    this.title = 'Saldo disponible',
    this.allowHideBalance = false,
    super.key,
  });

  final String accountNumber;
  final double balance;
  final String title;
  final bool allowHideBalance;

  @override
  State<FinancialBalanceCard> createState() => _FinancialBalanceCardState();
}

class _FinancialBalanceCardState extends State<FinancialBalanceCard> {
  bool _visible = true;

  @override
  Widget build(BuildContext context) {
    return Semantics(
      label: '${widget.title}, ${AppFormatters.currency(widget.balance)}',
      child: Container(
        constraints: const BoxConstraints(minHeight: 238),
        clipBehavior: Clip.antiAlias,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(30),
          gradient: const LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              AppColors.primaryDeep,
              AppColors.primary,
              AppColors.turquoise,
            ],
            stops: [0, .58, 1],
          ),
          boxShadow: [
            BoxShadow(
              color: AppColors.primaryDeep.withValues(alpha: .18),
              blurRadius: 32,
              offset: const Offset(0, 16),
            ),
          ],
        ),
        child: Stack(
          children: [
            Positioned(
              right: -95,
              top: -120,
              child: Container(
                width: 270,
                height: 270,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: Colors.white.withValues(alpha: .12),
                    width: 34,
                  ),
                ),
              ),
            ),
            Positioned(
              left: -50,
              bottom: -80,
              child: Container(
                width: 180,
                height: 180,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: AppColors.cyan.withValues(alpha: .18),
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Text(
                        'LAFISE',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 17,
                          fontWeight: FontWeight.w700,
                          letterSpacing: 1.1,
                        ),
                      ),
                      const SizedBox(height: 38),
                      if (widget.allowHideBalance)
                        IconButton(
                          tooltip: _visible ? 'Ocultar saldo' : 'Mostrar saldo',
                          onPressed: () => setState(() => _visible = !_visible),
                          color: Colors.white,
                          icon: Icon(
                            _visible
                                ? Icons.visibility_outlined
                                : Icons.visibility_off_outlined,
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(height: 34),
                  Text(
                    widget.title,
                    style: TextStyle(
                      color: Colors.white.withValues(alpha: .8),
                      fontSize: 13,
                    ),
                  ),
                  const SizedBox(height: 6),
                  AnimatedSwitcher(
                    duration: const Duration(milliseconds: 180),
                    child: Text(
                      _visible
                          ? AppFormatters.currency(widget.balance)
                          : r'C$ ••••••',
                      key: ValueKey(_visible),
                      maxLines: 1,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 31,
                        height: 1.1,
                        fontWeight: FontWeight.w700,
                        letterSpacing: -1,
                        fontFeatures: [FontFeature.tabularFigures()],
                      ),
                    ),
                  ),
                  const SizedBox(height: 38),
                  Text(
                    widget.accountNumber,
                    style: TextStyle(
                      color: Colors.white.withValues(alpha: .86),
                      fontSize: 13,
                      fontWeight: FontWeight.w500,
                      letterSpacing: .4,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
