import 'package:flutter/material.dart';

import 'app_text.dart';

class CustomDivider extends StatelessWidget {
  final String text;

  const CustomDivider({required this.text});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        const Expanded(child: Divider(thickness: 1.5)),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 8.0),
          child: AppText(
            text: text,
            fontWeight: FontWeight.bold,
            fontSize: 18,
          ),
        ),
        const Expanded(child: Divider(thickness: 1.5)),
      ],
    );
  }
}
