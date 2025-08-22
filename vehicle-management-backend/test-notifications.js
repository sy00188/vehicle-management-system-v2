const express = require('express');
const app = express();

// 简单测试路由
const testRouter = express.Router();

testRouter.get('/', (req, res) => {
  res.json({ message: 'Notifications route is working!' });
});

app.use('/api/v1/notifications', testRouter);

app.listen(3002, () => {
  console.log('Test server running on port 3002');
});

// 测试请求
setTimeout(() => {
  const http = require('http');
  
  const options = {
    hostname: 'localhost',
    port: 3002,
    path: '/api/v1/notifications',
    method: 'GET'
  };
  
  const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    res.on('data', (chunk) => {
      console.log(`Response: ${chunk}`);
      process.exit(0);
    });
  });
  
  req.on('error', (e) => {
    console.error(`Error: ${e.message}`);
    process.exit(1);
  });
  
  req.end();
}, 1000);