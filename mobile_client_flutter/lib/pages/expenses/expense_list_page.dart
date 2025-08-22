import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/expense_provider.dart';
import '../../models/expense.dart';

class ExpenseListPage extends StatefulWidget {
  const ExpenseListPage({super.key});

  @override
  State<ExpenseListPage> createState() => _ExpenseListPageState();
}

class _ExpenseListPageState extends State<ExpenseListPage> {
  @override
  void initState() {
    super.initState();
    // 初始化时加载费用列表
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<ExpenseProvider>().loadExpenses();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('费用管理'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () => _navigateToAddExpense(),
          ),
        ],
      ),
      body: Consumer<ExpenseProvider>(
        builder: (context, expenseProvider, child) {
          if (expenseProvider.isLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          if (expenseProvider.error != null) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    expenseProvider.error!,
                    style: const TextStyle(color: Colors.red),
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () => expenseProvider.loadExpenses(),
                    child: const Text('重试'),
                  ),
                ],
              ),
            );
          }

          final expenses = expenseProvider.expenses;
          if (expenses.isEmpty) {
            return const Center(
              child: Text('暂无费用记录'),
            );
          }

          return ListView.builder(
            itemCount: expenses.length,
            itemBuilder: (context, index) {
              final expense = expenses[index];
              return Card(
                margin: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 8,
                ),
                child: ListTile(
                  leading: CircleAvatar(
                    backgroundColor: _getExpenseTypeColor(expense.type),
                    child: Icon(
                      _getExpenseTypeIcon(expense.type),
                      color: Colors.white,
                    ),
                  ),
                  title: Text(
                    expense.type.label,
                    style: const TextStyle(fontWeight: FontWeight.bold),
                  ),
                  subtitle: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('金额: ¥${expense.amount.toStringAsFixed(2)}'),
                      Text('日期: ${expense.expenseDate.toString().split(' ')[0]}'),
                      Text('状态: ${expense.status.label}'),
                    ],
                  ),
                  trailing: const Icon(Icons.chevron_right),
                  onTap: () => _navigateToExpenseDetail(expense),
                ),
              );
            },
          );
        },
      ),
    );
  }

  Color _getExpenseTypeColor(ExpenseType type) {
    switch (type) {
      case ExpenseType.fuel:
        return Colors.orange;
      case ExpenseType.maintenance:
        return Colors.blue;
      case ExpenseType.insurance:
        return Colors.green;
      case ExpenseType.parking:
        return Colors.purple;
      case ExpenseType.toll:
        return Colors.red;
      case ExpenseType.fine:
        return Colors.redAccent;
      case ExpenseType.repair:
        return Colors.deepOrange;
      case ExpenseType.cleaning:
        return Colors.lightBlue;
      case ExpenseType.registration:
        return Colors.indigo;
      case ExpenseType.other:
        return Colors.grey;
    }
  }

  IconData _getExpenseTypeIcon(ExpenseType type) {
    switch (type) {
      case ExpenseType.fuel:
        return Icons.local_gas_station;
      case ExpenseType.maintenance:
        return Icons.build;
      case ExpenseType.insurance:
        return Icons.security;
      case ExpenseType.parking:
        return Icons.local_parking;
      case ExpenseType.toll:
        return Icons.toll;
      case ExpenseType.fine:
        return Icons.warning;
      case ExpenseType.repair:
        return Icons.car_repair;
      case ExpenseType.cleaning:
        return Icons.local_car_wash;
      case ExpenseType.registration:
        return Icons.assignment;
      case ExpenseType.other:
        return Icons.more_horiz;
    }
  }

  void _navigateToAddExpense() {
    // TODO: 导航到添加费用页面
  }

  void _navigateToExpenseDetail(ExpenseRecord expense) {
    // TODO: 导航到费用详情页面
  }
}