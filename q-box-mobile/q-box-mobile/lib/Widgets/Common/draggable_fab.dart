import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';

import '../../Provider/dashboard_provider.dart';
import '../Custom/app_colors.dart';

class DraggableFAB extends StatefulWidget {
  const DraggableFAB({super.key});

  @override
  _DraggableFABState createState() => _DraggableFABState();
}

class _DraggableFABState extends State<DraggableFAB> {
  Offset position = Offset(50, 600); // Initial position of FAB

  @override
  Widget build(BuildContext context) {
    return _buildFAB();
  }

  Widget _buildFAB() {
    return GestureDetector(
      onTap: () => _showFilterBottomSheet(context),
      child: Container(
        padding: EdgeInsets.symmetric(horizontal: 10,vertical: 12),
        decoration: BoxDecoration(
          color:Colors.transparent,
          border: Border.all(color: Colors.red.shade800),
          borderRadius: BorderRadius.circular(16),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            Text("Filter By Date",
                style: TextStyle(fontSize: 18, color: AppColors.mintGreen)),
            Icon(Icons.filter_list, color: AppColors.mintGreen)
          ],
        ),
      ),
    );
  }

  void _showFilterBottomSheet(BuildContext context) {
    final provider = Provider.of<DashboardProvider>(context, listen: false);

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (BuildContext context) {
        return DraggableScrollableSheet(
          initialChildSize: 0.3, // Default height when opened (30% of screen)
          minChildSize: 0.2, // Minimum draggable height
          maxChildSize: 0.4, // Maximum draggable height
          expand: false,
          builder: (BuildContext context, ScrollController scrollController) {
            return Container(
              padding: EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    width: 40,
                    height: 5,
                    margin: EdgeInsets.only(bottom: 16),
                    decoration: BoxDecoration(
                      color: Colors.grey[400],
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                  TextFormField(
                    readOnly: true,
                    controller: TextEditingController(
                      text: provider.selectedDate != null
                          ? DateFormat('MMM dd, yyyy').format(provider.selectedDate!)
                          : '',
                    ),
                    decoration: InputDecoration(
                      labelText: 'Choose Date',
                      border: OutlineInputBorder(),
                      suffixIcon: Icon(Icons.calendar_today),
                    ),
                    onTap: () async {
                      DateTime? pickedDate = await showDatePicker(
                        context: context,
                        initialDate: provider.selectedDate ?? DateTime.now(),
                        firstDate: DateTime(2000),
                        lastDate: DateTime(2101),
                      );
                      if (pickedDate != null) {
                        provider.setSelectedDate(pickedDate);
                      }
                    },
                  ),
                  SizedBox(height: 16),
                  // Search Button
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      ElevatedButton.icon(
                        icon: Icon(Icons.clear),
                        onPressed: () {
                          provider.resetFilters();
                          Navigator.pop(context);
                        },
                        style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.grey[300],
                            foregroundColor: Colors.black,
                            padding: EdgeInsets.symmetric(vertical: 12,horizontal: 16)
                        ),
                        label: Text('Reset Filters'),
                      ),
                      SizedBox(width: 16),
                      ElevatedButton.icon(
                        icon: Icon(Icons.search),
                        onPressed: () {
                          Navigator.pop(context);
                        },
                        style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.mintGreen,
                            foregroundColor: Colors.white,
                            padding: EdgeInsets.symmetric(vertical: 12,horizontal: 16)
                        ),
                        label: Text('Search'),
                      ),
                    ],
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

}
