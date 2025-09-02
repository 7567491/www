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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  padding: 20px;
  position: relative;
}

.mobile-layout::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%);
  pointer-events: none;
}

.phone-frame {
  width: 375px;
  height: 812px;
  background: linear-gradient(145deg, #1a1a1a, #000);
  border-radius: 42px;
  padding: 6px;
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.5),
    0 0 0 2px rgba(255, 255, 255, 0.1),
    inset 0 2px 4px rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  z-index: 1;
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
  height: 70px;
  padding: 0 24px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.9));
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  position: relative;
}

.app-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
}

.app-title {
  font-size: 22px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.refresh-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  padding: 12px;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  color: white;
}

.refresh-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.refresh-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.refresh-icon {
  font-size: 20px;
  display: inline-block;
  transition: transform 0.3s ease;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
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
  background: transparent;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  position: relative;
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
  .mobile-layout {
    background: linear-gradient(135deg, #2d1b69 0%, #11998e 50%, #38097a 100%);
  }
  
  .phone-frame {
    background: linear-gradient(145deg, #000, #1a1a1a);
    box-shadow: 
      0 25px 50px rgba(0, 0, 0, 0.8),
      0 0 0 2px rgba(255, 255, 255, 0.1),
      inset 0 2px 4px rgba(255, 255, 255, 0.05);
  }
  
  .app-header {
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.6));
    border-bottom-color: rgba(255, 255, 255, 0.1);
  }
  
  .app-header::before {
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  }
  
  .app-title {
    background: linear-gradient(135deg, #60a5fa, #34d399);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
}
</style>