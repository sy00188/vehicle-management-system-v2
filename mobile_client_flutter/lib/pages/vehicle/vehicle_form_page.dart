import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/vehicle.dart';
import '../../providers/vehicle_provider.dart';
import '../../utils/date_utils.dart' as AppDateUtils;

class VehicleFormPage extends StatefulWidget {
  final Vehicle? vehicle;
  final bool isEdit;

  const VehicleFormPage({
    super.key,
    this.vehicle,
    this.isEdit = false,
  });

  @override
  State<VehicleFormPage> createState() => _VehicleFormPageState();
}

class _VehicleFormPageState extends State<VehicleFormPage> {
  final _formKey = GlobalKey<FormState>();
  final _plateNumberController = TextEditingController();
  final _brandController = TextEditingController();
  final _modelController = TextEditingController();
  final _colorController = TextEditingController();
  final _seatsController = TextEditingController();
  final _mileageController = TextEditingController();
  final _departmentController = TextEditingController();
  final _locationController = TextEditingController();
  final _descriptionController = TextEditingController();
  // 移除不存在的字段控制器

  VehicleType _selectedType = VehicleType.sedan;
  VehicleStatus _selectedStatus = VehicleStatus.available;
  String _selectedFuelType = '汽油';
  DateTime? _purchaseDate;
  DateTime? _registrationDate;
  DateTime? _insuranceExpiry;
  DateTime? _inspectionExpiry;
  // 移除不存在的维护相关字段
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    if (widget.isEdit && widget.vehicle != null) {
      _initializeFormData();
    }
  }

  void _initializeFormData() {
    final vehicle = widget.vehicle!;
    _plateNumberController.text = vehicle.plateNumber;
    _brandController.text = vehicle.brand ?? '';
    _modelController.text = vehicle.model ?? '';
    _colorController.text = vehicle.color ?? '';
    _seatsController.text = vehicle.seats.toString();
    _mileageController.text = vehicle.mileage.toString();
    _departmentController.text = vehicle.department ?? '';
    _locationController.text = vehicle.location ?? '';
    _descriptionController.text = vehicle.description ?? '';
    // 移除不存在字段的初始化
    
    _selectedType = vehicle.type;
    _selectedStatus = vehicle.status;
    _selectedFuelType = vehicle.fuelType ?? '汽油';
    _purchaseDate = vehicle.purchaseDate;
    _registrationDate = vehicle.registrationDate;
    _insuranceExpiry = vehicle.insuranceExpiry;
    _inspectionExpiry = vehicle.inspectionExpiry;
  }

  @override
  void dispose() {
    _plateNumberController.dispose();
    _brandController.dispose();
    _modelController.dispose();
    _colorController.dispose();
    _seatsController.dispose();
    _mileageController.dispose();
    _departmentController.dispose();
    _locationController.dispose();
    _descriptionController.dispose();
    // 移除不存在字段控制器的dispose
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.isEdit ? '编辑车辆' : '添加车辆'),
        actions: [
          TextButton(
            onPressed: _isLoading ? null : _saveVehicle,
            child: Text(
              '保存',
              style: TextStyle(
                color: _isLoading ? Colors.grey : Colors.white,
                fontSize: 16,
              ),
            ),
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : Form(
              key: _formKey,
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildBasicInfoSection(),
                    const SizedBox(height: 24),
                    _buildTechnicalInfoSection(),
                    const SizedBox(height: 24),
                    _buildDateInfoSection(),
                    const SizedBox(height: 24),
                    _buildAdditionalInfoSection(),
                    const SizedBox(height: 32),
                  ],
                ),
              ),
            ),
    );
  }

  Widget _buildBasicInfoSection() {
    return _buildSection(
      title: '基本信息',
      icon: Icons.info_outline,
      children: [
        TextFormField(
          controller: _plateNumberController,
          decoration: const InputDecoration(
            labelText: '车牌号 *',
            hintText: '请输入车牌号',
            border: OutlineInputBorder(),
          ),
          validator: (value) {
            if (value == null || value.trim().isEmpty) {
              return '请输入车牌号';
            }
            return null;
          },
        ),
        const SizedBox(height: 16),
        Row(
          children: [
            Expanded(
              child: TextFormField(
                controller: _brandController,
                decoration: const InputDecoration(
                  labelText: '品牌',
                  hintText: '请输入品牌',
                  border: OutlineInputBorder(),
                ),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: TextFormField(
                controller: _modelController,
                decoration: const InputDecoration(
                  labelText: '型号',
                  hintText: '请输入型号',
                  border: OutlineInputBorder(),
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),
        Row(
          children: [
            Expanded(
              child: DropdownButtonFormField<VehicleType>(
                value: _selectedType,
                decoration: const InputDecoration(
                  labelText: '车辆类型 *',
                  border: OutlineInputBorder(),
                ),
                items: VehicleType.values.map((type) {
                  return DropdownMenuItem(
                    value: type,
                    child: Text(type.label),
                  );
                }).toList(),
                onChanged: (value) {
                  if (value != null) {
                    setState(() {
                      _selectedType = value;
                    });
                  }
                },
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: DropdownButtonFormField<VehicleStatus>(
                value: _selectedStatus,
                decoration: const InputDecoration(
                  labelText: '车辆状态 *',
                  border: OutlineInputBorder(),
                ),
                items: VehicleStatus.values.map((status) {
                  return DropdownMenuItem(
                    value: status,
                    child: Text(status.label),
                  );
                }).toList(),
                onChanged: (value) {
                  if (value != null) {
                    setState(() {
                      _selectedStatus = value;
                    });
                  }
                },
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),
        Row(
          children: [
            Expanded(
              child: TextFormField(
                controller: _colorController,
                decoration: const InputDecoration(
                  labelText: '颜色',
                  hintText: '请输入颜色',
                  border: OutlineInputBorder(),
                ),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: TextFormField(
                controller: _seatsController,
                decoration: const InputDecoration(
                  labelText: '座位数 *',
                  hintText: '请输入座位数',
                  border: OutlineInputBorder(),
                ),
                keyboardType: TextInputType.number,
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return '请输入座位数';
                  }
                  final seats = int.tryParse(value);
                  if (seats == null || seats <= 0) {
                    return '请输入有效的座位数';
                  }
                  return null;
                },
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),
        Row(
          children: [
            Expanded(
              child: DropdownButtonFormField<String>(
                value: _selectedFuelType,
                decoration: const InputDecoration(
                  labelText: '燃料类型 *',
                  border: OutlineInputBorder(),
                ),
                items: ['汽油', '柴油', '电动', '混合动力', '天然气'].map((fuel) {
                  return DropdownMenuItem(
                    value: fuel,
                    child: Text(fuel),
                  );
                }).toList(),
                onChanged: (value) {
                  if (value != null) {
                    setState(() {
                      _selectedFuelType = value;
                    });
                  }
                },
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: TextFormField(
                controller: _mileageController,
                decoration: const InputDecoration(
                  labelText: '当前里程 (km)',
                  hintText: '请输入当前里程',
                  border: OutlineInputBorder(),
                ),
                keyboardType: TextInputType.number,
                validator: (value) {
                  if (value != null && value.trim().isNotEmpty) {
                    final mileage = int.tryParse(value);
                    if (mileage == null || mileage < 0) {
                      return '请输入有效的里程数';
                    }
                  }
                  return null;
                },
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildTechnicalInfoSection() {
    return _buildSection(
      title: '技术信息',
      icon: Icons.settings,
      children: [
        // 技术信息部分暂时简化，只保留燃料类型选择
        DropdownButtonFormField<String>(
          value: _selectedFuelType,
          decoration: const InputDecoration(
            labelText: '燃料类型',
            border: OutlineInputBorder(),
          ),
          items: ['汽油', '柴油', '电动', '混合动力', '天然气'].map((fuel) {
            return DropdownMenuItem(
              value: fuel,
              child: Text(fuel),
            );
          }).toList(),
          onChanged: (value) {
            setState(() {
              _selectedFuelType = value!;
            });
          },
        ),
      ],
    );
  }

  Widget _buildDateInfoSection() {
    return _buildSection(
      title: '日期信息',
      icon: Icons.calendar_today,
      children: [
        Row(
          children: [
            Expanded(
              child: _buildDateField(
                label: '购买日期',
                date: _purchaseDate,
                onTap: () => _selectDate(context, (date) {
                  setState(() {
                    _purchaseDate = date;
                  });
                }),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: _buildDateField(
                label: '注册日期',
                date: _registrationDate,
                onTap: () => _selectDate(context, (date) {
                  setState(() {
                    _registrationDate = date;
                  });
                }),
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),
        Row(
          children: [
            Expanded(
              child: _buildDateField(
                label: '保险到期',
                date: _insuranceExpiry,
                onTap: () => _selectDate(context, (date) {
                  setState(() {
                    _insuranceExpiry = date;
                  });
                }),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: _buildDateField(
                label: '年检到期',
                date: _inspectionExpiry,
                onTap: () => _selectDate(context, (date) {
                  setState(() {
                    _inspectionExpiry = date;
                  });
                }),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildMaintenanceInfoSection() {
    // 维护信息部分已移除，因为Vehicle模型中不包含这些字段
    return const SizedBox.shrink();
  }

  Widget _buildAdditionalInfoSection() {
    return _buildSection(
      title: '附加信息',
      icon: Icons.note,
      children: [
        Row(
          children: [
            Expanded(
              child: TextFormField(
                controller: _departmentController,
                decoration: const InputDecoration(
                  labelText: '所属部门',
                  hintText: '请输入所属部门',
                  border: OutlineInputBorder(),
                ),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: TextFormField(
                controller: _locationController,
                decoration: const InputDecoration(
                  labelText: '当前位置',
                  hintText: '请输入当前位置',
                  border: OutlineInputBorder(),
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),
        TextFormField(
          controller: _descriptionController,
          decoration: const InputDecoration(
            labelText: '车辆描述',
            hintText: '请输入车辆描述',
            border: OutlineInputBorder(),
          ),
          maxLines: 3,
        ),
        // 移除备注字段，因为Vehicle模型中不包含此字段
      ],
    );
  }

  Widget _buildSection({
    required String title,
    required IconData icon,
    required List<Widget> children,
  }) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(icon, size: 20, color: Colors.blue),
                const SizedBox(width: 8),
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            ...children,
          ],
        ),
      ),
    );
  }

  Widget _buildDateField({
    required String label,
    required DateTime? date,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      child: InputDecorator(
        decoration: InputDecoration(
          labelText: label,
          border: const OutlineInputBorder(),
          suffixIcon: const Icon(Icons.calendar_today),
        ),
        child: Text(
          date != null ? AppDateUtils.DateUtils.formatDisplayDate(date!) : '请选择日期',
          style: TextStyle(
            color: date != null ? Colors.black : Colors.grey,
          ),
        ),
      ),
    );
  }

  Future<void> _selectDate(BuildContext context, Function(DateTime) onDateSelected) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime(1900),
      lastDate: DateTime(2100),
    );
    if (picked != null) {
      onDateSelected(picked);
    }
  }

  Future<void> _saveVehicle() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    setState(() {
      _isLoading = true;
    });

    try {
      final vehicleData = {
        'plateNumber': _plateNumberController.text.trim(),
        'brand': _brandController.text.trim(),
        'model': _modelController.text.trim(),
        'color': _colorController.text.trim(),
        'type': _selectedType.name,
        'status': _selectedStatus.name,
        'seats': int.parse(_seatsController.text),
        'fuelType': _selectedFuelType,
        'mileage': int.tryParse(_mileageController.text) ?? 0,
        'department': _departmentController.text.trim(),
        'location': _locationController.text.trim(),
        'description': _descriptionController.text.trim(),
        'purchaseDate': _purchaseDate?.toIso8601String(),
        'registrationDate': _registrationDate?.toIso8601String(),
        'insuranceExpiry': _insuranceExpiry?.toIso8601String(),
        'inspectionExpiry': _inspectionExpiry?.toIso8601String(),
      };

      final provider = context.read<VehicleProvider>();
      bool success;

      if (widget.isEdit && widget.vehicle != null) {
        success = await provider.updateVehicle(widget.vehicle!.id, vehicleData);
      } else {
        success = await provider.createVehicle(vehicleData);
      }

      if (success) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(widget.isEdit ? '车辆更新成功' : '车辆创建成功'),
              backgroundColor: Colors.green,
            ),
          );
          Navigator.pop(context, true);
        }
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('操作失败'),
              backgroundColor: Colors.red,
            ),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('操作失败: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }
}