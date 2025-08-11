import 'package:flutter_serial_communication/flutter_serial_communication.dart';
import 'package:flutter_serial_communication/models/device_info.dart';

class DeviceChecker {
  final FlutterSerialCommunication _serialCommunicationPlugin =
  FlutterSerialCommunication();

  /// Check if there are any connected embedded devices
  Future<bool> isEmbeddedDeviceConnected() async {
    try {
      // Fetch the list of connected devices
      List<DeviceInfo> connectedDevices = await _serialCommunicationPlugin.getAvailableDevices();

      // Print the list of devices
      print('Connected Devices:');
      for (var device in connectedDevices) {
        print('Device Name: ${device.deviceName}, Vendor ID: ${device.vendorId}, Product ID: ${device.productId}');
      }

      // Return true if the list is not empty
      return connectedDevices.isNotEmpty;
    } catch (e) {
      print('Error while checking connected devices: $e');
      return false; // Handle the error gracefully
    }
  }
}
