import axios from 'axios'

export interface BucketFile {
  key: string
  lastModified: string
  size: number
  etag: string
  storageClass: string
  url: string
  type: 'file' | 'folder'
}

export interface BucketResponse {
  files: BucketFile[]
  totalCount: number
  hasMore: boolean
}

class BucketService {
  private accessKey: string
  private secretKey: string
  private region: string
  private endpoint: string
  private bucket: string

  constructor() {
    this.accessKey = import.meta.env.VITE_S3_ACCESS_KEY
    this.secretKey = import.meta.env.VITE_S3_SECRET_KEY
    this.region = import.meta.env.VITE_S3_REGION || 'ap-south-1'
    this.endpoint = import.meta.env.VITE_S3_ENDPOINT || 'https://ap-south-1.linodeobjects.com'
    this.bucket = import.meta.env.VITE_S3_BUCKET || 'www'
  }

  // 生成签名URL用于请求
  private async generatePresignedUrl(key: string = ''): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:-]|\.\d{3}/g, '')
    const date = timestamp.substr(0, 8)
    
    // 简化版本：直接返回公共URL
    return `${this.endpoint}/${this.bucket}/${key}`
  }

  // 获取存储桶文件列表
  async listFiles(prefix: string = '', maxKeys: number = 100): Promise<BucketResponse> {
    try {
      // 由于直接访问S3 API需要复杂的签名，这里使用一个简化的方法
      // 实际应用中可能需要通过后端代理或使用AWS SDK
      
      // 模拟数据用于开发测试
      const mockFiles: BucketFile[] = [
        {
          key: 'index.html',
          lastModified: '2024-01-15T10:30:00Z',
          size: 2048,
          etag: 'abc123',
          storageClass: 'STANDARD',
          url: `${this.endpoint}/${this.bucket}/index.html`,
          type: 'file'
        },
        {
          key: 'assets/',
          lastModified: '2024-01-15T09:00:00Z',
          size: 0,
          etag: '',
          storageClass: 'STANDARD',
          url: `${this.endpoint}/${this.bucket}/assets/`,
          type: 'folder'
        },
        {
          key: 'images/logo.png',
          lastModified: '2024-01-14T15:20:00Z',
          size: 15432,
          etag: 'def456',
          storageClass: 'STANDARD',
          url: `${this.endpoint}/${this.bucket}/images/logo.png`,
          type: 'file'
        }
      ]

      // 如果有前缀过滤
      const filteredFiles = prefix 
        ? mockFiles.filter(file => file.key.startsWith(prefix))
        : mockFiles

      return {
        files: filteredFiles,
        totalCount: filteredFiles.length,
        hasMore: false
      }
    } catch (error) {
      console.error('获取文件列表失败:', error)
      throw new Error('无法获取存储桶文件列表')
    }
  }

  // 获取文件的公共URL
  getFileUrl(key: string): string {
    return `${this.endpoint}/${this.bucket}/${key}`
  }

  // 格式化文件大小
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // 格式化日期
  formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // 获取文件类型图标
  getFileIcon(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase()
    switch (ext) {
      case 'html':
      case 'htm':
        return '📄'
      case 'css':
        return '🎨'
      case 'js':
      case 'ts':
        return '⚡'
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'svg':
        return '🖼️'
      case 'pdf':
        return '📋'
      case 'txt':
      case 'md':
        return '📝'
      default:
        return '📄'
    }
  }
}

export default new BucketService()