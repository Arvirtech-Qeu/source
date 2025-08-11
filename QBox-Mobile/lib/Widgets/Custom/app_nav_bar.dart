import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:qr_page/Features/Screens/MainPage/Customer%20Delivery/main/delivery_tracking.dart';
import 'package:qr_page/Features/Screens/MainPage/Dashboard/dashboard.dart';
import 'package:qr_page/Features/Screens/MainPage/Load-unload/load-unload-main.dart';
import 'package:qr_page/Features/Screens/MainPage/Order/Order%20History/order_history_main.dart';
import '../../Features/Screens/MainPage/Order/Inward Order/inward_order_main.dart';
import 'app_bottom_bar.dart';
import 'app_colors.dart';

class AppNavBar extends StatefulWidget {
  final child;
  const AppNavBar({
    required this.child,
    Key? key,
  }) : super(key: key ?? const ValueKey<String>('AppNavBar'));

  @override
  _AppNavBarState createState() => _AppNavBarState();
}

class _AppNavBarState extends State<AppNavBar> {

  @override
  void initState() {
    super.initState();
  }

  Future<bool> _onWillPop() async {
    final isTablet = MediaQuery.of(context).size.shortestSide >= 600;

    return await showDialog(
      context: context,
      builder: (context) => Dialog(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        child: Container(
          width:isTablet? 300:MediaQuery.of(context).size.width,
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(
                Icons.exit_to_app_rounded,
                color: AppColors.mintGreen,
                size: 48,
              ),
              const SizedBox(height: 16),
              const Text(
                'Exit App',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: Colors.black,
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                'Are you sure you want to exit?',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 16,
                  color: Colors.black87,
                ),
              ),
              const SizedBox(height: 24),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  Expanded(
                    child: TextButton(
                      onPressed: () => Navigator.of(context).pop(false),
                      style: TextButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                      child: const Text(
                        'Cancel',
                        style: TextStyle(
                          fontSize: 16,
                          color: Colors.black54,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () => Navigator.of(context).pop(true),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.mintGreen,
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                      child: const Text(
                        'Exit',
                        style: TextStyle(
                          fontSize: 16,
                          color: Colors.white,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    ) ?? false;
  }

  @override
  Widget build(BuildContext context) {
    print('object ${widget.child}');
    return WillPopScope(
      onWillPop: _onWillPop,
      child: Scaffold(
        body: widget.child,
        bottomNavigationBar: AppBottomBar(
          opacity: 1.0,
          // opacity: .2,
          currentIndex: _calculateSelectedIndex(context),
          onTap: (int? index) => _onTap(context, index ?? 0),
          // borderRadius: const BorderRadius.vertical(top: Radius.circular(23)),
          elevation: 8,
          // hasInk: true,
          items: _navigationItems,
        ),
      ),
    );
  }

  static const _navigationItems = <AppBottomBarItem>[
    AppBottomBarItem(
      icon: Icon(Icons.home_outlined),
      activeIcon: Icon(Icons.home),
      title: "Home",
    ),
    AppBottomBarItem(
      icon: Icon(Icons.inventory_2_outlined),
      activeIcon: Icon(Icons.inventory_2),
      title: "Load/Unload",
    ),
    AppBottomBarItem(
      icon: Icon(Icons.dashboard_outlined),
      activeIcon: Icon(Icons.dashboard),
      title:"Dashboard",
    ),
    // AppBottomBarItem(
    //   icon: Icon(Icons.delivery_dining_rounded),
    //   activeIcon: Icon(Icons.delivery_dining),
    //   title: "Delivery",
    // ),
    AppBottomBarItem(
      icon: Icon(Icons.history),
      activeIcon: Icon(Icons.history),
      title: "History",
    ),

  ];

  static int _calculateSelectedIndex(BuildContext context) {
    final String location = GoRouterState.of(context).uri.toString();

    if (location.startsWith(InwardOrder.routeName)) {
      return 0;
    }
    if (location.startsWith(LoadOrUnload.routeName)) {
      return 1;
    }
    if (location.startsWith(Dashboard.routeName)) {
      return 2;
    }
    // if (location.startsWith(DeliveryTrackingScreen.routeName)) {
    //   return 3;
    // }
    if (location.startsWith(HistoryScreen.routeName)) {
      return 3;
    }
    return 0;
  }

  void _onTap(BuildContext context, int index) {
    print("_onTap index ${index}");
    switch (index) {
      case 0:
        GoRouter.of(context).go(InwardOrder.routeName);
        break;
      case 1:
        GoRouter.of(context).go(LoadOrUnload.routeName);
        break;
      case 2:
        GoRouter.of(context).go(Dashboard.routeName);
      // case 3:
      //   GoRouter.of(context).go(DeliveryTrackingScreen.routeName);
      case 3:
        GoRouter.of(context).go(HistoryScreen.routeName);
        break;

    }
  }
}
