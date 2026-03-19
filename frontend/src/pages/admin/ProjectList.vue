<template>
  <div class="min-h-screen bg-zinc-50 dark:bg-zinc-950">

    <!-- 네비게이션 -->
    <nav class="bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800">
      <div class="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <RouterLink to="/" class="font-semibold text-zinc-900 dark:text-white tracking-tight">folio</RouterLink>
        <div class="flex items-center gap-4">
          <RouterLink to="/admin/projects/new" class="btn-primary text-xs px-4 py-2">
            + 새 프로젝트
          </RouterLink>
          <button @click="logout" class="text-sm text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
            로그아웃
          </button>
        </div>
      </div>
    </nav>

    <div class="max-w-5xl mx-auto px-6 py-10">

      <div class="flex items-center justify-between mb-8">
        <h1 class="text-2xl font-bold text-zinc-900 dark:text-white">프로젝트 관리</h1>
        <span class="text-sm text-zinc-400">총 {{ store.projects.length }}개</span>
      </div>

      <!-- 로딩 -->
      <div v-if="store.loading" class="space-y-3">
        <div v-for="i in 4" :key="i" class="h-16 bg-white dark:bg-zinc-900 rounded-xl animate-pulse"/>
      </div>

      <!-- 프로젝트 목록 -->
      <div v-else-if="store.projects.length" class="space-y-3">
        <div v-for="project in store.projects" :key="project.id"
             class="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800 px-5 py-4 flex items-center gap-4">

          <!-- 썸네일 -->
          <div class="w-12 h-12 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0">
            <img v-if="project.thumbnailUrl" :src="project.thumbnailUrl" class="w-full h-full object-cover"/>
            <div v-else class="w-full h-full flex items-center justify-center text-lg">📁</div>
          </div>

          <!-- 정보 -->
          <div class="flex-1 min-w-0">
            <h3 class="font-medium text-zinc-900 dark:text-white truncate">{{ project.title }}</h3>
            <p class="text-sm text-zinc-400 truncate">{{ project.description }}</p>
          </div>

          <!-- 카테고리 -->
          <span class="text-xs px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 shrink-0">
            {{ categoryLabel(project.category) }}
          </span>

          <!-- 액션 버튼 -->
          <div class="flex items-center gap-2 shrink-0">
            <RouterLink :to="`/admin/projects/${project.id}/edit`"
                        class="text-sm px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
              수정
            </RouterLink>
            <button @click="deleteProject(project.id)"
                    class="text-sm px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-900 text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors">
              삭제
            </button>
          </div>
        </div>
      </div>

      <!-- 빈 상태 -->
      <div v-else class="text-center py-24">
        <p class="text-4xl mb-4">📭</p>
        <p class="text-zinc-400 mb-6">아직 프로젝트가 없어요.</p>
        <RouterLink to="/admin/projects/new" class="btn-primary">첫 프로젝트 등록하기</RouterLink>
      </div>

    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useProjectsStore } from '@/stores/projects'
import { useAuthStore } from '@/stores/auth'
import { projectsApi } from '@/api/projects'

const store = useProjectsStore()
const auth = useAuthStore()
const router = useRouter()

const categories = [
  { value: 'app', label: '앱' },
  { value: 'web', label: '웹' },
  { value: 'other', label: '기타' },
]

function categoryLabel(value) {
  return categories.find(c => c.value === value)?.label ?? value
}

async function deleteProject(id) {
  if (!confirm('정말 삭제할까요?')) return
  try {
    await projectsApi.remove(id)
    await store.fetchProjects()
  } catch {
    alert('삭제 중 오류가 발생했어요.')
  }
}

function logout() {
  auth.logout()
  router.push({ name: 'AdminLogin' })
}

onMounted(() => store.fetchProjects())
</script>