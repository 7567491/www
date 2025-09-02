<template>
  <div class="file-list">
    <!-- 面包屑导航 -->
    <div v-if="breadcrumbs.length > 0 || currentPrefix" class="breadcrumb-nav">
      <button @click="navigateToRoot" class="breadcrumb-item root">
        🏠 根目录
      </button>
      <span v-if="breadcrumbs.length > 0" class="breadcrumb-separator">/</span>
      <template v-for="(crumb, index) in breadcrumbs" :key="crumb.path">
        <button
          @click="navigateToPath(crumb.path)"
          class="breadcrumb-item"
          :class="{ 'current': index === breadcrumbs.length - 1 }"
        >
          {{ crumb.name }}
        </button>
        <span v-if="index < breadcrumbs.length - 1" class="breadcrumb-separator">/</span>
      </template>
      <button v-if="currentPrefix" @click="navigateBack" class="back-btn">
        ← 返回上级
      </button>
    </div>

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
const breadcrumbs = computed(() => bucketStore.breadcrumbs)
const currentPrefix = computed(() => bucketStore.currentPrefix)

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
    // 导航到文件夹
    bucketStore.navigateToFolder(file.key)
  } else {
    openFile(file)
  }
}

// 导航功能
function navigateToRoot() {
  bucketStore.navigateToRoot()
}

function navigateBack() {
  bucketStore.navigateBack()
}

function navigateToPath(path: string) {
  bucketStore.loadFiles(path)
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.breadcrumb-nav {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 14px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.breadcrumb-item {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  color: white;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 20px;
  transition: all 0.3s ease;
  white-space: nowrap;
  font-weight: 500;
  font-size: 13px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.breadcrumb-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.breadcrumb-item.root {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  color: white;
  font-weight: 600;
}

.breadcrumb-item.current {
  background: linear-gradient(135deg, #fa709a, #fee140);
  color: #333;
  cursor: default;
  font-weight: 600;
}

.breadcrumb-separator {
  color: #667eea;
  margin: 0 4px;
  font-weight: bold;
}

.back-btn {
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-left: auto;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
}

.back-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
}

.search-bar {
  padding: 20px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 25px;
  padding: 0 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.search-input-wrapper:focus-within {
  border-color: #667eea;
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.2);
}

.search-icon {
  font-size: 18px;
  margin-right: 12px;
  color: #667eea;
}

.search-input {
  flex: 1;
  border: none;
  background: none;
  padding: 14px 0;
  font-size: 16px;
  outline: none;
  color: #333;
  font-weight: 500;
}

.search-input::placeholder {
  color: #999;
  font-weight: 400;
}

.clear-search {
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  border: none;
  color: white;
  font-size: 14px;
  cursor: pointer;
  padding: 6px;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.clear-search:hover {
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
}

.stats-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 14px;
  color: #5a67d8;
  font-weight: 600;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.1);
  margin: 20px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
  box-shadow: 0 0 20px rgba(102, 126, 234, 0.3);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 20px;
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  margin: 20px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

.error-icon {
  font-size: 64px;
  margin-bottom: 20px;
  filter: drop-shadow(0 0 10px rgba(255, 107, 107, 0.3));
}

.error-message {
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 25px;
  font-size: 16px;
  font-weight: 500;
}

.retry-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.retry-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.files-container {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 10px 20px 20px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100px 20px;
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

.empty-icon {
  font-size: 80px;
  margin-bottom: 25px;
  opacity: 0.7;
  filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.2));
}

.empty-state h3 {
  margin: 0 0 12px 0;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  font-size: 18px;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
  opacity: 0.8;
}

.file-item {
  display: flex;
  align-items: center;
  padding: 18px 20px;
  margin-bottom: 8px;
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.95);
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.file-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  background: rgba(255, 255, 255, 1);
}

.file-item:active {
  transform: translateY(0);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.file-icon {
  font-size: 28px;
  margin-right: 20px;
  min-width: 40px;
  text-align: center;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.file-info {
  flex: 1;
  min-width: 0;
}

.file-name {
  margin: 0 0 6px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-details {
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.file-actions {
  display: flex;
  gap: 6px;
}

.action-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  font-size: 16px;
  cursor: pointer;
  padding: 10px;
  border-radius: 12px;
  transition: all 0.3s ease;
  color: white;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
  min-width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.action-btn:nth-child(2) {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .file-list {
    background: linear-gradient(135deg, #2d1b69 0%, #11998e 100%);
  }
  
  .breadcrumb-nav {
    background: rgba(0, 0, 0, 0.4);
    border-color: rgba(255, 255, 255, 0.1);
  }
  
  .search-bar {
    background: rgba(0, 0, 0, 0.4);
    border-color: rgba(255, 255, 255, 0.1);
  }
  
  .search-input-wrapper {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
  }
  
  .search-input {
    color: #fff;
  }
  
  .search-input::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
  
  .stats-bar {
    background: rgba(0, 0, 0, 0.4);
    border-color: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.9);
  }
  
  .file-item {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.1);
  }
  
  .file-item:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  
  .file-name {
    color: #fff;
  }
  
  .file-details {
    color: rgba(255, 255, 255, 0.7);
  }
  
  .loading-container,
  .error-container,
  .empty-state {
    background: rgba(0, 0, 0, 0.3);
  }
}
</style>