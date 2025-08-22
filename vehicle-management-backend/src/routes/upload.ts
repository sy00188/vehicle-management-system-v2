import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { config } from '../config/config';
import { asyncHandler } from '../middleware/errorHandler';
import { ValidationError } from '../middleware/errorHandler';
import { authMiddleware } from '../middleware/auth';
import { uploadRateLimit } from '../middleware/rateLimit';

const router = express.Router();

// 确保上传目录存在
const ensureUploadDir = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// 创建上传目录
ensureUploadDir(config.uploadPath);
ensureUploadDir(path.join(config.uploadPath, 'images'));
ensureUploadDir(path.join(config.uploadPath, 'documents'));
ensureUploadDir(path.join(config.uploadPath, 'avatars'));
ensureUploadDir(path.join(config.uploadPath, 'temp'));

// 文件过滤器
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const allowedDocumentTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv'
  ];

  const uploadType = req.body.type || req.query.type;

  if (uploadType === 'image' || uploadType === 'avatar') {
    if (allowedImageTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new ValidationError('只允许上传图片文件 (JPEG, PNG, GIF, WebP)'));
    }
  } else if (uploadType === 'document') {
    if (allowedDocumentTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new ValidationError('只允许上传文档文件 (PDF, Word, Excel, TXT, CSV)'));
    }
  } else {
    // 默认允许图片和文档
    if ([...allowedImageTypes, ...allowedDocumentTypes].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new ValidationError('不支持的文件类型'));
    }
  }
};

// 存储配置
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadType = req.body.type || req.query.type || 'temp';
    let uploadDir = config.uploadPath;

    switch (uploadType) {
      case 'image':
        uploadDir = path.join(config.uploadPath, 'images');
        break;
      case 'document':
        uploadDir = path.join(config.uploadPath, 'documents');
        break;
      case 'avatar':
        uploadDir = path.join(config.uploadPath, 'avatars');
        break;
      default:
        uploadDir = path.join(config.uploadPath, 'temp');
    }

    ensureUploadDir(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // 生成唯一文件名
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    const sanitizedName = name.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_');
    cb(null, `${sanitizedName}_${uniqueSuffix}${ext}`);
  }
});

// 创建 multer 实例
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.uploadMaxSize,
    files: 10 // 最多同时上传10个文件
  }
});

// 单文件上传
router.post('/single', authMiddleware, uploadRateLimit, upload.single('file'), asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ValidationError('请选择要上传的文件');
  }

  const file = req.file;
  const uploadType = req.body.type || 'temp';
  const description = req.body.description || '';

  // 构建文件URL
  const relativePath = path.relative(config.uploadPath, file.path);
  const fileUrl = `/uploads/${relativePath.replace(/\\/g, '/')}`;

  // 文件信息
  const fileInfo = {
    id: Date.now().toString(),
    originalName: file.originalname,
    filename: file.filename,
    path: file.path,
    url: fileUrl,
    mimetype: file.mimetype,
    size: file.size,
    type: uploadType,
    description,
    uploadedAt: new Date().toISOString(),
    uploadedBy: req.user?.id
  };

  res.json({
    success: true,
    message: '文件上传成功',
    data: fileInfo
  });
}));

// 多文件上传
router.post('/multiple', authMiddleware, uploadRateLimit, upload.array('files', 10), asyncHandler(async (req, res) => {
  const files = req.files as Express.Multer.File[];
  
  if (!files || files.length === 0) {
    throw new ValidationError('请选择要上传的文件');
  }

  const uploadType = req.body.type || 'temp';
  const description = req.body.description || '';

  // 处理所有文件
  const fileInfos = files.map(file => {
    const relativePath = path.relative(config.uploadPath, file.path);
    const fileUrl = `/uploads/${relativePath.replace(/\\/g, '/')}`;

    return {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      originalName: file.originalname,
      filename: file.filename,
      path: file.path,
      url: fileUrl,
      mimetype: file.mimetype,
      size: file.size,
      type: uploadType,
      description,
      uploadedAt: new Date().toISOString(),
      uploadedBy: req.user?.id
    };
  });

  res.json({
    success: true,
    message: `成功上传 ${files.length} 个文件`,
    data: fileInfos
  });
}));

// 头像上传
router.post('/avatar', authMiddleware, uploadRateLimit, upload.single('avatar'), asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ValidationError('请选择头像文件');
  }

  const file = req.file;
  
  // 验证是否为图片
  if (!file.mimetype.startsWith('image/')) {
    // 删除已上传的文件
    fs.unlinkSync(file.path);
    throw new ValidationError('头像必须是图片文件');
  }

  // 验证文件大小（头像限制为2MB）
  const maxAvatarSize = 2 * 1024 * 1024; // 2MB
  if (file.size > maxAvatarSize) {
    fs.unlinkSync(file.path);
    throw new ValidationError('头像文件大小不能超过2MB');
  }

  const relativePath = path.relative(config.uploadPath, file.path);
  const fileUrl = `/uploads/${relativePath.replace(/\\/g, '/')}`;

  const avatarInfo = {
    id: Date.now().toString(),
    originalName: file.originalname,
    filename: file.filename,
    path: file.path,
    url: fileUrl,
    mimetype: file.mimetype,
    size: file.size,
    type: 'avatar',
    uploadedAt: new Date().toISOString(),
    uploadedBy: req.user?.id
  };

  res.json({
    success: true,
    message: '头像上传成功',
    data: avatarInfo
  });
}));

// 删除文件
router.delete('/file/:filename', authMiddleware, asyncHandler(async (req, res) => {
  const { filename } = req.params;
  const fileType = req.query.type as string || 'temp';

  // 构建文件路径
  let filePath: string;
  switch (fileType) {
    case 'image':
      filePath = path.join(config.uploadPath, 'images', filename);
      break;
    case 'document':
      filePath = path.join(config.uploadPath, 'documents', filename);
      break;
    case 'avatar':
      filePath = path.join(config.uploadPath, 'avatars', filename);
      break;
    default:
      filePath = path.join(config.uploadPath, 'temp', filename);
  }

  // 检查文件是否存在
  if (!fs.existsSync(filePath)) {
    throw new ValidationError('文件不存在');
  }

  // 安全检查：确保文件在上传目录内
  const resolvedPath = path.resolve(filePath);
  const uploadDir = path.resolve(config.uploadPath);
  if (!resolvedPath.startsWith(uploadDir)) {
    throw new ValidationError('无效的文件路径');
  }

  try {
    fs.unlinkSync(filePath);
    res.json({
      success: true,
      message: '文件删除成功'
    });
  } catch (error) {
    throw new ValidationError('文件删除失败');
  }
}));

// 获取文件信息
router.get('/info/:filename', authMiddleware, asyncHandler(async (req, res) => {
  const { filename } = req.params;
  const fileType = req.query.type as string || 'temp';

  // 构建文件路径
  let filePath: string;
  let urlPath: string;
  
  switch (fileType) {
    case 'image':
      filePath = path.join(config.uploadPath, 'images', filename);
      urlPath = `/uploads/images/${filename}`;
      break;
    case 'document':
      filePath = path.join(config.uploadPath, 'documents', filename);
      urlPath = `/uploads/documents/${filename}`;
      break;
    case 'avatar':
      filePath = path.join(config.uploadPath, 'avatars', filename);
      urlPath = `/uploads/avatars/${filename}`;
      break;
    default:
      filePath = path.join(config.uploadPath, 'temp', filename);
      urlPath = `/uploads/temp/${filename}`;
  }

  // 检查文件是否存在
  if (!fs.existsSync(filePath)) {
    throw new ValidationError('文件不存在');
  }

  // 获取文件统计信息
  const stats = fs.statSync(filePath);
  const ext = path.extname(filename);
  
  // 根据扩展名推断MIME类型
  const mimeTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.txt': 'text/plain',
    '.csv': 'text/csv'
  };

  const fileInfo = {
    filename,
    path: filePath,
    url: urlPath,
    size: stats.size,
    mimetype: mimeTypes[ext.toLowerCase()] || 'application/octet-stream',
    type: fileType,
    createdAt: stats.birthtime.toISOString(),
    modifiedAt: stats.mtime.toISOString()
  };

  res.json({
    success: true,
    data: fileInfo
  });
}));

// 清理临时文件
router.post('/cleanup/temp', authMiddleware, asyncHandler(async (req, res) => {
  const tempDir = path.join(config.uploadPath, 'temp');
  const maxAge = req.body.maxAge || 24 * 60 * 60 * 1000; // 默认24小时

  if (!fs.existsSync(tempDir)) {
    res.json({
      success: true,
      message: '临时目录不存在',
      data: { deletedCount: 0 }
    });
    return;
  }

  const files = fs.readdirSync(tempDir);
  let deletedCount = 0;
  const now = Date.now();

  for (const file of files) {
    const filePath = path.join(tempDir, file);
    const stats = fs.statSync(filePath);
    
    // 检查文件年龄
    if (now - stats.mtime.getTime() > maxAge) {
      try {
        fs.unlinkSync(filePath);
        deletedCount++;
      } catch (error) {
        console.error(`删除临时文件失败: ${filePath}`, error);
      }
    }
  }

  res.json({
    success: true,
    message: `清理完成，删除了 ${deletedCount} 个过期临时文件`,
    data: { deletedCount }
  });
}));

// 获取上传统计信息
router.get('/stats/overview', authMiddleware, asyncHandler(async (req, res) => {
  const uploadDir = config.uploadPath;
  const subdirs = ['images', 'documents', 'avatars', 'temp'];
  
  const stats: Record<string, any> = {};
  let totalFiles = 0;
  let totalSize = 0;

  for (const subdir of subdirs) {
    const dirPath = path.join(uploadDir, subdir);
    
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath);
      let dirSize = 0;
      
      for (const file of files) {
        const filePath = path.join(dirPath, file);
        const fileStats = fs.statSync(filePath);
        dirSize += fileStats.size;
      }
      
      stats[subdir] = {
        fileCount: files.length,
        totalSize: dirSize,
        formattedSize: formatFileSize(dirSize)
      };
      
      totalFiles += files.length;
      totalSize += dirSize;
    } else {
      stats[subdir] = {
        fileCount: 0,
        totalSize: 0,
        formattedSize: '0 B'
      };
    }
  }

  res.json({
    success: true,
    data: {
      totalFiles,
      totalSize,
      formattedTotalSize: formatFileSize(totalSize),
      byType: stats,
      maxFileSize: config.uploadMaxSize,
      formattedMaxFileSize: formatFileSize(config.uploadMaxSize)
    }
  });
}));

// 格式化文件大小
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 错误处理中间件
router.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: `文件大小超过限制 (${formatFileSize(config.uploadMaxSize)})`
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: '上传文件数量超过限制'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: '意外的文件字段'
      });
    }
    // 处理其他MulterError类型
    return res.status(400).json({
      success: false,
      message: '文件上传错误'
    });
  }
  return next(error);
});

export default router;