import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/vehicle.dart';
import '../../providers/vehicle_provider.dart';
import '../../providers/auth_provider.dart';

class VehicleDetailPage extends StatefulWidget {
  final String vehicleId;

  const VehicleDetailPage({
    super.key,
    required this.vehicleId,
  });

  @override
  State<VehicleDetailPage> createState() => _VehicleDetailPageState();
}

class _VehicleDetailPageState extends State<VehicleDetailPage> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<VehicleProvider>().fetchVehicleDetail(widget.vehicleId);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('车辆详情'),
        actions: [
          Consumer<VehicleProvider>(builder: (context, provider, child) {
            final vehicle = provider.selectedVehicle;
            if (vehicle == null) return const SizedBox.shrink();
            
            return PopupMenuButton<String>(
              onSelected: (value) {
                switch (value) {
                  case 'edit':
                    _navigateToEdit(vehicle);
                    break;
                  case 'apply':
                    _showApplyDialog(vehicle);
                    break;
                  case 'return':
                    _showReturnDialog(vehicle);
                    break;
                }
              },
              itemBuilder: (context) => [
                const PopupMenuItem(
                  value: 'edit',
                  child: ListTile(
                    leading: Icon(Icons.edit),
                    title: Text('编辑'),
                    contentPadding: EdgeInsets.zero,
                  ),
                ),
                if (vehicle.status == VehicleStatus.available)
                  const PopupMenuItem(
                    value: 'apply',
                    child: ListTile(
                      leading: Icon(Icons.assignment),
                      title: Text('申请使用'),
                      contentPadding: EdgeInsets.zero,
                    ),
                  ),
                if (vehicle.status == VehicleStatus.inUse &&
                    vehicle.driverId == context.read<AuthProvider>().currentUser?.id)
                  const PopupMenuItem(
                    value: 'return',
                    child: ListTile(
                      leading: Icon(Icons.keyboard_return),
                      title: Text('归还车辆'),
                      contentPadding: EdgeInsets.zero,
                    ),
                  ),
              ],
            );
          }),
        ],
      ),
      body: Consumer<VehicleProvider>(builder: (context, provider, child) {
        if (provider.isLoadingDetail) {
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
                  onPressed: () {
                    provider.fetchVehicleDetail(widget.vehicleId);
                  },
                  child: const Text('重试'),
                ),
              ],
            ),
          );
        }

        final vehicle = provider.selectedVehicle;
        if (vehicle == null) {
          return const Center(
            child: Text('车辆信息不存在'),
          );
        }

        return SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // 车辆图片
              if (vehicle.images?.isNotEmpty == true)
                Container(
                  height: 200,
                  width: double.infinity,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(12),
                    image: DecorationImage(
                      image: NetworkImage(vehicle.images!.first),
                      fit: BoxFit.cover,
                    ),
                  ),
                )
              else
                Container(
                  height: 200,
                  width: double.infinity,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(12),
                    color: Colors.grey[300],
                  ),
                  child: const Icon(
                    Icons.directions_car,
                    size: 64,
                    color: Colors.grey,
                  ),
                ),
              const SizedBox(height: 16),

              // 基本信息卡片
              _buildInfoCard(
                '基本信息',
                [
                  _buildInfoRow('车牌号', vehicle.plateNumber),
                  _buildInfoRow('品牌', vehicle.brand ?? ''),
                  _buildInfoRow('型号', vehicle.model ?? ''),
                  _buildInfoRow('颜色', vehicle.color ?? ''),
                  _buildInfoRow('车辆类型', vehicle.type.label),
                  _buildInfoRow('座位数', '${vehicle.seats}座'),
                  _buildInfoRow('燃料类型', vehicle.fuelType ?? '未设置'),
                ],
              ),
              const SizedBox(height: 16),

              // 状态信息卡片
              _buildInfoCard(
                '状态信息',
                [
                  _buildInfoRow('当前状态', vehicle.status.label),
                  if (vehicle.driverName != null)
                    _buildInfoRow('当前使用人', vehicle.driverName!),
                  _buildInfoRow('所属部门', vehicle.department ?? ''),
                  _buildInfoRow('当前位置', vehicle.location ?? ''),
                ],
              ),
              const SizedBox(height: 16),

              // 技术信息卡片
              _buildInfoCard(
                '技术信息',
                [
                  _buildInfoRow('里程数', '${vehicle.mileage} km'),
                  _buildInfoRow('购买日期', vehicle.purchaseDate != null ? _formatDate(vehicle.purchaseDate!) : ''),
                  _buildInfoRow('注册日期', vehicle.registrationDate != null ? _formatDate(vehicle.registrationDate!) : ''),
                  _buildInfoRow('保险到期', vehicle.insuranceExpiry != null ? _formatDate(vehicle.insuranceExpiry!) : ''),
                  _buildInfoRow('年检到期', vehicle.inspectionExpiry != null ? _formatDate(vehicle.inspectionExpiry!) : ''),
                ],
              ),
              const SizedBox(height: 16),

              // 描述信息
              if (vehicle.description?.isNotEmpty == true)
                _buildInfoCard(
                  '描述信息',
                  [
                    Padding(
                      padding: const EdgeInsets.symmetric(vertical: 8),
                      child: Text(
                        vehicle.description ?? '',
                        style: const TextStyle(fontSize: 16),
                      ),
                    ),
                  ],
                ),
            ],
          ),
        );
      }),
    );
  }

  Widget _buildInfoCard(String title, List<Widget> children) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 12),
            ...children,
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 100,
            child: Text(
              '$label:',
              style: const TextStyle(
                fontWeight: FontWeight.w500,
                color: Colors.grey,
              ),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(fontSize: 16),
            ),
          ),
        ],
      ),
    );
  }

  String _formatDate(DateTime date) {
    return '${date.year}-${date.month.toString().padLeft(2, '0')}-${date.day.toString().padLeft(2, '0')}';
  }

  void _navigateToEdit(Vehicle vehicle) {
    // TODO: 导航到编辑页面
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('编辑功能待实现')),
    );
  }

  void _showApplyDialog(Vehicle vehicle) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('申请使用车辆'),
        content: Text('确定要申请使用车辆 ${vehicle.plateNumber} 吗？'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('取消'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              // TODO: 实现申请逻辑
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('申请功能待实现')),
              );
            },
            child: const Text('确定'),
          ),
        ],
      ),
    );
  }

  void _showReturnDialog(Vehicle vehicle) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('归还车辆'),
        content: Text('确定要归还车辆 ${vehicle.plateNumber} 吗？'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('取消'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              // TODO: 实现归还逻辑
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('归还功能待实现')),
              );
            },
            child: const Text('确定'),
          ),
        ],
      ),
    );
  }
}