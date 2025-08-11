import 'package:intl/intl.dart';

class Time {
  DateTime now = DateTime.now();

  getLocalTime(DateTime dateTime) async {
    final formatter = DateFormat('yyyy-MM-dd HH:mm:ss');
    return formatter.format(dateTime);
  }
}
