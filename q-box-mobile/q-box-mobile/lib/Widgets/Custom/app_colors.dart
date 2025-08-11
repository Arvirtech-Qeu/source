
import 'package:flutter/material.dart';

class AppColors{
  static const primaryColor = Color(0xFF0A0606);
  static const lightPrimaryColor = Color(0xFF42A5F5);
  static const lightScaffoldBackgroundColor = Color(0xFFF7F7F8);
  // static const lightScaffoldBackgroundColor = Color(0xFFfbdfeb  );
  static const darkPrimaryVariantColor = Colors.black;
  static const lightBackgroundColor = Color(0XFFFFFFFF);
  static const darkPrimaryColor = Color(0xFF000000);
  static const lightPrimaryContainer = Color(0xFFEEF0F3);
  static const darkSecondaryColor = Colors.white;
  static const darkOnPrimaryColor = Colors.white;
  // static const buttonBgColor =  Color(0xFFFF3131);
  static const buttonBgColor = Color(0xFFEC1C24);

  static const loadingProgressColor = Colors.white;


  // Main colors
  static const Color background = Colors.white;
  static const Color primaryText = Color(0xFF000000);
  static const Color secondaryText = Color(0xFF757575);

  // Card colors

  // static const Color mintGreen = Color(0xFF8fbc8f);
  static const Color mintGreen = Color(0xFFEC1C24);
  static const Color appGreen = Color(0xFF6c9d6c);
  // static const Color darkMintGreen = Color(0xFF6c9d6c); // Light green cards
  static const Color darkMintGreen = Colors.red;
  static const Color paleYellow = Colors.red;
  static const Color darkPaleYellow = Colors.red;
  // static const Color paleYellow = Color(0xFFf2db8e);
  // static const Color darkPaleYellow = Color(0xFFdabc59); // Yellow card
  static const Color softPink = Color(0xFFFCE4EC);     // Pink course card
  static const Color lightGray = Color(0xFFF5F5F5);
  static const Color lightBlack = Colors.black54;
  // static const Color black = Colors.black;
  // static const Color white = Colors.white70;
  static const Color wine =  Color(0xFFA52A2A);
  // static const Color appTheme = Color(0xFFFF3131);
  // Gray course card

  // Navigation colors
  static const Color navActive = Color(0xFF000000);
  static const Color navInactive = Color(0xFF9E9E9E);

  // Progress bar colors
  static const Color progressBackground = Color(0xFFEEEEEE);
  static const Color progressFill = Color(0xFF000000);

  // static const Color primary = Color(0xFF1A237E);  // Deep Indigo
  // static const Color secondary = Color(0xFF00796B); // Deep Teal
  static const Color accent = Color(0xFFFF6F00);   // Deep Orange
  static const Color surface = Color(0xFFFAFAFA);  // Light Surface
  static const Color card1 = Color(0xFF3949AB);    // Indigo
  static const Color card2 = Color(0xFF00897B);    // Teal
  static const Color card3 = Color(0xFF5E35B1);    // Deep Purple
  static const Color textPrimary = Color(0xFF263238);
  static const Color textSecondary = Color(0xFF546E7A);
  static const Color success = Color(0xFF2E7D32);
  static const Color divider = Color(0xFFEEEEEE);

  static const LinearGradient scaffoldGradient = LinearGradient(
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
    colors: [
      AppColors.buttonBgColor,
      Colors.white,
    ],
  );

  static const Color primary = Color(0xFF22C55E);  // Green color for active states
  static const Color primaryLight = Color(0xFFDCFCE7); // Light green for backgrounds
  static const Color secondary = Color(0xFFE11D48); // Red color for alerts/negative
  static const Color secondaryLight = Color(0xFFFEE2E2); // Light red background
  static const Color grey = Color(0xFF64748B); // Text and icons
  static const Color greyLight = Color(0xFFF8FAFC); // Background grey
  static const Color white = Colors.white;
  static const Color black = Color(0xFF1E293B);

}