import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../constants/app_constants.dart';

/// 本地存储帮助类
class StorageHelper {
  static const _secureStorage = FlutterSecureStorage();
  
  static SharedPreferences? _prefs;
  
  /// 初始化SharedPreferences
  static Future<void> init() async {
    _prefs ??= await SharedPreferences.getInstance();
  }
  
  /// 确保SharedPreferences已初始化
  static Future<SharedPreferences> get _preferences async {
    if (_prefs == null) {
      await init();
    }
    return _prefs!;
  }
  
  // ==================== 认证相关 ====================
  
  /// 保存认证Token
  Future<void> saveAuthToken(String token) async {
    await _secureStorage.write(
      key: AppConstants.tokenKey,
      value: token,
    );
  }
  
  /// 获取认证Token
  Future<String?> getAuthToken() async {
    return await _secureStorage.read(key: AppConstants.tokenKey);
  }
  
  /// 保存刷新Token
  Future<void> saveRefreshToken(String token) async {
    await _secureStorage.write(
      key: AppConstants.refreshTokenKey,
      value: token,
    );
  }
  
  /// 获取刷新Token
  Future<String?> getRefreshToken() async {
    return await _secureStorage.read(key: AppConstants.refreshTokenKey);
  }
  
  /// 保存用户数据
  Future<void> saveUserData(Map<String, dynamic> userData) async {
    final prefs = await _preferences;
    await prefs.setString(
      AppConstants.userKey,
      jsonEncode(userData),
    );
  }
  
  /// 获取用户数据
  Future<Map<String, dynamic>?> getUserData() async {
    final prefs = await _preferences;
    final userDataString = prefs.getString(AppConstants.userKey);
    if (userDataString != null) {
      return jsonDecode(userDataString) as Map<String, dynamic>;
    }
    return null;
  }
  
  /// 清除认证数据
  Future<void> clearAuthData() async {
    await _secureStorage.delete(key: AppConstants.tokenKey);
    await _secureStorage.delete(key: AppConstants.refreshTokenKey);
    
    final prefs = await _preferences;
    await prefs.remove(AppConstants.userKey);
  }
  
  // ==================== 应用设置 ====================
  
  /// 保存主题模式
  Future<void> saveThemeMode(String themeMode) async {
    final prefs = await _preferences;
    await prefs.setString(AppConstants.themeKey, themeMode);
  }
  
  /// 获取主题模式
  Future<String?> getThemeMode() async {
    final prefs = await _preferences;
    return prefs.getString(AppConstants.themeKey);
  }
  
  /// 保存语言设置
  Future<void> saveLanguage(String language) async {
    final prefs = await _preferences;
    await prefs.setString(AppConstants.languageKey, language);
  }
  
  /// 获取语言设置
  Future<String?> getLanguage() async {
    final prefs = await _preferences;
    return prefs.getString(AppConstants.languageKey);
  }
  
  /// 保存是否首次启动
  Future<void> saveFirstLaunch(bool isFirstLaunch) async {
    final prefs = await _preferences;
    await prefs.setBool('is_first_launch', isFirstLaunch);
  }
  
  /// 获取是否首次启动
  Future<bool> isFirstLaunch() async {
    final prefs = await _preferences;
    return prefs.getBool('is_first_launch') ?? true;
  }
  
  // ==================== 缓存数据 ====================
  
  /// 保存缓存数据
  Future<void> saveCache(String key, Map<String, dynamic> data) async {
    final prefs = await _preferences;
    await prefs.setString(key, jsonEncode(data));
  }
  
  /// 获取缓存数据
  Future<Map<String, dynamic>?> getCache(String key) async {
    final prefs = await _preferences;
    final cacheString = prefs.getString(key);
    if (cacheString != null) {
      return jsonDecode(cacheString) as Map<String, dynamic>;
    }
    return null;
  }
  
  /// 删除缓存数据
  Future<void> removeCache(String key) async {
    final prefs = await _preferences;
    await prefs.remove(key);
  }
  
  /// 清除所有缓存
  Future<void> clearAllCache() async {
    final prefs = await _preferences;
    final keys = prefs.getKeys().where((key) => key.startsWith('cache_'));
    for (final key in keys) {
      await prefs.remove(key);
    }
  }
  
  // ==================== 搜索历史 ====================
  
  /// 保存搜索历史
  Future<void> saveSearchHistory(List<String> history) async {
    final prefs = await _preferences;
    await prefs.setStringList('search_history', history);
  }
  
  /// 获取搜索历史
  Future<List<String>> getSearchHistory() async {
    final prefs = await _preferences;
    return prefs.getStringList('search_history') ?? [];
  }
  
  /// 添加搜索记录
  Future<void> addSearchRecord(String keyword) async {
    final history = await getSearchHistory();
    
    // 移除重复项
    history.remove(keyword);
    
    // 添加到开头
    history.insert(0, keyword);
    
    // 限制历史记录数量
    if (history.length > 20) {
      history.removeRange(20, history.length);
    }
    
    await saveSearchHistory(history);
  }
  
  /// 清除搜索历史
  Future<void> clearSearchHistory() async {
    final prefs = await _preferences;
    await prefs.remove('search_history');
  }
  
  // ==================== 通用方法 ====================
  
  /// 保存字符串
  Future<void> saveString(String key, String value) async {
    final prefs = await _preferences;
    await prefs.setString(key, value);
  }
  
  /// 获取字符串
  Future<String?> getString(String key) async {
    final prefs = await _preferences;
    return prefs.getString(key);
  }
  
  /// 保存整数
  Future<void> saveInt(String key, int value) async {
    final prefs = await _preferences;
    await prefs.setInt(key, value);
  }
  
  /// 获取整数
  Future<int?> getInt(String key) async {
    final prefs = await _preferences;
    return prefs.getInt(key);
  }
  
  /// 保存布尔值
  Future<void> saveBool(String key, bool value) async {
    final prefs = await _preferences;
    await prefs.setBool(key, value);
  }
  
  /// 获取布尔值
  Future<bool?> getBool(String key) async {
    final prefs = await _preferences;
    return prefs.getBool(key);
  }
  
  /// 保存双精度浮点数
  Future<void> saveDouble(String key, double value) async {
    final prefs = await _preferences;
    await prefs.setDouble(key, value);
  }
  
  /// 获取双精度浮点数
  Future<double?> getDouble(String key) async {
    final prefs = await _preferences;
    return prefs.getDouble(key);
  }
  
  /// 保存字符串列表
  Future<void> saveStringList(String key, List<String> value) async {
    final prefs = await _preferences;
    await prefs.setStringList(key, value);
  }
  
  /// 获取字符串列表
  Future<List<String>?> getStringList(String key) async {
    final prefs = await _preferences;
    return prefs.getStringList(key);
  }
  
  /// 删除指定键的数据
  Future<void> remove(String key) async {
    final prefs = await _preferences;
    await prefs.remove(key);
  }
  
  /// 检查是否包含指定键
  Future<bool> containsKey(String key) async {
    final prefs = await _preferences;
    return prefs.containsKey(key);
  }
  
  /// 获取所有键
  Future<Set<String>> getAllKeys() async {
    final prefs = await _preferences;
    return prefs.getKeys();
  }
  
  /// 清除所有数据
  Future<void> clearAll() async {
    final prefs = await _preferences;
    await prefs.clear();
    await _secureStorage.deleteAll();
  }
}