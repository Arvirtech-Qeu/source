import 'package:flutter/material.dart';
import 'package:qr_page/Widgets/Custom/app_colors.dart';
import '../Custom/app_text.dart';

class NoDataFound extends StatelessWidget {
final String title;
  const NoDataFound({super.key,required this.title});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Column(
            children: [
              Image.asset(
                "assets/noorder.png",
                // width: 280,
              ),
               SizedBox(height: 10,),
               AppText(
                text: "No $title found",
                fontSize: 16.0,
                color: AppColors.mintGreen,
                fontWeight: FontWeight.w500,
              ),
            ],
          ),
        ],
      ),
    );
  }
}