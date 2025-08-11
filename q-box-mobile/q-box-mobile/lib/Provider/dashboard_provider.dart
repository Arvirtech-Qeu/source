import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../Model/Data_Models/dashboard_entity_model.dart';
import '../Services/api_service.dart';
import '../Services/toast_service.dart';
import '../Services/token_service.dart';

class DashboardProvider with ChangeNotifier {
  final ApiService apiService = ApiService();
  final CommonService commonService = CommonService();
  List<dynamic> _hotboxCountList = [];
  List<dynamic> _currentInventoryCountlist = [];
  List<dynamic> _outwardOrderProcessingCountlist = [];
  final TokenService _tokenService = TokenService();
  bool _isLoading = true;
  String? _error;
  final List<dynamic> _outwardOrderList = [
    {"name": "Biriyani", "count": 8},
    {"name": "Sambar", "count": 12},
  ];
  List<dynamic> get qboxLists => _qboxList;
  List<dynamic> get hotboxCountList => _hotboxCountList;
  List<dynamic> get currentInventoryCountlist => _currentInventoryCountlist;
  List<dynamic> get outwardOrderProcessingCountlist => _outwardOrderProcessingCountlist;
  bool get isLoading => _isLoading;
  String? get error => _error;
  List<dynamic> get outwardOrderList => _outwardOrderList;
  Map<String, dynamic> qboxInventory = {};
  List<dynamic> qboxCounts = [];
  List<dynamic> qBoxNumber = [];
  int columnCount = 5; // Default value, update based on your needs
  int rowCount = 5;
  String qboxEntityName = "";
  List<List<Map<String, dynamic>>> _qboxList = [];
  List<List<Map<String, dynamic>>> get groupedQboxLists => _qboxList;
  List<QboxEntity> _qboxEntities = [];
  QboxEntity? _selectedQboxEntity;
  List<QboxEntity> get qboxEntities => _qboxEntities;
  QboxEntity? get selectedQboxEntity => _selectedQboxEntity;
  String _sortBy = 'Date';
  DateTime? _startDate;
  DateTime? _endDate;

  DateTime? get startDate => _startDate;
  DateTime? get endDate => _endDate;
  DateTime? _selectedDate;
  DateTime? get selectedDate => _selectedDate;

  String get sortBy => _sortBy;
  final List<String> sortOptions = ['Date', 'Food Item Name', 'Qbox ID'];
  String currentDate = DateFormat('yyyy-MM-dd').format(DateTime.now());
  int _currentPage = 1;
  int _itemsPerPage = 2;
  int get currentPage => _currentPage;
  int get itemsPerPage => _itemsPerPage;
  int get totalPages => (_currentInventoryCountlist.length / _itemsPerPage).ceil();

  void setSortBy(String value) {
    _sortBy = value;
    notifyListeners();
  }

  void nextPage() {
    if (_currentPage < totalPages) {
      _currentPage++;
      notifyListeners();
    }
  }

  void previousPage() {
    if (_currentPage > 1) {
      _currentPage--;
      notifyListeners();
    }
  }

  void setDateRange(DateTime? start, DateTime? end) {
    _startDate = start;
    _endDate = end;
    notifyListeners();
  }

  void setSelectedDate(DateTime date) {
    _selectedDate = date;
    notifyListeners();
  }

  // Reset filters (clears the selected date)
  void resetFilters() {
    _selectedDate = null;
    notifyListeners();
  }

  Future<void> setSelectedQboxEntity(QboxEntity entity) async {
    _selectedQboxEntity = entity;
    await _tokenService.saveQboxEntitySno(entity.qboxEntitySno);
    await getQboxes(entity.qboxEntitySno);
    await getCurrentInventoryCount(entity.qboxEntitySno);
    await getHotboxCount(entity.qboxEntitySno);
    notifyListeners();
  }

  Future<void> initialize() async {
    try {
      final user = await _tokenService.getUser();
      print('usersss$user');
      if (user != null) {
        Map<String, dynamic> userData;
        if (user is String) {
          userData = jsonDecode(user);
        } else if (user is Map<String, dynamic>) {
          userData = user;
        } else {
          throw Exception('Invalid user data format');
        }
        final qboxEntityDetails = userData['qboxEntityDetails'] as List<dynamic>;
        _qboxEntities = qboxEntityDetails.map((entity) => QboxEntity.fromJson(entity)).toList();
        int? savedQboxEntitySno = await _tokenService.getQboxEntitySno();
        if (savedQboxEntitySno != null) {
          print("Using saved QboxEntitySno");
          print('SavedQboxEntitySno: $savedQboxEntitySno');
          _selectedQboxEntity = _qboxEntities.firstWhere(
                (entity) => entity.qboxEntitySno == savedQboxEntitySno,
            orElse: () => _qboxEntities.first,
          );
        } else if (_qboxEntities.isNotEmpty) {
          print("No saved QboxEntitySno, using first entity");
          _selectedQboxEntity = _qboxEntities.first;
          savedQboxEntitySno = _selectedQboxEntity!.qboxEntitySno;
          print("currentsavedQboxEntitySno:$savedQboxEntitySno");
          await _tokenService.saveQboxEntitySno(savedQboxEntitySno);
        }
        if (_selectedQboxEntity != null){
          await getQboxes(_selectedQboxEntity!.qboxEntitySno);
          await getCurrentInventoryCount(_selectedQboxEntity!.qboxEntitySno);
          await getHotboxCount(_selectedQboxEntity!.qboxEntitySno);
          await getOutwardDeliveryCount(_selectedQboxEntity!.qboxEntitySno);
        }
      }
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> refreshData() async {
    var entitySno = await _tokenService.getQboxEntitySno();
    print("entitySno$entitySno");
    if (entitySno != null) {
      await Future.wait([
        getQboxes(entitySno),
        getCurrentInventoryCount(entitySno),
        getHotboxCount(entitySno),
        getOutwardDeliveryCount(entitySno),
      ]);
    }
  }

  Future<dynamic> getQboxes(int qboxEntitySno) async {
    try {
      _isLoading = true;
      _error = null;
      notifyListeners();

      Map<String, dynamic> params = {"qboxEntitySno": qboxEntitySno};
      print("params: $params");

      var result = await apiService.post(
        "8911",
        "masters",
        "get_box_cell_inventory_v2",
        params,
      );
      print("resultsssss: $result");
      if (result != null && result['isSuccess'] == true) {
        qboxInventory = result['data']['qboxInventory'] ?? {};
        qboxCounts = result['data']['qboxCounts'] ?? [];
        qBoxNumber = result['data']['qboxInventory']['qBoxNumber'] ?? [];
        qboxEntityName =
            result['data']['qboxInventory']['qboxEntityName'] ?? "Entity";
        Map<int, List<Map<String, dynamic>>> groupedQboxes = {};
        print("qBoxNumberssss$qBoxNumber");
        for (var qbox in qboxInventory['qboxes'] ?? []) {
          int entityInfraSno = qbox['EntityInfraSno'] ?? 0;
          if (!groupedQboxes.containsKey(entityInfraSno)) {
            groupedQboxes[entityInfraSno] = [];
          }
          groupedQboxes[entityInfraSno]!.add(qbox);
        }
        _qboxList = groupedQboxes.values.toList();
        notifyListeners();
      } else {
      }
    } catch (e) {
      print("Error in getQboxes: $e");
      _error = 'An error occurred while retrieving the data.';
      commonService.errorToast(_error!);
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  void setCurrentInventoryCountList(List<Map<String, dynamic>> list) {
    _currentInventoryCountlist = list;
    _currentPage = 1;
    notifyListeners();
  }

  Future<dynamic> getCurrentInventoryCount(int qboxEntitySno) async {
    try {
      _isLoading = true;
      _error = null;
      notifyListeners();

      Map<String, dynamic> params = {
        "qboxEntitySno": qboxEntitySno,
        "transactionDate": currentDate
      };
      var result = await apiService.post(
          "8911", "masters", "get_sku_dashboard_counts", params);
      print("get_sku_dashboard_counts$result");
      if (result != null && result['data'] != null) {
        _currentInventoryCountlist = result['data'] ?? [];
        print('_currentInventoryCountlist$_currentInventoryCountlist');
      } else {
      }
    } catch (e) {
      _error = 'An error occurred while retrieving the data.';
      debugPrint('$e');
      commonService.errorToast(_error!);
      setCurrentInventoryCountList([]);
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<dynamic> getOutwardDeliveryCount(int qboxEntitySno) async {
    try {
      _isLoading = true;
      _error = null;
      notifyListeners();

      Map<String, dynamic> params = {
        "qboxEntitySno": qboxEntitySno,
        "orderedTime": currentDate
      };
      print("parama$params");
      var result = await apiService.post(
          "8911", "masters", "get_unallocated_food_orders", params);
      print("get_unallocated_food_orders${result['data']}");
      if (result != null && result['data'] != null) {
        _outwardOrderProcessingCountlist = result['data'] ?? [];
        print('outwardOrderProcessingCountlist$_outwardOrderProcessingCountlist');
      } else {
      }
    } catch (e) {
      _error = 'An error occurred while retrieving the data.';
      debugPrint('$e');
      commonService.errorToast(_error!);
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> getHotboxCount(int qboxEntitySno) async {
    try {
      _isLoading = true;
      _error = null;
      notifyListeners();

      Map<String, dynamic> params = {
        "qboxEntitySno": qboxEntitySno,
        "transactionDate": currentDate
      };
      var result =
      await apiService.post("8911", "masters", "get_hotbox_count_v2", params);
      print("my result:$result");
      if (result != null && result['data'] != null) {
        _hotboxCountList = result['data']['hotboxCounts'];
        print('_hotboxCountlist$_hotboxCountList');
      } else {

      }
    } catch (e) {
      _error = 'An error occurred while retrieving the data.';
      debugPrint('$e');
      commonService.errorToast(_error!);
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}