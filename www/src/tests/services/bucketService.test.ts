import { describe, it, expect, vi, beforeEach } from 'vitest'
import bucketService, { type BucketFile } from '@/services/bucketService'

// Mock环境变量
vi.mock('import.meta.env', () => ({
  VITE_S3_ACCESS_KEY: 'test-access-key',
  VITE_S3_SECRET_KEY: 'test-secret-key',
  VITE_S3_REGION: 'ap-south-1',
  VITE_S3_ENDPOINT: 'https://ap-south-1.linodeobjects.com',
  VITE_S3_BUCKET: 'www'
}))

describe('BucketService', () => {
  describe('listFiles', () => {
    it('应该返回模拟的文件列表', async () => {
      const result = await bucketService.listFiles()
      
      expect(result).toBeDefined()
      expect(result.files).toBeInstanceOf(Array)
      expect(result.totalCount).toBeGreaterThan(0)
      expect(result.hasMore).toBe(false)
    })

    it('应该根据前缀过滤文件', async () => {
      const prefix = 'assets'
      const result = await bucketService.listFiles(prefix)
      
      expect(result.files.every(file => file.key.startsWith(prefix))).toBe(true)
    })

    it('应该处理空前缀', async () => {
      const result = await bucketService.listFiles('')
      
      expect(result).toBeDefined()
      expect(result.files).toBeInstanceOf(Array)
    })
  })

  describe('getFileUrl', () => {
    it('应该返回正确的文件URL', () => {
      const key = 'test-file.txt'
      const url = bucketService.getFileUrl(key)
      
      expect(url).toBe('https://ap-south-1.linodeobjects.com/www/test-file.txt')
    })

    it('应该处理带路径的文件key', () => {
      const key = 'folder/subfolder/file.png'
      const url = bucketService.getFileUrl(key)
      
      expect(url).toBe('https://ap-south-1.linodeobjects.com/www/folder/subfolder/file.png')
    })
  })

  describe('formatFileSize', () => {
    it('应该正确格式化字节数', () => {
      expect(bucketService.formatFileSize(0)).toBe('0 B')
      expect(bucketService.formatFileSize(1024)).toBe('1 KB')
      expect(bucketService.formatFileSize(1048576)).toBe('1 MB')
      expect(bucketService.formatFileSize(1073741824)).toBe('1 GB')
    })

    it('应该正确处理小数', () => {
      expect(bucketService.formatFileSize(1536)).toBe('1.5 KB')
      expect(bucketService.formatFileSize(2560000)).toBe('2.44 MB')
    })
  })

  describe('formatDate', () => {
    it('应该正确格式化日期字符串', () => {
      const dateString = '2024-01-15T10:30:00Z'
      const formatted = bucketService.formatDate(dateString)
      
      expect(formatted).toMatch(/^\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}$/)
    })

    it('应该处理无效日期', () => {
      const invalidDate = 'invalid-date'
      expect(() => bucketService.formatDate(invalidDate)).not.toThrow()
    })
  })

  describe('getFileIcon', () => {
    it('应该返回HTML文件的正确图标', () => {
      expect(bucketService.getFileIcon('index.html')).toBe('📄')
      expect(bucketService.getFileIcon('test.htm')).toBe('📄')
    })

    it('应该返回CSS文件的正确图标', () => {
      expect(bucketService.getFileIcon('style.css')).toBe('🎨')
    })

    it('应该返回JavaScript文件的正确图标', () => {
      expect(bucketService.getFileIcon('app.js')).toBe('⚡')
      expect(bucketService.getFileIcon('main.ts')).toBe('⚡')
    })

    it('应该返回图片文件的正确图标', () => {
      expect(bucketService.getFileIcon('logo.png')).toBe('🖼️')
      expect(bucketService.getFileIcon('photo.jpg')).toBe('🖼️')
      expect(bucketService.getFileIcon('icon.svg')).toBe('🖼️')
    })

    it('应该返回PDF文件的正确图标', () => {
      expect(bucketService.getFileIcon('document.pdf')).toBe('📋')
    })

    it('应该返回文本文件的正确图标', () => {
      expect(bucketService.getFileIcon('readme.txt')).toBe('📝')
      expect(bucketService.getFileIcon('notes.md')).toBe('📝')
    })

    it('应该为未知文件类型返回默认图标', () => {
      expect(bucketService.getFileIcon('unknown.xyz')).toBe('📄')
      expect(bucketService.getFileIcon('noextension')).toBe('📄')
    })

    it('应该处理大写扩展名', () => {
      expect(bucketService.getFileIcon('IMAGE.PNG')).toBe('🖼️')
      expect(bucketService.getFileIcon('SCRIPT.JS')).toBe('⚡')
    })
  })
})