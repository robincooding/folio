<template>
  <div class="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300">

    <!-- 네비게이션 -->
    <nav class="fixed top-0 w-full z-50 backdrop-blur-xl saturate-[1.8] bg-white/80 dark:bg-zinc-950/80 border-b border-zinc-100 dark:border-zinc-800">
      <div class="max-w-[1100px] mx-auto px-7 h-14 flex items-center justify-between">
        <RouterLink to="/" class="text-[16px] font-extrabold tracking-[-0.03em] text-zinc-900 dark:text-white">folio</RouterLink>
        <div class="flex items-center gap-5">
          <RouterLink to="/projects" class="nav-link">Projects</RouterLink>
          <RouterLink to="/about" class="text-[13px] font-medium text-zinc-900 dark:text-white">About</RouterLink>
        </div>
      </div>
    </nav>

    <div class="max-w-3xl mx-auto px-6 pt-32 pb-24">

      <!-- 헤더 -->
      <div class="mb-16 fade-up">
        <h1 class="text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-white tracking-tight mb-4">About</h1>
        <p class="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed">
          안녕하세요, 풀스택 개발자를 꿈꾸는 이다은입니다.<br/>
          다양한 주제와 기술로 웹 및 모바일 앱 프로젝트를 진행했습니다.<br/>
          실생활의 문제를 해결하면서도 사용자 경험을 중시하는 서비스를 추구합니다.<br/>
          탄탄한 기본기를 바탕으로 변화하는 기술 흐름을 익히며 역량과 가능성을 넓혀 갑니다.
        </p>
      </div>

      <!-- 프로젝트 -->
      <div class="mb-16 fade-up">
        <h2 class="section-label mb-6">Projects</h2>
        <div class="space-y-6">
          <div v-for="proj in projects" :key="proj.title"
               class="flex gap-6 pb-6 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
            <div class="w-24 shrink-0 text-sm text-zinc-400 dark:text-zinc-600 pt-0.5 leading-relaxed">{{ proj.period }}</div>
            <div>
              <div class="flex items-center gap-2 mb-1 flex-wrap">
                <h3 class="font-semibold text-zinc-900 dark:text-white">{{ proj.title }}</h3>
                <span v-if="proj.badge"
                      class="text-xs px-2 py-0.5 rounded-full border border-zinc-200 dark:border-zinc-700 text-zinc-400 dark:text-zinc-500">
                  {{ proj.badge }}
                </span>
              </div>
              <p class="text-sm text-zinc-400 dark:text-zinc-500 mb-2">{{ proj.subtitle }}</p>
              <p class="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{{ proj.description }}</p>
              <div v-if="proj.links" class="flex gap-3 mt-3">
                <a v-for="link in proj.links" :key="link.label"
                   :href="link.href" target="_blank"
                   class="text-xs text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors underline underline-offset-2">
                  {{ link.label }} →
                </a>
              </div>
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
              <span v-for="skill in group.skills" :key="skill" class="tag-pill">
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

const projects = [
  {
    period: '2022.03 - 2022.11, 리팩토링 예정',
    title: 'we:plant',
    subtitle: '식물 추천 웹 애플리케이션 · 팀 프로젝트 (3인)',
    description:
        '사용자 환경과 취향을 기반으로 식물을 추천하는 ML 기반 웹 서비스입니다. ' +
        '프론트엔드 개발을 맡아 HTML/CSS/JS로 UI 전반을 설계하고 구현했으며, ' +
        'Python 기반 추천 모델과 Java/Spring Boot 백엔드와의 연동을 담당했습니다.',
    links: [
      { label: 'GitHub', href: '준비중(리팩토링)' },
    ],
  },
  {
    period: '2025.12 - 2026.03',
    title: 'palette michi',
    subtitle: '일본 여행 큐레이션 모바일 앱 · 개인 프로젝트',
    description:
        '동행 유형·분위기·일정 밀도를 입력하면 AI가 맞춤 여행 일정을 생성해 주는 Flutter 앱입니다. ' +
        'Firebase/Firestore, Gemini 2.5 Flash, Google Places API를 연동하여 ' +
        '일본의 도시 데이터베이스 기반의 실시간 큐레이션 기능을 구현했습니다.',
    links: [
      { label: 'GitHub', href: 'https://github.com/robincooding/palette-michi' },
    ],
  },
  {
    period: '2022.07 - 2022.08, 리팩토링(2026.03)',
    title: 'stockholm',
    subtitle: '주가 데이터 분석 웹 애플리케이션 · 개인 프로젝트',
    description:
        'KRX·Naver Finance·Yahoo Finance 데이터를 수집해 기술적 지표 분석 및 백테스팅을 수행하는 웹 서비스입니다. ' +
        'Python 분석 엔진 위에 FastAPI 백엔드와 React/Vite/Tailwind 프론트엔드를 구축하고, ' +
        '켈리 기준·트레일링 스탑 등 리스크 관리 전략을 직접 설계·구현했습니다.',
    links: [
      { label: 'GitHub', href: 'https://github.com/robincooding/stockholm' },
    ],
  },
  {
    period: '2026.03 - ',
    title: 'folio',
    subtitle: '포트폴리오 사이트 · 개인 프로젝트',
    badge: '개발 중',
    description:
        '현재 보고 계신 이 사이트입니다. Vue.js 3 + Vite + Tailwind CSS 프론트엔드와 ' +
        'Node.js/Express/Prisma/PostgreSQL 백엔드로 구성되며, ' +
        'Vercel + Railway 환경에 배포되어 있습니다. 프로젝트와 함께 계속 발전시켜 나가고 있습니다.',
    links: [
      { label: 'GitHub', href: 'https://github.com/robincooding/folio' },
      { label: 'Live', href: 'https://folio-one-nu.vercel.app' },
    ],
  },
]

const skillGroups = [
  {
    category: 'Mobile',
    skills: ['Flutter', 'Dart', 'Firebase', 'Riverpod'],
  },
  {
    category: 'Frontend',
    skills: ['Vue.js 3', 'React', 'Vite', 'Tailwind CSS', 'JavaScript'],
  },
  {
    category: 'Backend',
    skills: ['Node.js', 'Express', 'FastAPI', 'Python', 'Java', 'Spring Boot'],
  },
  {
    category: 'Data',
    skills: ['Pandas', 'PostgreSQL', 'MySQL', 'Prisma'],
  },
  {
    category: 'Infra / Tools',
    skills: ['AWS S3', 'Vercel', 'Railway', 'Git'],
  },
]

const contacts = [
  { icon: '🐙', label: 'github.com/robincooding', href: 'https://github.com/robincooding' },
]
</script>