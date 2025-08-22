import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/vehicle_provider.dart';
import '../../models/vehicle.dart';

class VehicleListPage extends StatefulWidget {
  const VehicleListPage({super.key});

  @override
  State<VehicleListPage> createState() => _VehicleListPageState();
}

class _VehicleListPageState extends State<VehicleListPage> {
  final TextEditingController _searchController = TextEditingController();
  VehicleStatus? _selectedStatus;
  VehicleType? _selectedType;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<VehicleProvider>().fetchVehicles(refresh: true);
    });
  }

  void _loadMoreVehicles() {
    final provider = context.read<VehicleProvider>();
    provider.fetchVehicles(page: provider.currentPage + 1);
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('车辆管理'),
        actions: [
          IconButton(
            icon: const Icon(Icons.filter_list),
            onPressed: _showFilterDialog,
          ),
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () {
              context.read<VehicleProvider>().refreshVehicles();
            },
          ),
        ],
      ),
      body: Column(
        children: [
          // 搜索栏
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: '搜索车牌号、品牌或型号',
                prefixIcon: const Icon(Icons.search),
                suffixIcon: _searchController.text.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear),
                        onPressed: () {
                          _searchController.clear();
                          _performSearch();
                        },
                      )
                    : null,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              onChanged: (value) {
                setState(() {});
                _performSearch();
              },
            ),
          ),
          
          // 筛选标签
          if (_selectedStatus != null || _selectedType != null)
            Container(
              height: 50,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: ListView(
                scrollDirection: Axis.horizontal,
                children: [
                  if (_selectedStatus != null)
                    Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: Chip(
                        label: Text('状态: ${_selectedStatus!.label}'),
                        onDeleted: () {
                          setState(() {
                            _selectedStatus = null;
                          });
                          _performSearch();
                        },
                      ),
                    ),
                  if (_selectedType != null)
                    Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: Chip(
                        label: Text('类型: ${_selectedType!.label}'),
                        onDeleted: () {
                          setState(() {
                            _selectedType = null;
                          });
                          _performSearch();
                        },
                      ),
                    ),
                ],
              ),
            ),
          
          // 车辆列表
          Expanded(
            child: Consumer<VehicleProvider>(
              builder: (context, vehicleProvider, child) {
                if (vehicleProvider.isLoading && vehicleProvider.vehicles.isEmpty) {
                  return const Center(
                    child: CircularProgressIndicator(),
                  );
                }
                
                if (vehicleProvider.errorMessage.isNotEmpty) {
                  return Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.error_outline,
                          size: 64,
                          color: Colors.grey[400],
                        ),
                        const SizedBox(height: 16),
                        Text(
                          '加载失败',
                          style: TextStyle(
                            fontSize: 18,
                            color: Colors.grey[600],
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          vehicleProvider.errorMessage,
                          style: TextStyle(
                            color: Colors.grey[500],
                          ),
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: () {
                            vehicleProvider.refreshVehicles();
                          },
                          child: const Text('重试'),
                        ),
                      ],
                    ),
                  );
                }
                
                if (vehicleProvider.vehicles.isEmpty) {
                  return Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.directions_car_outlined,
                          size: 64,
                          color: Colors.grey[400],
                        ),
                        const SizedBox(height: 16),
                        Text(
                          '暂无车辆',
                          style: TextStyle(
                            fontSize: 18,
                            color: Colors.grey[600],
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          '请联系管理员添加车辆',
                          style: TextStyle(
                            color: Colors.grey[500],
                          ),
                        ),
                      ],
                    ),
                  );
                }
                
                return RefreshIndicator(
                  onRefresh: () async {
                    await vehicleProvider.refreshVehicles();
                  },
                  child: ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: vehicleProvider.vehicles.length + 
                        (vehicleProvider.hasNextPage ? 1 : 0),
                    itemBuilder: (context, index) {
                      if (index >= vehicleProvider.vehicles.length) {
                        // 加载更多指示器
                        if (vehicleProvider.isLoading) {
                          return const Padding(
                            padding: EdgeInsets.all(16),
                            child: Center(
                              child: CircularProgressIndicator(),
                            ),
                          );
                        } else {
                          // 触发加载更多
                          WidgetsBinding.instance.addPostFrameCallback((_) {
                            _loadMoreVehicles();
                          });
                          return const SizedBox.shrink();
                        }
                      }
                      
                      final vehicle = vehicleProvider.vehicles[index];
                      return VehicleCard(
                        vehicle: vehicle,
                        onTap: () {
                          Navigator.of(context).pushNamed(
                            '/vehicle/detail',
                            arguments: vehicle.id,
                          );
                        },
                      );
                    },
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
  
  void _performSearch() {
    final provider = context.read<VehicleProvider>();
    provider.searchVehicles(_searchController.text.trim());
    provider.filterVehicles(
      status: _selectedStatus?.value,
      type: _selectedType?.value,
    );
  }
  
  void _showFilterDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('筛选条件'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('车辆状态'),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              children: [
                FilterChip(
                  label: const Text('全部'),
                  selected: _selectedStatus == null,
                  onSelected: (selected) {
                    setState(() {
                      _selectedStatus = null;
                    });
                  },
                ),
                ...VehicleStatus.values.map((status) => FilterChip(
                  label: Text(status.label),
                  selected: _selectedStatus == status,
                  onSelected: (selected) {
                    setState(() {
                      _selectedStatus = selected ? status : null;
                    });
                  },
                )),
              ],
            ),
            const SizedBox(height: 16),
            const Text('车辆类型'),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              children: [
                FilterChip(
                  label: const Text('全部'),
                  selected: _selectedType == null,
                  onSelected: (selected) {
                    setState(() {
                      _selectedType = null;
                    });
                  },
                ),
                ...VehicleType.values.map((type) => FilterChip(
                  label: Text(type.label),
                  selected: _selectedType == type,
                  onSelected: (selected) {
                    setState(() {
                      _selectedType = selected ? type : null;
                    });
                  },
                )),
              ],
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.of(context).pop();
            },
            child: const Text('取消'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.of(context).pop();
              _performSearch();
            },
            child: const Text('应用'),
          ),
        ],
      ),
    );
  }
}

class VehicleCard extends StatelessWidget {
  final Vehicle vehicle;
  final VoidCallback? onTap;
  
  const VehicleCard({
    super.key,
    required this.vehicle,
    this.onTap,
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
                  // 车辆图标
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: _getTypeColor(vehicle.type).withOpacity(0.1),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Icon(
                      _getTypeIcon(vehicle.type),
                      color: _getTypeColor(vehicle.type),
                      size: 24,
                    ),
                  ),
                  const SizedBox(width: 16),
                  
                  // 车辆基本信息
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Text(
                              vehicle.plateNumber,
                              style: const TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(width: 8),
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 8,
                                vertical: 2,
                              ),
                              decoration: BoxDecoration(
                                color: _getStatusColor(vehicle.status),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Text(
                                vehicle.status.label,
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 12,
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Text(
                          vehicle.displayName ?? '${vehicle.brand} ${vehicle.model}',
                          style: const TextStyle(
                            fontSize: 16,
                            color: Colors.grey,
                          ),
                        ),
                      ],
                    ),
                  ),
                  
                  // 箭头图标
                  const Icon(
                    Icons.chevron_right,
                    color: Colors.grey,
                  ),
                ],
              ),
              
              const SizedBox(height: 12),
              
              // 车辆详细信息
              Row(
                children: [
                  Expanded(
                    child: _buildInfoItem(
                      icon: Icons.category,
                      label: '类型',
                      value: vehicle.type.label,
                    ),
                  ),
                  Expanded(
                    child: _buildInfoItem(
                      icon: Icons.people,
                      label: '座位',
                      value: '${vehicle.seats}座',
                    ),
                  ),
                  Expanded(
                    child: _buildInfoItem(
                      icon: Icons.local_gas_station,
                      label: '燃料',
                      value: vehicle.fuelType ?? '',
                    ),
                  ),
                ],
              ),
              
              if (vehicle.driverId != null) ...[
                const SizedBox(height: 12),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.orange.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    children: [
                      const Icon(
                        Icons.person,
                        size: 16,
                        color: Colors.orange,
                      ),
                      const SizedBox(width: 8),
                      Text(
                        '当前使用人: ${vehicle.driverName ?? '已分配'}',
                        style: const TextStyle(
                          color: Colors.orange,
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
  
  Widget _buildInfoItem({
    required IconData icon,
    required String label,
    required String value,
  }) {
    return Row(
      children: [
        Icon(
          icon,
          size: 16,
          color: Colors.grey,
        ),
        const SizedBox(width: 4),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: const TextStyle(
                  fontSize: 10,
                  color: Colors.grey,
                ),
              ),
              Text(
                value,
                style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
  
  Color _getStatusColor(VehicleStatus status) {
    switch (status) {
      case VehicleStatus.available:
        return Colors.green;
      case VehicleStatus.inUse:
        return Colors.orange;
      case VehicleStatus.maintenance:
        return Colors.red;
      case VehicleStatus.repair:
        return Colors.red;
      case VehicleStatus.retired:
        return Colors.grey;
      case VehicleStatus.reserved:
        return Colors.blue;
    }
  }
  
  Color _getTypeColor(VehicleType type) {
    switch (type) {
      case VehicleType.sedan:
        return Colors.blue;
      case VehicleType.suv:
        return Colors.teal;
      case VehicleType.truck:
        return Colors.orange;
      case VehicleType.van:
        return Colors.purple;
      case VehicleType.bus:
        return Colors.green;
      case VehicleType.motorcycle:
        return Colors.red;
      case VehicleType.other:
        return Colors.grey;
    }
  }
  
  IconData _getTypeIcon(VehicleType type) {
    switch (type) {
      case VehicleType.sedan:
        return Icons.directions_car;
      case VehicleType.suv:
        return Icons.directions_car;
      case VehicleType.truck:
        return Icons.local_shipping;
      case VehicleType.van:
        return Icons.airport_shuttle;
      case VehicleType.bus:
        return Icons.directions_bus;
      case VehicleType.motorcycle:
        return Icons.motorcycle;
      case VehicleType.other:
        return Icons.help_outline;
    }
  }
}