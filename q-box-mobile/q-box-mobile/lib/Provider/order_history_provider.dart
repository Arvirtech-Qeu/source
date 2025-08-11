import 'package:flutter/material.dart';
import '../Services/api_service.dart';

class OrderHistoryProvider extends ChangeNotifier {
  final ApiService _apiService = ApiService();
  bool _isLoading = false;
  String? _error;
  List<dynamic> _purchaseOrder = [];
  final Set<int> _expandedInwardIndices = {};
  final Set<int> _expandedOutwardIndices = {};
  List<dynamic> _salesOrder = [];
  String _sortBy = 'Date';
  final List<String> sortOptions = ['Date', 'Food Item Name', 'Qbox ID'];
  bool _isAscending = false;
  DateTime? _startDate;
  DateTime? _endDate;

  DateTime? get startDate => _startDate;
  DateTime? get endDate => _endDate;
  bool get isAscending => _isAscending;
  String get sortBy => _sortBy;
  bool get isLoading => _isLoading;
  String? get error => _error;
  Set<int> get expandedInwardIndices => _expandedInwardIndices;
  Set<int> get expandedOutwardIndices => _expandedOutwardIndices;
  List<dynamic> get purchaseOrder => _purchaseOrder;
  List<dynamic> get salesOrder => _salesOrder;

  void setSortBy(String value) {
    _sortBy = value;
    notifyListeners();
  }

  void toggleSortOrder() {
    _isAscending = !_isAscending;
    notifyListeners();
  }

  void resetFilters() {
    _sortBy = 'Date';
    _isAscending = false;
    _startDate = null;
    _endDate = null;
    notifyListeners();
  }

  void setDateRange(DateTime? start, DateTime? end) {
    _startDate = start;
    _endDate = end;
    notifyListeners();
  }

  Future<void> fetchOutwardOrderItems(int qboxEntitySno) async {
    try {
      _isLoading = true;
      notifyListeners();
      Map<String, dynamic> params = {"qboxEntitySno": qboxEntitySno};

      var result = await _apiService.post(
        "8911",
        "masters",
        "partner_channel_outward_delivery_history",
        params,
      );

      if (result != null) {
        if (result is List) {
          _salesOrder = result;
        } else if (result is Map<String, dynamic>) {
          var data = result['data'];
          if (data is List) {
            _salesOrder = data;
          } else if (data is Map<String, dynamic>) {
            _salesOrder = [data];
          } else {
            _salesOrder = [];
          }
        } else {
          _salesOrder = [];
        }
      } else {
        _salesOrder = [];
      }
      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<dynamic> fetchInwardOrders(int qboxEntitySno) async {
    try {
      _isLoading = true;
      _error = null;
      notifyListeners();

      Map<String, dynamic> params = {"qboxEntitySno": qboxEntitySno};

      var result = await _apiService.post(
          "8911", "masters", "partner_channel_inward_delivery_history", params);

      if (result != null &&
          result['data'] != null &&
          result['data']['myOrders'] != null) {
        print("inwardOrderResult:${result['data']}");
        _purchaseOrder = result['data']['myOrders'];
        print("inwardOrder:$_purchaseOrder");
      } else {
        _purchaseOrder = [];
      }
      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
    }
  }

  // Future<void> fetchInwardOrders(int qboxEntitySno) async {
  //   try {
  //     _isLoading = true;
  //     _error = null;
  //     notifyListeners();
  //     Map<String, dynamic> params = {
  //       "qboxEntitySno":qboxEntitySno
  //     };
  //
  //     var result = await _apiService.post(
  //         "8911",
  //         "masters",
  //         "partner_channel_inward_delivery_history",
  //         params
  //     );
  //     print("resultss$result");
  //     if (result != null) {
  //       if (result is List) {
  //         _purchaseOrder = result;
  //       } else if (result is Map<String, dynamic>) {
  //         var data = result['data'];
  //         if (data is List) {
  //           _purchaseOrder = data;
  //         } else if (data is Map<String, dynamic>) {
  //           _purchaseOrder = [data];
  //         } else {
  //           _purchaseOrder = [];
  //         }
  //       } else {
  //         _purchaseOrder = [];
  //       }
  //     } else {
  //       _purchaseOrder = [];
  //     }
  //     _isLoading = false;
  //     notifyListeners();
  //
  //   } catch (e) {
  //     _error = e.toString();
  //     _isLoading = false;
  //     notifyListeners();
  //   }
  // }
}
