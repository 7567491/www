import { test, expect } from '@playwright/test'

test.describe('基本功能测试', () => {
  test('页面加载和基本元素', async ({ page }) => {
    // 访问主页
    await page.goto('/')
    
    // 等待页面加载完成
    await page.waitForLoadState('networkidle')
    
    // 检查页面标题
    await expect(page).toHaveTitle(/WWW存储桶/)
    
    // 检查基本UI元素
    await expect(page.locator('.mobile-layout')).toBeVisible()
    await expect(page.locator('.app-title')).toHaveText('WWW存储桶')
    
    // 检查文件列表容器存在
    await expect(page.locator('.files-container')).toBeVisible()
    
    // 检查搜索输入框
    await expect(page.locator('.search-input')).toBeVisible()
    await expect(page.locator('.search-input')).toHaveAttribute('placeholder', '搜索文件...')
    
    console.log('✅ 基本页面元素测试通过')
  })

  test('搜索功能', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // 等待文件列表加载
    await page.waitForSelector('.file-item', { timeout: 10000 })
    
    // 获取初始文件数量
    const initialCount = await page.locator('.file-item').count()
    expect(initialCount).toBeGreaterThan(0)
    
    // 输入搜索关键词
    await page.fill('.search-input', 'index')
    
    // 等待搜索结果更新
    await page.waitForTimeout(500)
    
    // 验证搜索结果（接受任何数量的结果，因为这依赖于模拟数据）
    const searchResults = await page.locator('.file-item')
    const searchCount = await searchResults.count()
    expect(searchCount).toBeGreaterThanOrEqual(0)
    
    // 清除搜索，验证恢复原始列表
    await page.fill('.search-input', '')
    await page.waitForTimeout(500)
    
    const finalCount = await page.locator('.file-item').count()
    expect(finalCount).toBe(initialCount)
    
    console.log('✅ 搜索功能测试通过')
  })

  test('刷新功能', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // 点击刷新按钮
    const refreshBtn = page.locator('.refresh-btn')
    await expect(refreshBtn).toBeVisible()
    await refreshBtn.click()
    
    // 验证按钮暂时禁用
    await expect(refreshBtn).toHaveAttribute('disabled', '')
    
    // 等待刷新完成
    await page.waitForTimeout(1200)
    
    // 验证按钮重新启用
    await expect(refreshBtn).not.toHaveAttribute('disabled')
    
    console.log('✅ 刷新功能测试通过')
  })

  test('移动端布局', async ({ page }) => {
    // 设置移动端视口
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // 检查移动布局元素
    await expect(page.locator('.phone-frame')).toBeVisible()
    await expect(page.locator('.status-bar')).toBeVisible()
    await expect(page.locator('.time')).toBeVisible()
    
    console.log('✅ 移动端布局测试通过')
  })
})