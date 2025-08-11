// import 'dart:io';
//
// import 'package:device_info/device_info.dart';
//
// class DeviceInfo {
//   final deviceInfo = DeviceInfoPlugin();
//
//   Future<String> getDeviceId() async {
//     AndroidDeviceInfo androidInfo;
//     IosDeviceInfo iosInfo;
//     try {
//       if(Platform.isAndroid){
//         androidInfo = await deviceInfo.androidInfo;
//         return androidInfo.androidId;
//       }else{
//         iosInfo = await deviceInfo.iosInfo;
//         return iosInfo.identifierForVendor;
//       }
//     } catch (e) {
//       return 'Error';
//     }
//   }
// }

import 'dart:io';
import 'package:device_info_plus/device_info_plus.dart';

class DeviceInfo {
  final deviceInfo = DeviceInfoPlugin();

  Future<String> getDeviceId() async {
    try {
      if (Platform.isAndroid) {
        AndroidDeviceInfo androidInfo = await deviceInfo.androidInfo;
        return androidInfo.id ?? 'Unknown';
      } else if (Platform.isIOS) {
        IosDeviceInfo iosInfo = await deviceInfo.iosInfo;
        return iosInfo.identifierForVendor ?? 'Unknown';
      } else {
        return 'Unsupported platform';
      }
    } catch (e) {
      return 'Error: $e';
    }
  }
}
