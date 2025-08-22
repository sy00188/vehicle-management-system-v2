import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/application.dart';
import '../../providers/application_provider.dart';
import '../../providers/auth_provider.dart';

class ApplicationListPage extends StatefulWidget {
  const ApplicationListPage({super.key});

  @override
  State<ApplicationListPage> createState() => _ApplicationListPageState();
}

class _ApplicationListPageState extends State<ApplicationListPage>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _scrollController.addListener(_onScroll);
    
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadApplications();
    });
  }

  @override
  void dispose() {
    _tabController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_scrollController.position.pixels ==
        _scrollController.position.maxScrollExtent) {
      final provider = context.read<ApplicationProvider>();
      if (provider.hasNextPage && !provider.isLoading) {
        _loadMoreApplications();
      }
    }
  }

  void _loadApplications() {
    context.read<ApplicationProvider>().fetchApplications(page: 1);
  }

  void _loadMoreApplications() {
    final provider = context.read<ApplicationProvider>();
    provider.fetchApplications(page: provider.currentPage + 1);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('申请管理'),
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(text: '我的申请'),
            Tab(text: '待审批'),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadApplications,
          ),
        ],
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildMyApplicationsTab(),
          _buildPendingApprovalsTab(),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // TODO: 导航到新建申请页面
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('新建申请功能待实现')),
          );
        },
        child: const Icon(Icons.add),
      ),
    );
  }

  Widget _buildMyApplicationsTab() {
    return Consumer<ApplicationProvider>(builder: (context, provider, child) {
      if (provider.isLoading && provider.applications.isEmpty) {
        return const Center(child: CircularProgressIndicator());
      }

      if (provider.hasError) {
        return Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.error, size: 64, color: Colors.red),
              const SizedBox(height: 16),
              Text(
                provider.errorMessage,
                style: const TextStyle(fontSize: 16),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: _loadApplications,
                child: const Text('重试'),
              ),
            ],
          ),
        );
      }

      final myApplications = provider.applications
          .where((app) => app.applicantId == context.read<AuthProvider>().currentUser?.id)
          .toList();

      if (myApplications.isEmpty) {
        return const Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.assignment, size: 64, color: Colors.grey),
              SizedBox(height: 16),
              Text(
                '暂无申请记录',
                style: TextStyle(fontSize: 16, color: Colors.grey),
              ),
            ],
          ),
        );
      }

      return RefreshIndicator(
        onRefresh: () async {
          _loadApplications();
        },
        child: ListView.builder(
          controller: _scrollController,
          padding: const EdgeInsets.all(16),
          itemCount: myApplications.length + (provider.hasNextPage ? 1 : 0),
          itemBuilder: (context, index) {
            if (index == myApplications.length) {
              return const Center(
                child: Padding(
                  padding: EdgeInsets.all(16),
                  child: CircularProgressIndicator(),
                ),
              );
            }

            final application = myApplications[index];
            return ApplicationCard(
              application: application,
              onTap: () => _navigateToDetail(application),
            );
          },
        ),
      );
    });
  }

  Widget _buildPendingApprovalsTab() {
    return Consumer<ApplicationProvider>(builder: (context, provider, child) {
      if (provider.isLoading && provider.applications.isEmpty) {
        return const Center(child: CircularProgressIndicator());
      }

      if (provider.hasError) {
        return Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.error, size: 64, color: Colors.red),
              const SizedBox(height: 16),
              Text(
                provider.errorMessage,
                style: const TextStyle(fontSize: 16),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: _loadApplications,
                child: const Text('重试'),
              ),
            ],
          ),
        );
      }

      final pendingApplications = provider.applications
          .where((app) => app.status == ApplicationStatus.pending)
          .toList();

      if (pendingApplications.isEmpty) {
        return const Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.check_circle, size: 64, color: Colors.grey),
              SizedBox(height: 16),
              Text(
                '暂无待审批申请',
                style: TextStyle(fontSize: 16, color: Colors.grey),
              ),
            ],
          ),
        );
      }

      return RefreshIndicator(
        onRefresh: () async {
          _loadApplications();
        },
        child: ListView.builder(
          controller: _scrollController,
          padding: const EdgeInsets.all(16),
          itemCount: pendingApplications.length + (provider.hasNextPage ? 1 : 0),
          itemBuilder: (context, index) {
            if (index == pendingApplications.length) {
              return const Center(
                child: Padding(
                  padding: EdgeInsets.all(16),
                  child: CircularProgressIndicator(),
                ),
              );
            }

            final application = pendingApplications[index];
            return ApplicationCard(
              application: application,
              onTap: () => _navigateToDetail(application),
              showApprovalActions: true,
              onApprove: () => _approveApplication(application),
              onReject: () => _rejectApplication(application),
            );
          },
        ),
      );
    });
  }

  void _navigateToDetail(VehicleApplication application) {
    // TODO: 导航到申请详情页面
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('查看申请详情: ${application.id}')),
    );
  }

  void _approveApplication(VehicleApplication application) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('批准申请'),
        content: Text('确定要批准申请 ${application.id} 吗？'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('取消'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              context.read<ApplicationProvider>().approveApplication(application.id, true, '批准');
            },
            child: const Text('批准'),
          ),
        ],
      ),
    );
  }

  void _rejectApplication(VehicleApplication application) {
    final TextEditingController reasonController = TextEditingController();
    
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('拒绝申请'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text('确定要拒绝申请 ${application.id} 吗？'),
            const SizedBox(height: 16),
            TextField(
              controller: reasonController,
              decoration: const InputDecoration(
                labelText: '拒绝原因',
                border: OutlineInputBorder(),
              ),
              maxLines: 3,
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('取消'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              context.read<ApplicationProvider>().approveApplication(
                application.id,
                false,
                reasonController.text.trim().isEmpty ? '拒绝' : reasonController.text.trim(),
              );
            },
            child: const Text('拒绝'),
          ),
        ],
      ),
    );
  }
}

class ApplicationCard extends StatelessWidget {
  final VehicleApplication application;
  final VoidCallback? onTap;
  final bool showApprovalActions;
  final VoidCallback? onApprove;
  final VoidCallback? onReject;

  const ApplicationCard({
    super.key,
    required this.application,
    this.onTap,
    this.showApprovalActions = false,
    this.onApprove,
    this.onReject,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Icon(
                    _getApplicationIcon(),
                    color: _getStatusColor(),
                    size: 24,
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      application.type.label,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: _getStatusColor().withOpacity(0.1),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      application.status.label,
                      style: TextStyle(
                        color: _getStatusColor(),
                        fontSize: 12,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              if (application.vehiclePlateNumber?.isNotEmpty == true) ...[
                Row(
                  children: [
                    const Icon(Icons.directions_car, size: 16, color: Colors.grey),
                    const SizedBox(width: 4),
                    Text(
                      '车辆: ${application.vehiclePlateNumber}',
                      style: const TextStyle(color: Colors.grey),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
              ],
              Row(
                children: [
                  const Icon(Icons.schedule, size: 16, color: Colors.grey),
                  const SizedBox(width: 4),
                  Text(
                    '申请时间: ${_formatDate(application.createdAt)}',
                    style: const TextStyle(color: Colors.grey),
                  ),
                ],
              ),
              if (application.startTime != null && application.endTime != null) ...[
                const SizedBox(height: 4),
                Row(
                  children: [
                    const Icon(Icons.access_time, size: 16, color: Colors.grey),
                    const SizedBox(width: 4),
                    Text(
                      '使用时间: ${_formatDate(application.startTime!)} - ${_formatDate(application.endTime!)}',
                      style: const TextStyle(color: Colors.grey),
                    ),
                  ],
                ),
              ],
              if (application.purpose?.isNotEmpty == true) ...[
                const SizedBox(height: 8),
                Text(
                  '用途: ${application.purpose}',
                  style: const TextStyle(fontSize: 14),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
              if (showApprovalActions && application.status == ApplicationStatus.pending) ...[
                const SizedBox(height: 12),
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    TextButton(
                      onPressed: onReject,
                      style: TextButton.styleFrom(
                        foregroundColor: Colors.red,
                      ),
                      child: const Text('拒绝'),
                    ),
                    const SizedBox(width: 8),
                    ElevatedButton(
                      onPressed: onApprove,
                      child: const Text('批准'),
                    ),
                  ],
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  IconData _getApplicationIcon() {
    switch (application.type) {
      case ApplicationType.business:
        return Icons.business;
      case ApplicationType.personal:
        return Icons.person;
      case ApplicationType.emergency:
        return Icons.emergency;
      case ApplicationType.maintenance:
        return Icons.build;
      default:
        return Icons.help_outline;
    }
  }

  Color _getStatusColor() {
    switch (application.status) {
      case ApplicationStatus.pending:
        return Colors.orange;
      case ApplicationStatus.approved:
        return Colors.green;
      case ApplicationStatus.rejected:
        return Colors.red;
      case ApplicationStatus.cancelled:
        return Colors.grey;
      case ApplicationStatus.inProgress:
        return Colors.blue;
      case ApplicationStatus.completed:
        return Colors.green;
      default:
        return Colors.grey;
    }
  }

  String _formatDate(DateTime date) {
    return '${date.month.toString().padLeft(2, '0')}-${date.day.toString().padLeft(2, '0')} ${date.hour.toString().padLeft(2, '0')}:${date.minute.toString().padLeft(2, '0')}';
  }
}