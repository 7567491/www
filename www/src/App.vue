<template>
  <div id="app">
    <MobileLayout @refresh="handleRefresh">
      <RouterView ref="routerViewRef" />
    </MobileLayout>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import MobileLayout from '@/components/MobileLayout.vue'

const routerViewRef = ref()

function handleRefresh() {
  // 调用当前视图的刷新方法
  if (routerViewRef.value?.refresh) {
    routerViewRef.value.refresh()
  }
}
</script>

<style scoped>
#app {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}
</style>