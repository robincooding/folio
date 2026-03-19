<template>
  <div class="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300">

    <!-- Navigation -->
    <nav
        class="fixed top-0 w-full z-50 backdrop-blur-md bg-white/80 dark:bg-zinc-950/80 border-b border-zinc-100 dark:border-zinc-800">
      <div class="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <RouterLink to="/" class="font-semibold text-zinc-900 dark:text-white tracking-tight">folio</RouterLink>
        <RouterLink to="/projects" class="nav-link">
          ← Projects
        </RouterLink>
      </div>
    </nav>

    <!-- Loading -->
    <div v-if="store.loading" class="max-w-3xl mx-auto px-6 pt-32 pb-24 animate-pulse space-y-6">
      <div class="h-8 w-2/3 bg-zinc-100 dark:bg-zinc-800 rounded"/>
      <div class="h-72 bg-zinc-100 dark:bg-zinc-800 rounded-2xl"/>
      <div class="space-y-3">
        <div class="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-full"/>
        <div class="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-4/5"/>
      </div>
    </div>

    <!-- No Project -->
    <div v-else-if="!store.currentProject" class="max-w-3xl mx-auto px-6 pt-32 text-center">
      <p class="text-4xl mb-4">🔍</p>
      <p class="text-zinc-400">프로젝트를 찾을 수 없어요.</p>
      <RouterLink to="/projects" class="mt-4 inline-block text-sm text-indigo-500 hover:underline">목록으로 돌아가기
      </RouterLink>
    </div>

    <!-- Project Details -->
    <article v-else class="max-w-3xl mx-auto px-6 pt-32 pb-24 fade-up">

      <!-- Meta Data -->
      <div class="mb-6">
        <span
            class="text-xs px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 font-medium">
          {{ categoryLabel(store.currentProject.category) }}
        </span>
      </div>

      <!-- Title -->
      <h1 class="text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-white tracking-tight mb-4">
        {{ store.currentProject.title }}
      </h1>

      <!-- Link Buttons -->
      <div class="flex gap-3 mb-10">
        <a v-if="store.currentProject.githubUrl" :href="store.currentProject.githubUrl" target="_blank"
           class="btn-primary">
          GitHub →
        </a>
        <a v-if="store.currentProject.demoUrl" :href="store.currentProject.demoUrl" target="_blank"
           class="btn-secondary">
          데모 보기 →
        </a>
      </div>

      <!-- Thumbnails -->
      <div class="rounded-2xl overflow-hidden mb-10 bg-zinc-100 dark:bg-zinc-900">
        <img v-if="store.currentProject.thumbnailUrl"
             :src="store.currentProject.thumbnailUrl"
             :alt="store.currentProject.title"
             class="w-full object-cover max-h-96"/>
        <div v-else class="h-64 flex items-center justify-center text-6xl">📁</div>
      </div>

      <!-- Descriptions -->
      <div class="prose dark:prose-invert max-w-none mb-10">
        <p class="text-zinc-600 dark:text-zinc-300 leading-relaxed text-lg whitespace-pre-line">
          {{ store.currentProject.description }}
        </p>
      </div>

      <!-- Tech Stacks -->
      <div class="mb-10">
        <h2 class="section-label mb-4">Tech Stack</h2>
        <div class="flex flex-wrap gap-2">
          <span v-for="tech in store.currentProject.techStack" :key="tech"
                class="px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-600 dark:text-zinc-400">
            {{ tech }}
          </span>
        </div>
      </div>

      <!-- Image Gallery -->
      <div v-if="store.currentProject.images?.length" class="mb-10">
        <h2 class="section-label mb-4">Gallery</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div v-for="img in store.currentProject.images" :key="img.id"
               class="rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 cursor-pointer"
               @click="openImage(img.imageUrl)">
            <img :src="img.imageUrl" class="w-full object-cover hover:scale-105 transition-transform duration-300"/>
          </div>
        </div>
      </div>

      <!-- Bottom Navigation -->
      <div class="pt-8 border-t border-zinc-100 dark:border-zinc-800">
        <RouterLink to="/projects" class="text-sm text-indigo-500 hover:underline">← 모든 프로젝트 보기</RouterLink>
      </div>

    </article>

    <!-- Image LightBox -->
    <Teleport to="body">
      <div v-if="lightboxUrl" @click="lightboxUrl = null"
           class="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-6 cursor-zoom-out">
        <img :src="lightboxUrl" class="max-w-full max-h-full rounded-xl object-contain"/>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import {RouterLink, useRoute} from 'vue-router'
import {useProjectsStore} from '@/stores/projects'

const route = useRoute()
const store = useProjectsStore()
const lightboxUrl = ref(null)

const categories = [
  {value: 'app', label: '앱'},
  {value: 'web', label: '웹'},
  {value: 'other', label: '기타'},
]

function categoryLabel(value) {
  return categories.find(c => c.value === value)?.label ?? value
}

function openImage(url) {
  lightboxUrl.value = url
}

onMounted(() => {
  store.fetchProject(route.params.id)
})
</script>