import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import 'package:qr_page/Provider/order_history_provider.dart';
import 'package:qr_page/Widgets/Custom/app_colors.dart';
import 'package:qr_page/Utils/network_error.dart';
import '../../../../../Services/token_service.dart';
import '../../../../../Widgets/Custom/custom_modern_tabbar.dart';
import 'outward_delivery_history.dart';
import 'order_history_card.dart';

class HistoryScreen extends StatefulWidget {
  static const String routeName = '/history';
  const HistoryScreen({super.key});

  @override
  State<HistoryScreen> createState() => _HistoryScreenState();
}

class _HistoryScreenState extends State<HistoryScreen> with TickerProviderStateMixin {
  late TabController _tabController;
  late List<TabItem> _tabItems;
  TokenService tokenService = TokenService();

  @override
  void initState() {
    super.initState();
    _tabItems = [
      TabItem(title: 'Inward Order', icon: Icons.arrow_downward),
      TabItem(title: 'Outward Order', icon: Icons.arrow_upward),
    ];
    _tabController = TabController(length: _tabItems.length, vsync: this);
    // context.read<OrderHistoryProvider>().fetchInwardOrders();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<OrderHistoryProvider>(context);

    return NetworkWrapper(
      child: SafeArea(
        child: Scaffold(
          appBar: AppBar(
            automaticallyImplyLeading: false,
            elevation: 0,
            backgroundColor: Colors.transparent,
            title: Text('Order History', style: TextStyle(color: Colors.black),),
            actions: [],
          ),
          body: Column(
            children: [
              SizedBox(height: 16),
              _buildTabBar(),
              Expanded(
                child: TabBarView(
                  controller: _tabController,
                  children: [
                    OrderHistoryCard(),
                    OutwardOrderHistoryCard(),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTabBar() {
    final isTablet = MediaQuery.of(context).size.shortestSide >= 600;
    return isTablet ? Container(
      margin: EdgeInsets.symmetric(horizontal: 24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(10),
      ),
      child: ModernTabBar(
        controller: _tabController,
        tabItems: _tabItems,
        onTap: (index) {
          print('Tapped on tab $index');
        },
      ),
    ).animate()
        .fadeIn(duration: 600.ms)
        .slideY(begin: 0.2, end: 0):LayoutBuilder(
        builder: (BuildContext context, BoxConstraints constraints) {
          return Container(
            margin: EdgeInsets.symmetric(horizontal: 24),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(10),
            ),
            child: ModernTabBar(
              controller: _tabController,
              tabItems: _tabItems,
              onTap: (index) {
                print('Tapped on tab $index');
              },
              isScrollable: true,
              labelPadding: EdgeInsets.symmetric(horizontal: 16),
            ),
          ).animate()
              .fadeIn(duration: 600.ms)
              .slideY(begin: 0.2, end: 0);
    });
  }

  void _showFilterBottomSheet(BuildContext context, OrderHistoryProvider provider) {
    showModalBottomSheet(
      context: context,
      builder: (BuildContext context) {
        return StatefulBuilder(
          builder: (BuildContext context, StateSetter setModalState) {
            return Container(
              padding: EdgeInsets.all(16),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    'Filter and Sort',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: AppColors.mintGreen,
                    ),
                  ),
                  SizedBox(height: 16),

                  DropdownButtonFormField<String>(
                    value: provider.sortBy,
                    decoration: InputDecoration(
                      labelText: 'Sort By',
                      border: OutlineInputBorder(),
                    ),
                    items: provider.sortOptions.map((String value) {
                      return DropdownMenuItem<String>(
                        value: value,
                        child: Text(value),
                      );
                    }).toList(),
                    onChanged: (newValue) {
                      if (newValue != null) {
                        setModalState(() {
                          provider.setSortBy(newValue);
                        });
                      }
                    },
                  ),
                  SizedBox(height: 16),

                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Ascending Order'),
                      Switch(
                        value: provider.isAscending,
                        onChanged: (bool value) {
                          setModalState(() {
                            provider.toggleSortOrder();
                          });
                        },
                        activeColor: AppColors.mintGreen,
                      ),
                    ],
                  ),
                  SizedBox(height: 16),

                  ElevatedButton.icon(
                    onPressed: () => _selectDateRange(context, provider),
                    icon: Icon(Icons.calendar_today, color: Colors.white),
                    label: Text(
                      provider.startDate == null || provider.endDate == null
                          ? 'Select Date Range'
                          : '${DateFormat('MMM dd, yyyy').format(provider.startDate!)} - ${DateFormat('MMM dd, yyyy').format(provider.endDate!)}',
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.mintGreen,
                      foregroundColor: Colors.white,
                    ),
                  ),
                  SizedBox(height: 16),

                  ElevatedButton(
                    onPressed: () {
                      provider.resetFilters();
                      Navigator.pop(context);
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.grey[300],
                      foregroundColor: Colors.black,
                    ),
                    child: Text('Reset Filters'),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  Future<void> _selectDateRange(BuildContext context, OrderHistoryProvider provider) async {
    final DateTimeRange? picked = await showDateRangePicker(
      context: context,
      firstDate: DateTime(2000),
      lastDate: DateTime.now(),
      initialDateRange: provider.startDate != null && provider.endDate != null
          ? DateTimeRange(start: provider.startDate!, end: provider.endDate!)
          : null,
    );

    if (picked != null) {
      provider.setDateRange(picked.start, picked.end);
    }
  }

}