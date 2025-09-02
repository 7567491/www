import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import MobileLayout from '@/components/MobileLayout.vue'

describe('MobileLayout', () => {
  let wrapper: VueWrapper<any>
  
  beforeEach(() => {
    // Mock Date for consistent time display
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-15 14:30:00'))
    
    wrapper = mount(MobileLayout, {
      slots: {
        default: '<div data-test="content">Test Content</div>'
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
    vi.useRealTimers()
  })

  describe('渲染', () => {
    it('应该正确渲染基本结构', () => {
      expect(wrapper.find('.mobile-layout').exists()).toBe(true)
      expect(wrapper.find('.phone-frame').exists()).toBe(true)
      expect(wrapper.find('.status-bar').exists()).toBe(true)
      expect(wrapper.find('.app-header').exists()).toBe(true)
      expect(wrapper.find('.app-content').exists()).toBe(true)
      expect(wrapper.find('.home-indicator').exists()).toBe(true)
    })

    it('应该渲染slot内容', () => {
      expect(wrapper.find('[data-test="content"]').exists()).toBe(true)
      expect(wrapper.find('[data-test="content"]').text()).toBe('Test Content')
    })

    it('应该显示应用标题', () => {
      expect(wrapper.find('.app-title').text()).toBe('WWW存储桶')
    })

    it('应该显示当前时间', () => {
      expect(wrapper.find('.time').text()).toBe('14:30')
    })

    it('应该显示状态栏图标', () => {
      expect(wrapper.find('.signal').exists()).toBe(true)
      expect(wrapper.find('.wifi').exists()).toBe(true)
      expect(wrapper.find('.battery').exists()).toBe(true)
    })
  })

  describe('刷新功能', () => {
    it('应该有刷新按钮', () => {
      expect(wrapper.find('.refresh-btn').exists()).toBe(true)
    })

    it('点击刷新按钮应该触发refresh事件', async () => {
      const refreshBtn = wrapper.find('.refresh-btn')
      await refreshBtn.trigger('click')

      expect(wrapper.emitted().refresh).toBeTruthy()
      expect(wrapper.emitted().refresh).toHaveLength(1)
    })

    it('刷新期间应该显示加载状态', async () => {
      const refreshBtn = wrapper.find('.refresh-btn')
      
      // 点击刷新
      await refreshBtn.trigger('click')
      
      // 应该显示loading状态
      expect(wrapper.find('.refresh-icon.spinning').exists()).toBe(true)
      expect(refreshBtn.attributes('disabled')).toBeDefined()
    })

    it('刷新完成后应该恢复正常状态', async () => {
      const refreshBtn = wrapper.find('.refresh-btn')
      
      // 点击刷新
      await refreshBtn.trigger('click')
      
      // 等待1秒模拟刷新完成
      await vi.advanceTimersByTimeAsync(1000)
      await wrapper.vm.$nextTick()
      
      // 应该恢复正常状态
      expect(wrapper.find('.refresh-icon.spinning').exists()).toBe(false)
      expect(refreshBtn.attributes('disabled')).toBeUndefined()
    })
  })

  describe('时间显示', () => {
    it('应该每秒更新时间', async () => {
      // 初始时间
      expect(wrapper.find('.time').text()).toBe('14:30')
      
      // 前进1分钟
      vi.advanceTimersByTime(60000)
      await wrapper.vm.$nextTick()
      
      expect(wrapper.find('.time').text()).toBe('14:31')
    })

    it('组件卸载时应该清理定时器', () => {
      const clearIntervalSpy = vi.spyOn(global, 'clearInterval')
      
      wrapper.unmount()
      
      expect(clearIntervalSpy).toHaveBeenCalled()
    })
  })

  describe('响应式样式', () => {
    it('应该在移动设备上调整布局', () => {
      // 这里可以测试CSS类的存在，或者模拟媒体查询
      expect(wrapper.find('.mobile-layout').classes()).toContain('mobile-layout')
    })
  })

  describe('无障碍访问', () => {
    it('刷新按钮应该有适当的状态属性', async () => {
      const refreshBtn = wrapper.find('.refresh-btn')
      
      // 正常状态
      expect(refreshBtn.attributes('disabled')).toBeUndefined()
      
      // 点击后应该禁用
      await refreshBtn.trigger('click')
      expect(refreshBtn.attributes('disabled')).toBeDefined()
    })
  })
})