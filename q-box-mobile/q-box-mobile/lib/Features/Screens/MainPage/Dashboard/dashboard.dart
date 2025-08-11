import 'dart:convert';
import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import 'package:qr_page/Features/Screens/Login/second_login.dart';
import 'package:qr_page/Provider/auth_provider.dart';
import 'package:qr_page/Provider/dashboard_provider.dart';
import 'package:qr_page/Services/toast_service.dart';
import 'package:qr_page/Services/token_service.dart';
import 'package:qr_page/Widgets/Custom/app_colors.dart';
import '../../../../Model/Data_Models/dashboard_entity_model.dart';
import '../../../../Model/Data_Models/dashboard_model/dashboard_model.dart';

enum ScreenLayout {
  mobile,
  tablet,
}

class Dashboard extends StatefulWidget {
  static const String routeName = '/dashboard';
  const Dashboard({super.key});
  @override
  State<Dashboard> createState() => _DashboardState();
}

class _DashboardState extends State<Dashboard>
    with SingleTickerProviderStateMixin {
  final CommonService commonService = CommonService();
  late AnimationController _headerController;
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  List<InventoryItem> inventoryItems = [];
  final TokenService _tokenService = TokenService();
  List<QboxEntity> qboxEntities = [];
  int? savedQboxEntitySno;
  late final  user;

  ScreenLayout _getScreenLayout(BuildContext context) {
    double width = MediaQuery.of(context).size.width;
    if (width < 600) {
      return ScreenLayout.mobile;
    }
    return ScreenLayout.tablet;
  }

  @override
  void initState() {
    super.initState();
    getCurrentSno();
    getUser();
    _headerController = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    );
    _headerController.forward();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<DashboardProvider>().initialize();
    });
  }

  getCurrentSno() async {
    savedQboxEntitySno = await _tokenService.getQboxEntitySno();
    print("latest$savedQboxEntitySno");
  }



  Future<Map<String, dynamic>> getUser() async {
    return await _tokenService.getUser();
  }

  @override
  void dispose() {
    _headerController.dispose();
    super.dispose();
  }

  Map<String, dynamic>? selectedItem;

  final List<Map<String, dynamic>> outwardOrders = [
    {
      "itemName": "Biriyani",
      "count": "8",
      "itemColor": Colors.orange.shade700,
      "status": "Delivered",
      'imageUrl':
          'https://media.istockphoto.com/id/467631905/photo/hyderabadi-biryani-a-popular-chicken-or-mutton-based-dish.jpg?s=612x612&w=0&k=20&c=8O-erNH35y5qHS8i6dbWPi5Xscb40fNBhK6t1VI8GBc='
    },
    {
      "itemName": "Sambar",
      "count": "12",
      "itemColor": Colors.green,
      "status": "Cancelled",
      'imageUrl':
          'https://t3.ftcdn.net/jpg/00/36/35/20/240_F_36352011_mqoIDF2IUy1eGD3gOf6y8gkZ449PiBcK.jpg'
    },
  ];

  @override
  Widget build(BuildContext context) {
    final screenLayout = _getScreenLayout(context);
    return Scaffold(
      key: _scaffoldKey,
      endDrawer: Drawer(
        child: Column(
          children: [
            // Top section with red background
            Container(
              color: AppColors.mintGreen,
              height: 250, // Fixed height for red section
              width: double.infinity, // Full width
              child: Column(
                mainAxisAlignment: MainAxisAlignment.start,
                children: [
                  Container(
                    padding: EdgeInsets.only(top: 50, bottom: 20),
                    child: Column(
                      children: [
                        SizedBox(
                          width: 100,
                          height: 100,
                          child: ClipOval(
                            child: Image.network(
                              'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqkUYrITWyI8OhPNDHoCDUjGjhg8w10_HRqg&s',
                              fit: BoxFit.cover,
                            ),
                          ),
                        ),
                        SizedBox(height: 16),
                        Text(
                          'Loader',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: Colors.white, // Adjusted for contrast
                          ),
                        ),
                        SizedBox(height: 8),
                        FutureBuilder<Map<String, dynamic>>(
                          future: getUser(),
                          builder: (context, snapshot) {
                            if (snapshot.connectionState == ConnectionState.waiting) {
                              return CircularProgressIndicator();
                            } else if (snapshot.hasError) {
                              return Text('Error: ${snapshot.error}', style: TextStyle(color: Colors.white));
                            } else if (!snapshot.hasData || snapshot.data == null) {
                              return Text('No user data available', style: TextStyle(color: Colors.white));
                            } else {
                              final user = snapshot.data!;
                              return Text(
                                user['authUserName'] ?? 'No username',
                                style: TextStyle(
                                  fontSize: 14,
                                  color: Colors.white, // Adjusted for contrast
                                ),
                              );
                            }
                          },
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            // Bottom section with white background, logout button just below red section
            Container(
              color: Colors.white,
              width: double.infinity,
              child: Column(
                mainAxisSize: MainAxisSize.min, // Only take needed height
                children: [
                  ListTile(
                    leading: Icon(Icons.logout, color: AppColors.mintGreen),
                    title: Text(
                      'Logout',
                      style: TextStyle(
                        fontSize: 16,
                        color: AppColors.mintGreen,
                      ),
                    ),
                    onTap: () {
                      Navigator.pop(context);
                      _handleLogout();
                    },
                  ),
                ],
              ),
            ),
            // Fill remaining space
            Expanded(child: Container(color: Colors.white)),
          ],
        ),
      ),
      body: FutureBuilder(
        future: Provider.of<DashboardProvider>(context, listen: false).initialize(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(
              child: CircularProgressIndicator(
                color: AppColors.mintGreen,
              ),
            );
          } else if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          } else {
            return Consumer<DashboardProvider>(
              builder: (context, provider, child) {
                if (provider.isLoading) {
                  return const Center(
                    child: CircularProgressIndicator(
                      color: AppColors.mintGreen,
                    ),
                  );
                }
                final isTablet = MediaQuery.of(context).size.shortestSide >= 600;
                return Row(
                  children: [
                    Expanded(
                      child: Column(
                        children: [
                          _buildHeader(context, screenLayout),
                          Expanded(
                            child: RefreshIndicator(
                              color: AppColors.mintGreen,
                              onRefresh: () => provider.refreshData(),
                              child: CustomScrollView(
                                slivers: [
                                  SliverPadding(
                                    padding: EdgeInsets.all(
                                      screenLayout == ScreenLayout.mobile ? 16.0 : 20.0,
                                    ),
                                    sliver: SliverToBoxAdapter(
                                      child: Column(
                                        children: [
                                          isTablet
                                              ? Row(
                                            mainAxisAlignment: MainAxisAlignment.start,
                                            crossAxisAlignment: CrossAxisAlignment.start,
                                            children: [
                                              Expanded(
                                                flex: 5,
                                                child: Container(
                                                  decoration: BoxDecoration(
                                                    color: Colors.white,
                                                    boxShadow: [
                                                      BoxShadow(
                                                        color: Colors.black12,
                                                        blurRadius: 8,
                                                        offset: Offset(0, 2),
                                                      ),
                                                    ],
                                                  ),
                                                  child: Column(
                                                    crossAxisAlignment: CrossAxisAlignment.start,
                                                    children: [
                                                      _buildCurrentTime(),
                                                      _buildInventoryTable(),
                                                    ],
                                                  ),
                                                ),
                                              ),
                                              SizedBox(width: 5),
                                              Expanded(
                                                flex: 3,
                                                child: Container(
                                                  decoration: BoxDecoration(
                                                    color: Colors.white,
                                                    boxShadow: [
                                                      BoxShadow(
                                                        color: Colors.black12,
                                                        blurRadius: 8,
                                                        offset: Offset(0, 2),
                                                      ),
                                                    ],
                                                  ),
                                                  child: Column(
                                                    crossAxisAlignment: CrossAxisAlignment.start,
                                                    children: [
                                                      _buildOutwardOrder(),
                                                      outwardTableWidget(provider),
                                                    ],
                                                  ),
                                                ),
                                              ),
                                            ],
                                          )
                                              : Column(
                                            children: [
                                              Container(
                                                decoration: BoxDecoration(
                                                  color: Colors.white,
                                                  boxShadow: [
                                                    BoxShadow(
                                                      color: Colors.black12,
                                                      blurRadius: 8,
                                                      offset: Offset(0, 2),
                                                    ),
                                                  ],
                                                ),
                                                child: Column(
                                                  children: [
                                                    _buildCurrentTime(),
                                                    _buildInventoryTable(),
                                                  ],
                                                ),
                                              ),
                                              SizedBox(height: 5),
                                              Container(
                                                decoration: BoxDecoration(
                                                  color: Colors.white,
                                                  boxShadow: [
                                                    BoxShadow(
                                                      color: Colors.black12,
                                                      blurRadius: 8,
                                                      offset: Offset(0, 2),
                                                    ),
                                                  ],
                                                ),
                                                child: Column(
                                                  children: [
                                                    _buildOutwardOrder(),
                                                    outwardTableWidget(provider),
                                                  ],
                                                ),
                                              ),
                                            ],
                                          ),
                                          SizedBox(
                                            height: screenLayout == ScreenLayout.mobile ? 16 : 24,
                                          ),
                                          _buildMainContent(context, provider),
                                        ],
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                );
              },
            );
          }
        },
      ),
    );
  }

  Widget _buildCurrentTime() {
    return Container(
      width: double.infinity,
      padding: EdgeInsets.symmetric(vertical: 8),
      decoration: BoxDecoration(
        // borderRadius: BorderRadius.only(topLeft: Radius.circular(12),topRight:  Radius.circular(12)),
        gradient: LinearGradient(
          colors: [Colors.red.shade400, Colors.red.shade600],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black26,
            blurRadius: 4,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Text(
        'Current Inventory - ${DateFormat('dd-MM-yyyy hh:mm a').format(DateTime.now())}',
        textAlign: TextAlign.center,
        style: TextStyle(
            fontSize: 18, fontWeight: FontWeight.w500, color: AppColors.white),
      ),
    );
  }

  Widget _buildOutwardOrder() {
    return Container(
      width: double.infinity,
      padding: EdgeInsets.symmetric(vertical: 8),
      decoration: BoxDecoration(
        // borderRadius: BorderRadius.only(topLeft: Radius.circular(12),topRight:  Radius.circular(12)),
        gradient: LinearGradient(
          colors: [Colors.red.shade400, Colors.red.shade600],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black26,
            blurRadius: 4,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Text(
        'Outward Order - In Process',
        textAlign: TextAlign.center,
        style: TextStyle(
            fontSize: 18, fontWeight: FontWeight.w500, color: AppColors.white),
      ),
    );
  }

  Widget outwardTableWidget(DashboardProvider provider) {
    return provider.outwardOrderProcessingCountlist == null ||
            provider.outwardOrderProcessingCountlist.isEmpty
        ? Container(
            padding: EdgeInsets.all(12),
            child: Text("No present outward orders available!"),
          )
        : Container(
            decoration: BoxDecoration(
              color: Colors.white,
              boxShadow: [
                BoxShadow(
                  color: Colors.black12,
                  blurRadius: 8,
                  offset: Offset(0, 2),
                ),
              ],
            ),
            child: ListView.builder(
              shrinkWrap: true,
              itemCount: provider.outwardOrderProcessingCountlist.length,
              itemBuilder: (context, index) {
                final provider = Provider.of<DashboardProvider>(context);
                final item = provider.outwardOrderProcessingCountlist[index];
                return Container(
                  padding: EdgeInsets.symmetric(vertical: 12, horizontal: 12),
                  decoration: BoxDecoration(
                    color: index.isEven ? Colors.grey.shade50 : Colors.white,
                    border: Border(
                      bottom: BorderSide(color: Colors.grey.shade200),
                    ),
                  ),
                  child: Row(
                    children: [
                      Expanded(
                        flex: 2,
                        child: Text(
                          "${item['skuName']}",
                          style: TextStyle(
                            color: AppColors.black,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                      Container(
                        padding:
                            EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                        decoration: BoxDecoration(
                            color: Colors.green.shade100,
                            borderRadius: BorderRadius.circular(15),
                            border: Border.all(
                                color: Colors.green.shade300, width: 1)),
                        child: Text("${item['count']}",
                            textAlign: TextAlign.center,
                            style: TextStyle(
                                color: Colors.green.shade800,
                                fontWeight: FontWeight.bold)),
                      ),
                    ],
                  ),
                );
              },
            ),
          );
  }

  void _handleLogout() async {
    final isTablet = MediaQuery.of(context).size.shortestSide >= 600;
    await showDialog(
      context: context,
      builder: (BuildContext context) {
        return Dialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          child: Container(
            width: isTablet ? 300 : MediaQuery.of(context).size.width,
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(
                  Icons.logout_rounded,
                  color: Colors.red,
                  size: 48,
                ),
                const SizedBox(height: 16),
                const Text(
                  'Logout',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: Colors.black,
                  ),
                ),
                const SizedBox(height: 8),
                const Text(
                  'Are you sure you want to logout?',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 16,
                    color: Colors.black87,
                  ),
                ),
                const SizedBox(height: 24),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    Expanded(
                      child: TextButton(
                        onPressed: () => Navigator.pop(context),
                        style: TextButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8),
                          ),
                        ),
                        child: const Text(
                          'Cancel',
                          style: TextStyle(
                            fontSize: 16,
                            color: Colors.black54,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 16),
                    Consumer<AuthProvider>(builder: (
                      context,
                      provider,
                      _,
                    ) {
                      return Expanded(
                        child: ElevatedButton(
                          onPressed: () {
                            Navigator.pop(context);
                            provider.logout();
                            GoRouter.of(context).push(LoginScreen.routeName);
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.red,
                            padding: const EdgeInsets.symmetric(vertical: 12),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(8),
                            ),
                          ),
                          child: const Text(
                            'Logout',
                            style: TextStyle(
                              fontSize: 16,
                              color: Colors.white,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      );
                    })
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildMainContent(BuildContext context, DashboardProvider provider) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildQboxStatus(context, provider),
        SizedBox(height: 16),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Hot Box - Current Status (Over All)',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w500,
                color: Colors.black,
              ),
            ),
            SizedBox(height: 16),
            _buildHotBoxStatus(),
          ],
        ),
      ],
    );
  }

  Widget _buildQboxStatus(BuildContext context, DashboardProvider provider) {
    final groupedQboxes = provider.groupedQboxLists;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Qeu Box - Current Status',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w500,
            color: Colors.black,
          ),
        ),
        SizedBox(height: 16),
        for (var i = 0; i < groupedQboxes.length; i++) ...[
          Builder(
            builder: (context) {
              int entityInfraSno = groupedQboxes[i].isNotEmpty
                  ? groupedQboxes[i][0]['EntityInfraSno']
                  : 0;
              var qBoxNumberEntry = provider.qBoxNumber.firstWhere(
                (entry) => entry['entityInfraSno'] == entityInfraSno,
                orElse: () =>
                    {'columnCount': '10', 'rowCount': '10'}, // default fallback
              );
              int rowCount =
                  int.tryParse(qBoxNumberEntry['rowCount'] ?? '10') ?? 10;
              int columnCount =
                  int.tryParse(qBoxNumberEntry['columnCount'] ?? '10') ?? 10;
              return Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Qeu Box: ($columnCount x $rowCount)',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w900,
                      color: AppColors.black,
                    ),
                  ),
                  SizedBox(height: 8),
                  LayoutBuilder(
                    builder: (context, constraints) {
                      final cellWidth =
                          (constraints.maxWidth - ((columnCount - 1) * 8)) /
                              columnCount;
                      final cellHeight = cellWidth * 1.2;
                      final fontSize = cellWidth * 0.12;
                      return GridView.builder(
                        shrinkWrap: true,
                        physics: NeverScrollableScrollPhysics(),
                        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: columnCount > 0 ? columnCount : 1,
                          childAspectRatio: cellWidth > 0 && cellHeight > 0
                              ? cellWidth / cellHeight
                              : 1.0, // Fallback to 1.0 if calculations fail
                          mainAxisSpacing: 8,
                          crossAxisSpacing: 8,
                        ),
                        itemCount: groupedQboxes[i].length,
                        itemBuilder: (context, index) {
                          return _buildGridCell(
                            context,
                            groupedQboxes[i][index],
                            cellHeight, // Use calculated cell height
                            fontSize, // Fixed font size
                            index,
                          );
                        },
                      );
                    },
                  ),
                  SizedBox(height: 16),
                ],
              );
            },
          ),
        ]
      ],
    );
  }

  Widget _buildGridCell(BuildContext context, Map<String, dynamic> qbox,
      double cellHeight, double fontSize, int index) {
    bool isFilled = qbox['foodCode'] != null;
    return InkWell(
      onTap: () {
        if (isFilled) {
          _showItemDetails(context, qbox);
        } else {
          _showEmptyItemDetails(context, qbox);
        }
      },
      child: Container(
        decoration: BoxDecoration(
          color: isFilled ? Color(0xFF2ECC71) : Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isFilled ? Color(0xFF27AE60) : Colors.grey[300]!,
            width: 1.5,
          ),
          boxShadow: [
            BoxShadow(
              color: isFilled
                  ? Color(0xFF2ECC71).withOpacity(0.3)
                  : Colors.grey.withOpacity(0.15),
              blurRadius: 10,
              offset: const Offset(0, 5),
              spreadRadius: 0,
            ),
          ],
        ),
        child: Stack(
          children: [
            if (qbox['logo'] != null)
              Positioned(
                top: 2,
                right: 2,
                child: ClipOval(
                  child: Image.network(
                    qbox['logo'],
                    width: cellHeight * 0.3,
                    height: cellHeight * 0.3,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) => Icon(
                        Icons.image_not_supported,
                        size: 24,
                        color: Colors.grey),
                  ),
                ),
              ),
            Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  if (!isFilled)
                    Icon(Icons.remove_circle_outline,
                        color: Colors.red[700], size: fontSize * 1.6),
                  if (isFilled)
                    Icon(Icons.check_circle,
                        color: Colors.white, size: fontSize * 1.6),
                  SizedBox(height: 6),
                  Text(
                    'R${qbox['rowNo']}-C${qbox['columnNo']}',
                    style: TextStyle(
                      color: isFilled ? Colors.white : Colors.grey[800],
                      fontSize: fontSize,
                      fontWeight: FontWeight.w300,
                    ),
                  ),
                  SizedBox(height: 4),
                  Text(
                    '${qbox['qboxId']}',
                    style: TextStyle(
                      color: isFilled
                          ? Colors.white.withOpacity(0.8)
                          : Colors.grey[700],
                      fontSize: fontSize * 0.9,
                      fontWeight:isFilled? FontWeight.w600:FontWeight.w300,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // Widget _buildTopCards(ScreenLayout layout, DashboardProvider provider) {
  //   return MetricsDashboardCard(
  //       totalOrders: 1234,
  //       activeDeliveries: 56,
  //       onRefresh: () => provider.refreshData());
  // }

  Widget _buildHeader(BuildContext context, ScreenLayout layout) {
    return Container(
      padding: EdgeInsets.all(layout == ScreenLayout.mobile ? 16 : 24),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Consumer<DashboardProvider>(
                      builder: (context, provider, child) {
                        return DropdownButton<QboxEntity>(
                          value: provider.selectedQboxEntity,
                          items: provider.qboxEntities.map((QboxEntity entity) {
                            return DropdownMenuItem<QboxEntity>(
                              value: entity,
                              child: Text(
                                entity.qboxEntityName,
                                style: GoogleFonts.poppins(
                                  fontSize:
                                      layout == ScreenLayout.mobile ? 20 : 24,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            );
                          }).toList(),
                          onChanged: (QboxEntity? newValue) {
                            if (newValue != null) {
                              provider.setSelectedQboxEntity(newValue);
                            }
                          },
                          hint: Text('Select Qbox Entity'),
                        );
                      },
                    ),
                    Text(
                      'Last updated: ${DateFormat('dd-MM-yyyy hh:mm a').format(DateTime.now())}',
                      style: GoogleFonts.poppins(
                        color: Colors.grey[600],
                        fontSize: layout == ScreenLayout.mobile ? 12 : 14,
                      ),
                    ),
                  ],
                ),
              ),
              Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  IconButton(
                    icon: Icon(
                      Icons.account_circle_outlined,
                      size: 40,
                      color: AppColors.mintGreen,
                    ),
                    onPressed: () {
                      _scaffoldKey.currentState?.openEndDrawer();
                      _headerController.forward();
                    },
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: TextStyle(
              fontWeight: FontWeight.w600,
              color: Colors.grey[700],
            ),
          ),
          Text(
            value,
            style: TextStyle(
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInventoryTable() {
    return Consumer<DashboardProvider>(builder: (context, provider, child) {
      if (provider.isLoading) {
        return Center(
          child: CircularProgressIndicator(
            color: AppColors.mintGreen,
          ),
        );
      }
      int startIndex = (provider.currentPage - 1) * provider.itemsPerPage;
      int endIndex = startIndex + provider.itemsPerPage;
      List<dynamic> paginatedItems = provider.currentInventoryCountlist
          .sublist(startIndex, endIndex.clamp(0, provider.currentInventoryCountlist.length));

      return provider.currentInventoryCountlist.isEmpty ||
              provider.currentInventoryCountlist == null
          ? Container(
              padding: EdgeInsets.all(12),
              child: Text("No current inventory data available!"),
            )
          : Column(
            children: [
              Container(
                  padding: EdgeInsets.all(12),
                  child: Table(
                    columnWidths: {
                      0: FlexColumnWidth(3),
                      1: FlexColumnWidth(1),
                      2: FlexColumnWidth(1),
                      3: FlexColumnWidth(1),
                    },
                    children: [
                      TableRow(
                        decoration: BoxDecoration(
                          border:
                              Border(bottom: BorderSide(color: Colors.grey[200]!)),
                        ),
                        children: [
                          _buildTableHeader('Item Name'),
                          _buildTableHeader('In'),
                          _buildTableHeader('Out'),
                          _buildTableHeader('In Stock'),
                          _buildTableHeader('Total'),
                        ],
                      ),
                      ...paginatedItems
                          .map((item) => _buildTableRow(
                        item['skuCode'] ?? '--',
                        item['totalCount']?.toString() ?? '0',
                        item['soldCount']?.toString() ?? '0',
                        item['inStockCount']?.toString() ?? '0',
                        item['totalCount']?.toString() ?? '0',
                      )).toList()
                    ],
                  ),
                ),
              _buildPaginationControls(provider),
            ],
          );
    });
  }

  Widget _buildPaginationControls(DashboardProvider provider) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        IconButton(
          icon: Icon(Icons.chevron_left),
          onPressed: provider.currentPage > 1 ? provider.previousPage : null,
        ),
        Text('${provider.currentPage} / ${provider.totalPages}'),
        IconButton(
          icon: Icon(Icons.chevron_right),
          onPressed: provider.currentPage < provider.totalPages ? provider.nextPage : null,
        ),
      ],
    );
  }

  Widget _buildTableHeader(String text) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: 16),
      child: Text(
        text,
        style: GoogleFonts.poppins(
          fontWeight: FontWeight.w600,
          color: Colors.grey[600],
        ),
      ),
    );
  }

  TableRow _buildTableRow(
      String name, String inCount,String inStock, String outCount, String total) {
    return TableRow(
      decoration: BoxDecoration(
        border: Border(bottom: BorderSide(color: Colors.grey[200]!)),
      ),
      children: [
        _buildTableCell(name, isName: true),
        _buildTableCell(inCount),
        _buildTableCell(outCount),
        _buildTableCell(inStock),
        _buildTableCell(total, isTotal: true),
      ],
    );
  }

  Widget _buildTableCell(String text,
      {bool isName = false, bool isTotal = false}) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: 16),
      child: Text(
        text,
        style: GoogleFonts.poppins(
          fontWeight: isName || isTotal ? FontWeight.w600 : FontWeight.normal,
          color: isName ? Colors.green.shade800 : null,
        ),
      ),
    );
  }

  Widget _buildHotBoxStatus() {
    return Consumer<DashboardProvider>(builder: (context, provider, child) {
      if (provider.isLoading) {
        return Center(
          child: CircularProgressIndicator(
            color: AppColors.mintGreen,
          ),
        );
      }
      if (provider.hotboxCountList == null ||
          provider.hotboxCountList.isEmpty) {
        return Center(
          child: Container(
            padding: EdgeInsets.all(16.0),
            margin: EdgeInsets.all(16.0),
            decoration: BoxDecoration(
              color: Colors.red.shade50,
              border: Border.all(color: Colors.red.shade200),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(
                  Icons.info_outline,
                  color: Colors.red,
                  size: 32,
                ),
                SizedBox(height: 8),
                Text(
                  provider.error ?? "No food items found in hotbox",
                  style: TextStyle(
                    color: Colors.red.shade700,
                    fontSize: 16,
                    fontWeight: FontWeight.w500,
                  ),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ),
        );
      }
      final List<Map<String, dynamic>> flattenedData = [];
      for (var hotel in provider.hotboxCountList) {
        for (var sku in hotel['skuList']) {
          flattenedData.add({
            'restaurantName': hotel['restaurantName'],
            'skuCode': sku['skuCode'],
            'description': sku['description'],
            'hotBoxCount': sku['hotBoxCount']
          });
        }
      }

      return LayoutBuilder(
        builder: (context, constraints) {
          return SingleChildScrollView(
            scrollDirection: Axis.vertical,
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: ConstrainedBox(
                constraints: BoxConstraints(minWidth: constraints.maxWidth),
                child: DataTable(
                  columnSpacing: 20,
                  headingRowColor: MaterialStateColor.resolveWith(
                      (states) => Colors.red.shade100),
                  border: TableBorder.all(color: Colors.red.shade200, width: 1),
                  columns: [
                    DataColumn(
                      label: Text(
                        'Restaurant',
                        style: TextStyle(
                            color: Colors.red, fontWeight: FontWeight.bold),
                        softWrap: true,
                      ),
                    ),
                    DataColumn(
                      label: Text(
                        'SKU',
                        style: TextStyle(
                            color: Colors.red, fontWeight: FontWeight.bold),
                        softWrap: true,
                      ),
                    ),
                    DataColumn(
                      label: Text(
                        'Description',
                        style: TextStyle(
                            color: Colors.red, fontWeight: FontWeight.bold),
                        softWrap: true,
                      ),
                    ),
                    DataColumn(
                      label: Text(
                        'In Hot Box Count',
                        style: TextStyle(
                            color: Colors.red, fontWeight: FontWeight.bold),
                        softWrap: true,
                      ),
                    ),
                  ],
                  rows: flattenedData
                      .map((item) => DataRow(cells: [
                            DataCell(
                              ConstrainedBox(
                                constraints: BoxConstraints(maxWidth: 200),
                                child: Text(
                                  item['restaurantName'] ?? '--',
                                  style: TextStyle(color: Colors.black87),
                                  softWrap: true,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                            ),
                            DataCell(
                              ConstrainedBox(
                                constraints: BoxConstraints(maxWidth: 70),
                                child: Text(
                                  item['skuCode'] ?? '--',
                                  style: TextStyle(color: Colors.black87),
                                  softWrap: true,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                            ),
                            DataCell(
                              ConstrainedBox(
                                constraints: BoxConstraints(maxWidth: 200),
                                child: Text(
                                  item['description'] ?? '--',
                                  style: TextStyle(color: Colors.black87),
                                  softWrap: true,
                                  overflow: TextOverflow.ellipsis,
                                  maxLines: 2,
                                ),
                              ),
                            ),
                            DataCell(
                              Container(
                                padding: EdgeInsets.symmetric(
                                    horizontal: 10, vertical: 5),
                                decoration: BoxDecoration(
                                    color: Colors.green.shade100,
                                    borderRadius: BorderRadius.circular(15),
                                    border: Border.all(
                                        color: Colors.green.shade300,
                                        width: 1)),
                                child: Text(item['hotBoxCount'].toString(),
                                    style: TextStyle(
                                        color: Colors.green.shade800,
                                        fontWeight: FontWeight.bold)),
                              ),
                            ),
                          ]))
                      .toList(),
                ),
              ),
            ),
          );
        },
      );
    });
  }

  void _showEmptyItemDetails(BuildContext context, Map<String, dynamic> item) {
    final isTablet = MediaQuery.of(context).size.shortestSide >= 600;
    showModalBottomSheet(
      context: context,
      builder: (BuildContext context) {
        // Future.delayed(Duration(seconds: 4), () async {
        //   if (mounted) {
        //     Navigator.of(context).pop();
        //   }
        // });
        return Container(
          padding: EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                'Qbox number ${item['qboxId']} is empty!',
                style: TextStyle(
                  fontSize: isTablet ? 20 : 14,
                  fontWeight: FontWeight.bold,
                  color: AppColors.mintGreen,
                ),
              ),
              Text(
                'There is no food item map for this compartment',
                style: TextStyle(
                  fontSize: isTablet ? 18 : 14,
                  fontWeight: FontWeight.bold,
                  color: AppColors.black,
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  void _showItemDetails(BuildContext context, Map<String, dynamic> item) {
    final isTablet = MediaQuery.of(context).size.shortestSide >= 600;
    showModalBottomSheet(
      context: context,
      builder: (BuildContext context) {
        return Stack(
          clipBehavior: Clip.none, // This allows the avatar to overflow
          children: [
            Container(
              padding: EdgeInsets.all(16),
              margin: EdgeInsets.only(top: 40),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    'Item Details',
                    style: TextStyle(
                      fontSize: isTablet ? 20 : 18,
                      fontWeight: FontWeight.bold,
                      color: AppColors.mintGreen,
                    ),
                  ),
                  SizedBox(height: 16),
                  _buildDetailRow('Qbox Number', item['qboxId'].toString()),
                  _buildDetailRow('Location', item['foodName']),
                  _buildDetailRow('Sku Code',
                      item['foodCode'].isNotEmpty ? item['foodCode'] : '--'),
                  // _buildDetailRow('Created at', item['storageDate'].toString()),
                ],
              ),
            ),
            // Positioned CircleAvatar at the top center
            Positioned(
              top: -40,
              left: 0,
              right: 0,
              child: CircleAvatar(
                radius: 40,
                backgroundColor: Colors.grey[200],
                child: ClipOval(
                  child: Image.network(
                    item['logo'],
                    width: 80, // Should be 2x the radius
                    height: 80, // Should be 2x the radius
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) {
                      return Icon(
                        Icons.error_outline,
                        size: 30,
                        color: Colors.red.shade800,
                      );
                    },
                  ),
                ),
              ),
            ),
          ],
        );
      },
    );
  }
}
