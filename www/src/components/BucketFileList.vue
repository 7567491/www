<template>
  <div class="file-list">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <div class="search-input-wrapper">
        <span class="search-icon">🔍</span>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索文件..."
          class="search-input"
          @input="handleSearch"
        />
        <button
          v-if="searchQuery"
          @click="clearSearch"
          class="clear-search"
        >
          ✕
        </button>
      </div>
    </div>

    <!-- 统计信息 -->
    <div class="stats-bar">
      <span class="file-count">{{ filteredFiles.length }} 个文件</span>
      <span class="total-size">总大小: {{ formattedTotalSize }}</span>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>

    <!-- 错误提示 -->
    <div v-if="error" class="error-container">
      <div class="error-icon">⚠️</div>
      <p class="error-message">{{ error }}</p>
      <button @click="retry" class="retry-btn">重试</button>
    </div>

    <!-- 文件列表 -->
    <div v-if="!loading && !error" class="files-container">
      <!-- 空状态 -->
      <div v-if="filteredFiles.length === 0" class="empty-state">
        <div class="empty-icon">📁</div>
        <h3>没有找到文件</h3>
        <p v-if="searchQuery">尝试修改搜索条件</p>
        <p v-else>存储桶中没有文件</p>
      </div>

      <!-- 文件项 -->
      <div
        v-for="file in filteredFiles"
        :key="file.key"
        class="file-item"
        @click="handleFileClick(file)"
      >
        <div class="file-icon">
          {{ getFileIcon(file.key) }}
        </div>
        <div class="file-info">
          <h4 class="file-name">{{ getFileName(file.key) }}</h4>
          <div class="file-details">
            <span class="file-size">{{ formatFileSize(file.size) }}</span>
            <span class="file-date">{{ formatDate(file.lastModified) }}</span>
          </div>
        </div>
        <div class="file-actions">
          <button @click.stop="openFile(file)" class="action-btn">
            {{ file.type === 'folder' ? '📂' : '👁️' }}
          </button>
          <button @click.stop="copyUrl(file)" class="action-btn">
            📋
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useBucketStore } from '@/stores/bucket'
import type { BucketFile } from '@/services/bucketService'

const bucketStore = useBucketStore()
const searchQuery = ref('')

// 计算属性
const filteredFiles = computed(() => bucketStore.filteredFiles)
const loading = computed(() => bucketStore.loading)
const error = computed(() => bucketStore.error)
const formattedTotalSize = computed(() => bucketStore.formattedTotalSize)

// 方法
function handleSearch() {
  bucketStore.setSearchQuery(searchQuery.value)
}

function clearSearch() {
  searchQuery.value = ''
  bucketStore.setSearchQuery('')
}

function retry() {
  bucketStore.clearError()
  bucketStore.refreshFiles()
}

function getFileName(key: string): string {
  const parts = key.split('/')
  return parts[parts.length - 1] || key
}

function getFileIcon(key: string): string {
  return bucketStore.getFileIcon(key)
}

function formatFileSize(size: number): string {
  return bucketStore.formatFileSize(size)
}

function formatDate(dateString: string): string {
  return bucketStore.formatDate(dateString)
}

function handleFileClick(file: BucketFile) {
  if (file.type === 'folder') {
    // 处理文件夹点击 - 可以在这里实现文件夹导航
    console.log('点击文件夹:', file.key)
  } else {
    openFile(file)
  }
}

function openFile(file: BucketFile) {
  const url = bucketStore.getFileUrl(file.key)
  window.open(url, '_blank')
}

function copyUrl(file: BucketFile) {
  const url = bucketStore.getFileUrl(file.key)
  
  if (navigator.clipboard) {
    navigator.clipboard.writeText(url).then(() => {
      // 这里可以添加一个toast提示
      console.log('URL已复制到剪贴板')
    })
  } else {
    // 兼容旧浏览器
    const textarea = document.createElement('textarea')
    textarea.value = url
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    console.log('URL已复制到剪贴板')
  }
}
</script>

<style scoped>
.file-list {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.search-bar {
  padding: 16px;
  background: #fff;
  border-bottom: 1px solid #e5e5e5;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background: #f5f5f5;
  border-radius: 12px;
  padding: 0 12px;
}

.search-icon {
  font-size: 16px;
  margin-right: 8px;
  color: #666;
}

.search-input {
  flex: 1;
  border: none;
  background: none;
  padding: 12px 0;
  font-size: 16px;
  outline: none;
  color: #333;
}

.search-input::placeholder {
  color: #999;
}

.clear-search {
  background: none;
  border: none;
  color: #666;
  font-size: 16px;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
}

.clear-search:hover {
  background: rgba(0, 0, 0, 0.1);
}

.stats-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: #f8f9fa;
  border-bottom: 1px solid #e5e5e5;
  font-size: 14px;
  color: #666;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #666;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 20px;
  text-align: center;
}

.error-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.error-message {
  color: #dc2626;
  margin-bottom: 20px;
  font-size: 16px;
}

.retry-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.retry-btn:hover {
  background: #2563eb;
}

.files-container {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 20px;
  text-align: center;
  color: #666;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-state h3 {
  margin: 0 0 8px 0;
  color: #333;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}

.file-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  background: #fff;
  cursor: pointer;
  transition: background-color 0.2s;
}

.file-item:hover {
  background: #f8f9fa;
}

.file-item:active {
  background: #e9ecef;
}

.file-icon {
  font-size: 24px;
  margin-right: 16px;
  min-width: 32px;
  text-align: center;
}

.file-info {
  flex: 1;
  min-width: 0;
}

.file-name {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 500;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-details {
  display: flex;
  gap: 12px;
  font-size: 14px;
  color: #666;
}

.file-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.action-btn:hover {
  background: rgba(0, 0, 0, 0.1);
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .search-bar,
  .file-item {
    background: #1a1a1a;
    border-color: #333;
    color: #fff;
  }
  
  .search-input-wrapper {
    background: #333;
  }
  
  .search-input {
    color: #fff;
  }
  
  .search-input::placeholder {
    color: #999;
  }
  
  .stats-bar {
    background: #2a2a2a;
    border-color: #333;
    color: #ccc;
  }
  
  .file-name {
    color: #fff;
  }
  
  .file-item:hover {
    background: #333;
  }
  
  .file-item:active {
    background: #444;
  }
}
</style>