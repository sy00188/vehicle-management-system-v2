/**
 * 格式化货币金额
 * @param amount 金额
 * @param currency 货币符号，默认为 ¥
 * @returns 格式化后的货币字符串
 */
export const formatCurrency = (amount: number, currency: string = '¥'): string => {
  return `${currency}${amount.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

/**
 * 格式化日期
 * @param date 日期字符串或Date对象
 * @param format 格式类型
 * @returns 格式化后的日期字符串
 */
export const formatDate = (date: string | Date, format: 'date' | 'datetime' | 'time' = 'date'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (format === 'date') {
    return dateObj.toLocaleDateString('zh-CN');
  } else if (format === 'datetime') {
    return dateObj.toLocaleString('zh-CN');
  } else {
    return dateObj.toLocaleTimeString('zh-CN');
  }
};

/**
 * 格式化文件大小
 * @param bytes 字节数
 * @returns 格式化后的文件大小字符串
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * 格式化里程数
 * @param mileage 里程数
 * @returns 格式化后的里程字符串
 */
export const formatMileage = (mileage: number): string => {
  return `${mileage.toLocaleString('zh-CN')} km`;
};

/**
 * 格式化百分比
 * @param value 数值
 * @param total 总数
 * @returns 格式化后的百分比字符串
 */
export const formatPercentage = (value: number, total: number): string => {
  if (total === 0) return '0%';
  return `${((value / total) * 100).toFixed(1)}%`;
};