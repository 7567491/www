import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useBucketStore } from '@/stores/bucket'
import bucketService from '@/services/bucketService'

// Mock bucketService
vi.mock('@/services/bucketService', () => {
  return {
    default: {
      listFiles: vi.fn(),
      getFileUrl: vi.fn(),
      formatFileSize: vi.fn(),
      formatDate: vi.fn(),
      getFileIcon: vi.fn(),
    }
  }
})

const mockedBucketService = vi.mocked(bucketService)

describe('Bucket Store', () => {
  let store: ReturnType<typeof useBucketStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useBucketStore()
    
    // 重置所有mocks
    vi.clearAllMocks()
    
    // 设置默认mock返回值
    mockedBucketService.formatFileSize.mockImplementation((size: number) => `${size} B`)
    mockedBucketService.formatDate.mockImplementation((date: string) => date)
    mockedBucketService.getFileIcon.mockImplementation(() => '📄')
    mockedBucketService.getFileUrl.mockImplementation((key: string) => `https://example.com/${key}`)
  })

  describe('初始状态', () => {
    it('应该有正确的初始状态', () => {
      expect(store.files).toEqual([])
      expect(store.loading).toBe(false)
      expect(store.error).toBe(null)
      expect(store.searchQuery).toBe('')
      expect(store.currentPrefix).toBe('')
    })

    it('计算属性应该返回正确的初始值', () => {
      expect(store.filteredFiles).toEqual([])
      expect(store.totalFiles).toBe(0)
      expect(store.totalSize).toBe(0)
      expect(store.formattedTotalSize).toBe('0 B')
    })
  })

  describe('loadFiles', () => {
    it('应该成功加载文件', async () => {
      const mockFiles = [
        {
          key: 'test1.txt',
          lastModified: '2024-01-01',
          size: 100,
          etag: 'etag1',
          storageClass: 'STANDARD',
          url: 'https://example.com/test1.txt',
          type: 'file' as const
        },
        {
          key: 'test2.txt',
          lastModified: '2024-01-02',
          size: 200,
          etag: 'etag2',
          storageClass: 'STANDARD',
          url: 'https://example.com/test2.txt',
          type: 'file' as const
        }
      ]

      mockedBucketService.listFiles.mockResolvedValue({
        files: mockFiles,
        totalCount: 2,
        hasMore: false
      })

      await store.loadFiles()

      expect(store.loading).toBe(false)
      expect(store.files).toEqual(mockFiles)
      expect(store.error).toBe(null)
      expect(mockedBucketService.listFiles).toHaveBeenCalledWith('')
    })

    it('应该处理带前缀的加载', async () => {
      const prefix = 'assets/'
      mockedBucketService.listFiles.mockResolvedValue({
        files: [],
        totalCount: 0,
        hasMore: false
      })

      await store.loadFiles(prefix)

      expect(store.currentPrefix).toBe(prefix)
      expect(mockedBucketService.listFiles).toHaveBeenCalledWith(prefix)
    })

    it('应该处理加载错误', async () => {
      const errorMessage = '网络错误'
      mockedBucketService.listFiles.mockRejectedValue(new Error(errorMessage))

      await store.loadFiles()

      expect(store.loading).toBe(false)
      expect(store.error).toBe(errorMessage)
      expect(store.files).toEqual([])
    })

    it('应该在加载期间设置loading状态', async () => {
      let resolvePromise: (value: any) => void
      const promise = new Promise((resolve) => {
        resolvePromise = resolve
      })

      mockedBucketService.listFiles.mockReturnValue(promise)

      // 开始加载
      const loadPromise = store.loadFiles()
      expect(store.loading).toBe(true)

      // 完成加载
      resolvePromise!({
        files: [],
        totalCount: 0,
        hasMore: false
      })
      await loadPromise

      expect(store.loading).toBe(false)
    })
  })

  describe('refreshFiles', () => {
    it('应该使用当前前缀刷新文件', async () => {
      const prefix = 'images/'
      store.currentPrefix = prefix

      mockedBucketService.listFiles.mockResolvedValue({
        files: [],
        totalCount: 0,
        hasMore: false
      })

      await store.refreshFiles()

      expect(mockedBucketService.listFiles).toHaveBeenCalledWith(prefix)
    })
  })

  describe('搜索功能', () => {
    beforeEach(async () => {
      const mockFiles = [
        {
          key: 'image.png',
          lastModified: '2024-01-01',
          size: 100,
          etag: 'etag1',
          storageClass: 'STANDARD',
          url: 'https://example.com/image.png',
          type: 'file' as const
        },
        {
          key: 'document.pdf',
          lastModified: '2024-01-02',
          size: 200,
          etag: 'etag2',
          storageClass: 'STANDARD',
          url: 'https://example.com/document.pdf',
          type: 'file' as const
        }
      ]

      mockedBucketService.listFiles.mockResolvedValue({
        files: mockFiles,
        totalCount: 2,
        hasMore: false
      })

      await store.loadFiles()
    })

    it('应该正确过滤文件', () => {
      store.setSearchQuery('image')
      expect(store.filteredFiles).toHaveLength(1)
      expect(store.filteredFiles[0].key).toBe('image.png')
    })

    it('应该不区分大小写搜索', () => {
      store.setSearchQuery('IMAGE')
      expect(store.filteredFiles).toHaveLength(1)
      expect(store.filteredFiles[0].key).toBe('image.png')
    })

    it('应该返回所有文件当搜索查询为空时', () => {
      store.setSearchQuery('')
      expect(store.filteredFiles).toHaveLength(2)
    })
  })

  describe('计算属性', () => {
    beforeEach(async () => {
      const mockFiles = [
        {
          key: 'file1.txt',
          lastModified: '2024-01-01',
          size: 100,
          etag: 'etag1',
          storageClass: 'STANDARD',
          url: 'https://example.com/file1.txt',
          type: 'file' as const
        },
        {
          key: 'file2.txt',
          lastModified: '2024-01-02',
          size: 300,
          etag: 'etag2',
          storageClass: 'STANDARD',
          url: 'https://example.com/file2.txt',
          type: 'file' as const
        }
      ]

      mockedBucketService.listFiles.mockResolvedValue({
        files: mockFiles,
        totalCount: 2,
        hasMore: false
      })
      mockedBucketService.formatFileSize.mockImplementation((size: number) => `${size} bytes`)

      await store.loadFiles()
    })

    it('totalFiles应该返回正确的文件数量', () => {
      expect(store.totalFiles).toBe(2)
    })

    it('totalSize应该计算总文件大小', () => {
      expect(store.totalSize).toBe(400)
    })

    it('formattedTotalSize应该格式化总大小', () => {
      expect(store.formattedTotalSize).toBe('400 bytes')
    })
  })

  describe('工具方法', () => {
    it('应该正确调用bucketService的方法', () => {
      const key = 'test.txt'
      const size = 1024
      const date = '2024-01-01'

      store.getFileUrl(key)
      store.formatFileSize(size)
      store.formatDate(date)
      store.getFileIcon(key)

      expect(mockedBucketService.getFileUrl).toHaveBeenCalledWith(key)
      expect(mockedBucketService.formatFileSize).toHaveBeenCalledWith(size)
      expect(mockedBucketService.formatDate).toHaveBeenCalledWith(date)
      expect(mockedBucketService.getFileIcon).toHaveBeenCalledWith(key)
    })
  })

  describe('错误处理', () => {
    it('clearError应该清除错误状态', () => {
      store.error = '测试错误'
      store.clearError()
      expect(store.error).toBe(null)
    })
  })
})