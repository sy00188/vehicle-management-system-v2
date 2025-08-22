import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    console.log('🔍 测试自动登录功能...');
    
    // 1. 首先进行正常登录以获取token
    console.log('1. 进行正常登录以获取token...');
    await page.goto('http://localhost:5173/login');
    await page.waitForSelector('input[type="email"]');
    
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // 等待登录成功并跳转
    await page.waitForURL('http://localhost:5173/dashboard', { timeout: 10000 });
    console.log('✅ 登录成功，已跳转到dashboard');
    
    // 2. 检查localStorage中是否存储了token
    const token = await page.evaluate(() => localStorage.getItem('accessToken'));
    console.log('📝 Token已存储:', token ? '是' : '否');
    
    if (!token) {
      throw new Error('Token未正确存储');
    }
    
    // 3. 刷新页面测试自动登录
    console.log('2. 刷新页面测试自动登录...');
    try {
      await page.reload({ waitUntil: 'networkidle' });
      
      // 等待一段时间让自动登录逻辑执行
      await page.waitForTimeout(3000);
      
      // 检查是否仍在dashboard页面（自动登录成功）
      const currentUrl2 = page.url();
      if (currentUrl2.includes('/dashboard')) {
        console.log('✅ 自动登录成功，仍在dashboard页面');
      } else {
        console.log('❌ 自动登录失败，当前页面:', currentUrl2);
      }
    } catch (error) {
      console.log('⚠️ 页面刷新出现问题，尝试重新导航到首页...');
      await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
      await page.waitForTimeout(3000);
      
      const currentUrl2 = page.url();
      if (currentUrl2.includes('/dashboard')) {
        console.log('✅ 自动登录成功，已跳转到dashboard');
      } else {
        console.log('❌ 自动登录失败，当前页面:', currentUrl2);
      }
    }
    
    // 4. 测试token失效情况
    console.log('3. 测试token失效情况...');
    await page.evaluate(() => {
      localStorage.setItem('accessToken', 'invalid_token');
    });
    
    await page.reload();
    await page.waitForTimeout(3000);
    
    const finalUrl = page.url();
    if (finalUrl.includes('/login')) {
      console.log('✅ Token失效处理正确！已跳转到登录页面');
    } else {
      console.log('❌ Token失效处理异常，当前页面:', finalUrl);
    }
    
    console.log('\n🎉 自动登录功能测试完成！');
    
  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error.message);
  } finally {
    await browser.close();
  }
})();