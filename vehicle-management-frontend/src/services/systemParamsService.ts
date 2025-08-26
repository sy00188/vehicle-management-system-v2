import { apiClient } from '../utils/api';

// 系统参数类型定义
export interface SystemParam {
  id: string;
  key: string;
  value: string;
  type: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'JSON';
  category: string;
  description?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

// 系统参数创建/更新数据
export interface SystemParamFormData {
  key: string;
  value: string;
  type: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'JSON';
  category: string;
  description?: string;
  isPublic?: boolean;
}

// 系统参数查询参数
export interface SystemParamQueryParams {
  category?: string;
  search?: string;
  isPublic?: boolean;
}

// 批量更新参数
export interface BatchUpdateParam {
  key: string;
  value: string;
  type?: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'JSON';
  category?: string;
  description?: string;
  isPublic?: boolean;
}

// API响应类型
export interface SystemParamResponse {
  success: boolean;
  data: SystemParam;
  message?: string;
}

export interface SystemParamsListResponse {
  success: boolean;
  data: {
    settings: SystemParam[];
    groupedSettings: Record<string, SystemParam[]>;
  };
}

export interface CategoriesResponse {
  success: boolean;
  data: string[];
}

// 系统参数服务类
class SystemParamsService {
  private baseUrl = '/api/v1/settings';

  /**
   * 获取所有系统参数
   */
  async getAllParams(params?: SystemParamQueryParams): Promise<SystemParamsListResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.category) {
      queryParams.append('category', params.category);
    }
    if (params?.search) {
      queryParams.append('search', params.search);
    }
    if (params?.isPublic !== undefined) {
      queryParams.append('isPublic', params.isPublic.toString());
    }

    const url = queryParams.toString() 
      ? `${this.baseUrl}?${queryParams.toString()}`
      : this.baseUrl;

    return apiClient.get(url);
  }

  /**
   * 根据键名获取单个系统参数
   */
  async getParamByKey(key: string): Promise<SystemParamResponse> {
    return apiClient.get(`${this.baseUrl}/${encodeURIComponent(key)}`);
  }

  /**
   * 创建新的系统参数
   */
  async createParam(data: SystemParamFormData): Promise<SystemParamResponse> {
    return apiClient.post(this.baseUrl, data);
  }

  /**
   * 更新系统参数
   */
  async updateParam(key: string, data: Partial<SystemParamFormData>): Promise<SystemParamResponse> {
    return apiClient.put(`${this.baseUrl}/${encodeURIComponent(key)}`, data);
  }

  /**
   * 删除系统参数
   */
  async deleteParam(key: string): Promise<{ success: boolean; message: string }> {
    return apiClient.delete(`${this.baseUrl}/${encodeURIComponent(key)}`);
  }

  /**
   * 批量更新系统参数
   */
  async batchUpdateParams(params: BatchUpdateParam[]): Promise<{
    success: boolean;
    message: string;
    data: SystemParam[];
  }> {
    return apiClient.put(`${this.baseUrl}/batch/update`, { settings: params });
  }

  /**
   * 获取所有公开的系统参数（无需认证）
   */
  async getPublicParams(): Promise<SystemParamsListResponse> {
    return apiClient.get(`${this.baseUrl}/public/all`);
  }

  /**
   * 获取所有参数分类列表
   */
  async getCategories(): Promise<CategoriesResponse> {
    return apiClient.get(`${this.baseUrl}/categories/list`);
  }

  /**
   * 重置指定参数为默认值
   */
  async resetToDefaults(keys: string[]): Promise<{
    success: boolean;
    message: string;
    data: SystemParam[];
  }> {
    return apiClient.post(`${this.baseUrl}/reset/defaults`, { keys });
  }

  /**
   * 导出系统参数配置
   */
  async exportConfig(includePrivate: boolean = false): Promise<{
    success: boolean;
    data: {
      config: Record<string, SystemParam[]>;
      exportedAt: string;
      totalSettings: number;
    };
  }> {
    const params = new URLSearchParams();
    if (includePrivate) {
      params.append('includePrivate', 'true');
    }
    
    const url = `${this.baseUrl}/export/config?${params.toString()}`;
    return apiClient.get(url);
  }

  /**
   * 验证参数值格式
   */
  validateParamValue(value: string, type: SystemParam['type']): { isValid: boolean; error?: string } {
    try {
      switch (type) {
        case 'NUMBER':
          const numValue = parseFloat(value);
          if (isNaN(numValue)) {
            return { isValid: false, error: '数值类型的值必须是有效数字' };
          }
          break;
        case 'BOOLEAN':
          if (value !== 'true' && value !== 'false') {
            return { isValid: false, error: '布尔类型的值必须是true或false' };
          }
          break;
        case 'JSON':
          JSON.parse(value);
          break;
        case 'STRING':
        default:
          // 字符串类型不需要特殊验证
          break;
      }
      return { isValid: true };
    } catch (error) {
      return { isValid: false, error: `值格式不正确: ${error}` };
    }
  }

  /**
   * 格式化参数值用于显示
   */
  formatParamValue(param: SystemParam): string {
    switch (param.type) {
      case 'BOOLEAN':
        return param.value === 'true' ? '是' : '否';
      case 'JSON':
        try {
          return JSON.stringify(JSON.parse(param.value), null, 2);
        } catch {
          return param.value;
        }
      case 'NUMBER':
        return parseFloat(param.value).toLocaleString();
      case 'STRING':
      default:
        return param.value;
    }
  }

  /**
   * 获取参数类型的显示标签
   */
  getTypeLabel(type: SystemParam['type']): string {
    const labels = {
      STRING: '字符串',
      NUMBER: '数字',
      BOOLEAN: '布尔值',
      JSON: 'JSON对象'
    };
    return labels[type] || type;
  }

  /**
   * 检查参数是否为系统关键参数（不可删除）
   */
  isCriticalParam(key: string): boolean {
    const criticalParams = [
      'system.name',
      'system.version',
      'system.maintenance_mode',
      'system.session_timeout'
    ];
    return criticalParams.includes(key);
  }

  /**
   * 获取参数分类的显示标签
   */
  getCategoryLabel(category: string): string {
    const labels: Record<string, string> = {
      system: '系统设置',
      upload: '上传设置',
      notification: '通知设置',
      application: '申请设置',
      security: '安全设置',
      general: '常规设置'
    };
    return labels[category] || category;
  }
}

// 导出服务实例
export const systemParamsService = new SystemParamsService();
export default systemParamsService;