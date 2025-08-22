import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';

/// 应用主题配置
class AppTheme {
  // 主色调
  static const Color primaryColor = Color(0xFF2563EB); // 蓝色
  static const Color primaryLightColor = Color(0xFF3B82F6);
  static const Color primaryDarkColor = Color(0xFF1D4ED8);
  
  // 辅助色
  static const Color secondaryColor = Color(0xFF64748B); // 灰蓝色
  static const Color accentColor = Color(0xFF10B981); // 绿色
  
  // 状态色
  static const Color successColor = Color(0xFF10B981); // 绿色
  static const Color warningColor = Color(0xFFF59E0B); // 橙色
  static const Color errorColor = Color(0xFFEF4444); // 红色
  static const Color infoColor = Color(0xFF3B82F6); // 蓝色
  
  // 中性色
  static const Color backgroundColor = Color(0xFFF8FAFC);
  static const Color surfaceColor = Color(0xFFFFFFFF);
  static const Color cardColor = Color(0xFFFFFFFF);
  
  // 文字色
  static const Color textPrimaryColor = Color(0xFF1E293B);
  static const Color textSecondaryColor = Color(0xFF64748B);
  static const Color textDisabledColor = Color(0xFF94A3B8);
  
  // 边框色
  static const Color borderColor = Color(0xFFE2E8F0);
  static const Color dividerColor = Color(0xFFE2E8F0);
  
  // 阴影色
  static const Color shadowColor = Color(0x1A000000);
  
  // 字体大小
  static const double fontSizeXS = 10.0;
  static const double fontSizeSM = 12.0;
  static const double fontSizeBase = 14.0;
  static const double fontSizeLG = 16.0;
  static const double fontSizeXL = 18.0;
  static const double fontSize2XL = 20.0;
  static const double fontSize3XL = 24.0;
  static const double fontSize4XL = 28.0;
  static const double fontSize5XL = 32.0;
  
  // 间距
  static const double spacingXS = 4.0;
  static const double spacingSM = 8.0;
  static const double spacingMD = 12.0;
  static const double spacingLG = 16.0;
  static const double spacingXL = 20.0;
  static const double spacing2XL = 24.0;
  static const double spacing3XL = 32.0;
  static const double spacing4XL = 40.0;
  static const double spacing5XL = 48.0;
  
  // 圆角
  static const double radiusXS = 2.0;
  static const double radiusSM = 4.0;
  static const double radiusMD = 6.0;
  static const double radiusLG = 8.0;
  static const double radiusXL = 12.0;
  static const double radius2XL = 16.0;
  static const double radius3XL = 24.0;
  static const double radiusFull = 9999.0;
  
  // 阴影
  static const List<BoxShadow> shadowSM = [
    BoxShadow(
      color: Color(0x0D000000),
      blurRadius: 2,
      offset: Offset(0, 1),
    ),
  ];
  
  static const List<BoxShadow> shadowMD = [
    BoxShadow(
      color: Color(0x1A000000),
      blurRadius: 6,
      offset: Offset(0, 4),
    ),
    BoxShadow(
      color: Color(0x0F000000),
      blurRadius: 4,
      offset: Offset(0, 2),
    ),
  ];
  
  static const List<BoxShadow> shadowLG = [
    BoxShadow(
      color: Color(0x1A000000),
      blurRadius: 15,
      offset: Offset(0, 10),
    ),
    BoxShadow(
      color: Color(0x0D000000),
      blurRadius: 6,
      offset: Offset(0, 4),
    ),
  ];
  
  // Material Design 主题
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: primaryColor,
        brightness: Brightness.light,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: surfaceColor,
        foregroundColor: textPrimaryColor,
        elevation: 0,
        centerTitle: true,
        titleTextStyle: TextStyle(
          color: textPrimaryColor,
          fontSize: fontSize2XL,
          fontWeight: FontWeight.w600,
        ),
      ),
      cardTheme: CardTheme(
        color: cardColor,
        elevation: 2,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(radiusLG),
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primaryColor,
          foregroundColor: Colors.white,
          elevation: 2,
          padding: const EdgeInsets.symmetric(
            horizontal: spacingXL,
            vertical: spacingMD,
          ),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(radiusLG),
          ),
          textStyle: const TextStyle(
            fontSize: fontSizeBase,
            fontWeight: FontWeight.w500,
          ),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: primaryColor,
          side: const BorderSide(color: borderColor),
          padding: const EdgeInsets.symmetric(
            horizontal: spacingXL,
            vertical: spacingMD,
          ),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(radiusLG),
          ),
          textStyle: const TextStyle(
            fontSize: fontSizeBase,
            fontWeight: FontWeight.w500,
          ),
        ),
      ),
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: primaryColor,
          padding: const EdgeInsets.symmetric(
            horizontal: spacingLG,
            vertical: spacingSM,
          ),
          textStyle: const TextStyle(
            fontSize: fontSizeBase,
            fontWeight: FontWeight.w500,
          ),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(radiusLG),
          borderSide: const BorderSide(color: borderColor),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(radiusLG),
          borderSide: const BorderSide(color: borderColor),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(radiusLG),
          borderSide: const BorderSide(color: primaryColor, width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(radiusLG),
          borderSide: const BorderSide(color: errorColor),
        ),
        contentPadding: const EdgeInsets.symmetric(
          horizontal: spacingLG,
          vertical: spacingMD,
        ),
        hintStyle: const TextStyle(
          color: textSecondaryColor,
          fontSize: fontSizeBase,
        ),
        labelStyle: const TextStyle(
          color: textSecondaryColor,
          fontSize: fontSizeBase,
        ),
      ),
      dividerTheme: const DividerThemeData(
        color: dividerColor,
        thickness: 1,
      ),
      scaffoldBackgroundColor: backgroundColor,
      fontFamily: 'PingFang SC',
    );
  }
  
  // Cupertino 主题
  static CupertinoThemeData get cupertinoTheme {
    return const CupertinoThemeData(
      primaryColor: primaryColor,
      scaffoldBackgroundColor: backgroundColor,
      barBackgroundColor: surfaceColor,
      textTheme: CupertinoTextThemeData(
        primaryColor: textPrimaryColor,
        textStyle: TextStyle(
          fontFamily: 'PingFang SC',
          fontSize: fontSizeBase,
          color: textPrimaryColor,
        ),
        navTitleTextStyle: TextStyle(
          fontFamily: 'PingFang SC',
          fontSize: fontSize2XL,
          fontWeight: FontWeight.w600,
          color: textPrimaryColor,
        ),
        navLargeTitleTextStyle: TextStyle(
          fontFamily: 'PingFang SC',
          fontSize: fontSize4XL,
          fontWeight: FontWeight.bold,
          color: textPrimaryColor,
        ),
      ),
    );
  }
  
  // 文本样式
  static const TextStyle headingLarge = TextStyle(
    fontSize: fontSize4XL,
    fontWeight: FontWeight.bold,
    color: textPrimaryColor,
    height: 1.2,
  );
  
  static const TextStyle headingMedium = TextStyle(
    fontSize: fontSize3XL,
    fontWeight: FontWeight.w600,
    color: textPrimaryColor,
    height: 1.3,
  );
  
  static const TextStyle headingSmall = TextStyle(
    fontSize: fontSize2XL,
    fontWeight: FontWeight.w600,
    color: textPrimaryColor,
    height: 1.4,
  );
  
  static const TextStyle bodyLarge = TextStyle(
    fontSize: fontSizeLG,
    fontWeight: FontWeight.normal,
    color: textPrimaryColor,
    height: 1.5,
  );
  
  static const TextStyle bodyMedium = TextStyle(
    fontSize: fontSizeBase,
    fontWeight: FontWeight.normal,
    color: textPrimaryColor,
    height: 1.5,
  );
  
  static const TextStyle bodySmall = TextStyle(
    fontSize: fontSizeSM,
    fontWeight: FontWeight.normal,
    color: textSecondaryColor,
    height: 1.4,
  );
  
  static const TextStyle labelLarge = TextStyle(
    fontSize: fontSizeBase,
    fontWeight: FontWeight.w500,
    color: textPrimaryColor,
    height: 1.4,
  );
  
  static const TextStyle labelMedium = TextStyle(
    fontSize: fontSizeSM,
    fontWeight: FontWeight.w500,
    color: textSecondaryColor,
    height: 1.3,
  );
  
  static const TextStyle labelSmall = TextStyle(
    fontSize: fontSizeXS,
    fontWeight: FontWeight.w500,
    color: textSecondaryColor,
    height: 1.2,
  );
}

/// 状态颜色扩展
extension StatusColors on AppTheme {
  static Color getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'active':
      case 'approved':
      case 'completed':
      case 'success':
        return AppTheme.successColor;
      case 'pending':
      case 'warning':
        return AppTheme.warningColor;
      case 'rejected':
      case 'failed':
      case 'error':
        return AppTheme.errorColor;
      case 'info':
      case 'processing':
        return AppTheme.infoColor;
      default:
        return AppTheme.textSecondaryColor;
    }
  }
  
  static Color getVehicleStatusColor(String status) {
    switch (status) {
      case 'available':
        return AppTheme.successColor;
      case 'in_use':
        return AppTheme.infoColor;
      case 'maintenance':
        return AppTheme.warningColor;
      case 'retired':
        return AppTheme.errorColor;
      default:
        return AppTheme.textSecondaryColor;
    }
  }
  
  static Color getApplicationStatusColor(String status) {
    switch (status) {
      case 'pending':
        return AppTheme.warningColor;
      case 'approved':
        return AppTheme.successColor;
      case 'rejected':
        return AppTheme.errorColor;
      case 'completed':
        return AppTheme.infoColor;
      default:
        return AppTheme.textSecondaryColor;
    }
  }
}