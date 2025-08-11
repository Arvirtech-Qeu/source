import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:qr_page/Features/Screens/Login/second_login.dart';
import 'package:qr_page/Widgets/Custom/app_colors.dart';
import 'dart:async';

import '../../../Core/Router/app_router.dart';
import '../../../Services/token_service.dart';


class AnimeSplashScreen extends StatefulWidget {
  static const String routeName = '/anime-splash';
  const AnimeSplashScreen({super.key});

  @override
  _SplashScreenState createState() => _SplashScreenState();
}

class _SplashScreenState extends State<AnimeSplashScreen> with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _scaleAnimation;
  late Animation<double> _rotateAnimation;
  TokenService tokenService = TokenService();

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    );

    _scaleAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _animationController,
        curve: Curves.elasticOut,
      ),
    );

    _rotateAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _animationController,
        curve: Curves.easeOut,
      ),
    );
    _animationController.forward();
    Timer(const Duration(seconds: 5), goToPage);
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  goToPage() async {
    var user = await tokenService.getUser();
    print('users$user');
    if (user != null) {
      AppRouter.navigateToHomeView();
      // Navigator.push(
      //     context,
      //     MaterialPageRoute(
      //       builder: (context) => const MainNavigationScreen(),
      //     ));
    } else {
      Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => const LoginScreen(),
          ));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Container(
        decoration: BoxDecoration(
          gradient: AppColors.scaffoldGradient,
        ),
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Logo Animation
              AnimatedBuilder(
                animation: _animationController,
                builder: (context, child) {
                  return Transform.scale(
                    scale: _scaleAnimation.value,
                    child: Transform.rotate(
                      angle: _rotateAnimation.value * 2 * 3.14159 * 0.25,
                      child: Container(
                        width: 120,
                        height: 120,
                        decoration: BoxDecoration(
                          color: AppColors.buttonBgColor.withOpacity(0.2),
                          shape: BoxShape.circle,
                          boxShadow: [
                            BoxShadow(
                              color: AppColors.buttonBgColor.withOpacity(0.2),
                              blurRadius: 20,
                              offset: Offset(0, 10),
                            ),
                          ],
                        ),
                        child: Icon(
                          Icons.restaurant_menu,
                          size: 60,
                          color: AppColors.white,
                        ),
                      ),
                    ),
                  );
                },
              ),
              SizedBox(height: 40),
              // App Name Animation
              AnimatedBuilder(
                animation: _scaleAnimation,
                builder: (context, child) {
                  return Opacity(
                    opacity: _scaleAnimation.value.clamp(0.0, 1.0),
                    child: Transform.translate(
                      offset: Offset(0, 20 * (1 - _scaleAnimation.value)),
                      child: Column(
                        children: [
                          Text(
                            'Qeu Box',
                            style: TextStyle(
                              fontSize: 32,
                              fontWeight: FontWeight.bold,
                              color: AppColors.wine,
                            ),
                          ),
                          SizedBox(height: 8),
                          Text(
                            'SavorEase – Your Food, Your Way!',
                            style: TextStyle(
                              fontSize: 16,
                              color: AppColors.black,
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
              SizedBox(height: 60),
              // Loading Indicator
              SizedBox(
                width: 160,
                child: LinearProgressIndicator(
                  backgroundColor: AppColors.buttonBgColor,
                  valueColor: AlwaysStoppedAnimation<Color>(
                    AppColors.wine,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

