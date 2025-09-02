import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import BucketFileList from '@/components/BucketFileList.vue'
import { useBucketStore } from '@/stores/bucket'

// Mock the bucket store
vi.mock('@/stores/bucket')

// Mock navigator.clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
})

// Mock window.open
Object.assign(window, {
  open: vi.fn(),
})

let mockBucketStore = {
  filteredFiles: [],
  loading: false,
  error: null,
  formattedTotalSize: '0 B',
  setSearchQuery: vi.fn(),
  clearError: vi.fn(),
  refreshFiles: vi.fn(),
  getFileIcon: vi.fn().mockReturnValue('📄'),
  formatFileSize: vi.fn().mockImplementation((size: number) => `${size} B`),
  formatDate: vi.fn().mockImplementation((date: string) => date),
  getFileUrl: vi.fn().mockImplementation((key: string) => `https://example.com/${key}`)
}

describe('BucketFileList', () => {
  let wrapper: VueWrapper<any>

  beforeEach(() => {
    setActivePinia(createPinia())
    
    // Reset mockBucketStore to defaults
    mockBucketStore = {
      filteredFiles: [],
      loading: false,
      error: null,
      formattedTotalSize: '0 B',
      setSearchQuery: vi.fn(),
      clearError: vi.fn(),
      refreshFiles: vi.fn(),
      getFileIcon: vi.fn().mockReturnValue('📄'),
      formatFileSize: vi.fn().mockImplementation((size: number) => `${size} B`),
      formatDate: vi.fn().mockImplementation((date: string) => date),
      getFileUrl: vi.fn().mockImplementation((key: string) => `https://example.com/${key}`)
    }
    
    // Mock the store
    vi.mocked(useBucketStore).mockReturnValue(mockBucketStore as any)
    
    // Reset all mocks
    vi.clearAllMocks()
    
    wrapper = mount(BucketFileList)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  describe('渲染基本结构', () => {
    it('应该渲染搜索栏', () => {
      expect(wrapper.find('.search-bar').exists()).toBe(true)
      expect(wrapper.find('.search-input').exists()).toBe(true)
    })

    it('应该渲染统计信息栏', () => {
      expect(wrapper.find('.stats-bar').exists()).toBe(true)
      expect(wrapper.find('.file-count').exists()).toBe(true)
      expect(wrapper.find('.total-size').exists()).toBe(true)
    })

    it('应该渲染文件容器', () => {
      expect(wrapper.find('.files-container').exists()).toBe(true)
    })
  })

  describe('加载状态', () => {
    it('应该显示加载状态', async () => {
      // 重新挂载组件，设置loading状态
      wrapper.unmount()
      mockBucketStore.loading = true
      wrapper = mount(BucketFileList)
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.loading-container').exists()).toBe(true)
      expect(wrapper.find('.loading-spinner').exists()).toBe(true)
      expect(wrapper.text()).toContain('加载中...')
    })

    it('加载时不应该显示文件列表', async () => {
      wrapper.unmount()
      mockBucketStore.loading = true
      wrapper = mount(BucketFileList)
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.files-container').exists()).toBe(false)
    })
  })

  describe('错误状态', () => {
    beforeEach(async () => {
      wrapper.unmount()
      mockBucketStore.loading = false
      mockBucketStore.error = '网络连接错误'
      wrapper = mount(BucketFileList)
      await wrapper.vm.$nextTick()
    })

    it('应该显示错误状态', () => {
      expect(wrapper.find('.error-container').exists()).toBe(true)
      expect(wrapper.find('.error-message').text()).toBe('网络连接错误')
    })

    it('应该有重试按钮', () => {
      expect(wrapper.find('.retry-btn').exists()).toBe(true)
    })

    it('点击重试按钮应该清除错误并重新加载', async () => {
      const retryBtn = wrapper.find('.retry-btn')
      await retryBtn.trigger('click')

      expect(mockBucketStore.clearError).toHaveBeenCalled()
      expect(mockBucketStore.refreshFiles).toHaveBeenCalled()
    })
  })

  describe('空状态', () => {
    beforeEach(async () => {
      wrapper.unmount()
      mockBucketStore.loading = false
      mockBucketStore.error = null
      mockBucketStore.filteredFiles = []
      wrapper = mount(BucketFileList)
      await wrapper.vm.$nextTick()
    })

    it('应该显示空状态', () => {
      expect(wrapper.find('.empty-state').exists()).toBe(true)
      expect(wrapper.text()).toContain('没有找到文件')
    })

    it('应该显示空状态图标', () => {
      expect(wrapper.find('.empty-icon').exists()).toBe(true)
    })
  })

  describe('文件列表', () => {
    const mockFiles = [
      {
        key: 'test1.txt',
        lastModified: '2024-01-01T10:00:00Z',
        size: 1024,
        etag: 'etag1',
        storageClass: 'STANDARD',
        url: 'https://example.com/test1.txt',
        type: 'file' as const
      },
      {
        key: 'folder/',
        lastModified: '2024-01-02T10:00:00Z',
        size: 0,
        etag: 'etag2',
        storageClass: 'STANDARD',
        url: 'https://example.com/folder/',
        type: 'folder' as const
      }
    ]

    beforeEach(async () => {
      wrapper.unmount()
      mockBucketStore.loading = false
      mockBucketStore.error = null
      mockBucketStore.filteredFiles = mockFiles
      wrapper = mount(BucketFileList)
      await wrapper.vm.$nextTick()
    })

    it('应该渲染文件项', () => {
      const fileItems = wrapper.findAll('.file-item')
      expect(fileItems).toHaveLength(2)
    })

    it('应该显示文件信息', () => {
      const firstFileItem = wrapper.find('.file-item')
      expect(firstFileItem.find('.file-name').text()).toBe('test1.txt')
      expect(firstFileItem.find('.file-size').exists()).toBe(true)
      expect(firstFileItem.find('.file-date').exists()).toBe(true)
    })

    it('应该显示文件操作按钮', () => {
      const fileItem = wrapper.find('.file-item')
      const actionBtns = fileItem.findAll('.action-btn')
      expect(actionBtns).toHaveLength(2)
    })

    it('点击文件应该触发相应的处理', async () => {
      const fileItem = wrapper.findAll('.file-item')[0]
      await fileItem.trigger('click')

      // 文件应该被打开
      expect(window.open).toHaveBeenCalledWith('https://example.com/test1.txt', '_blank')
    })

    it('点击文件夹应该有不同的处理', async () => {
      const folderItem = wrapper.findAll('.file-item')[1]
      await folderItem.trigger('click')

      // 文件夹点击不应该打开新窗口
      expect(window.open).not.toHaveBeenCalled()
    })
  })

  describe('搜索功能', () => {
    it('应该有搜索输入框', () => {
      const searchInput = wrapper.find('.search-input')
      expect(searchInput.exists()).toBe(true)
      expect(searchInput.attributes('placeholder')).toBe('搜索文件...')
    })

    it('输入搜索词应该调用store方法', async () => {
      const searchInput = wrapper.find('.search-input')
      await searchInput.setValue('test')
      await searchInput.trigger('input')

      expect(mockBucketStore.setSearchQuery).toHaveBeenCalledWith('test')
    })

    it('应该显示清除搜索按钮', async () => {
      const searchInput = wrapper.find('.search-input')
      await searchInput.setValue('test')

      expect(wrapper.find('.clear-search').exists()).toBe(true)
    })

    it('点击清除按钮应该清空搜索', async () => {
      const searchInput = wrapper.find('.search-input')
      await searchInput.setValue('test')

      const clearBtn = wrapper.find('.clear-search')
      await clearBtn.trigger('click')

      expect(mockBucketStore.setSearchQuery).toHaveBeenCalledWith('')
    })
  })

  describe('统计信息', () => {
    beforeEach(async () => {
      wrapper.unmount()
      mockBucketStore.loading = false
      mockBucketStore.error = null
      mockBucketStore.filteredFiles = [
        {
          key: 'test.txt',
          lastModified: '2024-01-01',
          size: 1024,
          etag: 'etag1',
          storageClass: 'STANDARD',
          url: 'https://example.com/test.txt',
          type: 'file' as const
        }
      ]
      mockBucketStore.formattedTotalSize = '1 KB'
      wrapper = mount(BucketFileList)
      await wrapper.vm.$nextTick()
    })

    it('应该显示正确的文件数量', () => {
      expect(wrapper.find('.file-count').text()).toBe('1 个文件')
    })

    it('应该显示总大小', () => {
      expect(wrapper.find('.total-size').text()).toBe('总大小: 1 KB')
    })
  })

  describe('文件操作', () => {
    const mockFile = {
      key: 'test.txt',
      lastModified: '2024-01-01',
      size: 1024,
      etag: 'etag1',
      storageClass: 'STANDARD',
      url: 'https://example.com/test.txt',
      type: 'file' as const
    }

    beforeEach(async () => {
      wrapper.unmount()
      mockBucketStore.loading = false
      mockBucketStore.error = null
      mockBucketStore.filteredFiles = [mockFile]
      wrapper = mount(BucketFileList)
      await wrapper.vm.$nextTick()
    })

    it('点击预览按钮应该打开文件', async () => {
      const actionBtns = wrapper.findAll('.action-btn')
      const previewBtn = actionBtns[0] // 第一个按钮是预览
      
      await previewBtn.trigger('click')
      
      expect(window.open).toHaveBeenCalledWith('https://example.com/test.txt', '_blank')
    })

    it('点击复制按钮应该复制URL', async () => {
      const actionBtns = wrapper.findAll('.action-btn')
      const copyBtn = actionBtns[1] // 第二个按钮是复制
      
      await copyBtn.trigger('click')
      
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('https://example.com/test.txt')
    })

    it('应该阻止点击操作按钮时触发文件项点击', async () => {
      const actionBtns = wrapper.findAll('.action-btn')
      const copyBtn = actionBtns[1]
      
      // 清除之前的调用
      vi.mocked(window.open).mockClear()
      
      await copyBtn.trigger('click')
      
      // 文件不应该被打开（因为阻止了事件冒泡）
      expect(window.open).not.toHaveBeenCalled()
    })
  })

  describe('无障碍访问', () => {
    it('搜索输入框应该有正确的属性', () => {
      const searchInput = wrapper.find('.search-input')
      expect(searchInput.attributes('type')).toBe('text')
      expect(searchInput.attributes('placeholder')).toBe('搜索文件...')
    })

    it('按钮应该有正确的状态', async () => {
      wrapper.unmount()
      mockBucketStore.loading = false
      mockBucketStore.error = '错误信息'
      wrapper = mount(BucketFileList)
      await wrapper.vm.$nextTick()

      const retryBtn = wrapper.find('.retry-btn')
      expect(retryBtn.exists()).toBe(true)
    })
  })
})