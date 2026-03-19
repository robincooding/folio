<template>
  <div class="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center px-6">
    <div class="w-full max-w-sm">

      <!-- 로고 -->
      <div class="text-center mb-10">
        <RouterLink to="/" class="font-semibold text-xl text-zinc-900 dark:text-white tracking-tight">folio</RouterLink>
        <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-2">관리자 로그인</p>
      </div>

      <!-- 로그인 폼 -->
      <div class="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-8">
        <div class="space-y-5">

          <div>
            <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">이메일</label>
            <input v-model="email" type="email" placeholder="admin@folio.dev"
                   class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all"
                   @keyup.enter="login"/>
          </div>

          <div>
            <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">비밀번호</label>
            <input v-model="password" type="password" placeholder="••••••••"
                   class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all"
                   @keyup.enter="login"/>
          </div>

          <!-- 오류 메시지 -->
          <p v-if="error" class="text-sm text-red-500 dark:text-red-400">{{ error }}</p>

          <button @click="login" :disabled="loading"
                  class="w-full py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
            {{ loading ? '로그인 중...' : '로그인' }}
          </button>

        </div>
      </div>

      <p class="text-center mt-6">
        <RouterLink to="/" class="text-sm text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
          ← 홈으로 돌아가기
        </RouterLink>
      </p>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { authApi } from '@/api/projects'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function login() {
  if (!email.value || !password.value) {
    error.value = '이메일과 비밀번호를 입력해주세요.'
    return
  }
  loading.value = true
  error.value = ''
  try {
    const { data } = await authApi.login(email.value, password.value)
    auth.setToken(data.token)
    router.push({ name: 'AdminProjects' })
  } catch {
    error.value = '이메일 또는 비밀번호가 올바르지 않아요.'
  } finally {
    loading.value = false
  }
}
</script>