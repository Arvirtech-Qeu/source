import 'package:flutter/material.dart';
import 'dart:async';

class EmbeddedScannerScreen extends StatefulWidget {
  final Function(String) onScanComplete;

  const EmbeddedScannerScreen({super.key, required this.onScanComplete});

  @override
  _EmbeddedScannerScreenState createState() => _EmbeddedScannerScreenState();
}

class _EmbeddedScannerScreenState extends State<EmbeddedScannerScreen> {
  final TextEditingController _controller = TextEditingController();
  final FocusNode _focusNode = FocusNode();
  String _scannedData = "No data scanned yet.";
  Timer? _scanTimer;

  @override
  void initState() {
    super.initState();
    _controller.addListener(_onScan);
  }

  void _onScan() {
    // Cancel the previous timer if it exists
    _scanTimer?.cancel();

    // Start a new timer to debounce the input
    _scanTimer = Timer(Duration(milliseconds: 300), () {
      String scannedData = _controller.text.trim();

      // If the scanned data is non-empty and different from the previous value
      if (scannedData.isNotEmpty && scannedData != _scannedData) {
        setState(() {
          _scannedData = scannedData;
        });
        print('scannedData$scannedData');
        widget.onScanComplete(scannedData); // Call the callback with scanned data
        Navigator.pop(context);
    }

      // Clear the text controller for the next scan
      _controller.clear();
    });
  }

  void _startScan() {
    _controller.clear();
    setState(() {
      _scannedData = "Scanning..."; // Indicate scanning state
    });
    FocusScope.of(context).requestFocus(_focusNode); // Focus the hidden TextField
  }

  @override
  void dispose() {
    _controller.removeListener(_onScan);
    _controller.dispose();
    _focusNode.dispose();
    _scanTimer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('USB Barcode Scanner'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            // Hidden TextField to capture barcode input
            SizedBox(
              height: 0,
              child: TextField(
                controller: _controller,
                focusNode: _focusNode,
                autofocus: false,
              ),
            ),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: _startScan,
              child: Text("Scan QR Code"),
            ),
            SizedBox(height: 20),
            Text(
              'Scanned Data: $_scannedData', // Display scanned data
              style: TextStyle(fontSize: 20),
            ),
          ],
        ),
      ),
    );
  }
}