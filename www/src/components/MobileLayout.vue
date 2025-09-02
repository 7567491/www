<template>
  <div class="mobile-layout">
    <!-- iPhone 框架模拟 -->
    <div class="phone-frame">
      <!-- 状态栏 -->
      <div class="status-bar">
        <div class="status-left">
          <span class="time">{{ currentTime }}</span>
        </div>
        <div class="status-center">
          <div class="notch"></div>
        </div>
        <div class="status-right">
          <span class="signal">📶</span>
          <span class="wifi">📶</span>
          <span class="battery">🔋</span>
        </div>
      </div>

      <!-- 应用标题栏 -->
      <header class="app-header">
        <h1 class="app-title">WWW存储桶</h1>
        <div class="header-actions">
          <button @click="refreshPage" class="refresh-btn" :disabled="isRefreshing">
            <span class="refresh-icon" :class="{ spinning: isRefreshing }">🔄</span>
          </button>
        </div>
      </header>

      <!-- 主要内容区域 -->
      <main class="app-content">
        <slot />
      </main>

      <!-- 虚拟Home指示器 -->
      <div class="home-indicator"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const currentTime = ref('')
const isRefreshing = ref(false)
let timeInterval: ReturnType<typeof setInterval> | null = null

const emit = defineEmits<{
  refresh: []
}>()

function updateTime() {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

async function refreshPage() {
  isRefreshing.value = true
  emit('refresh')
  
  // 模拟刷新延迟
  setTimeout(() => {
    isRefreshing.value = false
  }, 1000)
}

onMounted(() => {
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})
</script>

<style scoped>
.mobile-layout {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.phone-frame {
  width: 375px;
  height: 812px;
  background: #000;
  border-radius: 40px;
  padding: 8px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 44px;
  padding: 0 20px;
  background: #000;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  position: relative;
  z-index: 10;
}

.status-center {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.notch {
  width: 150px;
  height: 30px;
  background: #000;
  border-radius: 0 0 20px 20px;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  padding: 0 20px;
  background: #fff;
  border-bottom: 1px solid #e5e5e5;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.app-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.refresh-btn {
  background: none;
  border: none;
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.2s;
}

.refresh-btn:hover {
  background: rgba(0, 0, 0, 0.1);
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.refresh-icon {
  font-size: 18px;
  display: inline-block;
  transition: transform 0.3s ease;
}

.refresh-icon.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.app-content {
  flex: 1;
  background: #f5f5f5;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.home-indicator {
  height: 34px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #000;
}

.home-indicator::before {
  content: '';
  width: 134px;
  height: 5px;
  background: #fff;
  border-radius: 3px;
  opacity: 0.5;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .mobile-layout {
    padding: 0;
  }
  
  .phone-frame {
    width: 100vw;
    height: 100vh;
    border-radius: 0;
    box-shadow: none;
  }
  
  .status-bar {
    background: #000;
  }
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .app-header {
    background: #1a1a1a;
    border-bottom-color: #333;
    color: #fff;
  }
  
  .app-title {
    color: #fff;
  }
  
  .app-content {
    background: #000;
  }
}
</style>