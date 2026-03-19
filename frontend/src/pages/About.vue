<template>
  <div class="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300">

    <!-- 네비게이션 -->
    <nav class="fixed top-0 w-full z-50 backdrop-blur-md bg-white/80 dark:bg-zinc-950/80 border-b border-zinc-100 dark:border-zinc-800">
      <div class="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <RouterLink to="/" class="font-semibold text-zinc-900 dark:text-white tracking-tight">folio</RouterLink>
        <div class="flex items-center gap-6">
          <RouterLink to="/projects" class="nav-link">Projects</RouterLink>
          <RouterLink to="/about" class="text-sm text-zinc-900 dark:text-white font-medium">About</RouterLink>
        </div>
      </div>
    </nav>

    <div class="max-w-3xl mx-auto px-6 pt-32 pb-24">

      <!-- 헤더 -->
      <div class="mb-16 fade-up">
        <h1 class="text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-white tracking-tight mb-4">About</h1>
        <p class="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed">
          안녕하세요, Robin입니다.<br/>
          앱과 웹을 만드는 개발자로, 사용자 경험을 중심에 두고 꼼꼼하게 만드는 걸 좋아합니다.
        </p>
      </div>

      <!-- 경력 / 경험 -->
      <div class="mb-16 fade-up">
        <h2 class="section-label mb-6">Experience</h2>
        <div class="space-y-6">
          <div v-for="exp in experiences" :key="exp.title"
               class="flex gap-6 pb-6 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
            <div class="w-24 shrink-0 text-sm text-zinc-400 dark:text-zinc-600 pt-0.5">{{ exp.period }}</div>
            <div>
              <h3 class="font-semibold text-zinc-900 dark:text-white mb-1">{{ exp.title }}</h3>
              <p class="text-sm text-zinc-500 dark:text-zinc-400 mb-2">{{ exp.company }}</p>
              <p class="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{{ exp.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 기술 스택 -->
      <div class="mb-16 fade-up">
        <h2 class="section-label mb-6">Skills</h2>
        <div class="space-y-4">
          <div v-for="group in skillGroups" :key="group.category">
            <p class="text-xs text-zinc-400 dark:text-zinc-600 mb-2">{{ group.category }}</p>
            <div class="flex flex-wrap gap-2">
              <span v-for="skill in group.skills" :key="skill"
                    class="tag-pill">
                {{ skill }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 연락처 -->
      <div class="fade-up">
        <h2 class="section-label mb-6">Contact</h2>
        <div class="flex flex-col gap-3">
          <a v-for="contact in contacts" :key="contact.label"
             :href="contact.href" target="_blank"
             class="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors group">
            <span class="w-5 text-center">{{ contact.icon }}</span>
            <span class="group-hover:underline">{{ contact.label }}</span>
            <span class="text-zinc-400 dark:text-zinc-600">→</span>
          </a>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'

const experiences = [
  {
    period: '2025 —',
    title: 'Palette Michi 개발',
    company: 'REDBREW (개인 프로젝트)',
    description: 'Flutter/Dart 기반 일본 여행 큐레이션 앱. AI 기반 일정 생성, Firebase, Gemini API 활용.'
  },
  // 경력 추가
]

const skillGroups = [
  {
    category: 'Mobile',
    skills: ['Flutter', 'Dart', 'Firebase']
  },
  {
    category: 'Frontend',
    skills: ['Vue.js 3', 'Tailwind CSS', 'JavaScript']
  },
  {
    category: 'Backend',
    skills: ['Node.js', 'Express', 'PostgreSQL', 'Prisma']
  },
  {
    category: 'Infra',
    skills: ['AWS S3', 'Vercel', 'Railway']
  },
]

const contacts = [
  { icon: '🐙', label: 'github.com/robincooding', href: 'https://github.com/robincooding' },
  { icon: '✉️', label: 'hello@robin.dev', href: 'mailto:hello@robin.dev' },
  // 링크 추가
]
</script>