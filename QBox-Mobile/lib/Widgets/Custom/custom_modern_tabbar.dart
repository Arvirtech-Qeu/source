import 'package:flutter/material.dart';
import 'app_colors.dart';

class TabItem {
  final String title;
  final IconData icon;

  TabItem({required this.title, required this.icon});
}

class ModernTabBar extends StatelessWidget {
  final TabController controller;
  final List<TabItem> tabItems;
  final Function(int)? onTap;
  final bool isScrollable;
  final EdgeInsetsGeometry labelPadding;

  const ModernTabBar({
    Key? key,
    required this.controller,
    required this.tabItems,
    this.onTap,
    this.isScrollable = false,
    this.labelPadding = const EdgeInsets.symmetric(horizontal: 16),
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      height: 60,
      decoration: BoxDecoration(
        color: Colors.grey[100],
        borderRadius: BorderRadius.circular(10),
      ),
      child: Padding(
        padding: const EdgeInsets.all(4),
        child: TabBar(
          controller: controller,
          onTap: onTap,
          isScrollable: isScrollable,
          labelPadding: labelPadding,
          indicator: BoxDecoration(
            borderRadius: BorderRadius.circular(10),
            color: AppColors.mintGreen,
          ),
          labelStyle: const TextStyle(
            fontSize: 15,
            fontWeight: FontWeight.w600,
          ),
          unselectedLabelStyle: const TextStyle(
            fontSize: 15,
            fontWeight: FontWeight.w500,
          ),
          labelColor: Colors.white,
          unselectedLabelColor: Colors.grey[600],
          tabs: tabItems.map((item) => _buildTab(item)).toList(),
        ),
      ),
    );
  }

  Widget _buildTab(TabItem item) {
    return Tab(
      height: 50,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(item.icon, size: 20),
          SizedBox(width: 8,),
          Text(item.title,textAlign: TextAlign.center,),
        ],
      ),
    );
  }
}

