import 'package:flutter/material.dart';
import 'package:flutter_serial_communication/flutter_serial_communication.dart';
import 'package:flutter_serial_communication/models/device_info.dart';
import 'dart:typed_data';

class SerialCommunicationHelper {
  final FlutterSerialCommunication _flutterSerialCommunicationPlugin = FlutterSerialCommunication();
  bool isConnected = false;
  List<DeviceInfo> connectedDevices = [];
  String messageStatus = "";

  void initializeListeners(void Function(bool) onConnectionChanged, void Function(String) onMessageReceived) {
    _flutterSerialCommunicationPlugin
        .getSerialMessageListener()
        .receiveBroadcastStream()
        .listen((event) {
      onMessageReceived("Received From Native:  $event");
    });

    _flutterSerialCommunicationPlugin
        .getDeviceConnectionListener()
        .receiveBroadcastStream()
        .listen((event) {
      onConnectionChanged(event);
    });
  }

  Future<void> getAllConnectedDevices() async {
    List<DeviceInfo> newConnectedDevices = await _flutterSerialCommunicationPlugin.getAvailableDevices();
    connectedDevices = newConnectedDevices;
  }

  Future<void> connectToDevice(DeviceInfo deviceInfo, int baudRate) async {
    bool isConnectionSuccess = await _flutterSerialCommunicationPlugin.connect(deviceInfo, baudRate);
    isConnected = isConnectionSuccess;
    debugPrint("Is Connection Success:  $isConnectionSuccess");
  }

  Future<void> disconnectDevice() async {
    await _flutterSerialCommunicationPlugin.disconnect();
    isConnected = false;
    messageStatus = "Disconnected";
  }

  Future<void> sendHexMessage(String hexString) async {
    try {
      List<int> messageBytes = _hexStringToByteArray(hexString);
      bool isMessageSent = await _flutterSerialCommunicationPlugin.write(Uint8List.fromList(messageBytes));

      messageStatus = isMessageSent ? "Message Sent Successfully" : "Message Sending Failed";
      debugPrint("Is Message Sent:  $isMessageSent");
    } catch (e) {
      messageStatus = "Error: $e";
      debugPrint("Error Sending Message: $e");
    }
  }

  List<int> _hexStringToByteArray(String hexString) {
    List<int> bytes = [];
    for (int i = 0; i < hexString.length; i += 2) {
      String hexByte = hexString.substring(i, i + 2);
      bytes.add(int.parse(hexByte, radix: 16));
    }

    return bytes;
  }
}