import 'package:flutter/material.dart';

class AppText extends StatelessWidget {
  final String text;
  final double fontSize;
  final FontWeight fontWeight;
  final Color? color;
  final TextAlign? textAlign;
  final FontStyle? fontStyle;
final TextOverflow? overflow;
  const AppText({
    super.key,
    required this.text,
    required this.fontSize,
    this.fontWeight = FontWeight.normal,
    this.color,
    this.textAlign,
    this.fontStyle, this.overflow,
  });

  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      textAlign: textAlign,
      style:TextStyle(
        color: color,
        fontSize: fontSize,
        fontStyle: fontStyle,
        fontWeight: fontWeight
      )
    );
  }
}