import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/expense.dart';
import '../../models/vehicle.dart';
import '../../providers/expense_provider.dart';
import '../../providers/vehicle_provider.dart';
import '../../providers/auth_provider.dart';
import '../../utils/date_utils.dart';

class ExpenseFormPage extends StatefulWidget {
  final ExpenseRecord? expense;
  final bool isEdit;

  const ExpenseFormPage({
    super.key,
    this.expense,
    this.isEdit = false,
  });

  @override
  State<ExpenseFormPage> createState() => _ExpenseFormPageState();
}

class _ExpenseFormPageState extends State<ExpenseFormPage> {
  final _formKey = GlobalKey<FormState>();
  final _descriptionController = TextEditingController();
  final _amountController = TextEditingController();
  final _vendorController = TextEditingController();
  final _invoiceNumberController = TextEditingController();
  final _mileageController = TextEditingController();
  final _locationController = TextEditingController();
  final _remarksController = TextEditingController();

  ExpenseType _selectedType = ExpenseType.fuel;
  Vehicle? _selectedVehicle;
  DateTime _expenseDate = DateTime.now();
  String _currency = 'CNY';
  String? _category;
  String? _subcategory;
  String _paymentMethod = 'cash';

  @override
  void initState() {
    super.initState();
    _loadVehicles();
    if (widget.isEdit && widget.expense != null) {
      _initializeFormData();
    }
  }

  void _loadVehicles() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<VehicleProvider>().fetchVehicles(refresh: true);
    });
  }

  void _initializeFormData() {
    final expense = widget.expense!;
    _descriptionController.text = expense.description;
    _amountController.text = expense.amount.toString();
    _vendorController.text = expense.vendor ?? '';
    _invoiceNumberController.text = expense.invoiceNumber ?? '';
    _mileageController.text = expense.mileage?.toString() ?? '';
    _locationController.text = expense.location ?? '';
    _remarksController.text = expense.remarks ?? '';
    
    _selectedType = expense.type;
    _expenseDate = expense.expenseDate;
    _currency = expense.currency;
    _category = expense.category;
    _subcategory = expense.subcategory;
    _paymentMethod = expense.paymentMethod ?? 'cash';
  }

  @override
  void dispose() {
    _descriptionController.dispose();
    _amountController.dispose();
    _vendorController.dispose();
    _invoiceNumberController.dispose();
    _mileageController.dispose();
    _locationController.dispose();
    _remarksController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.isEdit ? '编辑费用' : '新增费用'),
        actions: [
          TextButton(
            onPressed: _submitForm,
            child: const Text(
              '保存',
              style: TextStyle(color: Colors.white),
            ),
          ),
        ],
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            _buildBasicInfoSection(),
            const SizedBox(height: 24),
            _buildExpenseDetailsSection(),
            const SizedBox(height: 24),
            _buildAdditionalInfoSection(),
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }

  Widget _buildBasicInfoSection() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              '基本信息',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            _buildVehicleSelector(),
            const SizedBox(height: 16),
            _buildExpenseTypeSelector(),
            const SizedBox(height: 16),
            _buildDateSelector(),
          ],
        ),
      ),
    );
  }

  Widget _buildVehicleSelector() {
    return Consumer<VehicleProvider>(
      builder: (context, provider, child) {
        if (provider.isLoading) {
          return const Center(child: CircularProgressIndicator());
        }

        return DropdownButtonFormField<Vehicle>(
          value: _selectedVehicle,
          decoration: const InputDecoration(
            labelText: '选择车辆',
            border: OutlineInputBorder(),
          ),
          items: provider.vehicles.map((vehicle) {
            return DropdownMenuItem<Vehicle>(
              value: vehicle,
              child: Text('${vehicle.plateNumber} - ${vehicle.brand} ${vehicle.model}'),
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
    );
  }

  Widget _buildExpenseTypeSelector() {
    return DropdownButtonFormField<ExpenseType>(
      value: _selectedType,
      decoration: const InputDecoration(
        labelText: '费用类型',
        border: OutlineInputBorder(),
      ),
      items: ExpenseType.values.map((type) {
        return DropdownMenuItem<ExpenseType>(
          value: type,
          child: Text(type.label),
        );
      }).toList(),
      onChanged: (type) {
        if (type != null) {
          setState(() {
            _selectedType = type;
          });
        }
      },
    );
  }

  Widget _buildDateSelector() {
    return InkWell(
      onTap: _selectDate,
      child: InputDecorator(
        decoration: const InputDecoration(
          labelText: '费用日期',
          border: OutlineInputBorder(),
          suffixIcon: Icon(Icons.calendar_today),
        ),
        child: Text(
          DateUtils.formatDisplayDate(_expenseDate),
        ),
      ),
    );
  }

  Widget _buildExpenseDetailsSection() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              '费用详情',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _descriptionController,
              decoration: const InputDecoration(
                labelText: '费用描述',
                border: OutlineInputBorder(),
              ),
              maxLines: 2,
              validator: (value) {
                if (value == null || value.trim().isEmpty) {
                  return '请输入费用描述';
                }
                return null;
              },
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  flex: 2,
                  child: TextFormField(
                    controller: _amountController,
                    decoration: const InputDecoration(
                      labelText: '金额',
                      border: OutlineInputBorder(),
                    ),
                    keyboardType: TextInputType.number,
                    validator: (value) {
                      if (value == null || value.trim().isEmpty) {
                        return '请输入金额';
                      }
                      if (double.tryParse(value) == null) {
                        return '请输入有效金额';
                      }
                      return null;
                    },
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: DropdownButtonFormField<String>(
                    value: _currency,
                    decoration: const InputDecoration(
                      labelText: '货币',
                      border: OutlineInputBorder(),
                    ),
                    items: const [
                      DropdownMenuItem(value: 'CNY', child: Text('人民币')),
                      DropdownMenuItem(value: 'USD', child: Text('美元')),
                      DropdownMenuItem(value: 'EUR', child: Text('欧元')),
                    ],
                    onChanged: (value) {
                      if (value != null) {
                        setState(() {
                          _currency = value;
                        });
                      }
                    },
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _vendorController,
              decoration: const InputDecoration(
                labelText: '供应商/商家',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _invoiceNumberController,
              decoration: const InputDecoration(
                labelText: '发票号码',
                border: OutlineInputBorder(),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAdditionalInfoSection() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              '附加信息',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: TextFormField(
                    controller: _mileageController,
                    decoration: const InputDecoration(
                      labelText: '里程数',
                      border: OutlineInputBorder(),
                      suffixText: 'km',
                    ),
                    keyboardType: TextInputType.number,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: DropdownButtonFormField<String>(
                    value: _paymentMethod,
                    decoration: const InputDecoration(
                      labelText: '支付方式',
                      border: OutlineInputBorder(),
                    ),
                    items: const [
                      DropdownMenuItem(value: 'cash', child: Text('现金')),
                      DropdownMenuItem(value: 'card', child: Text('银行卡')),
                      DropdownMenuItem(value: 'transfer', child: Text('转账')),
                      DropdownMenuItem(value: 'other', child: Text('其他')),
                    ],
                    onChanged: (value) {
                      if (value != null) {
                        setState(() {
                          _paymentMethod = value;
                        });
                      }
                    },
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _locationController,
              decoration: const InputDecoration(
                labelText: '地点',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _remarksController,
              decoration: const InputDecoration(
                labelText: '备注',
                border: OutlineInputBorder(),
              ),
              maxLines: 3,
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _selectDate() async {
    final date = await showDatePicker(
      context: context,
      initialDate: _expenseDate,
      firstDate: DateTime(2020),
      lastDate: DateTime.now(),
    );
    if (date != null) {
      setState(() {
        _expenseDate = date;
      });
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

    final currentUser = context.read<AuthProvider>().currentUser;
    if (currentUser == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('用户信息获取失败')),
      );
      return;
    }

    final expense = ExpenseRecord(
      id: widget.expense?.id ?? '',
      vehicleId: _selectedVehicle!.id,
      vehiclePlateNumber: _selectedVehicle!.plateNumber,
      type: _selectedType,
      status: widget.expense?.status ?? ExpenseStatus.pending,
      description: _descriptionController.text.trim(),
      amount: double.parse(_amountController.text),
      currency: _currency,
      expenseDate: _expenseDate,
      vendor: _vendorController.text.trim().isEmpty ? null : _vendorController.text.trim(),
      invoiceNumber: _invoiceNumberController.text.trim().isEmpty ? null : _invoiceNumberController.text.trim(),
      mileage: _mileageController.text.trim().isEmpty ? null : int.tryParse(_mileageController.text),
      location: _locationController.text.trim().isEmpty ? null : _locationController.text.trim(),
      category: _category,
      subcategory: _subcategory,
      paymentMethod: _paymentMethod,
      remarks: _remarksController.text.trim().isEmpty ? null : _remarksController.text.trim(),
      createdBy: currentUser.id,
      createdByName: currentUser.username,
      createdAt: widget.expense?.createdAt ?? DateTime.now(),
      updatedAt: DateTime.now(),
    );

    final provider = context.read<ExpenseProvider>();
    bool success;

    if (widget.isEdit) {
      success = await provider.updateExpense(widget.expense!.id, expense);
    } else {
      success = await provider.createExpense(expense);
    }

    if (success) {
      if (mounted) {
        Navigator.pop(context, true);
      }
    } else {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              provider.error?.isNotEmpty == true
                  ? provider.error!
                  : '操作失败',
            ),
          ),
        );
      }
    }
  }
}