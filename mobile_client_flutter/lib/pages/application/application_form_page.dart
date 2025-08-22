import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/application.dart';
import '../../models/vehicle.dart';
import '../../providers/application_provider.dart';
import '../../providers/vehicle_provider.dart';
import '../../providers/auth_provider.dart';

class ApplicationFormPage extends StatefulWidget {
  final VehicleApplication? application;
  final bool isEdit;

  const ApplicationFormPage({
    super.key,
    this.application,
    this.isEdit = false,
  });

  @override
  State<ApplicationFormPage> createState() => _ApplicationFormPageState();
}

class _ApplicationFormPageState extends State<ApplicationFormPage> {
  final _formKey = GlobalKey<FormState>();
  final _purposeController = TextEditingController();
  final _destinationController = TextEditingController();
  final _passengersController = TextEditingController();
  final _remarksController = TextEditingController();

  ApplicationType _selectedType = ApplicationType.business;
  Vehicle? _selectedVehicle;
  DateTime? _startTime;
  DateTime? _endTime;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _initializeForm();
    _loadVehicles();
  }

  void _initializeForm() {
    if (widget.application != null) {
      final app = widget.application!;
      _purposeController.text = app.purpose ?? '';
      _destinationController.text = app.destination ?? '';
      _passengersController.text = app.passengers?.toString() ?? '';
      _remarksController.text = app.remarks ?? '';
      _selectedType = app.type;
      _startTime = app.startTime;
      _endTime = app.endTime;
    }
  }

  void _loadVehicles() {
    context.read<VehicleProvider>().fetchVehicles(page: 1);
  }

  @override
  void dispose() {
    _purposeController.dispose();
    _destinationController.dispose();
    _passengersController.dispose();
    _remarksController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.isEdit ? '编辑申请' : '新建申请'),
        actions: [
          if (_isLoading)
            const Center(
              child: Padding(
                padding: EdgeInsets.all(16.0),
                child: SizedBox(
                  width: 20,
                  height: 20,
                  child: CircularProgressIndicator(strokeWidth: 2),
                ),
              ),
            ),
        ],
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            _buildTypeSection(),
            const SizedBox(height: 24),
            _buildVehicleSection(),
            const SizedBox(height: 24),
            _buildTimeSection(),
            const SizedBox(height: 24),
            _buildDetailsSection(),
            const SizedBox(height: 32),
            _buildSubmitButton(),
          ],
        ),
      ),
    );
  }

  Widget _buildTypeSection() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              '申请类型',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 12),
            Wrap(
              spacing: 8,
              children: ApplicationType.values.map((type) {
                return ChoiceChip(
                  label: Text(type.label),
                  selected: _selectedType == type,
                  onSelected: (selected) {
                    if (selected) {
                      setState(() {
                        _selectedType = type;
                      });
                    }
                  },
                );
              }).toList(),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildVehicleSection() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              '选择车辆',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 12),
            Consumer<VehicleProvider>(
              builder: (context, provider, child) {
                if (provider.isLoading) {
                  return const Center(
                    child: CircularProgressIndicator(),
                  );
                }

                final availableVehicles = provider.vehicles
                    .where((v) => v.status == VehicleStatus.available)
                    .toList();

                if (availableVehicles.isEmpty) {
                  return const Text(
                    '暂无可用车辆',
                    style: TextStyle(color: Colors.grey),
                  );
                }

                return DropdownButtonFormField<Vehicle>(
                  value: _selectedVehicle,
                  decoration: const InputDecoration(
                    labelText: '请选择车辆',
                    border: OutlineInputBorder(),
                  ),
                  items: availableVehicles.map((vehicle) {
                    return DropdownMenuItem<Vehicle>(
                      value: vehicle,
                      child: Text(
                        '${vehicle.plateNumber} - ${vehicle.brand} ${vehicle.model}',
                      ),
                    );
                  }).toList(),
                  onChanged: (vehicle) {
                    setState(() {
                      _selectedVehicle = vehicle;
                    });
                  },
                  validator: (value) {
                    if (value == null) {
                      return '请选择车辆';
                    }
                    return null;
                  },
                );
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTimeSection() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              '使用时间',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: InkWell(
                    onTap: () => _selectDateTime(true),
                    child: InputDecorator(
                      decoration: const InputDecoration(
                        labelText: '开始时间',
                        border: OutlineInputBorder(),
                      ),
                      child: Text(
                        _startTime != null
                            ? _formatDateTime(_startTime!)
                            : '请选择开始时间',
                        style: TextStyle(
                          color: _startTime != null ? null : Colors.grey,
                        ),
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: InkWell(
                    onTap: () => _selectDateTime(false),
                    child: InputDecorator(
                      decoration: const InputDecoration(
                        labelText: '结束时间',
                        border: OutlineInputBorder(),
                      ),
                      child: Text(
                        _endTime != null
                            ? _formatDateTime(_endTime!)
                            : '请选择结束时间',
                        style: TextStyle(
                          color: _endTime != null ? null : Colors.grey,
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
            if (_startTime != null && _endTime != null) ...[
              const SizedBox(height: 8),
              Text(
                '使用时长: ${_calculateDuration()}',
                style: const TextStyle(
                  color: Colors.blue,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildDetailsSection() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              '申请详情',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _purposeController,
              decoration: const InputDecoration(
                labelText: '用车目的',
                border: OutlineInputBorder(),
                hintText: '请输入用车目的',
              ),
              maxLines: 2,
              validator: (value) {
                if (value == null || value.trim().isEmpty) {
                  return '请输入用车目的';
                }
                return null;
              },
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _destinationController,
              decoration: const InputDecoration(
                labelText: '目的地',
                border: OutlineInputBorder(),
                hintText: '请输入目的地',
              ),
              validator: (value) {
                if (value == null || value.trim().isEmpty) {
                  return '请输入目的地';
                }
                return null;
              },
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _passengersController,
              decoration: const InputDecoration(
                labelText: '乘车人数',
                border: OutlineInputBorder(),
                hintText: '请输入乘车人数',
              ),
              keyboardType: TextInputType.number,
              validator: (value) {
                if (value == null || value.trim().isEmpty) {
                  return '请输入乘车人数';
                }
                final passengers = int.tryParse(value.trim());
                if (passengers == null || passengers <= 0) {
                  return '请输入有效的乘车人数';
                }
                return null;
              },
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _remarksController,
              decoration: const InputDecoration(
                labelText: '备注',
                border: OutlineInputBorder(),
                hintText: '请输入备注信息（可选）',
              ),
              maxLines: 3,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSubmitButton() {
    return SizedBox(
      width: double.infinity,
      height: 48,
      child: ElevatedButton(
        onPressed: _isLoading ? null : _submitForm,
        child: _isLoading
            ? const SizedBox(
                width: 20,
                height: 20,
                child: CircularProgressIndicator(
                  strokeWidth: 2,
                  valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                ),
              )
            : Text(widget.isEdit ? '更新申请' : '提交申请'),
      ),
    );
  }

  Future<void> _selectDateTime(bool isStartTime) async {
    final date = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 365)),
    );

    if (date != null) {
      final time = await showTimePicker(
        context: context,
        initialTime: TimeOfDay.now(),
      );

      if (time != null) {
        final dateTime = DateTime(
          date.year,
          date.month,
          date.day,
          time.hour,
          time.minute,
        );

        setState(() {
          if (isStartTime) {
            _startTime = dateTime;
            // 如果开始时间晚于结束时间，清空结束时间
            if (_endTime != null && dateTime.isAfter(_endTime!)) {
              _endTime = null;
            }
          } else {
            // 确保结束时间不早于开始时间
            if (_startTime != null && dateTime.isBefore(_startTime!)) {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('结束时间不能早于开始时间'),
                ),
              );
              return;
            }
            _endTime = dateTime;
          }
        });
      }
    }
  }

  String _formatDateTime(DateTime dateTime) {
    return '${dateTime.year}-${dateTime.month.toString().padLeft(2, '0')}-${dateTime.day.toString().padLeft(2, '0')} '
        '${dateTime.hour.toString().padLeft(2, '0')}:${dateTime.minute.toString().padLeft(2, '0')}';
  }

  String _calculateDuration() {
    if (_startTime == null || _endTime == null) return '';
    
    final duration = _endTime!.difference(_startTime!);
    final days = duration.inDays;
    final hours = duration.inHours % 24;
    final minutes = duration.inMinutes % 60;

    if (days > 0) {
      return '$days天${hours}小时${minutes}分钟';
    } else if (hours > 0) {
      return '${hours}小时${minutes}分钟';
    } else {
      return '${minutes}分钟';
    }
  }

  Future<void> _submitForm() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    if (_selectedVehicle == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('请选择车辆')),
      );
      return;
    }

    if (_startTime == null || _endTime == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('请选择使用时间')),
      );
      return;
    }

    setState(() {
      _isLoading = true;
    });

    try {
      final currentUser = context.read<AuthProvider>().currentUser;
      if (currentUser == null) {
        throw Exception('用户未登录');
      }

      final applicationData = {
        'applicantId': currentUser.id,
        'applicantName': currentUser.username,
        'department': currentUser.department,
        'vehicleId': _selectedVehicle!.id,
        'vehiclePlateNumber': _selectedVehicle!.plateNumber,
        'type': _selectedType.value,
        'purpose': _purposeController.text.trim(),
        'destination': _destinationController.text.trim(),
        'passengers': int.parse(_passengersController.text.trim()),
        'startTime': _startTime!.toIso8601String(),
        'endTime': _endTime!.toIso8601String(),
        'remarks': _remarksController.text.trim(),
      };

      bool success;
      if (widget.isEdit && widget.application != null) {
        success = await context.read<ApplicationProvider>().updateApplication(
          widget.application!.id,
          applicationData,
        );
      } else {
        success = await context.read<ApplicationProvider>().createApplication(
          applicationData,
        );
      }

      if (success) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(widget.isEdit ? '申请更新成功' : '申请提交成功'),
            ),
          );
          Navigator.pop(context, true);
        }
      } else {
        if (mounted) {
          final provider = context.read<ApplicationProvider>();
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(provider.errorMessage.isNotEmpty ? provider.errorMessage : '操作失败'),
            ),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('操作失败: $e'),
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