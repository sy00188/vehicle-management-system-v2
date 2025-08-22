import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';

import 'providers/auth_provider.dart';
import 'providers/vehicle_provider.dart';
import 'providers/application_provider.dart';
import 'providers/expense_provider.dart';
import 'pages/auth/login_page.dart';
import 'pages/auth/register_page.dart';
import 'pages/home/home_page.dart';
import 'pages/vehicle/vehicle_list_page.dart';
import 'pages/vehicle/vehicle_detail_page.dart';
import 'pages/application/application_list_page.dart';
import 'pages/application/application_form_page.dart';
import 'pages/expense/expense_list_page.dart';
import 'pages/profile/profile_page.dart';
import 'themes/app_theme.dart';

void main() {
  runApp(const VehicleManagementApp());
}

class VehicleManagementApp extends StatelessWidget {
  const VehicleManagementApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => VehicleProvider()),
        ChangeNotifierProvider(create: (_) => ApplicationProvider()),
        ChangeNotifierProvider(create: (_) => ExpenseProvider()),
      ],
      child: Consumer<AuthProvider>(
        builder: (context, authProvider, child) {
          return MaterialApp.router(
            title: '车辆管理系统',
            theme: AppTheme.lightTheme,
            themeMode: ThemeMode.light,
            routerConfig: _createRouter(authProvider),
            debugShowCheckedModeBanner: false,
          );
        },
      ),
    );
  }

  GoRouter _createRouter(AuthProvider authProvider) {
    return GoRouter(
      initialLocation: authProvider.isAuthenticated ? '/home' : '/login',
      redirect: (context, state) {
        final isAuthenticated = authProvider.isAuthenticated;
        final isLoggingIn = state.matchedLocation == '/login' || state.matchedLocation == '/register';
        
        if (!isAuthenticated && !isLoggingIn) {
          return '/login';
        }
        
        if (isAuthenticated && isLoggingIn) {
          return '/home';
        }
        
        return null;
      },
      routes: [
        // 认证路由
        GoRoute(
          path: '/login',
          builder: (context, state) => const LoginPage(),
        ),
        GoRoute(
          path: '/register',
          builder: (context, state) => const RegisterPage(),
        ),
        
        // 主要功能路由
        GoRoute(
          path: '/home',
          builder: (context, state) => const HomePage(),
        ),
        // Dashboard功能暂时使用HomePage
        GoRoute(
          path: '/dashboard',
          builder: (context, state) => const HomePage(),
        ),
        
        // 车辆管理路由
        GoRoute(
          path: '/vehicles',
          builder: (context, state) => const VehicleListPage(),
        ),
        GoRoute(
          path: '/vehicles/:id',
          builder: (context, state) {
            final id = state.pathParameters['id']!;
            return VehicleDetailPage(vehicleId: id);
          },
        ),
        
        // 申请管理路由
        GoRoute(
          path: '/applications',
          builder: (context, state) => const ApplicationListPage(),
        ),
        GoRoute(
          path: '/applications/new',
          builder: (context, state) => const ApplicationFormPage(),
        ),
        
        // 驾驶员管理路由（暂时重定向到车辆页面）
        GoRoute(
          path: '/drivers',
          builder: (context, state) => const VehicleListPage(),
        ),
        
        // 费用管理路由
        GoRoute(
          path: '/expenses',
          builder: (context, state) => const ExpenseListPage(),
        ),
        
        // 个人资料路由
        GoRoute(
          path: '/profile',
          builder: (context, state) => const ProfilePage(),
        ),
      ],
    );
  }
}
