<template>
  <div class="min-h-screen bg-zinc-50 dark:bg-zinc-950">

    <!-- 네비게이션 -->
    <nav class="bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800">
      <div class="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
        <RouterLink to="/admin/projects" class="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
          ← 목록으로
        </RouterLink>
        <span class="font-semibold text-zinc-900 dark:text-white">{{ isEdit ? '프로젝트 수정' : '새 프로젝트' }}</span>
        <div class="w-16"/>
      </div>
    </nav>

    <div class="max-w-3xl mx-auto px-6 py-10">
      <div class="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-8 space-y-6">

        <!-- 제목 -->
        <div>
          <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">프로젝트 이름 *</label>
          <input v-model="form.title" type="text" placeholder="Palette Michi"
                 class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"/>
        </div>

        <!-- 카테고리 -->
        <div>
          <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">카테고리 *</label>
          <div class="flex gap-2">
            <button v-for="cat in categories" :key="cat.value"
                    @click="form.category = cat.value"
                    :class="[
                'px-4 py-2 rounded-full text-sm font-medium transition-all',
                form.category === cat.value
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                  : 'border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400'
              ]">
              {{ cat.label }}
            </button>
          </div>
        </div>

        <!-- 설명 -->
        <div>
          <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">설명 *</label>
          <textarea v-model="form.description" rows="4" placeholder="프로젝트에 대한 설명을 입력해주세요."
                    class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"/>
        </div>

        <!-- 기술 스택 -->
        <div>
          <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">기술 스택</label>
          <div class="flex gap-2 mb-2">
            <input v-model="techInput" type="text" placeholder="Flutter, Vue.js ..."
                   class="flex-1 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                   @keyup.enter="addTech"/>
            <button @click="addTech" class="btn-primary px-4 py-2 text-xs">추가</button>
          </div>
          <div class="flex flex-wrap gap-2">
            <span v-for="(tech, i) in form.techStack" :key="tech"
                  class="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-600 dark:text-zinc-400">
              {{ tech }}
              <button @click="removeTech(i)" class="text-zinc-400 hover:text-red-500 transition-colors">×</button>
            </span>
          </div>
        </div>

        <!-- 썸네일 업로드 -->
        <div>
          <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">썸네일 이미지</label>
          <div class="flex items-center gap-4">
            <div class="w-24 h-24 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0">
              <img v-if="form.thumbnailUrl" :src="form.thumbnailUrl" class="w-full h-full object-cover"/>
              <div v-else class="w-full h-full flex items-center justify-center text-2xl">📷</div>
            </div>
            <div>
              <input ref="thumbInput" type="file" accept="image/*" class="hidden" @change="uploadThumbnail"/>
              <button @click="thumbInput.click()" :disabled="uploading"
                      class="btn-secondary text-xs px-4 py-2">
                {{ uploading ? '업로드 중...' : '이미지 선택' }}
              </button>
            </div>
          </div>
        </div>

        <!-- 섹션 / 표시 순서 -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">섹션 (폴더 탭 이름)</label>
            <input v-model="form.section" type="text" placeholder="General"
                   class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"/>
          </div>
          <div>
            <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">표시 순서</label>
            <input v-model.number="form.displayOrder" type="number" min="0" placeholder="0"
                   class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"/>
          </div>
        </div>

        <!-- GitHub / 데모 링크 -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">GitHub URL</label>
            <input v-model="form.githubUrl" type="url" placeholder="https://github.com/..."
                   class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"/>
          </div>
          <div>
            <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">데모 URL</label>
            <input v-model="form.demoUrl" type="url" placeholder="https://..."
                   class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"/>
          </div>
        </div>

        <!-- 오류 / 저장 버튼 -->
        <div class="pt-2">
          <p v-if="error" class="text-sm text-red-500 mb-4">{{ error }}</p>
          <button @click="submit" :disabled="saving"
                  class="w-full py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-50">
            {{ saving ? '저장 중...' : (isEdit ? '수정 완료' : '프로젝트 등록') }}
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { projectsApi, uploadApi } from '@/api/projects'
import { useProjectsStore } from '@/stores/projects'

const route = useRoute()
const router = useRouter()
const store = useProjectsStore()

const isEdit = computed(() => !!route.params.id)
const thumbInput = ref(null)
const uploading = ref(false)
const saving = ref(false)
const error = ref('')
const techInput = ref('')

const form = ref({
  title: '',
  description: '',
  category: 'web',
  section: 'General',
  displayOrder: 0,
  techStack: [],
  thumbnailUrl: '',
  githubUrl: '',
  demoUrl: '',
})

const categories = [
  { value: 'app', label: '앱' },
  { value: 'web', label: '웹' },
  { value: 'other', label: '기타' },
]

function addTech() {
  const val = techInput.value.trim()
  if (val && !form.value.techStack.includes(val)) {
    form.value.techStack.push(val)
  }
  techInput.value = ''
}

function removeTech(i) {
  form.value.techStack.splice(i, 1)
}

async function uploadThumbnail(e) {
  const file = e.target.files[0]
  if (!file) return
  uploading.value = true
  try {
    const formData = new FormData()
    formData.append('image', file)
    const { data } = await uploadApi.image(formData)
    form.value.thumbnailUrl = data.url
  } catch {
    error.value = '이미지 업로드에 실패했어요.'
  } finally {
    uploading.value = false
  }
}

async function submit() {
  if (!form.value.title || !form.value.description || !form.value.category) {
    error.value = '필수 항목을 모두 입력해주세요.'
    return
  }
  saving.value = true
  error.value = ''
  try {
    if (isEdit.value) {
      await projectsApi.update(route.params.id, form.value)
    } else {
      await projectsApi.create(form.value)
    }
    router.push({ name: 'AdminProjects' })
  } catch {
    error.value = '저장 중 오류가 발생했어요.'
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  if (isEdit.value) {
    await store.fetchProject(route.params.id)
    const p = store.currentProject
    if (p) {
      form.value = {
        title:        p.title,
        description:  p.description,
        category:     p.category,
        section:      p.section ?? 'General',
        displayOrder: p.displayOrder ?? 0,
        techStack:    [...p.techStack],
        thumbnailUrl: p.thumbnailUrl ?? '',
        githubUrl:    p.githubUrl ?? '',
        demoUrl:      p.demoUrl ?? '',
      }
    }
  }
})
</script>