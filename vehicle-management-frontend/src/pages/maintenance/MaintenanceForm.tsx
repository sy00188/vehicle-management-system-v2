import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Label from '../../components/ui/Label';
import Textarea from '../../components/ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
// import Separator from '../../components/ui/Separator';
import { Loader2, ArrowLeft, Save, X, Plus } from 'lucide-react';
import { maintenanceService } from '../../services/maintenanceService';
import { vehicleService } from '../../services/vehicleService';
import type { Vehicle } from '../../types';
import { appHelpers } from '../../stores/appStore';

interface MaintenanceFormData {
  vehicleId: string;
  type: 'routine' | 'repair' | 'emergency' | 'inspection';
  description: string;
  cost: number;
  date: string;
  completedDate?: string;
  nextMaintenanceDate?: string;
  serviceProvider: string;
  mileageAtService: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  parts?: string[];
  notes?: string;
}

const MaintenanceForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [vehiclesLoading, setVehiclesLoading] = useState(true);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newPart, setNewPart] = useState('');

  const [formData, setFormData] = useState<MaintenanceFormData>({
    vehicleId: '',
    type: 'routine',
    description: '',
    cost: 0,
    date: new Date().toISOString().split('T')[0],
    serviceProvider: '',
    mileageAtService: 0,
    priority: 'medium',
    status: 'pending',
    parts: [],
    notes: ''
  });

  // 获取车辆列表
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await vehicleService.getVehicles({ limit: 1000 });
        setVehicles(response.data);
      } catch (error) {
        console.error('获取车辆列表失败:', error);
        appHelpers.showError('获取车辆列表失败');
      } finally {
        setVehiclesLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  // 编辑模式下获取维护记录详情
  useEffect(() => {
    if (isEdit && id) {
      const fetchMaintenanceRecord = async () => {
        try {
          setLoading(true);
          const record = await maintenanceService.getMaintenanceRecordById(id);
          setFormData({
            vehicleId: record.vehicleId,
            type: record.type,
            description: record.description,
            cost: record.cost,
            date: record.date.split('T')[0],
            completedDate: record.completedDate ? record.completedDate.split('T')[0] : undefined,
            nextMaintenanceDate: record.nextMaintenanceDate ? record.nextMaintenanceDate.split('T')[0] : undefined,
            serviceProvider: record.serviceProvider,
            mileageAtService: record.mileageAtService,
            priority: record.priority,
            status: record.status,
            parts: record.parts || [],
            notes: record.notes || ''
          });
        } catch (error) {
          console.error('获取维护记录失败:', error);
          appHelpers.showError('获取维护记录失败');
          navigate('/maintenance');
        } finally {
          setLoading(false);
        }
      };

      fetchMaintenanceRecord();
    }
  }, [isEdit, id, navigate]);

  const handleInputChange = (field: keyof MaintenanceFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addPart = () => {
    if (newPart.trim()) {
      setFormData(prev => ({
        ...prev,
        parts: [...(prev.parts || []), newPart.trim()]
      }));
      setNewPart('');
    }
  };

  const removePart = (index: number) => {
    setFormData(prev => ({
      ...prev,
      parts: prev.parts?.filter((_, i) => i !== index) || []
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.vehicleId) {
      newErrors.vehicleId = '请选择车辆';
    }
    if (!formData.description.trim()) {
      newErrors.description = '请输入维护描述';
    }
    if (formData.cost < 0) {
      newErrors.cost = '费用不能为负数';
    }
    if (!formData.date) {
      newErrors.date = '请选择维护日期';
    }
    if (!formData.serviceProvider.trim()) {
      newErrors.serviceProvider = '请输入服务提供商';
    }
    if (formData.mileageAtService < 0) {
      newErrors.mileageAtService = '里程数不能为负数';
    }
    if (formData.completedDate && formData.completedDate < formData.date) {
      newErrors.completedDate = '完成日期不能早于维护日期';
    }
    if (formData.nextMaintenanceDate && formData.nextMaintenanceDate <= formData.date) {
      newErrors.nextMaintenanceDate = '下次维护日期必须晚于当前维护日期';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      const submitData = {
        ...formData,
        parts: formData.parts?.length ? formData.parts : undefined,
        createdBy: 'current-user-id', // TODO: 从用户状态获取实际用户ID
        creator: {
          id: 'current-user-id',
          username: 'current-user',
          email: 'user@example.com',
          role: 'user' as const,
          name: '当前用户',
          department: '维护部门',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      };

      if (isEdit && id) {
        await maintenanceService.updateMaintenanceRecord(id, submitData);
        appHelpers.showSuccess('维护记录更新成功');
      } else {
        await maintenanceService.createMaintenanceRecord(submitData);
        appHelpers.showSuccess('维护记录创建成功');
      }
      
      navigate('/maintenance');
    } catch (error: any) {
      console.error('保存维护记录失败:', error);
      appHelpers.showError('保存失败', error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  // const getStatusColor = (status: string) => {
  //   switch (status) {
  //     case 'pending': return 'bg-yellow-100 text-yellow-800';
  //     case 'in_progress': return 'bg-blue-100 text-blue-800';
  //     case 'completed': return 'bg-green-100 text-green-800';
  //     case 'cancelled': return 'bg-red-100 text-red-800';
  //     default: return 'bg-gray-100 text-gray-800';
  //   }
  // };

  // const getPriorityColor = (priority: string) => {
  //   switch (priority) {
  //     case 'urgent': return 'bg-red-100 text-red-800';
  //     case 'high': return 'bg-orange-100 text-orange-800';
  //     case 'medium': return 'bg-yellow-100 text-yellow-800';
  //     case 'low': return 'bg-green-100 text-green-800';
  //     default: return 'bg-gray-100 text-gray-800';
  //   }
  // };

  if (vehiclesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">加载中...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 页面头部 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/maintenance')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {isEdit ? '编辑维护记录' : '新增维护记录'}
            </h1>
            <p className="text-muted-foreground">
              {isEdit ? '修改现有维护记录信息' : '创建新的车辆维护记录'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 基本信息 */}
        <Card>
          <CardHeader>
            <CardTitle>基本信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vehicleId">车辆 *</Label>
                <Select
                  value={formData.vehicleId}
                  onValueChange={(value) => handleInputChange('vehicleId', value)}
                >
                  <SelectTrigger className={errors.vehicleId ? 'border-red-500' : ''}>
                    <SelectValue placeholder="选择车辆" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.plateNumber} - {vehicle.brand} {vehicle.model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.vehicleId && (
                  <p className="text-sm text-red-500">{errors.vehicleId}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">维护类型 *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: any) => handleInputChange('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="routine">常规保养</SelectItem>
                    <SelectItem value="repair">维修</SelectItem>
                    <SelectItem value="emergency">紧急维修</SelectItem>
                    <SelectItem value="inspection">检查</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">优先级 *</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: any) => handleInputChange('priority', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">低</SelectItem>
                    <SelectItem value="medium">中</SelectItem>
                    <SelectItem value="high">高</SelectItem>
                    <SelectItem value="urgent">紧急</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">状态 *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: any) => handleInputChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">待处理</SelectItem>
                    <SelectItem value="in_progress">进行中</SelectItem>
                    <SelectItem value="completed">已完成</SelectItem>
                    <SelectItem value="cancelled">已取消</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">维护描述 *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="请详细描述维护内容..."
                className={errors.description ? 'border-red-500' : ''}
                rows={3}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 服务信息 */}
        <Card>
          <CardHeader>
            <CardTitle>服务信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="serviceProvider">服务提供商 *</Label>
                <Input
                  id="serviceProvider"
                  value={formData.serviceProvider}
                  onChange={(e) => handleInputChange('serviceProvider', e.target.value)}
                  placeholder="输入服务提供商名称"
                  className={errors.serviceProvider ? 'border-red-500' : ''}
                />
                {errors.serviceProvider && (
                  <p className="text-sm text-red-500">{errors.serviceProvider}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cost">费用 (元) *</Label>
                <Input
                  id="cost"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.cost}
                  onChange={(e) => handleInputChange('cost', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  className={errors.cost ? 'border-red-500' : ''}
                />
                {errors.cost && (
                  <p className="text-sm text-red-500">{errors.cost}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="mileageAtService">维护时里程 (公里) *</Label>
                <Input
                  id="mileageAtService"
                  type="number"
                  min="0"
                  value={formData.mileageAtService}
                  onChange={(e) => handleInputChange('mileageAtService', parseInt(e.target.value) || 0)}
                  placeholder="0"
                  className={errors.mileageAtService ? 'border-red-500' : ''}
                />
                {errors.mileageAtService && (
                  <p className="text-sm text-red-500">{errors.mileageAtService}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 日期信息 */}
        <Card>
          <CardHeader>
            <CardTitle>日期信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">维护日期 *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className={errors.date ? 'border-red-500' : ''}
                />
                {errors.date && (
                  <p className="text-sm text-red-500">{errors.date}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="completedDate">完成日期</Label>
                <Input
                  id="completedDate"
                  type="date"
                  value={formData.completedDate || ''}
                  onChange={(e) => handleInputChange('completedDate', e.target.value || undefined)}
                  className={errors.completedDate ? 'border-red-500' : ''}
                />
                {errors.completedDate && (
                  <p className="text-sm text-red-500">{errors.completedDate}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="nextMaintenanceDate">下次维护日期</Label>
                <Input
                  id="nextMaintenanceDate"
                  type="date"
                  value={formData.nextMaintenanceDate || ''}
                  onChange={(e) => handleInputChange('nextMaintenanceDate', e.target.value || undefined)}
                  className={errors.nextMaintenanceDate ? 'border-red-500' : ''}
                />
                {errors.nextMaintenanceDate && (
                  <p className="text-sm text-red-500">{errors.nextMaintenanceDate}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 配件信息 */}
        <Card>
          <CardHeader>
            <CardTitle>配件信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                value={newPart}
                onChange={(e) => setNewPart(e.target.value)}
                placeholder="输入配件名称"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPart())}
              />
              <Button type="button" onClick={addPart} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {formData.parts && formData.parts.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.parts.map((part, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                    <span>{part}</span>
                    <button
                      type="button"
                      onClick={() => removePart(index)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 备注 */}
        <Card>
          <CardHeader>
            <CardTitle>备注</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.notes || ''}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="添加备注信息..."
              rows={3}
            />
          </CardContent>
        </Card>

        {/* 操作按钮 */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/maintenance')}
            disabled={loading}
          >
            取消
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            <Save className="h-4 w-4 mr-2" />
            {isEdit ? '更新' : '创建'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MaintenanceForm;