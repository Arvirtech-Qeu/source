import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'dart:math' as math;
import 'package:badges/badges.dart' as b;
import 'package:qr_page/Widgets/Custom/app_colors.dart';

class AppBottomBar extends StatefulWidget {
   AppBottomBar({
    Key? key,
    required this.items,
    this.onTap,
    this.currentIndex = 0,
    required this.opacity,
    this.iconSize = 24.0,
    this.backgroundColor,
    this.hasNotch = false,
    this.elevation,
  })  : assert(items.length >= 2),
        assert(
        items.every((AppBottomBarItem item) => item.title.isNotEmpty) == true,
        'Every item must have a non-null title',
        ),
        assert(0 <= currentIndex! && currentIndex < items.length),
        assert(iconSize != null),
        super(key: key);

  final List<AppBottomBarItem> items;
  final ValueChanged<int?>? onTap;
  final int? currentIndex;
  final double? iconSize;
  final double opacity;
  final Color? backgroundColor;
  final bool hasNotch;
  final double? elevation;

  @override
  State<AppBottomBar> createState() => _AppBottomBarState();
}

class _AppBottomBarState extends State<AppBottomBar> with TickerProviderStateMixin {
  late List<AnimationController> _animationControllers;
  late List<Animation<double>> _animations;

  @override
  void initState() {
    super.initState();
    _initAnimations();
  }

  void _initAnimations() {
    _animationControllers = List<AnimationController>.generate(
      widget.items.length,
          (index) => AnimationController(
        vsync: this,
        duration: const Duration(milliseconds: 400),
      ),
    );

    _animations = _animationControllers.map((controller) {
      return CurvedAnimation(
        parent: controller,
        curve: Curves.easeOutCubic,
        reverseCurve: Curves.easeInCubic,
      );
    }).toList();

    _animationControllers[widget.currentIndex!].forward();
  }

  @override
  void didUpdateWidget(AppBottomBar oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.currentIndex != oldWidget.currentIndex) {
      _animationControllers[oldWidget.currentIndex!].reverse();
      _animationControllers[widget.currentIndex!].forward();
    }
  }

  @override
  void dispose() {
    for (final controller in _animationControllers) {
      controller.dispose();
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final double additionalBottomPadding =
    math.max(MediaQuery.of(context).padding.bottom, 0.0);

    return Container(
      decoration: BoxDecoration(
        color: widget.backgroundColor ?? Colors.white,
        boxShadow: [
          if (widget.elevation != null && widget.elevation! > 0)
            BoxShadow(
              color: Colors.black.withOpacity(0.1),
              blurRadius: widget.elevation! * 2,
              offset: const Offset(0, -1),
            ),
        ],
      ),
      child: SafeArea(
        child: Container(
          height: kBottomNavigationBarHeight,
          padding: const EdgeInsets.symmetric(horizontal: 8),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: List.generate(widget.items.length, (index) {
              return _BottomNavItem(
                item: widget.items[index],
                isSelected: index == widget.currentIndex,
                animation: _animations[index],
                onTap: () => widget.onTap?.call(index),
                iconSize: widget.iconSize!,
              );
            }),
          ),
        ),
      ),
    );
  }
}

class _BottomNavItem extends StatelessWidget {
  final AppBottomBarItem item;
  final bool isSelected;
  final Animation<double> animation;
  final VoidCallback onTap;
  final double iconSize;

  const _BottomNavItem({
    required this.item,
    required this.isSelected,
    required this.animation,
    required this.onTap,
    required this.iconSize,
  });

  @override
  Widget build(BuildContext context) {
    final isTablet = MediaQuery.of(context).size.shortestSide >= 600;
    return Expanded(
      child: InkWell(
        onTap: onTap,
        highlightColor: Colors.transparent,
        splashColor: Colors.transparent,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 300),
          decoration: BoxDecoration(
            color: isSelected
                ? item.backgroundColor?.withOpacity(0.15) ?? Colors.transparent
                : Colors.transparent,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 4),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                b.Badge(
                  showBadge: item.showBadge,
                  badgeContent: item.badge,
                  child: AnimatedBuilder(
                    animation: animation,
                    builder: (context, child) {
                      return IconTheme(
                        data: IconThemeData(
                          color: isSelected ? AppColors.mintGreen : AppColors.black,
                          size: iconSize,
                        ),
                        child: isSelected ? item.activeIcon : item.icon,
                      );
                    },
                  ),
                ),
                const SizedBox(height: 4),
                isTablet? AnimatedBuilder(
                  animation: animation,
                  builder: (context, child) {
                    return AnimatedDefaultTextStyle(
                      duration: const Duration(milliseconds: 200),
                      style: TextStyle(
                        color: isSelected
                            ? item.titleColor ?? AppColors.mintGreen
                            : Colors.grey,
                        fontSize: 12,
                        fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                      ),
                      child: Text(
                        item.title,
                        textAlign: TextAlign.center,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    );
                  },
                ):Container(),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class AppBottomBarItem {
  const AppBottomBarItem({
    required this.icon,
    required this.activeIcon,
    required this.title,
    this.showBadge = false,
    this.badge,
    this.backgroundColor,
    this.iconColor,
    this.titleColor,
  });

  final Icon icon;
  final Widget activeIcon;
  final String title;
  final bool showBadge;
  final Widget? badge;
  final Color? backgroundColor;
  final Color? iconColor;
  final Color? titleColor;
}