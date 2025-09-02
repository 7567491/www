<template>
  <div class="bucket-view">
    <BucketFileList />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useBucketStore } from '@/stores/bucket'
import BucketFileList from '@/components/BucketFileList.vue'

const bucketStore = useBucketStore()

onMounted(async () => {
  // 初始加载文件列表
  await bucketStore.loadFiles()
})

// 暴露刷新方法给父组件
defineExpose({
  refresh: () => bucketStore.refreshFiles()
})
</script>

<style scoped>
.bucket-view {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>