import 'package:flutter/material.dart';

class AppTwoText extends StatelessWidget {
  final String firstText;
  final String secondText;
  final double fontSize;
  final FontWeight? fontWeight;
  final Color firstColor;
  final Color secondColor;
  final TextAlign? textAlign;
  final FontWeight? firstfontWeight;
  final FontWeight? secondfontWeight;
  final TextDecoration secondTextDecoration;
  final TextOverflow overflow;

  const AppTwoText({
    Key? key,
    required this.firstText,
    required this.secondText,
    required this.fontSize,
    this.fontWeight,
    required this.firstColor,
    required this.secondColor,
    this.textAlign,
    this.firstfontWeight,
    this.secondfontWeight,
    this.secondTextDecoration = TextDecoration.none,
    this.overflow = TextOverflow.ellipsis,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return  RichText(
      overflow: overflow,
      maxLines: 2,
      text: TextSpan(
        style: DefaultTextStyle.of(context).style,
        children: <TextSpan>[
          TextSpan(
            text: firstText,
            style: TextStyle(fontSize: fontSize,fontWeight: firstfontWeight, color: firstColor),
          ),
          TextSpan(
            text: secondText,
            style: TextStyle(fontSize: fontSize,fontWeight: secondfontWeight,color:secondColor),
          ),
        ],
      ),
    );
  }
}