<template>
  <div class="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300">

    <!-- Navigation -->
    <nav
        class="fixed top-0 w-full z-50 backdrop-blur-md bg-white/80 dark:bg-zinc-950/80 border-b border-zinc-100 dark:border-zinc-800">
      <div class="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <span class="font-semibold text-zinc-900 dark:text-white tracking-tight">folio</span>
        <div class="flex items-center gap-6">
          <RouterLink to="/projects" class="nav-link">Projects</RouterLink>
          <RouterLink to="/about" class="nav-link">About</RouterLink>
          <button @click="toggleDark"
                  class="w-8 h-8 rounded-full flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            <span v-if="isDark">☀️</span>
            <span v-else>🌙</span>
          </button>
        </div>
      </div>
    </nav>

    <!-- Hero -->
    <section class="max-w-5xl mx-auto px-6 pt-40 pb-24">
      <div class="fade-up">
        <p class="text-sm font-medium text-indigo-500 dark:text-indigo-400 mb-4 tracking-widest uppercase">Available for
          work</p>
        <h1 class="text-5xl sm:text-7xl font-bold text-zinc-900 dark:text-white tracking-tight leading-none mb-6">
          Robin<br/>
          <span class="text-zinc-400 dark:text-zinc-600">Developer</span>
        </h1>
        <p class="text-lg text-zinc-500 dark:text-zinc-400 max-w-xl leading-relaxed mb-10">
          앱과 웹을 만드는 개발자입니다. 사용자 경험을 중심에 두고 꼼꼼하게 만듭니다.
        </p>
        <div class="flex items-center gap-4">
          <RouterLink to="/projects"
                      class="btn-primary">
            프로젝트 보기
          </RouterLink>
          <a href="https://github.com/본인깃허브" target="_blank"
             class="btn-secondary">
            GitHub
          </a>
        </div>
      </div>
    </section>

    <!-- 기술 스택 -->
    <section class="max-w-5xl mx-auto px-6 pb-24">
      <h2 class="section-label mb-6">Tech Stack</h2>
      <div class="flex flex-wrap gap-3">
        <span v-for="tech in techStack" :key="tech.name"
              class="px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-600 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors cursor-default">
          {{ tech.icon }} {{ tech.name }}
        </span>
      </div>
    </section>

    <!-- 최근 프로젝트 -->
    <section class="max-w-5xl mx-auto px-6 pb-32">
      <div class="flex items-center justify-between mb-8">
        <h2 class="section-label">Recent Projects</h2>
        <RouterLink to="/projects" class="text-sm text-indigo-500 dark:text-indigo-400 hover:underline">전체 보기 →
        </RouterLink>
      </div>

      <!-- 로딩 -->
      <div v-if="store.loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="i in 3" :key="i" class="h-64 rounded-2xl bg-zinc-100 dark:bg-zinc-900 animate-pulse"/>
      </div>

      <!-- 프로젝트 카드 -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <RouterLink v-for="project in store.projects.slice(0, 3)" :key="project.id"
                    :to="`/projects/${project.id}`"
                    class="project-card group">
          <!-- 썸네일 -->
          <div class="h-44 overflow-hidden bg-zinc-200 dark:bg-zinc-800">
            <img v-if="project.thumbnailUrl" :src="project.thumbnailUrl" :alt="project.title"
                 class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
            <div v-else class="w-full h-full flex items-center justify-center text-zinc-400 text-4xl">📁</div>
          </div>
          <!-- 정보 -->
          <div class="p-5">
            <div class="flex items-center gap-2 mb-2">
              <span
                  class="text-xs px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                {{ project.category }}
              </span>
            </div>
            <h3 class="font-semibold text-zinc-900 dark:text-white mb-1">{{ project.title }}</h3>
            <p class="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">{{ project.description }}</p>
          </div>
        </RouterLink>
      </div>
    </section>

    <!-- 푸터 -->
    <footer class="border-t border-zinc-100 dark:border-zinc-800 py-8">
      <div class="max-w-5xl mx-auto px-6 flex items-center justify-between">
        <span class="text-sm text-zinc-400">© 2026 Robin</span>
        <div class="flex items-center gap-4">
          <a href="https://github.com/robincooding" target="_blank"
             class="text-sm text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">GitHub</a>
        </div>
      </div>
    </footer>

  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import {RouterLink} from 'vue-router'
import {useProjectsStore} from '@/stores/projects'

const store = useProjectsStore()
const isDark = ref(document.documentElement.classList.contains('dark'))

function toggleDark() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

// 저장된 테마 복원
onMounted(() => {
  const saved = localStorage.getItem('theme')
  if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true
    document.documentElement.classList.add('dark')
  }
  store.fetchProjects()
})

const techStack = [
  {name: 'Flutter', icon: '💙'},
  {name: 'Dart', icon: '🎯'},
  {name: 'Vue.js', icon: '💚'},
  {name: 'Node.js', icon: '🟢'},
  {name: 'PostgreSQL', icon: '🐘'},
  {name: 'Firebase', icon: '🔥'},
  {name: 'AWS', icon: '☁️'},
]
</script>