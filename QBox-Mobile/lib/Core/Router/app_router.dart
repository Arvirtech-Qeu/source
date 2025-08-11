import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:qr_page/Core/Router/bottom_bar_routes.dart';
import 'package:qr_page/Features/Screens/Login/second_login.dart';
import 'package:qr_page/Features/Screens/MainPage/Customer%20Delivery/main/delivery_tracking.dart';
import 'package:qr_page/Features/Screens/MainPage/Dashboard/dashboard.dart';
import 'package:qr_page/Features/Screens/MainPage/Load-unload/load-unload-main.dart';
import 'package:qr_page/Features/Screens/MainPage/Load-unload/load_history.dart';
import 'package:qr_page/Features/Screens/MainPage/Order/Order%20History/order_history_main.dart';
import 'package:qr_page/Features/Screens/MainPage/Order/Inward%20Order/inward_order_main.dart';
import 'package:qr_page/Features/Screens/MainPage/Order/Inward%20Order/qr_scanner_screen.dart';
import 'package:qr_page/Features/Screens/MainPage/Order/View%20Order/view_order.dart';
import 'package:qr_page/Features/Screens/Splash/animated_splash.dart';
import 'package:qr_page/Provider/auth_provider.dart';
import '../../Features/Screens/MainPage/Customer Delivery/Common/delivery_status.dart';
import '../../Features/Screens/MainPage/Customer Delivery/Common/scan_qbox_unload.dart';
import '../../Features/Screens/MainPage/Load-unload/sales_scanning.dart';
import '../../Widgets/Custom/app_nav_bar.dart';

class AppRouter {
  static final GlobalKey<NavigatorState> _routerKey = GlobalKey<NavigatorState>(debugLabel: 'root');
  static final GlobalKey<NavigatorState> _mainMenuNavigatorKey = GlobalKey<NavigatorState>(debugLabel: 'main-menu');
  static GlobalKey<NavigatorState> get routerKey => _routerKey;

  static final GoRouter _router = GoRouter(
    navigatorKey: _routerKey,
    debugLogDiagnostics: true,
    initialLocation: AnimeSplashScreen.routeName,
    observers: [
      GoRouterObserver(),
    ],// Default splash screen
    routes: <RouteBase>[
      GoRoute(
        name: AnimeSplashScreen.routeName,
        path: AnimeSplashScreen.routeName,
        builder: (_, __) => const AnimeSplashScreen(),
      ),
      GoRoute(
        name: LoginScreen.routeName,
        path: LoginScreen.routeName,
        builder: (_, __) => LoginScreen(),
      ),
      GoRoute(
        name: ScanQBoxScreen.routeName,
        path: ScanQBoxScreen.routeName,
        builder: (_, __) => const ScanQBoxScreen(),
      ),

      GoRoute(
        name: DeliveryStatusScreen.routeName,
        path: DeliveryStatusScreen.routeName,
        builder: (_, __) => const DeliveryStatusScreen(),
      ),

      GoRoute(
        name: OrderQRScannerScreen.routeName,
        path: OrderQRScannerScreen.routeName,
        builder: (_, __) => const OrderQRScannerScreen(),
      ),

      GoRoute(
        name: NotificationHistoryScreen.routeName,
        path: NotificationHistoryScreen.routeName,
        builder: (_, __) => const NotificationHistoryScreen(),
      ),
      GoRoute(
        name: ViewOrder.routeName,
        path: ViewOrder.routeName,

        builder: (context, state) {
          // Retrieve the extra parameter from the state
          final scannedOrderId = state.extra as String?;
          return ViewOrder(partnerPurchaseOrderId: scannedOrderId);
        },
      ),
      GoRoute(
        name: SalesScanning.routeName,
        path: SalesScanning.routeName,
        builder: (_, __) => const SalesScanning(),
      ),
      ShellRoute(
        navigatorKey: _mainMenuNavigatorKey,
        builder: (_, __, child) {
          print('child$child');
          return Scaffold(
              body: AppNavBar(child: child));
        },
        routes: <RouteBase>[
          ...AppBottomBarRoutes.mainMenuRoutes,
        ],
      ),
    ],
  );

  static void navigateToHomeView() {
    return _router.go(InwardOrder.routeName);
  }

  static void navigateToLoadUnload() {
    return _router.go(LoadOrUnload.routeName);
  }

  static void navigateToInwardOrder() {
       _router.replaceNamed(Dashboard.routeName);
       _router.goNamed(Dashboard.routeName);
  }

  static void navigateToDelivery() {
    return _router.go(DeliveryTrackingScreen.routeName);
  }

  static void navigateToHistory() {
    return _router.go(HistoryScreen.routeName);
  }


  static GoRouter get router => _router;
}


class GoRouterObserver extends NavigatorObserver {
  @override
  void didPush(Route<dynamic> route, Route<dynamic>? previousRoute) {
    print('1111');
  }

  @override
  void didPop(Route<dynamic> route, Route<dynamic>? previousRoute) {
    print('2222');
  }

  @override
  void didRemove(Route<dynamic> route, Route<dynamic>? previousRoute) {
    print('3333');
  }

  @override
  void didReplace({Route<dynamic>? newRoute, Route<dynamic>? oldRoute}) {
    print('4444');
  }
}

