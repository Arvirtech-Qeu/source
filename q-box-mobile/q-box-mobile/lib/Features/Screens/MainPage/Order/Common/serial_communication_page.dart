import 'package:flutter/material.dart';
import 'package:flutter_serial_communication/models/device_info.dart';

import '../../../../../Utils/SerialCommunicationHelper.dart';

class SerialCommunicationPage extends StatefulWidget {
  const SerialCommunicationPage({super.key});

  @override
  State<SerialCommunicationPage> createState() => _SerialCommunicationPageState();
}

class _SerialCommunicationPageState extends State<SerialCommunicationPage> {
  final SerialCommunicationHelper _serialHelper = SerialCommunicationHelper();
  bool isConnected = false;
  List<DeviceInfo> connectedDevices = [];
  String messageStatus = "";

  @override
  void initState() {
    super.initState();
    _serialHelper.initializeListeners(_onConnectionChanged, _onMessageReceived);
    _getAllConnectedDevicesButtonPressed();
  }

  void _onConnectionChanged(bool isConnected) {
    setState(() {
      this.isConnected = isConnected;
    });
  }

  void _onMessageReceived(String message) {
    setState(() {
      messageStatus = message;
    });
  }

  void _getAllConnectedDevicesButtonPressed() async {
    await _serialHelper.getAllConnectedDevices();
    setState(() {
      connectedDevices = _serialHelper.connectedDevices;
    });
  }

  void _connectButtonPressed(DeviceInfo deviceInfo) async {
    await _serialHelper.connectToDevice(deviceInfo, 9600);
  }

  void _disconnectButtonPressed() async {
    await _serialHelper.disconnectDevice();
  }

  void _sendMessageButtonPressed(String hexString) async {
    await _serialHelper.sendHexMessage(hexString);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Serial Communication Page'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            Text("Is Connected: $isConnected"),
            const SizedBox(height: 16.0),
            FilledButton(
              onPressed: _getAllConnectedDevicesButtonPressed,
              child: const Text("Get All Connected Devices"),
            ),
            const SizedBox(height: 16.0),
            ...connectedDevices.asMap().entries.map((entry) {
              return Row(
                children: [
                  Flexible(child: Text(entry.value.productName)),
                  const SizedBox(width: 16.0),
                  FilledButton(
                    onPressed: () {
                      _connectButtonPressed(entry.value);
                    },
                    child: const Text("Connect"),
                  ),
                ],
              );
            }).toList(),
            const SizedBox(height: 16.0),
            FilledButton(
              onPressed: isConnected ? _disconnectButtonPressed : null,
              child: const Text("Disconnect"),
            ),
            const SizedBox(height: 16.0),
            FilledButton(
              onPressed: isConnected ? () => _sendMessageButtonPressed("5A5A00010004000A000100000101000000010F") : null,
              child: const Text("Send Message"),
            ),
            const SizedBox(height: 16.0),
            Text(
              messageStatus,
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: messageStatus.contains("Failed") || messageStatus.contains("Error")
                    ? Colors.red
                    : Colors.green,
              ),
            ),
          ],
        ),
      ),
    );
  }
}