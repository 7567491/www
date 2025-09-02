import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import bucketService, { type BucketFile } from '@/services/bucketService'

export const useBucketStore = defineStore('bucket', () => {
  // 状态
  const files = ref<BucketFile[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const searchQuery = ref('')
  const currentPrefix = ref('')

  // 计算属性
  const filteredFiles = computed(() => {
    if (!searchQuery.value) return files.value
    
    return files.value.filter(file => 
      file.key.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  })

  const totalFiles = computed(() => files.value.length)

  const totalSize = computed(() => {
    return files.value.reduce((total, file) => total + file.size, 0)
  })

  const formattedTotalSize = computed(() => {
    return bucketService.formatFileSize(totalSize.value)
  })

  // 操作
  async function loadFiles(prefix: string = '') {
    loading.value = true
    error.value = null
    
    try {
      const response = await bucketService.listFiles(prefix)
      files.value = response.files
      currentPrefix.value = prefix
    } catch (err) {
      error.value = err instanceof Error ? err.message : '加载文件失败'
      console.error('加载文件失败:', err)
    } finally {
      loading.value = false
    }
  }

  async function refreshFiles() {
    await loadFiles(currentPrefix.value)
  }

  function setSearchQuery(query: string) {
    searchQuery.value = query
  }

  function clearError() {
    error.value = null
  }

  // 获取文件URL
  function getFileUrl(key: string) {
    return bucketService.getFileUrl(key)
  }

  // 格式化文件大小
  function formatFileSize(bytes: number) {
    return bucketService.formatFileSize(bytes)
  }

  // 格式化日期
  function formatDate(dateString: string) {
    return bucketService.formatDate(dateString)
  }

  // 获取文件图标
  function getFileIcon(filename: string) {
    return bucketService.getFileIcon(filename)
  }

  return {
    // 状态
    files,
    loading,
    error,
    searchQuery,
    currentPrefix,
    
    // 计算属性
    filteredFiles,
    totalFiles,
    totalSize,
    formattedTotalSize,
    
    // 操作
    loadFiles,
    refreshFiles,
    setSearchQuery,
    clearError,
    getFileUrl,
    formatFileSize,
    formatDate,
    getFileIcon,
  }
})