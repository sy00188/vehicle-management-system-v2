// 用户表单验证工具函数

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export interface UserFormData {
  email?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
  name?: string;
  phone?: string;
  role?: string;
}

export interface UserFormErrors {
  email?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
  name?: string;
  phone?: string;
  role?: string;
}

// 邮箱验证
export const validateEmail = (email: string): ValidationResult => {
  if (!email) {
    return { isValid: false, message: '邮箱不能为空' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: '请输入有效的邮箱地址' };
  }
  
  return { isValid: true };
};

// 用户名验证
export const validateUsername = (username: string): ValidationResult => {
  if (!username) {
    return { isValid: false, message: '用户名不能为空' };
  }
  
  if (username.length < 3) {
    return { isValid: false, message: '用户名至少需要3个字符' };
  }
  
  if (username.length > 20) {
    return { isValid: false, message: '用户名不能超过20个字符' };
  }
  
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!usernameRegex.test(username)) {
    return { isValid: false, message: '用户名只能包含字母、数字和下划线' };
  }
  
  return { isValid: true };
};

// 密码验证
export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, message: '密码不能为空' };
  }
  
  if (password.length < 8) {
    return { isValid: false, message: '密码至少需要8个字符' };
  }
  
  if (password.length > 50) {
    return { isValid: false, message: '密码不能超过50个字符' };
  }
  
  // 检查密码强度：至少包含一个大写字母、一个小写字母、一个数字
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  
  if (!hasUpperCase || !hasLowerCase || !hasNumber) {
    return { 
      isValid: false, 
      message: '密码必须包含至少一个大写字母、一个小写字母和一个数字' 
    };
  }
  
  return { isValid: true };
};

// 确认密码验证
export const validateConfirmPassword = (password: string, confirmPassword: string): ValidationResult => {
  if (!confirmPassword) {
    return { isValid: false, message: '请确认密码' };
  }
  
  if (password !== confirmPassword) {
    return { isValid: false, message: '两次输入的密码不一致' };
  }
  
  return { isValid: true };
};

// 姓名验证
export const validateName = (name: string): ValidationResult => {
  if (!name) {
    return { isValid: false, message: '姓名不能为空' };
  }
  
  if (name.length < 2) {
    return { isValid: false, message: '姓名至少需要2个字符' };
  }
  
  if (name.length > 50) {
    return { isValid: false, message: '姓名不能超过50个字符' };
  }
  
  return { isValid: true };
};

// 手机号验证
export const validatePhone = (phone: string): ValidationResult => {
  if (!phone) {
    return { isValid: true }; // 手机号是可选的
  }
  
  const phoneRegex = /^1[3-9]\d{9}$/;
  if (!phoneRegex.test(phone)) {
    return { isValid: false, message: '请输入有效的手机号码' };
  }
  
  return { isValid: true };
};

// 角色验证
export const validateRole = (role: string): ValidationResult => {
  if (!role) {
    return { isValid: false, message: '请选择用户角色' };
  }
  
  const validRoles = ['USER', 'DRIVER', 'MANAGER', 'ADMIN'];
  if (!validRoles.includes(role)) {
    return { isValid: false, message: '无效的用户角色' };
  }
  
  return { isValid: true };
};

// 综合表单验证
export const validateUserForm = (formData: UserFormData, isEdit: boolean = false): UserFormErrors => {
  const errors: UserFormErrors = {};
  
  // 邮箱验证
  if (formData.email !== undefined) {
    const emailResult = validateEmail(formData.email);
    if (!emailResult.isValid) {
      errors.email = emailResult.message;
    }
  }
  
  // 用户名验证
  if (formData.username !== undefined) {
    const usernameResult = validateUsername(formData.username);
    if (!usernameResult.isValid) {
      errors.username = usernameResult.message;
    }
  }
  
  // 密码验证（新建用户时必须，编辑时可选）
  if (!isEdit && formData.password !== undefined) {
    const passwordResult = validatePassword(formData.password);
    if (!passwordResult.isValid) {
      errors.password = passwordResult.message;
    }
  } else if (isEdit && formData.password && formData.password.length > 0) {
    const passwordResult = validatePassword(formData.password);
    if (!passwordResult.isValid) {
      errors.password = passwordResult.message;
    }
  }
  
  // 确认密码验证
  if (formData.password && formData.confirmPassword !== undefined) {
    const confirmPasswordResult = validateConfirmPassword(formData.password, formData.confirmPassword);
    if (!confirmPasswordResult.isValid) {
      errors.confirmPassword = confirmPasswordResult.message;
    }
  }
  
  // 姓名验证
  if (formData.name !== undefined) {
    const nameResult = validateName(formData.name);
    if (!nameResult.isValid) {
      errors.name = nameResult.message;
    }
  }
  
  // 手机号验证
  if (formData.phone !== undefined) {
    const phoneResult = validatePhone(formData.phone);
    if (!phoneResult.isValid) {
      errors.phone = phoneResult.message;
    }
  }
  
  // 角色验证
  if (formData.role !== undefined) {
    const roleResult = validateRole(formData.role);
    if (!roleResult.isValid) {
      errors.role = roleResult.message;
    }
  }
  
  return errors;
};

// 检查表单是否有错误
export const hasFormErrors = (errors: UserFormErrors): boolean => {
  return Object.values(errors).some(error => error !== undefined && error !== '');
};

// 获取密码强度
export const getPasswordStrength = (password: string): {
  score: number;
  label: string;
  color: string;
} => {
  if (!password) {
    return { score: 0, label: '无', color: 'gray' };
  }
  
  let score = 0;
  
  // 长度检查
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  
  // 字符类型检查
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^\w\s]/.test(password)) score += 1;
  
  if (score <= 2) {
    return { score, label: '弱', color: 'red' };
  } else if (score <= 4) {
    return { score, label: '中等', color: 'yellow' };
  } else {
    return { score, label: '强', color: 'green' };
  }
};