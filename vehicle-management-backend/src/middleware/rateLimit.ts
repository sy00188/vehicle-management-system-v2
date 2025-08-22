import rateLimit from 'express-rate-limit';
import { Request } from 'express';
import { config } from '../config/config';

// 基础速率限制
export const rateLimitMiddleware = rateLimit({
  windowMs: config.rateLimitWindowMs, // 15分钟
  max: config.rateLimitMax, // 每个窗口期最大请求数
  message: {
    success: false,
    message: '请求过于频繁，请稍后再试',
    retryAfter: Math.ceil(config.rateLimitWindowMs / 1000)
  },
  standardHeaders: true, // 返回速率限制信息在 `RateLimit-*` 头中
  legacyHeaders: false, // 禁用 `X-RateLimit-*` 头
  skip: (req: Request) => {
    // 跳过健康检查端点
    return req.path === '/health';
  }
});

// 严格的速率限制（用于敏感操作）
export const strictRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 5, // 每15分钟最多5次请求
  message: {
    success: false,
    message: '敏感操作请求过于频繁，请稍后再试',
    retryAfter: 900 // 15分钟
  },
  standardHeaders: true,
  legacyHeaders: false
});

// 登录速率限制
export const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 每15分钟最多100次登录尝试（临时调整用于测试）
  message: {
    success: false,
    message: '登录尝试过于频繁，请稍后再试',
    retryAfter: 900
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true // 成功的请求不计入限制
});

// 注册速率限制
export const registerRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1小时
  max: 3, // 每小时最多3次注册
  message: {
    success: false,
    message: '注册请求过于频繁，请稍后再试',
    retryAfter: 3600
  },
  standardHeaders: true,
  legacyHeaders: false
});

// 文件上传速率限制
export const uploadRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 20, // 每15分钟最多20次上传
  message: {
    success: false,
    message: '文件上传过于频繁，请稍后再试',
    retryAfter: 900
  },
  standardHeaders: true,
  legacyHeaders: false
});