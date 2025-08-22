import 'package:intl/intl.dart';

class DateUtils {
  static const String defaultDateFormat = 'yyyy-MM-dd';
  static const String defaultDateTimeFormat = 'yyyy-MM-dd HH:mm:ss';
  static const String displayDateFormat = 'yyyy年MM月dd日';
  static const String displayDateTimeFormat = 'yyyy年MM月dd日 HH:mm';
  static const String timeFormat = 'HH:mm';

  /// 格式化日期为字符串
  static String formatDate(DateTime date, {String? format}) {
    final formatter = DateFormat(format ?? defaultDateFormat);
    return formatter.format(date);
  }

  /// 格式化日期时间为字符串
  static String formatDateTime(DateTime dateTime, {String? format}) {
    final formatter = DateFormat(format ?? defaultDateTimeFormat);
    return formatter.format(dateTime);
  }

  /// 格式化为显示用的日期格式
  static String formatDisplayDate(DateTime date) {
    final formatter = DateFormat(displayDateFormat);
    return formatter.format(date);
  }

  /// 格式化为显示用的日期时间格式
  static String formatDisplayDateTime(DateTime dateTime) {
    final formatter = DateFormat(displayDateTimeFormat);
    return formatter.format(dateTime);
  }

  /// 格式化时间
  static String formatTime(DateTime dateTime) {
    final formatter = DateFormat(timeFormat);
    return formatter.format(dateTime);
  }

  /// 解析日期字符串
  static DateTime? parseDate(String dateString, {String? format}) {
    try {
      final formatter = DateFormat(format ?? defaultDateFormat);
      return formatter.parse(dateString);
    } catch (e) {
      return null;
    }
  }

  /// 解析日期时间字符串
  static DateTime? parseDateTime(String dateTimeString, {String? format}) {
    try {
      final formatter = DateFormat(format ?? defaultDateTimeFormat);
      return formatter.parse(dateTimeString);
    } catch (e) {
      return null;
    }
  }

  /// 获取相对时间描述（如：刚刚、5分钟前、1小时前等）
  static String getRelativeTime(DateTime dateTime) {
    final now = DateTime.now();
    final difference = now.difference(dateTime);

    if (difference.inDays > 0) {
      if (difference.inDays == 1) {
        return '昨天';
      } else if (difference.inDays < 7) {
        return '${difference.inDays}天前';
      } else {
        return formatDisplayDate(dateTime);
      }
    } else if (difference.inHours > 0) {
      return '${difference.inHours}小时前';
    } else if (difference.inMinutes > 0) {
      return '${difference.inMinutes}分钟前';
    } else {
      return '刚刚';
    }
  }

  /// 判断是否为今天
  static bool isToday(DateTime date) {
    final now = DateTime.now();
    return date.year == now.year &&
        date.month == now.month &&
        date.day == now.day;
  }

  /// 判断是否为昨天
  static bool isYesterday(DateTime date) {
    final yesterday = DateTime.now().subtract(const Duration(days: 1));
    return date.year == yesterday.year &&
        date.month == yesterday.month &&
        date.day == yesterday.day;
  }

  /// 获取月份的第一天
  static DateTime getFirstDayOfMonth(DateTime date) {
    return DateTime(date.year, date.month, 1);
  }

  /// 获取月份的最后一天
  static DateTime getLastDayOfMonth(DateTime date) {
    return DateTime(date.year, date.month + 1, 0);
  }

  /// 获取周的第一天（周一）
  static DateTime getFirstDayOfWeek(DateTime date) {
    final weekday = date.weekday;
    return date.subtract(Duration(days: weekday - 1));
  }

  /// 获取周的最后一天（周日）
  static DateTime getLastDayOfWeek(DateTime date) {
    final weekday = date.weekday;
    return date.add(Duration(days: 7 - weekday));
  }

  /// 计算两个日期之间的天数差
  static int daysBetween(DateTime from, DateTime to) {
    from = DateTime(from.year, from.month, from.day);
    to = DateTime(to.year, to.month, to.day);
    return to.difference(from).inDays;
  }

  /// 添加工作日（跳过周末）
  static DateTime addBusinessDays(DateTime date, int days) {
    var result = date;
    var remainingDays = days;

    while (remainingDays > 0) {
      result = result.add(const Duration(days: 1));
      if (result.weekday < 6) { // 周一到周五
        remainingDays--;
      }
    }

    return result;
  }
}