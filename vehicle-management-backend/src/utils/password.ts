import bcrypt from 'bcryptjs';
import { config } from '../config/config';

/**
 * 哈希密码
 * @param password 明文密码
 * @returns 哈希后的密码
 */
export const hashPassword = async (password: string): Promise<string> => {
  try {
    const salt = await bcrypt.genSalt(config.bcryptRounds);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw new Error('密码哈希失败');
  }
};

/**
 * 验证密码
 * @param password 明文密码
 * @param hashedPassword 哈希密码
 * @returns 是否匹配
 */
export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    throw new Error('密码验证失败');
  }
};

/**
 * 生成随机密码
 * @param length 密码长度
 * @returns 随机密码
 */
export const generateRandomPassword = (length: number = 12): string => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  
  return password;
};

/**
 * 验证密码强度
 * @param password 密码
 * @returns 密码强度信息
 */
export const validatePasswordStrength = (password: string): {
  isValid: boolean;
  errors: string[];
  score: number;
} => {
  const errors: string[] = [];
  let score = 0;

  // 长度检查
  if (password.length < 8) {
    errors.push('密码长度至少8位');
  } else {
    score += 1;
  }

  // 包含小写字母
  if (!/[a-z]/.test(password)) {
    errors.push('密码必须包含小写字母');
  } else {
    score += 1;
  }

  // 包含大写字母
  if (!/[A-Z]/.test(password)) {
    errors.push('密码必须包含大写字母');
  } else {
    score += 1;
  }

  // 包含数字
  if (!/\d/.test(password)) {
    errors.push('密码必须包含数字');
  } else {
    score += 1;
  }

  // 包含特殊字符
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('密码必须包含特殊字符');
  } else {
    score += 1;
  }

  return {
    isValid: errors.length === 0,
    errors,
    score,
  };
};