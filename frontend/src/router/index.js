import {createRouter, createWebHistory} from 'vue-router'
import {useAuthStore} from '@/stores/auth'

const routes = [
    // 방문자 페이지
    {path: '/', name: 'Home', component: () => import('@/pages/Home.vue')},
    {path: '/projects', name: 'Projects', component: () => import('@/pages/Projects.vue')},
    {path: '/projects/:id', name: 'ProjectDetail', component: () => import('@/pages/ProjectDetail.vue')},
    {path: '/about', name: 'About', component: () => import('@/pages/About.vue')},

    // 관리자 페이지
    {path: '/admin/login', name: 'AdminLogin', component: () => import('@/pages/admin/Login.vue')},
    {
        path: '/admin/projects',
        name: 'AdminProjects',
        component: () => import('@/pages/admin/ProjectList.vue'),
        meta: {requiresAuth: true}
    },
    {
        path: '/admin/projects/new',
        name: 'AdminNewProject',
        component: () => import('@/pages/admin/ProjectForm.vue'),
        meta: {requiresAuth: true}
    },
    {
        path: '/admin/projects/:id/edit',
        name: 'AdminEditProject',
        component: () => import('@/pages/admin/ProjectForm.vue'),
        meta: {requiresAuth: true}
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// 라우터 가드
router.beforeEach((to) => {
    const auth = useAuthStore()
    // 인증 필요 페이지 → 미로그인 시 로그인으로
    if (to.meta.requiresAuth && !auth.isLoggedIn) {
        return {name: 'AdminLogin'}
    }
    // 이미 로그인 상태에서 로그인 페이지 접근 → 관리자 목록으로
    if (to.name === 'AdminLogin' && auth.isLoggedIn) {
        return {name: 'AdminProjects'}
    }
})

export default router