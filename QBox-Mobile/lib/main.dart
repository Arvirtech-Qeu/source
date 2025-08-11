import 'package:firebase_core/firebase_core.dart' show Firebase, FirebaseOptions;
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:qr_page/Core/Router/app_router.dart';
import 'package:qr_page/Provider/dashboard_provider.dart';
import 'package:qr_page/Provider/inward_order_provider.dart';
import 'package:qr_page/Provider/network_provider.dart';
import 'package:qr_page/Provider/order_history_provider.dart';
import 'package:qr_page/Provider/order_qr_scanning_provider.dart';
import 'package:qr_page/Provider/qbox_delivery_provider.dart';
import 'Provider/auth_provider.dart';
import 'Provider/scanner.dart';
import 'Services/firebase_api.dart';


Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  print("Handling background message: ${message.messageId}");
}

void main()async{

  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    // options: DefaultFirebaseOptions.currentPlatform

    options: FirebaseOptions(
    apiKey: 'AIzaSyCdRjCVZlhrq72RuEklEyyxYlBRCYhI2Sw',
    appId: '1:943263543680:android:dd0cc860d4df943c2ad165',
    messagingSenderId: '943263543680',
    projectId: 'qbox-pushnotification',
    databaseURL:
    'https://flutterfire-e2e-tests-default-rtdb.europe-west1.firebasedatabase.app',
    storageBucket: 'flutterfire-e2e-tests.appspot.com',
    ),
  );
  FirebaseService firebaseService = FirebaseService();
  await firebaseService.firebaseInit();

  runApp(const MyApp());
}

class FirebaseService {
  final FirebaseMessaging _firebaseMessaging = FirebaseMessaging.instance;
  String? _fcmToken;

  Future<void> firebaseInit() async {
    try {
      // Request permission for notifications
      NotificationSettings settings = await _firebaseMessaging.requestPermission(
        alert: true,
        announcement: false,
        badge: true,
        carPlay: false,
        criticalAlert: false,
        provisional: false,
        sound: true,
      );

      if (settings.authorizationStatus == AuthorizationStatus.authorized) {
        print("User granted permission");
      } else {
        print("User denied permission");
      }

      // Get FCM Token
      _fcmToken = await _firebaseMessaging.getToken();
      print("FCM Token: $_fcmToken");

      // Handle token refresh
      _firebaseMessaging.onTokenRefresh.listen((newToken) {
        print("New FCM Token: $newToken");
        _fcmToken = newToken;
      });

      // Handle foreground notifications
      FirebaseMessaging.onMessage.listen((RemoteMessage message) {
        print("Foreground message received: ${message.notification?.title}");
      });

      // Handle background and terminated state
      FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);
      FirebaseMessaging.onMessageOpenedApp.listen((RemoteMessage message) {
        print("Notification clicked! ${message.notification?.title}");
      });
    } catch (e) {
      print("Error initializing Firebase: $e");
    }
  }
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => NetworkProvider()),
        ChangeNotifierProvider(create: (_) => DeliveryProvider()),
        ChangeNotifierProvider(create: (_) => DashboardProvider()),
        ChangeNotifierProvider(create: (_) => InwardOrderDtlProvider()),
        ChangeNotifierProvider(create: (context) => ScannerProvider()), // Ensure this is here
        ChangeNotifierProvider(create: (_) => OrderScanningProvider()),
        ChangeNotifierProvider(create: (_) => OrderHistoryProvider()),
      ],
      child:  Consumer<AuthProvider>(
        builder: (context, authProvider, _) {
          return MaterialApp.router(
            routerConfig: AppRouter.router, // Make sure your AppRouter is set up correctly
            debugShowCheckedModeBanner: false,
            title: 'Qeu Box',
            theme: ThemeData(
              useMaterial3: false,
            ),
          );
        },
      ),
    );
  }
}

