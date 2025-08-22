import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/expense.dart';
import '../../providers/expense_provider.dart';
import '../../providers/auth_provider.dart';
// import 'expense_form_page.dart'; // TODO: 创建后取消注释

class ExpenseListPage extends StatefulWidget {
  const ExpenseListPage({super.key});

  @override
  State<ExpenseListPage> createState() => _ExpenseListPageState();
}

class _ExpenseListPageState extends State<ExpenseListPage>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final ScrollController _scrollController = ScrollController();
  final ScrollController _myScrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _loadExpenses();
    _setupScrollListeners();
  }

  void _setupScrollListeners() {
    _scrollController.addListener(() {
      if (_scrollController.position.pixels >=
          _scrollController.position.maxScrollExtent - 200) {
        final provider = context.read<ExpenseProvider>();
        if (!provider.isLoading && provider.hasNextPage) {
          provider.loadMoreExpenses();
        }
      }
    });

    _myScrollController.addListener(() {
      if (_myScrollController.position.pixels >=
          _myScrollController.position.maxScrollExtent - 200) {
        final provider = context.read<ExpenseProvider>();
        if (!provider.isLoading && provider.hasNextPage) {
          provider.loadMoreExpenses();
        }
      }
    });
  }

  void _loadExpenses() {
    final provider = context.read<ExpenseProvider>();
    provider.loadExpenses(refresh: true);
  }

  @override
  void dispose() {
    _tabController.dispose();
    _scrollController.dispose();
    _myScrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('费用管理'),
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(text: '我的费用'),
            Tab(text: '所有费用'),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.filter_list),
            onPressed: _showFilterDialog,
          ),
        ],
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildMyExpensesList(),
          _buildAllExpensesList(),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _navigateToExpenseForm(),
        child: const Icon(Icons.add),
      ),
    );
  }

  Widget _buildMyExpensesList() {
    return Consumer<ExpenseProvider>(
      builder: (context, provider, child) {
        if (provider.isLoading && provider.expenses.isEmpty) {
          return const Center(
            child: CircularProgressIndicator(),
          );
        }

        if (provider.error != null) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(
                  Icons.error_outline,
                  size: 64,
                  color: Colors.grey,
                ),
                const SizedBox(height: 16),
                Text(
                  provider.error?.isNotEmpty == true
                      ? provider.error!
                      : '加载失败',
                  style: const TextStyle(color: Colors.grey),
                ),
                const SizedBox(height: 16),
                ElevatedButton(
                  onPressed: () => provider.loadExpenses(refresh: true),
                  child: const Text('重试'),
                ),
              ],
            ),
          );
        }

        if (provider.expenses.isEmpty) {
          return const Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  Icons.receipt_long_outlined,
                  size: 64,
                  color: Colors.grey,
                ),
                SizedBox(height: 16),
                Text(
                  '暂无费用记录',
                  style: TextStyle(color: Colors.grey),
                ),
              ],
            ),
          );
        }

        return RefreshIndicator(
          onRefresh: () => provider.loadExpenses(refresh: true),
          child: ListView.builder(
            controller: _myScrollController,
            padding: const EdgeInsets.all(16),
            itemCount: provider.expenses.length +
                (provider.isLoading ? 1 : 0),
            itemBuilder: (context, index) {
              if (index >= provider.expenses.length) {
                return const Center(
                  child: Padding(
                    padding: EdgeInsets.all(16),
                    child: CircularProgressIndicator(),
                  ),
                );
              }

              final expense = provider.expenses[index];
              return ExpenseCard(
                expense: expense,
                onTap: () => _navigateToExpenseDetail(expense),
                onEdit: () => _navigateToExpenseForm(expense: expense),
                onDelete: () => _deleteExpense(expense),
              );
            },
          ),
        );
      },
    );
  }

  Widget _buildAllExpensesList() {
    return Consumer<ExpenseProvider>(
      builder: (context, provider, child) {
        if (provider.isLoading && provider.expenses.isEmpty) {
          return const Center(
            child: CircularProgressIndicator(),
          );
        }

        if (provider.hasError) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(
                  Icons.error_outline,
                  size: 64,
                  color: Colors.grey,
                ),
                const SizedBox(height: 16),
                Text(
                  provider.errorMessage.isNotEmpty
                      ? provider.errorMessage
                      : '加载失败',
                  style: const TextStyle(color: Colors.grey),
                ),
                const SizedBox(height: 16),
                ElevatedButton(
                  onPressed: () => provider.loadExpenses(refresh: true),
                  child: const Text('重试'),
                ),
              ],
            ),
          );
        }

        if (provider.expenses.isEmpty) {
          return const Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  Icons.receipt_long_outlined,
                  size: 64,
                  color: Colors.grey,
                ),
                SizedBox(height: 16),
                Text(
                  '暂无费用记录',
                  style: TextStyle(color: Colors.grey),
                ),
              ],
            ),
          );
        }

        return RefreshIndicator(
          onRefresh: () => provider.loadExpenses(refresh: true),
          child: ListView.builder(
            controller: _scrollController,
            padding: const EdgeInsets.all(16),
            itemCount: provider.expenses.length +
                (provider.isLoading ? 1 : 0),
            itemBuilder: (context, index) {
              if (index >= provider.expenses.length) {
                return const Center(
                  child: Padding(
                    padding: EdgeInsets.all(16),
                    child: CircularProgressIndicator(),
                  ),
                );
              }

              final expense = provider.expenses[index];
              return ExpenseCard(
                expense: expense,
                onTap: () => _navigateToExpenseDetail(expense),
              );
            },
          ),
        );
      },
    );
  }

  void _navigateToExpenseForm({ExpenseRecord? expense}) async {
    final result = await Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => Scaffold(
          appBar: AppBar(title: const Text('费用表单')),
          body: const Center(child: Text('费用表单页面待实现')),
        ),
      ),
    );

    if (result == true) {
      _loadExpenses();
    }
  }

  void _navigateToExpenseDetail(ExpenseRecord expense) {
    // TODO: 实现费用详情页面
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('费用详情页面待实现')),
    );
  }

  void _deleteExpense(ExpenseRecord expense) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('删除费用'),
        content: const Text('确定要删除这条费用记录吗？'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('取消'),
          ),
          TextButton(
            onPressed: () async {
              Navigator.pop(context);
              final success = await context
                  .read<ExpenseProvider>()
                  .deleteExpense(expense.id);
              if (success) {
                if (mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('删除成功')),
                  );
                }
              } else {
                if (mounted) {
                  final provider = context.read<ExpenseProvider>();
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text(
                        provider.error?.isNotEmpty == true
                            ? provider.error!
                            : '删除失败',
                      ),
                    ),
                  );
                }
              }
            },
            child: const Text('删除'),
          ),
        ],
      ),
    );
  }

  void _showFilterDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('筛选条件'),
        content: const Text('筛选功能待实现'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('关闭'),
          ),
        ],
      ),
    );
  }
}

class ExpenseCard extends StatelessWidget {
  final ExpenseRecord expense;
  final VoidCallback? onTap;
  final VoidCallback? onEdit;
  final VoidCallback? onDelete;

  const ExpenseCard({
    super.key,
    required this.expense,
    this.onTap,
    this.onEdit,
    this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    final currentUser = context.read<AuthProvider>().currentUser;
    final canEdit = currentUser?.id == expense.createdBy;

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(8),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: _getTypeColor(expense.type),
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Text(
                      expense.type.label,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 12,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                  const Spacer(),
                  Text(
                    '¥${expense.amount.toStringAsFixed(2)}',
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Colors.red,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              if (expense.vehiclePlateNumber.isNotEmpty) ...[
                Row(
                  children: [
                    const Icon(Icons.directions_car, size: 16, color: Colors.grey),
                    const SizedBox(width: 4),
                    Text(
                      expense.vehiclePlateNumber,
                      style: const TextStyle(fontWeight: FontWeight.w500),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
              ],
              if (expense.description.isNotEmpty) ...[
                Text(
                  expense.description,
                  style: const TextStyle(color: Colors.grey),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 8),
              ],
              Row(
                children: [
                  Text(
                    _formatDate(expense.expenseDate),
                    style: const TextStyle(
                      color: Colors.grey,
                      fontSize: 12,
                    ),
                  ),
                  const Spacer(),
                  if (canEdit && (onEdit != null || onDelete != null))
                    PopupMenuButton<String>(
                      onSelected: (value) {
                        switch (value) {
                          case 'edit':
                            onEdit?.call();
                            break;
                          case 'delete':
                            onDelete?.call();
                            break;
                        }
                      },
                      itemBuilder: (context) => [
                        if (onEdit != null)
                          const PopupMenuItem(
                            value: 'edit',
                            child: Row(
                              children: [
                                Icon(Icons.edit, size: 16),
                                SizedBox(width: 8),
                                Text('编辑'),
                              ],
                            ),
                          ),
                        if (onDelete != null)
                          const PopupMenuItem(
                            value: 'delete',
                            child: Row(
                              children: [
                                Icon(Icons.delete, size: 16, color: Colors.red),
                                SizedBox(width: 8),
                                Text('删除', style: TextStyle(color: Colors.red)),
                              ],
                            ),
                          ),
                      ],
                      child: const Icon(
                        Icons.more_vert,
                        color: Colors.grey,
                      ),
                    ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Color _getTypeColor(ExpenseType type) {
    switch (type) {
      case ExpenseType.fuel:
        return Colors.orange;
      case ExpenseType.maintenance:
        return Colors.blue;
      case ExpenseType.insurance:
        return Colors.green;
      case ExpenseType.fine:
        return Colors.red;
      case ExpenseType.parking:
        return Colors.purple;
      case ExpenseType.toll:
        return Colors.teal;
      case ExpenseType.other:
        return Colors.grey;
      default:
        return Colors.grey;
    }
  }

  String _formatDate(DateTime date) {
    return '${date.year}-${date.month.toString().padLeft(2, '0')}-${date.day.toString().padLeft(2, '0')}';
  }
}