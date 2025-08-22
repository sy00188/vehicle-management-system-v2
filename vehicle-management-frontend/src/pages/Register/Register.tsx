import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import type { RegisterForm } from '../../types';
import { ROUTES } from '../../utils/constants';
import { registerUser } from '../../services/authService';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterForm>({
    fullName: '',
    employeeId: '',
    department: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    terms: false,
  });

  const [errors, setErrors] = useState<Partial<RegisterForm>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');

  // 部门选项
  const departments = [
    { value: 'admin', label: '行政部' },
    { value: 'finance', label: '财务部' },
    { value: 'hr', label: '人力资源部' },
    { value: 'it', label: '信息技术部' },
    { value: 'sales', label: '销售部' },
    { value: 'marketing', label: '市场部' },
    { value: 'operations', label: '运营部' },
  ];

  // 表单验证
  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterForm> = {};

    // 姓名验证
    if (!formData.fullName.trim()) {
      newErrors.fullName = '请输入姓名';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = '姓名至少需要2个字符';
    }

    // 员工编号验证
    if (!formData.employeeId.trim()) {
      newErrors.employeeId = '请输入员工编号';
    } else if (!/^[A-Z0-9]{4,10}$/.test(formData.employeeId)) {
      newErrors.employeeId = '员工编号格式不正确（4-10位字母数字组合）';
    }

    // 部门验证
    if (!formData.department) {
      newErrors.department = '请选择部门';
    }

    // 邮箱验证
    if (!formData.email.trim()) {
      newErrors.email = '请输入邮箱地址';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '邮箱格式不正确';
    }

    // 手机号验证
    if (!formData.phone.trim()) {
      newErrors.phone = '请输入手机号码';
    } else if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = '手机号格式不正确';
    }

    // 密码验证
    if (!formData.password) {
      newErrors.password = '请输入密码';
    } else if (formData.password.length < 8) {
      newErrors.password = '密码至少需要8位字符';
    } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = '密码必须包含字母和数字';
    }

    // 确认密码验证
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '请确认密码';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '两次输入的密码不一致';
    }

    // 服务条款验证
    if (!formData.terms) {
      newErrors.terms = true;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 密码强度检查
  const checkPasswordStrength = (password: string) => {
    if (password.length === 0) {
      setPasswordStrength('');
      return;
    }

    if (password.length >= 8 && /(?=.*[a-zA-Z])(?=.*\d)/.test(password)) {
      if (/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(password)) {
        setPasswordStrength('强');
      } else {
        setPasswordStrength('良好');
      }
    } else {
      setPasswordStrength('弱');
    }
  };

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    let processedValue = value;

    // 特殊处理
    if (name === 'employeeId') {
      processedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    } else if (name === 'phone') {
      processedValue = value.replace(/[^0-9]/g, '').slice(0, 11);
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : processedValue,
    }));

    // 清除对应字段的错误
    if (errors[name as keyof RegisterForm]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }

    // 密码强度检查
    if (name === 'password') {
      checkPasswordStrength(processedValue);
    }
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await registerUser({
        name: formData.fullName,
        employeeId: formData.employeeId,
        department: formData.department,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });
      
      // 注册成功，显示成功消息并跳转到登录页面
      alert('注册成功！请登录您的账户。');
      navigate(ROUTES.LOGIN);
    } catch (error) {
      console.error('注册失败:', error);
      const errorMessage = error instanceof Error ? error.message : '注册失败，请重试';
      setErrors({ password: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-12 relative">
      {/* 背景图片 */}
      <div className="fixed inset-0 z-0">
        <div className="w-full h-full bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-primary-900/40"></div>
      </div>

      {/* 注册容器 */}
      <div className="relative z-10 max-w-md w-full space-y-8">
        {/* 头部 */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-primary-600 rounded-full flex items-center justify-center mb-4">
            <i className="fas fa-user-plus text-2xl text-white"></i>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">创建新账户</h2>
          <p className="text-gray-300">加入车辆管理系统</p>
        </div>

        {/* 注册表单 */}
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-gray-700">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* 姓名 */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">
                <i className="fas fa-user mr-2"></i>姓名
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                  errors.fullName ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="请输入您的姓名"
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-400">{errors.fullName}</p>
              )}
            </div>

            {/* 员工编号 */}
            <div>
              <label htmlFor="employeeId" className="block text-sm font-medium text-gray-300 mb-2">
                <i className="fas fa-id-badge mr-2"></i>员工编号
              </label>
              <input
                id="employeeId"
                name="employeeId"
                type="text"
                required
                value={formData.employeeId}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                  errors.employeeId ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="请输入员工编号"
              />
              {errors.employeeId && (
                <p className="mt-1 text-sm text-red-400">{errors.employeeId}</p>
              )}
            </div>

            {/* 部门 */}
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-300 mb-2">
                <i className="fas fa-building mr-2"></i>部门
              </label>
              <select
                id="department"
                name="department"
                required
                value={formData.department}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                  errors.department ? 'border-red-500' : 'border-gray-600'
                }`}
              >
                <option value="">请选择部门</option>
                {departments.map(dept => (
                  <option key={dept.value} value={dept.value}>
                    {dept.label}
                  </option>
                ))}
              </select>
              {errors.department && (
                <p className="mt-1 text-sm text-red-400">{errors.department}</p>
              )}
            </div>

            {/* 邮箱 */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                <i className="fas fa-envelope mr-2"></i>邮箱地址
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                  errors.email ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="请输入邮箱地址"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            {/* 手机号 */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                <i className="fas fa-phone mr-2"></i>手机号码
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                  errors.phone ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="请输入手机号码"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-400">{errors.phone}</p>
              )}
            </div>

            {/* 密码 */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                <i className="fas fa-lock mr-2"></i>密码
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 pr-12 ${
                    errors.password ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="请输入密码"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-gray-400 hover:text-white transition-colors`}></i>
                </button>
              </div>
              <div className={`mt-2 text-xs ${
                passwordStrength === '强' ? 'text-green-400' :
                passwordStrength === '良好' ? 'text-yellow-400' :
                passwordStrength === '弱' ? 'text-red-400' : 'text-gray-400'
              }`}>
                {passwordStrength ? `密码强度：${passwordStrength}` : '密码至少8位，包含字母和数字'}
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password}</p>
              )}
            </div>

            {/* 确认密码 */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                <i className="fas fa-lock mr-2"></i>确认密码
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 pr-12 ${
                    errors.confirmPassword ? 'border-red-500' : 
                    formData.confirmPassword && formData.password === formData.confirmPassword ? 'border-green-500' :
                    formData.confirmPassword && formData.password !== formData.confirmPassword ? 'border-red-500' :
                    'border-gray-600'
                  }`}
                  placeholder="请再次输入密码"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'} text-gray-400 hover:text-white transition-colors`}></i>
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>
              )}
            </div>

            {/* 服务条款 */}
            <div className="flex items-start">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                checked={formData.terms}
                onChange={handleInputChange}
                className="mt-1 h-4 w-4 text-primary-600 bg-gray-700 border-gray-600 rounded focus:ring-primary-500 focus:ring-2"
              />
              <label htmlFor="terms" className="ml-3 text-sm text-gray-300">
                我已阅读并同意{' '}
                <a href="#" className="text-primary-400 hover:text-primary-300 underline">
                  服务条款
                </a>{' '}
                和{' '}
                <a href="#" className="text-primary-400 hover:text-primary-300 underline">
                  隐私政策
                </a>
              </label>
            </div>
            {errors.terms && (
              <p className="text-sm text-red-400">请同意服务条款</p>
            )}

            {/* 注册按钮 */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <i className={`fas ${isLoading ? 'fa-spinner fa-spin' : 'fa-user-plus'} group-hover:text-primary-300 transition-colors`}></i>
                </span>
                {isLoading ? '创建中...' : '创建账户'}
              </button>
            </div>

            {/* 登录链接 */}
            <div className="text-center">
              <p className="text-gray-400">
                已有账户？{' '}
                <Link
                  to={ROUTES.LOGIN}
                  className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
                >
                  立即登录
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* 附加信息 */}
        <div className="text-center text-sm text-gray-400">
          <p>注册即表示您同意我们的服务条款</p>
          <p className="mt-1">如有问题，请联系系统管理员</p>
        </div>
      </div>
    </div>
  );
};

export default Register;