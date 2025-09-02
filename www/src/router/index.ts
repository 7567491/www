import { createRouter, createWebHistory } from 'vue-router'
import BucketView from '@/views/BucketView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'bucket',
      component: BucketView,
    },
    // 重定向所有未匹配的路由到主页
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

export default router