import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:qr_page/Provider/auth_provider.dart';
import 'app_text.dart';
import 'app_colors.dart';

class CustomButton extends StatelessWidget {
  final String label;
  final VoidCallback onPressed;
  final Color color;
  final BorderRadius? borderRadius;
  final double fontSize;
  final double elevation;
  final Widget? leadingIcon; // Optional leading icon widget
  final Widget? trailingIcon; // Optional trailing icon widget
  final bool isLoading; // Loading state
  final String? tooltip; // Optional tooltip text
  final Color tooltipTextColor;
  final EdgeInsetsGeometry? padding;

  CustomButton({
    required this.label,
    required this.onPressed,
    this.color = Colors.blue,
    this.borderRadius,
    this.fontSize = 16.0,
    this.elevation = 2.0,
    this.leadingIcon,
    this.trailingIcon,
    this.isLoading = false,
    this.tooltip,
    this.tooltipTextColor = Colors.white,
    this.padding
  });

  @override
  Widget build(BuildContext context) {
    final loginProvider = Provider.of<AuthProvider>(context);

    return Ink(
      child: ElevatedButton(
        style: ElevatedButton.styleFrom(
          backgroundColor: color, // Transparent to show gradient
          shape: RoundedRectangleBorder(
            borderRadius: borderRadius ?? BorderRadius.circular(8.0),
          ),
          elevation: loginProvider.isLoading ? 0 : elevation,
          padding: padding ??
              const EdgeInsets.symmetric(vertical: 12, horizontal: 20),
        ),
        onPressed: loginProvider.isLoading ? null : onPressed,
        child: loginProvider.isLoading
            ? const SizedBox(
          height: 20,
          width: 20,
          child: CircularProgressIndicator(
            valueColor:
            AlwaysStoppedAnimation(AppColors.loadingProgressColor),
          ),
        )
            : Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            if (leadingIcon != null) ...[
              leadingIcon!,
              const SizedBox(width: 8), // Space between leading icon and label
            ],
            AppText(
              text: label,
              fontSize: fontSize,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
            if (trailingIcon != null) ...[
              const SizedBox(width: 8), // Space between label and trailing icon
              trailingIcon!,
            ],
          ],
        ),
      ),
    );
  }
}
