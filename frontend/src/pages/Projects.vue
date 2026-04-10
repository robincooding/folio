<template>
  <div class="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300">

    <!-- Navigation -->
    <nav class="fixed top-0 w-full z-50 backdrop-blur-xl saturate-[1.8] bg-white/80 dark:bg-zinc-950/80 border-b border-zinc-100 dark:border-zinc-800">
      <div class="max-w-[1100px] mx-auto px-7 h-14 flex items-center justify-between">
        <RouterLink to="/" class="text-[16px] font-extrabold tracking-[-0.03em] text-zinc-900 dark:text-white">folio</RouterLink>
        <div class="flex items-center gap-5">
          <RouterLink to="/projects" class="text-[13px] font-medium text-zinc-900 dark:text-white">Projects</RouterLink>
          <RouterLink to="/about" class="nav-link">About</RouterLink>
        </div>
      </div>
    </nav>

    <div class="max-w-5xl mx-auto px-6 pt-32 pb-24">

      <!-- Header -->
      <div class="mb-12 fade-up">
        <h1 class="text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-white tracking-tight mb-4">Projects</h1>
        <p class="text-zinc-500 dark:text-zinc-400">지금까지 만든 것들을 모아뒀어요.</p>
      </div>

      <!-- Category Filter -->
      <div class="flex gap-2 mb-10 fade-up">
        <button v-for="cat in categories" :key="cat.value"
                @click="selectCategory(cat.value)"
                :class="[
            'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
            selectedCategory === cat.value
              ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
              : 'border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-500'
          ]">
          {{ cat.label }}
        </button>
      </div>

      <!-- Loading Skeletons -->
      <div v-if="store.loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div v-for="i in 6" :key="i" class="rounded-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800">
          <div class="h-48 bg-zinc-100 dark:bg-zinc-900 animate-pulse"/>
          <div class="p-5 space-y-2">
            <div class="h-4 w-1/3 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse"/>
            <div class="h-5 w-2/3 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse"/>
            <div class="h-4 w-full bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse"/>
          </div>
        </div>
      </div>

      <!-- Project Grids -->
      <div v-else-if="store.projects.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <RouterLink v-for="project in store.projects" :key="project.id"
                    :to="`/projects/${project.id}`"
                    class="project-card group">
          <!-- Thumbnails -->
          <div class="h-48 overflow-hidden bg-zinc-100 dark:bg-zinc-800">
            <img v-if="project.thumbnailUrl" :src="project.thumbnailUrl" :alt="project.title"
                 class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
            <div v-else class="w-full h-full flex items-center justify-center text-5xl">📁</div>
          </div>
          <!-- Card Contents -->
          <div class="p-5">
            <div class="flex items-center gap-2 mb-3">
              <span
                  class="text-xs px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 font-medium">
                {{ categoryLabel(project.category) }}
              </span>
            </div>
            <h3 class="font-semibold text-zinc-900 dark:text-white mb-1.5 group-hover:text-indigo-500 transition-colors">
              {{ project.title }}
            </h3>
            <p class="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-4">{{ project.description }}</p>
            <div class="flex flex-wrap gap-1.5">
              <span v-for="tech in project.techStack.slice(0, 3)" :key="tech"
                    class="text-xs px-2 py-0.5 rounded bg-zinc-50 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500">
                {{ tech }}
              </span>
              <span v-if="project.techStack.length > 3" class="text-xs px-2 py-0.5 text-zinc-400">
                +{{ project.techStack.length - 3 }}
              </span>
            </div>
          </div>
        </RouterLink>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-24">
        <p class="text-4xl mb-4">📭</p>
        <p class="text-zinc-400 dark:text-zinc-600">아직 프로젝트가 없어요.</p>
      </div>

    </div>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import {RouterLink} from 'vue-router'
import {useProjectsStore} from '@/stores/projects'

const store = useProjectsStore()
const selectedCategory = ref(null)

const categories = [
  {value: null, label: '전체'},
  {value: 'app', label: '앱'},
  {value: 'web', label: '웹'},
  {value: 'other', label: '기타'},
]

function categoryLabel(value) {
  return categories.find(c => c.value === value)?.label ?? value
}

function selectCategory(value) {
  selectedCategory.value = value
  store.fetchProjects(value)
}

onMounted(() => store.fetchProjects())
</script>