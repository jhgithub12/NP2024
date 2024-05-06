import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TextView from '@/components/TextChatting.vue'
import VoiceVideo from '@/components/VoiceVideo.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/text',
      name: 'text',
      component: TextView,
      props: true
    },
    {
      path: '/voicevideo',
      name: 'voicevideo',
      component: VoiceVideo
    }
  ]
})

export default router