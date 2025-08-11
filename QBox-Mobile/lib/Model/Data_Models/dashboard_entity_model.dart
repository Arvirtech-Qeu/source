// class EntityData {
//   final List<List<Map<String, dynamic>>> qboxes;
//   final List<dynamic> hotboxCount;
//   final List<dynamic> inventoryCount;
//
//   EntityData({
//     required this.qboxes,
//     required this.hotboxCount,
//     required this.inventoryCount,
//   });
//
//   EntityData copyWith({
//     String? entityName,
//     List<List<Map<String, dynamic>>>? qboxes,
//     List<dynamic>? hotboxCount,
//     List<dynamic>? inventoryCount,
//   }) {
//     return EntityData(
//       qboxes: qboxes ?? this.qboxes,
//       hotboxCount: hotboxCount ?? this.hotboxCount,
//       inventoryCount: inventoryCount ?? this.inventoryCount,
//     );
//   }
// }

class QboxEntity {
  final int qboxEntitySno;
  final String qboxEntityName;

  QboxEntity({required this.qboxEntitySno, required this.qboxEntityName});

  factory QboxEntity.fromJson(Map<String, dynamic> json) {
    return QboxEntity(
      qboxEntitySno: json['qboxEntitySno'],
      qboxEntityName: json['qboxEntityName'],
    );
  }
}