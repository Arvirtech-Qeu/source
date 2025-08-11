class InventoryItem {
  final int inCount;
  final String skuCode;
  final int outCount;
  final int totalCount;
  final String description;

  InventoryItem({
    required this.inCount,
    required this.skuCode,
    required this.outCount,
    required this.totalCount,
    required this.description,
  });

  factory InventoryItem.fromJson(Map<String, dynamic> json) {
    return InventoryItem(
      inCount: json['inCount'] ?? 0,
      skuCode: json['skuCode'] ?? '',
      outCount: json['outCount'] ?? 0,
      totalCount: json['totalCount'] ?? 0,
      description: json['description'] ?? '',
    );
  }
}



