<template>
  <div id="app">
    <MobileLayout>
      <RouterView />
    </MobileLayout>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import MobileLayout from '@/components/MobileLayout.vue'
</script>

<style scoped>
#app {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}
</style>