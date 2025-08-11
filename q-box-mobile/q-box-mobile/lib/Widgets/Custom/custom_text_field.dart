import 'package:flutter/material.dart';

import '../../Utils/validator.dart';


class CustomTextFormField extends StatelessWidget {
  final TextEditingController? controller;
  final String hintText;
  final Widget? suffixIcon;
  final Widget? prefixIcon; // Added prefixIcon
  final List<ValidationRule> validationRules;
  final bool obscureText;
  final TextInputType keyboardType;
  final ValueChanged<String>? onchange;
  final InputDecoration? decoration; // New parameter

  const CustomTextFormField({
    super.key,
    this.controller,
    required this.hintText,
    this.suffixIcon,
    this.prefixIcon, // Optional prefixIcon
    required this.validationRules,
    this.obscureText = false,
    this.keyboardType = TextInputType.text,
    this.onchange,
    this.decoration, // Allow custom decoration
  });

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: controller,
      obscureText: obscureText,
      keyboardType: keyboardType,
      onChanged: onchange,
      decoration: decoration?.copyWith(
        hintText: hintText,
        suffixIcon: suffixIcon,
        prefixIcon: prefixIcon, // Add prefixIcon if provided
      ) ??
          InputDecoration(
            hintText: hintText,
            suffixIcon: suffixIcon,
            prefixIcon: prefixIcon,
            filled: true,
            border: const UnderlineInputBorder(borderSide: BorderSide.none),
            floatingLabelBehavior: FloatingLabelBehavior.never,
            errorBorder: const OutlineInputBorder(borderSide: BorderSide(color: Colors.red)),
          ),
      validator: (value) => Validator.validate(value, validationRules),
    );
  }
}

