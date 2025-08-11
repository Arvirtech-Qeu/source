import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:qr_page/Widgets/Custom/app_colors.dart';

class CommonService extends ChangeNotifier{

  presentToast(message,{ToastGravity? gravity,Color? backgroundColor,
    Color? textColor}){
    Fluttertoast.showToast(
      msg: message,
      toastLength: Toast.LENGTH_LONG,
      gravity: gravity ?? ToastGravity.BOTTOM,
      timeInSecForIosWeb: 1,
      backgroundColor: backgroundColor,
      textColor: Colors.green
    );
  }

  errorToast(message,{ToastGravity? gravity,Color? backgroundColor,
    Color? textColor}){
    Fluttertoast.showToast(
        msg: message,
        toastLength: Toast.LENGTH_LONG,
        gravity: gravity ?? ToastGravity.BOTTOM,
        timeInSecForIosWeb: 1,
        backgroundColor: AppColors.mintGreen,
        textColor: textColor
    );
  }

  emptyCheck(data){
    return data != null && data.length == 0 ? true : false;
  }
}
