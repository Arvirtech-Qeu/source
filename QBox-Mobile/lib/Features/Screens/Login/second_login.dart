import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:qr_page/Core/Router/app_router.dart';
import 'package:qr_page/Widgets/Custom/app_colors.dart';

import '../../../Provider/auth_provider.dart';
import '../../../Widgets/Custom/app_button.dart';
import '../ForgetPassword/forget_password.dart';
import '../MainPage/Dashboard/dashboard.dart';
import '../Signup/signup.dart';

class LoginScreen extends StatefulWidget {
  static const String routeName = '/login';
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> with SingleTickerProviderStateMixin{
  final _formKey = GlobalKey<FormState>();
  late TextEditingController _emailController;
  late TextEditingController _passwordController;
  AnimationController? _animationController;
  Animation<double>? _animation;

  @override
  void initState() {
    final formProvider = Provider.of<AuthProvider>(context, listen: false);
    _emailController = TextEditingController(text: formProvider.email);
    _passwordController = TextEditingController(text:formProvider.password);
    super.initState();
    _emailController.addListener((){
      formProvider.setLoginData(email: _emailController.text);
    });
    _passwordController.addListener((){
      formProvider.setLoginData(password: _passwordController.text);
    });
    _animationController = AnimationController(
      vsync: this,
      duration: Duration(seconds: 3),
    );
    _animation =
        CurvedAnimation(parent: _animationController!, curve: Curves.easeInOut);
    _animationController!.forward();
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    _animationController?.dispose();
    super.dispose();
  }


  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    var obsecureText = authProvider.obsecureText;
    final isTablet = MediaQuery.of(context).size.shortestSide >= 600;

    return FadeTransition(
      opacity: _animation!,
      child: Scaffold(
        body: Stack(
          children: [
            Container(
              height: MediaQuery.of(context).size.height,
              decoration: BoxDecoration(
                image: DecorationImage(
                  image: NetworkImage('https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750'),
                  fit: BoxFit.cover,
                ),
              ),
            ),
            BackdropFilter(
              filter: ImageFilter.blur(sigmaX: 10.0, sigmaY: 10.0),  // Adjust blur intensity here
              child: Container(
                height: MediaQuery.of(context).size.height,
                color: Colors.black.withOpacity(0.2),  // Adds slight dimming effect
              ),
            ),
            Center(
              child: SingleChildScrollView(
                child: Form(
                  key: _formKey,
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 24.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          width: isTablet?MediaQuery.of(context).size.width*0.6:MediaQuery.of(context).size.width,
                          padding: const EdgeInsets.all(24),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(24),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.1),
                                blurRadius: 10,
                                offset: const Offset(0, 5),
                              ),
                            ],
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(
                                'Welcome back',
                                style: TextStyle(
                                  fontSize: 24,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.grey[800],
                                ),
                              ),
                              const SizedBox(height: 24),
                              TextFormField(
                                controller: _emailController,
                                onChanged: (value) => authProvider.setLoginData(email: value),
                                decoration: InputDecoration(
                                  hintText: 'Email or username',
                                  prefixIcon: Icon(Icons.email_outlined, color: Colors.grey[600]),
                                  border: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(12),
                                    borderSide: BorderSide.none,
                                  ),
                                  filled: true,
                                  fillColor: Colors.grey[100],
                                ),
                                validator: (value) {
                                  if (value?.isEmpty ?? true) {
                                    return 'Please enter your email';
                                  }
                                  return null;
                                },
                              ),

                              const SizedBox(height: 16),

                              // Password Field
                              TextFormField(
                                controller: _passwordController,
                                onChanged: (value) => authProvider.setLoginData(password: value),
                                obscureText:  obsecureText,
                                decoration: InputDecoration(
                                  hintText: 'Password',
                                  prefixIcon: Icon(Icons.lock_outline),
                                  suffixIcon: IconButton(
                                    onPressed: () =>
                                        context.read<AuthProvider>().toggleLoginObscureText(),
                                    icon: Icon(obsecureText
                                        ? Icons.remove_red_eye_outlined
                                        : Icons.visibility_off_outlined,color: Colors.grey),
                                  ),
                                  border: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(12),
                                    borderSide: BorderSide.none,
                                  ),
                                  filled: true,
                                  fillColor: Colors.grey[100],
                                ),
                                validator: (value) {
                                  if (value?.isEmpty ?? true) {
                                    return 'Please enter your password';
                                  }
                                  return null;
                                },
                              ),

                              const SizedBox(height: 12),

                              // Forgot Password
                              Align(
                                alignment: Alignment.centerRight,
                                child: TextButton(
                                  onPressed: () {
                                    // GoRouter.of(context).push(ForgotPasswordScreen.routeName);
                                    Navigator.push(
                                      context,
                                      MaterialPageRoute(
                                        builder: (context) => ForgotPasswordScreen(),
                                      ),
                                    );
                                  },
                                  child: Text(
                                    'Forgot Password?',
                                    style: TextStyle(
                                      color: Color(0xFFFF6B6B),
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                ),
                              ),

                              SizedBox(
                                width: MediaQuery.of(context).size.width,
                                height: 50,
                                child:CustomButton(
                                  elevation: 0,
                                  label: "Sign In",
                                  color:AppColors.buttonBgColor,
                                  onPressed: () async{
                                    if (_formKey.currentState!.validate()) {
                                      final username = _emailController.text.trim();
                                      final password = _passwordController.text.trim();
                                     await Provider.of<AuthProvider>(context, listen: false)
                                          .login(username, password);
                                      _emailController.clear();
                                      _passwordController.clear();
                                    }
                                    // if (_formKey.currentState!.validate()) {
                                    //   final username = _emailController.text.trim();
                                    //   final password = _passwordController.text.trim();
                                    //   final success = await Provider.of<AuthProvider>(context, listen: false)
                                    //       .login(username, password);
                                    //   if (success) {
                                    //     // Navigate to Dashboard and force refresh
                                    //     Navigator.pushReplacement(
                                    //       context,
                                    //       MaterialPageRoute(
                                    //         builder: (context) => Dashboard(forceRefresh: true),
                                    //       ),
                                    //     );
                                    //   } else {
                                    //     ScaffoldMessenger.of(context).showSnackBar(
                                    //       SnackBar(content: Text('Login failed. Please try again.')),
                                    //     );
                                    //   }
                                    // }
                                  },
                                ),
                              ),
                              Center(
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Text(
                                      "Don't have an account? ",
                                      style: TextStyle(color: Colors.grey[600]),
                                    ),
                                    TextButton(
                                      onPressed: () {
                                        Navigator.push(
                                          context,
                                          MaterialPageRoute(
                                            builder: (context) => SignUpScreen(),
                                          ),
                                        );
                                      },
                                      child: Text(
                                        'Sign Up',
                                        style: TextStyle(
                                          color:AppColors.buttonBgColor,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              // const SizedBox(height: 24),
                              // Social Login
                              Row(
                                children: [
                                  const Expanded(
                                    child: Divider(thickness: 1),
                                  ),
                                  Padding(
                                    padding: const EdgeInsets.symmetric(horizontal: 16),
                                    child: Text(
                                      'or sign in with',
                                      style: TextStyle(
                                        color: Colors.grey[600],
                                        fontSize: 14,
                                      ),
                                    ),
                                  ),
                                  const Expanded(
                                    child: Divider(thickness: 1),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 24),
                              Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  _SocialLoginButton(
                                    icon: 'assets/google.png',
                                    onPressed: () {},
                                  ),
                                  SizedBox(width: 10,),
                                  _SocialLoginButton(
                                    icon: 'assets/facebook.png',
                                    onPressed: () {},
                                  ),

                                ],
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
          ],
        ),
      ),
    );
  }
}

class _SocialLoginButton extends StatelessWidget {
  final String icon;
  final VoidCallback onPressed;

  const _SocialLoginButton({
    required this.icon,
    required this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onPressed,
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.grey[100],
          borderRadius: BorderRadius.circular(12),
        ),
        child: Image.asset(
          icon,
          height: 24,
          width: 24,
        ),
      ),
    );
  }
}