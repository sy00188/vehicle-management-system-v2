import 'package:json_annotation/json_annotation.dart';

part 'user.g.dart';

/// 用户模型
@JsonSerializable()
class User {
  final String id;
  final String username;
  final String email;
  final String? phone;
  final String? avatar;
  final String role;
  final String department;
  final String? position;
  final UserStatus status;
  final List<String> permissions;
  final DateTime createdAt;
  final DateTime updatedAt;
  final DateTime? lastLoginAt;

  const User({
    required this.id,
    required this.username,
    required this.email,
    this.phone,
    this.avatar,
    required this.role,
    required this.department,
    this.position,
    required this.status,
    required this.permissions,
    required this.createdAt,
    required this.updatedAt,
    this.lastLoginAt,
  });

  factory User.fromJson(Map<String, dynamic> json) => _$UserFromJson(json);
  Map<String, dynamic> toJson() => _$UserToJson(this);

  User copyWith({
    String? id,
    String? username,
    String? email,
    String? phone,
    String? avatar,
    String? role,
    String? department,
    String? position,
    UserStatus? status,
    List<String>? permissions,
    DateTime? createdAt,
    DateTime? updatedAt,
    DateTime? lastLoginAt,
  }) {
    return User(
      id: id ?? this.id,
      username: username ?? this.username,
      email: email ?? this.email,
      phone: phone ?? this.phone,
      avatar: avatar ?? this.avatar,
      role: role ?? this.role,
      department: department ?? this.department,
      position: position ?? this.position,
      status: status ?? this.status,
      permissions: permissions ?? this.permissions,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      lastLoginAt: lastLoginAt ?? this.lastLoginAt,
    );
  }

  /// 检查用户是否有指定权限
  bool hasPermission(String permission) {
    return permissions.contains(permission);
  }

  /// 检查用户是否有任一权限
  bool hasAnyPermission(List<String> permissionList) {
    return permissionList.any((permission) => permissions.contains(permission));
  }

  /// 检查用户是否有所有权限
  bool hasAllPermissions(List<String> permissionList) {
    return permissionList.every((permission) => permissions.contains(permission));
  }

  /// 获取用户显示名称
  String get displayName {
    return username;
  }

  /// 获取用户头像URL
  String get avatarUrl {
    if (avatar != null && avatar!.isNotEmpty) {
      return avatar!;
    }
    // 返回默认头像
    return 'https://ui-avatars.com/api/?name=${Uri.encodeComponent(username)}&background=2563EB&color=fff';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is User && other.id == id;
  }

  @override
  int get hashCode => id.hashCode;

  @override
  String toString() {
    return 'User{id: $id, username: $username, email: $email, role: $role}';
  }
}

/// 用户状态枚举
enum UserStatus {
  @JsonValue('active')
  active,
  @JsonValue('inactive')
  inactive,
  @JsonValue('suspended')
  suspended,
  @JsonValue('deleted')
  deleted,
}

/// 用户状态扩展
extension UserStatusExtension on UserStatus {
  String get label {
    switch (this) {
      case UserStatus.active:
        return '正常';
      case UserStatus.inactive:
        return '未激活';
      case UserStatus.suspended:
        return '已暂停';
      case UserStatus.deleted:
        return '已删除';
    }
  }

  String get value {
    switch (this) {
      case UserStatus.active:
        return 'active';
      case UserStatus.inactive:
        return 'inactive';
      case UserStatus.suspended:
        return 'suspended';
      case UserStatus.deleted:
        return 'deleted';
    }
  }

  bool get isActive => this == UserStatus.active;
  bool get isInactive => this == UserStatus.inactive;
  bool get isSuspended => this == UserStatus.suspended;
  bool get isDeleted => this == UserStatus.deleted;
}

/// 用户角色枚举
enum UserRole {
  @JsonValue('admin')
  admin,
  @JsonValue('manager')
  manager,
  @JsonValue('driver')
  driver,
  @JsonValue('user')
  user,
  @JsonValue('super_admin')
  superAdmin,
}

/// 用户角色扩展
extension UserRoleExtension on UserRole {
  String get label {
    switch (this) {
      case UserRole.admin:
        return '系统管理员';
      case UserRole.manager:
        return '部门经理';
      case UserRole.driver:
        return '驾驶员';
      case UserRole.user:
        return '普通用户';
      case UserRole.superAdmin:
        return '超级管理员';
    }
  }

  String get value {
    switch (this) {
      case UserRole.admin:
        return 'admin';
      case UserRole.manager:
        return 'manager';
      case UserRole.driver:
        return 'driver';
      case UserRole.user:
        return 'user';
      case UserRole.superAdmin:
        return 'super_admin';
    }
  }

  bool get isAdmin => this == UserRole.admin;
  bool get isManager => this == UserRole.manager;
  bool get isDriver => this == UserRole.driver;
  bool get isUser => this == UserRole.user;
  bool get isSuperAdmin => this == UserRole.superAdmin;
}

/// 登录请求模型
@JsonSerializable()
class LoginRequest {
  final String username;
  final String password;
  final bool rememberMe;

  const LoginRequest({
    required this.username,
    required this.password,
    this.rememberMe = false,
  });

  factory LoginRequest.fromJson(Map<String, dynamic> json) => _$LoginRequestFromJson(json);
  Map<String, dynamic> toJson() => _$LoginRequestToJson(this);
}

/// 登录响应模型
@JsonSerializable()
class LoginResponse {
  final User user;
  final String accessToken;
  final String refreshToken;
  final String message;

  const LoginResponse({
    required this.user,
    required this.accessToken,
    required this.refreshToken,
    required this.message,
  });

  factory LoginResponse.fromJson(Map<String, dynamic> json) => _$LoginResponseFromJson(json);
  Map<String, dynamic> toJson() => _$LoginResponseToJson(this);
}

/// 注册请求模型
@JsonSerializable()
class RegisterRequest {
  final String username;
  final String email;
  final String password;
  final String confirmPassword;
  final String? phone;
  final String department;
  final String? position;

  const RegisterRequest({
    required this.username,
    required this.email,
    required this.password,
    required this.confirmPassword,
    this.phone,
    required this.department,
    this.position,
  });

  factory RegisterRequest.fromJson(Map<String, dynamic> json) => _$RegisterRequestFromJson(json);
  Map<String, dynamic> toJson() => _$RegisterRequestToJson(this);
}

/// 修改密码请求模型
@JsonSerializable()
class ChangePasswordRequest {
  final String currentPassword;
  final String newPassword;
  final String confirmPassword;

  const ChangePasswordRequest({
    required this.currentPassword,
    required this.newPassword,
    required this.confirmPassword,
  });

  factory ChangePasswordRequest.fromJson(Map<String, dynamic> json) => _$ChangePasswordRequestFromJson(json);
  Map<String, dynamic> toJson() => _$ChangePasswordRequestToJson(this);
}

/// 更新用户资料请求模型
@JsonSerializable()
class UpdateProfileRequest {
  final String? email;
  final String? phone;
  final String? avatar;
  final String? position;

  const UpdateProfileRequest({
    this.email,
    this.phone,
    this.avatar,
    this.position,
  });

  factory UpdateProfileRequest.fromJson(Map<String, dynamic> json) => _$UpdateProfileRequestFromJson(json);
  Map<String, dynamic> toJson() => _$UpdateProfileRequestToJson(this);
}

/// 注册响应模型
@JsonSerializable()
class RegisterResponse {
  final User user;
  final String accessToken;
  final String refreshToken;
  final String message;

  const RegisterResponse({
    required this.user,
    required this.accessToken,
    required this.refreshToken,
    required this.message,
  });

  factory RegisterResponse.fromJson(Map<String, dynamic> json) => _$RegisterResponseFromJson(json);
  Map<String, dynamic> toJson() => _$RegisterResponseToJson(this);
}

/// 更新用户资料响应模型
@JsonSerializable()
class UpdateProfileResponse {
  final User user;
  final String message;

  const UpdateProfileResponse({
    required this.user,
    required this.message,
  });

  factory UpdateProfileResponse.fromJson(Map<String, dynamic> json) => _$UpdateProfileResponseFromJson(json);
  Map<String, dynamic> toJson() => _$UpdateProfileResponseToJson(this);
}

/// 创建用户请求模型
@JsonSerializable()
class CreateUserRequest {
  final String username;
  final String email;
  final String password;
  final String? phone;
  final String role;
  final String department;
  final String? position;
  final List<String> permissions;

  const CreateUserRequest({
    required this.username,
    required this.email,
    required this.password,
    this.phone,
    required this.role,
    required this.department,
    this.position,
    required this.permissions,
  });

  factory CreateUserRequest.fromJson(Map<String, dynamic> json) => _$CreateUserRequestFromJson(json);
  Map<String, dynamic> toJson() => _$CreateUserRequestToJson(this);
}

/// 更新用户请求模型
@JsonSerializable()
class UpdateUserRequest {
  final String? username;
  final String? email;
  final String? phone;
  final String? avatar;
  final String? role;
  final String? department;
  final String? position;
  final List<String>? permissions;

  const UpdateUserRequest({
    this.username,
    this.email,
    this.phone,
    this.avatar,
    this.role,
    this.department,
    this.position,
    this.permissions,
  });

  factory UpdateUserRequest.fromJson(Map<String, dynamic> json) => _$UpdateUserRequestFromJson(json);
  Map<String, dynamic> toJson() => _$UpdateUserRequestToJson(this);
}

/// 用户统计信息模型
@JsonSerializable()
class UserStats {
  final int totalUsers;
  final int activeUsers;
  final int inactiveUsers;
  final int suspendedUsers;
  final Map<String, int> usersByRole;
  final Map<String, int> usersByDepartment;
  final int newUsersThisMonth;
  final int loginCountToday;

  const UserStats({
    required this.totalUsers,
    required this.activeUsers,
    required this.inactiveUsers,
    required this.suspendedUsers,
    required this.usersByRole,
    required this.usersByDepartment,
    required this.newUsersThisMonth,
    required this.loginCountToday,
  });

  factory UserStats.fromJson(Map<String, dynamic> json) => _$UserStatsFromJson(json);
  Map<String, dynamic> toJson() => _$UserStatsToJson(this);
}