// models/qbox_item.dart
import 'package:google_maps_flutter/google_maps_flutter.dart';

class QBoxItem {
  final String id;
  final String name;
  final int quantity;
  final String status;
  final DateTime scannedAt;

  QBoxItem({
    required this.id,
    required this.name,
    required this.quantity,
    required this.status,
    required this.scannedAt,
  });
}

// models/delivery_order.dart
enum DeliveryStatus {
  readyForPickup,
  inTransit,
  delivered,
}

class DeliveryOrder {
  final String orderId;
  final String customerName;
  final String address;
  final List<String> items;
  final DeliveryStatus status;

  DeliveryOrder({
    required this.orderId,
    required this.customerName,
    required this.address,
    required this.items,
    required this.status,
  });

  DeliveryOrder copyWith({
    String? orderId,
    String? customerName,
    String? address,
    List<String>? items,
    DeliveryStatus? status,
  }) {
    return DeliveryOrder(
      orderId: orderId ?? this.orderId,
      customerName: customerName ?? this.customerName,
      address: address ?? this.address,
      items: items ?? this.items,
      status: status ?? this.status,
    );
  }
}

// models/support_ticket.dart
class SupportTicket {
  final String id;
  final String customerName;
  final String orderId;
  final String issue;
  final String priority;
  final String status;

  SupportTicket({
    required this.id,
    required this.customerName,
    required this.orderId,
    required this.issue,
    required this.priority,
    required this.status,
  });
}

// models/delivery_stop.dart

class DeliveryStop {
  final String orderId;
  final LatLng location;
  final String address;
  final String expectedTime;

  DeliveryStop({
    required this.orderId,
    required this.location,
    required this.address,
    required this.expectedTime,
  });
}