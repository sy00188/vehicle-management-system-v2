import * as express from 'express';

const router = express.Router();

// 简单测试路由
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Notifications API is working!',
    timestamp: new Date().toISOString()
  });
});

export default router;