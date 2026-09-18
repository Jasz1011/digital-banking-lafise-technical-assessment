import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../app/providers.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/utils/formatters.dart';
import '../../../core/utils/validators.dart';
import '../../../core/widgets/async_error_card.dart';
import '../domain/customer.dart';

class CreateCustomerScreen extends ConsumerStatefulWidget {
  const CreateCustomerScreen({super.key});

  @override
  ConsumerState<CreateCustomerScreen> createState() =>
      _CreateCustomerScreenState();
}

class _CreateCustomerScreenState extends ConsumerState<CreateCustomerScreen> {
  final _formKey = GlobalKey<FormState>();
  final _fullNameController = TextEditingController();
  final _incomeController = TextEditingController();

  DateTime? _birthDate;
  String? _gender;
  bool _attempted = false;
  Object? _error;
  bool _submitting = false;

  @override
  void dispose() {
    _fullNameController.dispose();
    _incomeController.dispose();
    super.dispose();
  }

  Future<void> _selectBirthDate(BuildContext context) async {
    final now = DateTime.now();
    final date = await showDatePicker(
      context: context,
      initialDate: _birthDate ?? DateTime(now.year - 18, now.month, now.day),
      firstDate: DateTime(now.year - 100),
      lastDate: now,
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: const ColorScheme.light(
              primary: AppColors.primary,
              onPrimary: Colors.white,
              onSurface: AppColors.textPrimary,
            ),
          ),
          child: child!,
        );
      },
    );

    if (date != null) {
      setState(() => _birthDate = date);
    }
  }

  Future<void> _submit() async {
    setState(() {
      _attempted = true;
      _error = null;
    });

    if (!(_formKey.currentState?.validate() ?? false) ||
        _birthDate == null ||
        _gender == null) {
      return;
    }

    setState(() => _submitting = true);

    try {
      final customer = await ref
          .read(customerRepositoryProvider)
          .createCustomer(
            CreateCustomerInput(
              fullName: _fullNameController.text.trim(),
              birthDate: _birthDate!,
              gender: _gender!,
              monthlyIncome: AppFormatters.parseMoney(_incomeController.text)!,
            ),
          );

      if (mounted) {
        context.go('/clientes/creado', extra: customer);
      }
    } catch (e) {
      if (mounted) {
        setState(() => _error = e);
      }
    } finally {
      if (mounted) {
        setState(() => _submitting = false);
      }
    }
  }

  InputDecoration _neoInputDecoration({
    required String labelText,
    required IconData prefixIcon,
    String? hintText,
    String? helperText,
    String? errorText,
    String? prefixText,
    Widget? suffixIcon,
  }) {
    return InputDecoration(
      labelText: labelText,
      hintText: hintText,
      helperText: helperText,
      errorText: errorText,
      prefixText: prefixText,
      prefixIcon: Icon(prefixIcon, color: AppColors.primary),
      suffixIcon: suffixIcon,
      counterText: '',
      filled: true,
      fillColor: AppColors.surfaceMuted.withValues(alpha: 0.6),
      contentPadding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(20),
        borderSide: BorderSide.none,
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(20),
        borderSide: BorderSide.none,
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(20),
        borderSide: const BorderSide(color: AppColors.primary, width: 2),
      ),
      errorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(20),
        borderSide: const BorderSide(color: AppColors.danger, width: 2),
      ),
      focusedErrorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(20),
        borderSide: const BorderSide(color: AppColors.danger, width: 2),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final birthDateError = _attempted && _birthDate == null
        ? 'Por favor selecciona tu fecha de nacimiento.'
        : null;

    return Scaffold(
      backgroundColor: AppColors.surfaceSoft,
      body: SingleChildScrollView(
        child: Stack(
          clipBehavior: Clip.none,
          children: [
            Positioned(
              top: 0,
              left: 0,
              right: 0,
              height: 280,
              child: Container(
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    colors: [AppColors.primaryDeep, AppColors.primary],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.only(
                    bottomLeft: Radius.circular(50),
                    bottomRight: Radius.circular(50),
                  ),
                ),
              ),
            ),
            Positioned(
              top: -80,
              right: -50,
              child: Container(
                width: 300,
                height: 300,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: Colors.white.withValues(alpha: 0.05),
                ),
              ),
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Padding(
                  padding: const EdgeInsets.fromLTRB(24, 70, 24, 30),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 8,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.2),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: const Text(
                          'Paso 1 de 2',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 13,
                            fontWeight: FontWeight.w700,
                            letterSpacing: 1.2,
                          ),
                        ),
                      ),
                      const SizedBox(height: 24),
                      Text(
                        'Crear cliente',
                        style: Theme.of(context).textTheme.displaySmall
                            ?.copyWith(
                              color: Colors.white,
                              fontSize: 42,
                              fontWeight: FontWeight.w800,
                              letterSpacing: -1.5,
                            ),
                      ),
                      const SizedBox(height: 12),
                      Text(
                        'Completa tus datos para continuar con la apertura de tu nueva cuenta en LAFISE.',
                        style: TextStyle(
                          color: Colors.white.withValues(alpha: 0.85),
                          fontSize: 16,
                          height: 1.4,
                        ),
                      ),
                    ],
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.fromLTRB(24, 0, 24, 48),
                  child: Center(
                    child: ConstrainedBox(
                      constraints: const BoxConstraints(maxWidth: 620),
                      child: Container(
                        padding: const EdgeInsets.all(28),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(36),
                          boxShadow: [
                            BoxShadow(
                              color: AppColors.primaryDark.withValues(
                                alpha: 0.06,
                              ),
                              blurRadius: 30,
                              offset: const Offset(0, 15),
                            ),
                          ],
                        ),
                        child: Form(
                          key: _formKey,
                          autovalidateMode: AutovalidateMode.onUserInteraction,
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            children: [
                              TextFormField(
                                key: const Key('fullNameField'),
                                controller: _fullNameController,
                                enabled: !_submitting,
                                maxLength: 200,
                                textCapitalization: TextCapitalization.words,
                                textInputAction: TextInputAction.next,
                                autofillHints: const [AutofillHints.name],
                                style: const TextStyle(
                                  fontWeight: FontWeight.w600,
                                  fontSize: 16,
                                ),
                                decoration: _neoInputDecoration(
                                  labelText: 'Nombre completo',
                                  hintText: 'Ej. Maria Elvira Rodriguez',
                                  prefixIcon: Icons.person_outline_rounded,
                                ),
                                validator: AppValidators.fullName,
                              ),
                              const SizedBox(height: 20),
                              InkWell(
                                onTap: _submitting
                                    ? null
                                    : () => _selectBirthDate(context),
                                borderRadius: BorderRadius.circular(20),
                                child: InputDecorator(
                                  decoration: _neoInputDecoration(
                                    labelText: 'Fecha de nacimiento',
                                    prefixIcon: Icons.calendar_month_outlined,
                                    errorText: birthDateError,
                                    suffixIcon: const Icon(
                                      Icons.arrow_drop_down_rounded,
                                    ),
                                  ),
                                  child: Text(
                                    _birthDate != null
                                        ? AppFormatters.date(_birthDate!)
                                        : 'Selecciona una fecha',
                                    style: TextStyle(
                                      color: _birthDate != null
                                          ? AppColors.textPrimary
                                          : AppColors.textSecondary,
                                      fontWeight: _birthDate != null
                                          ? FontWeight.w600
                                          : FontWeight.normal,
                                      fontSize: 16,
                                    ),
                                  ),
                                ),
                              ),
                              const SizedBox(height: 24),
                              DropdownButtonFormField<String>(
                                key: const Key('genderField'),
                                initialValue: _gender,
                                isExpanded: true,
                                decoration: _neoInputDecoration(
                                  labelText: 'Género',
                                  prefixIcon: Icons.transgender_rounded,
                                  errorText: _attempted && _gender == null
                                      ? 'Por favor selecciona un género.'
                                      : null,
                                ),
                                items: const [
                                  DropdownMenuItem(
                                    value: 'M',
                                    child: Text(
                                      'Masculino',
                                      style: TextStyle(
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                  ),
                                  DropdownMenuItem(
                                    value: 'F',
                                    child: Text(
                                      'Femenino',
                                      style: TextStyle(
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                  ),
                                  DropdownMenuItem(
                                    value: 'O',
                                    child: Text(
                                      'Otro',
                                      style: TextStyle(
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                  ),
                                ],
                                onChanged: _submitting
                                    ? null
                                    : (v) => setState(() => _gender = v),
                              ),
                              const SizedBox(height: 24),
                              TextFormField(
                                key: const Key('incomeField'),
                                controller: _incomeController,
                                enabled: !_submitting,
                                keyboardType:
                                    const TextInputType.numberWithOptions(
                                      decimal: true,
                                    ),
                                textInputAction: TextInputAction.done,
                                style: const TextStyle(
                                  fontWeight: FontWeight.w600,
                                  fontSize: 16,
                                ),
                                decoration: _neoInputDecoration(
                                  labelText: 'Ingreso mensual',
                                  hintText: '0.00',
                                  prefixText: r'C$  ',
                                  prefixIcon: Icons.monetization_on_outlined,
                                ),
                                validator: (value) =>
                                    AppValidators.nonNegativeMoney(
                                      value,
                                      label: 'el ingreso mensual',
                                    ),
                                onFieldSubmitted: (_) => _submit(),
                              ),
                              if (_error != null) ...[
                                const SizedBox(height: 24),
                                AsyncErrorCard(error: _error!, compact: true),
                              ],
                              const SizedBox(height: 36),
                              ElevatedButton(
                                key: const Key('createCustomerButton'),
                                onPressed: _submitting ? null : _submit,
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: AppColors.primaryDark,
                                  minimumSize: const Size.fromHeight(64),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(20),
                                  ),
                                  elevation: 0,
                                ),
                                child: _submitting
                                    ? const SizedBox(
                                        width: 24,
                                        height: 24,
                                        child: CircularProgressIndicator(
                                          color: Colors.white,
                                          strokeWidth: 2.5,
                                        ),
                                      )
                                    : const Row(
                                        children: [
                                          Expanded(
                                            child: Text(
                                              'Continuar',
                                              textAlign: TextAlign.center,
                                              style: TextStyle(
                                                fontSize: 18,
                                                fontWeight: FontWeight.w700,
                                              ),
                                            ),
                                          ),
                                          SizedBox(width: 8),
                                          Icon(
                                            Icons.arrow_forward_rounded,
                                            size: 22,
                                          ),
                                        ],
                                      ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
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
