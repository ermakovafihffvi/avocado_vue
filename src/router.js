import { createMemoryHistory, createRouter } from 'vue-router'

import MainPage from './components/MainPage.vue'
import Login from './components/Login.vue'

const routes = [
  { path: '/', component: MainPage },
  { path: '/login', component: Login }
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router;