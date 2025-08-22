/// 应用常量定义
class AppConstants {
  // API 配置
  static const String baseUrl = 'http://localhost:3000/api';
  static const String apiVersion = 'v1';
  
  // 存储键名
  static const String tokenKey = 'auth_token';
  static const String refreshTokenKey = 'auth_token_refresh';
  static const String userKey = 'user_data';
  static const String themeKey = 'theme_mode';
  static const String languageKey = 'language';
  
  // 分页配置
  static const int defaultPageSize = 10;
  static const int maxPageSize = 50;
  
  // 文件上传配置
  static const int maxFileSize = 10 * 1024 * 1024; // 10MB
  static const List<String> allowedImageTypes = ['jpg', 'jpeg', 'png', 'gif'];
  static const List<String> allowedDocumentTypes = ['pdf', 'doc', 'docx', 'xls', 'xlsx'];
  
  // 超时配置
  static const Duration connectTimeout = Duration(seconds: 30);
  static const Duration receiveTimeout = Duration(seconds: 30);
  static const Duration sendTimeout = Duration(seconds: 30);
  
  // 缓存配置
  static const Duration cacheExpiry = Duration(hours: 24);
  static const int maxCacheSize = 100;
  
  // 动画配置
  static const Duration animationDuration = Duration(milliseconds: 300);
  static const Duration shortAnimationDuration = Duration(milliseconds: 150);
  static const Duration longAnimationDuration = Duration(milliseconds: 500);
  
  // 验证规则
  static const int minPasswordLength = 6;
  static const int maxPasswordLength = 20;
  static const int minUsernameLength = 3;
  static const int maxUsernameLength = 20;
  
  // 正则表达式
  static const String emailRegex = r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$';
  static const String phoneRegex = r'^1[3-9]\d{9}$';
  static const String plateNumberRegex = r'^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$';
  
  // 错误消息
  static const String networkError = '网络连接失败，请检查网络设置';
  static const String serverError = '服务器错误，请稍后重试';
  static const String timeoutError = '请求超时，请稍后重试';
  static const String unknownError = '未知错误，请稍后重试';
  static const String authError = '认证失败，请重新登录';
  static const String permissionError = '权限不足，请联系管理员';
  
  // 成功消息
  static const String loginSuccess = '登录成功';
  static const String logoutSuccess = '退出成功';
  static const String saveSuccess = '保存成功';
  static const String deleteSuccess = '删除成功';
  static const String updateSuccess = '更新成功';
  static const String createSuccess = '创建成功';
  
  // 日期格式
  static const String dateFormat = 'yyyy-MM-dd';
  static const String timeFormat = 'HH:mm:ss';
  static const String dateTimeFormat = 'yyyy-MM-dd HH:mm:ss';
  static const String displayDateFormat = 'yyyy年MM月dd日';
  static const String displayTimeFormat = 'HH:mm';
  static const String displayDateTimeFormat = 'yyyy年MM月dd日 HH:mm';
}

/// 路由常量
class AppRoutes {
  static const String splash = '/';
  static const String login = '/login';
  static const String register = '/register';
  static const String home = '/home';
  static const String dashboard = '/dashboard';
  static const String vehicles = '/vehicles';
  static const String vehicleDetail = '/vehicles/:id';
  static const String vehicleForm = '/vehicles/form';
  static const String applications = '/applications';
  static const String applicationDetail = '/applications/:id';
  static const String applicationForm = '/applications/form';
  static const String drivers = '/drivers';
  static const String driverDetail = '/drivers/:id';
  static const String driverForm = '/drivers/form';
  static const String maintenance = '/maintenance';
  static const String maintenanceDetail = '/maintenance/:id';
  static const String maintenanceForm = '/maintenance/form';
  static const String expenses = '/expenses';
  static const String expenseDetail = '/expenses/:id';
  static const String expenseForm = '/expenses/form';
  static const String settings = '/settings';
  static const String profile = '/profile';
  static const String about = '/about';
}