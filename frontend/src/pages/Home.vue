<template>
  <div class="explorer" :class="{ dark: isDark }">

    <!-- ── Navigation ── -->
    <nav class="xnav">
      <div class="xnav-inner">
        <div class="xnav-left">
          <transition name="btn-fade">
            <button v-if="viewState === 'browse'" class="xnav-back" @click="goBack" key="back-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </button>
          </transition>
          <span class="xnav-logo" :class="{ clickable: viewState !== 'folder' }" @click="onLogoClick">folio</span>
          <transition name="crumb">
            <span v-if="viewState === 'browse' && currentFile" class="xnav-crumb" :key="currentFile.section">
              / {{ currentFile.section }}
            </span>
          </transition>
        </div>
        <div class="xnav-right">
          <RouterLink to="/about" class="xnav-link">About</RouterLink>
          <button @click="toggleDark" class="xnav-dark">
            <span v-if="isDark">&#9728;&#65039;</span>
            <span v-else>&#127769;</span>
          </button>
        </div>
      </div>
    </nav>

    <!-- ── Scene ── -->
    <div class="scene">

      <!-- ═══ STATE 0 : Big Folder (Landing) ═══ -->
      <transition name="folder-out">
        <div v-if="viewState === 'folder'" class="folder-stage" key="folder">
          <div
            class="big-folder"
            :class="{ hovered: folderHover }"
            @mouseenter="folderHover = true"
            @mouseleave="folderHover = false"
            @click="openBrowse"
          >
            <div class="bf-tab"><span class="bf-tab-label">Projects</span></div>
            <div class="bf-body">
              <div class="bf-peek">
                <div class="bf-doc bf-doc-3">
                  <div class="pk w55"/><div class="pk w75"/><div class="pk w40"/>
                  <div class="pk w60"/><div class="pk w80"/><div class="pk w45"/>
                  <div class="pk w70"/><div class="pk w50"/><div class="pk w65"/>
                </div>
                <div class="bf-doc bf-doc-2">
                  <div class="pk w70"/><div class="pk w50"/><div class="pk w90"/>
                  <div class="pk w65"/><div class="pk w40"/><div class="pk w80"/>
                  <div class="pk w55"/><div class="pk w70"/><div class="pk w45"/>
                </div>
                <div class="bf-doc bf-doc-1">
                  <div class="pk w60"/><div class="pk w80"/><div class="pk w40"/>
                  <div class="pk w70"/><div class="pk w90"/><div class="pk w50"/>
                  <div class="pk w75"/><div class="pk w60"/><div class="pk w45"/>
                  <div class="pk w80"/>
                </div>
              </div>
              <div class="bf-front"/>
            </div>
          </div>
          <p class="bf-hint" :class="{ visible: folderHover }">click to explore</p>
        </div>
      </transition>

      <!-- ═══ STATE 1 : Browse (top-down file flip) ═══ -->
      <transition name="browse-in">
        <div v-if="viewState === 'browse'" class="browse-stage" key="browse">

          <!-- Tilted area (looking-down perspective) -->
          <div class="browse-tilt">
            <div class="fstack-wrap">

              <!-- Left side: section tab + previous file tabs -->
              <div class="left-tabs">
                <transition name="tab-swap" mode="out-in">
                  <div v-if="currentFile" class="section-tab" :key="currentFile.section">
                    <span class="section-tab-label">{{ currentFile.section }}</span>
                  </div>
                </transition>
                <div class="prev-tabs">
                  <transition-group name="tab-list">
                    <div
                      v-for="tab in prevTabs"
                      :key="tab.index"
                      class="prev-tab"
                      :style="{ '--ti': tab.offset }"
                      @click="goToFile(tab.index)"
                    >
                      <span class="prev-tab-name">{{ tab.label }}</span>
                      <span class="prev-tab-num">{{ String(tab.index + 1).padStart(2, '0') }}</span>
                    </div>
                  </transition-group>
                </div>
              </div>

              <!-- Peek tabs of upcoming files (right) -->
              <div class="peek-tabs">
                <transition-group name="tab-list">
                  <div
                    v-for="tab in peekTabs"
                    :key="tab.index"
                    class="peek-tab"
                    :style="{ '--ti': tab.offset }"
                    @click="goToFile(tab.index)"
                  >
                    <span class="peek-tab-num">{{ String(tab.index + 1).padStart(2, '0') }}</span>
                    <span class="peek-tab-name">{{ tab.label }}</span>
                  </div>
                </transition-group>
              </div>

              <!-- Main file stack -->
              <div class="fstack">
                <!-- Stack shadow layers (physical depth) -->
                <div class="fstack-depth">
                  <div class="fstack-layer l1"/>
                  <div class="fstack-layer l2"/>
                  <div class="fstack-layer l3"/>
                </div>

                <!-- Current file sheet (flippable) -->
                <transition :name="'flip-' + flipDir">
                  <div v-if="currentFile" class="fsheet" :key="currentIndex">
                    <div class="fsheet-scroll">
                      <div class="fsheet-head">
                        <span class="fsheet-cat">{{ currentFile.project.category }}</span>
                        <span class="fsheet-idx">{{ String(currentIndex + 1).padStart(2, '0') }}</span>
                      </div>

                      <h1 class="fsheet-title">{{ currentFile.project.title }}</h1>

                      <div v-if="currentFile.project.githubUrl || currentFile.project.demoUrl" class="fsheet-links">
                        <a v-if="currentFile.project.githubUrl" :href="currentFile.project.githubUrl" target="_blank" class="fsheet-link">GitHub &rarr;</a>
                        <a v-if="currentFile.project.demoUrl" :href="currentFile.project.demoUrl" target="_blank" class="fsheet-link outline">Demo &rarr;</a>
                      </div>

                      <div v-if="currentFile.project.thumbnailUrl" class="fsheet-thumb">
                        <img :src="currentFile.project.thumbnailUrl" :alt="currentFile.project.title"/>
                      </div>

                      <p class="fsheet-desc">{{ currentFile.project.description }}</p>

                      <div v-if="currentFile.project.techStack?.length" class="fsheet-section">
                        <h3 class="fsheet-label">Tech Stack</h3>
                        <div class="fsheet-pills">
                          <span v-for="t in currentFile.project.techStack" :key="t" class="fsheet-pill">{{ t }}</span>
                        </div>
                      </div>

                      <div v-if="currentFile.project.images?.length" class="fsheet-section">
                        <h3 class="fsheet-label">Gallery</h3>
                        <div class="fsheet-gallery">
                          <div v-for="img in currentFile.project.images" :key="img.id" class="fsheet-gimg" @click.stop="lightboxUrl = img.imageUrl">
                            <img :src="img.imageUrl"/>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
          </div>

          <!-- Navigation controls (flat, not tilted) -->
          <div class="browse-nav">
            <button class="nav-btn" :disabled="currentIndex <= 0" @click="prevFile">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <div class="nav-counter">
              <span class="nav-cur">{{ currentIndex + 1 }}</span>
              <span class="nav-sep">/</span>
              <span class="nav-tot">{{ allFiles.length }}</span>
            </div>
            <button class="nav-btn" :disabled="currentIndex >= allFiles.length - 1" @click="nextFile">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>
        </div>
      </transition>
    </div>

    <!-- ── Lightbox ── -->
    <Teleport to="body">
      <transition name="lb">
        <div v-if="lightboxUrl" class="lightbox" @click="lightboxUrl = null">
          <img :src="lightboxUrl"/>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useProjectsStore } from '@/stores/projects'

const router = useRouter()

const store = useProjectsStore()
const isDark = ref(document.documentElement.classList.contains('dark'))

/* ── Secret admin access (5 rapid taps on logo) ── */
let tapCount = 0
let tapTimer = null
function onLogoClick() {
  tapCount++
  clearTimeout(tapTimer)
  if (tapCount >= 5) {
    tapCount = 0
    router.push('/admin/login')
    return
  }
  tapTimer = setTimeout(() => { tapCount = 0 }, 800)
  if (viewState.value !== 'folder') goHome()
}

/* ── State ── */
const viewState = ref('folder')   // 'folder' | 'browse'
const folderHover = ref(false)
const currentIndex = ref(0)
const flipDir = ref('next')
const lightboxUrl = ref(null)

/* ── Data ── */
const sections = computed(() => {
  const s = new Set(store.projects.map(p => p.section || 'General'))
  return [...s]
})

function projectsInSection(sec) {
  return store.projects.filter(p => (p.section || 'General') === sec)
}

// Flat ordered list: every project as a "file"
const allFiles = computed(() => {
  const files = []
  for (const sec of sections.value) {
    for (const p of projectsInSection(sec)) {
      files.push({ project: p, section: sec })
    }
  }
  return files
})

const currentFile = computed(() => allFiles.value[currentIndex.value] || null)

// Tabs of upcoming files peeking behind current (right)
const peekTabs = computed(() => {
  const tabs = []
  const end = Math.min(currentIndex.value + 6, allFiles.value.length)
  for (let i = currentIndex.value + 1; i < end; i++) {
    tabs.push({
      label: allFiles.value[i].project.title,
      index: i,
      offset: i - currentIndex.value - 1,
    })
  }
  return tabs
})

// Tabs of previous files (left)
const prevTabs = computed(() => {
  const tabs = []
  const start = Math.max(currentIndex.value - 5, 0)
  for (let i = currentIndex.value - 1; i >= start; i--) {
    tabs.push({
      label: allFiles.value[i].project.title,
      index: i,
      offset: currentIndex.value - 1 - i,
    })
  }
  return tabs
})

/* ── Actions ── */
function toggleDark() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

function openBrowse() {
  currentIndex.value = 0
  flipDir.value = 'next'
  viewState.value = 'browse'
  folderHover.value = false
}

function nextFile() {
  if (currentIndex.value < allFiles.value.length - 1) {
    flipDir.value = 'next'
    currentIndex.value++
  }
}

function prevFile() {
  if (currentIndex.value > 0) {
    flipDir.value = 'prev'
    currentIndex.value--
  }
}

function goToFile(idx) {
  if (idx === currentIndex.value) return
  flipDir.value = idx > currentIndex.value ? 'next' : 'prev'
  currentIndex.value = idx
}

function goBack() {
  viewState.value = 'folder'
}

function goHome() {
  viewState.value = 'folder'
}

/* ── Keyboard ── */
function onKey(e) {
  if (viewState.value !== 'browse') return
  if (lightboxUrl.value) {
    if (e.key === 'Escape') lightboxUrl.value = null
    return
  }
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); nextFile() }
  if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); prevFile() }
  if (e.key === 'Escape') goBack()
}

onMounted(() => {
  const saved = localStorage.getItem('theme')
  if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true
    document.documentElement.classList.add('dark')
  }
  store.fetchProjects()
  window.addEventListener('keydown', onKey)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKey)
})
</script>

<style scoped>
/* ═══════════════════════════════════════════════════════════════════════════
   VARIABLES
   ═══════════════════════════════════════════════════════════════════════════ */
.explorer {
  --bg: #08080a;
  --surface: #151517;
  --border: rgba(255,255,255,0.06);
  --border-hover: rgba(255,255,255,0.12);
  --text: #f0f0f0;
  --text-sub: #888;
  --text-dim: #555;
  --folder-bg: #1e1e22;
  --folder-front: linear-gradient(180deg, rgba(60,60,66,0.5), rgba(30,30,34,0.95));
  --paper: #faf9f6;
  --paper-stack-1: #f2f1ec;
  --paper-stack-2: #eae9e3;
  --paper-stack-3: #e2e1db;
  --paper-line: #c8c5bc;
  --ink: #1a1a1a;
  --ink-sub: #666;
  --ink-dim: #aaa;

  height: 100vh; overflow: hidden;
  background: var(--bg); color: var(--text);
  font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif;
  transition: background 0.5s;
}

.explorer:not(.dark) {
  --bg: #e8e8ec;
  --surface: #fff;
  --border: rgba(0,0,0,0.07);
  --border-hover: rgba(0,0,0,0.14);
  --text: #1a1a1a;
  --text-sub: #777;
  --text-dim: #aaa;
  --folder-bg: #c8c8cc;
  --folder-front: linear-gradient(180deg, rgba(190,190,196,0.5), rgba(170,170,176,0.95));
}

/* ═══════════════════════════════════════════════════════════════════════════
   NAV
   ═══════════════════════════════════════════════════════════════════════════ */
.xnav {
  position: fixed; top: 0; width: 100%; z-index: 200;
  backdrop-filter: blur(16px) saturate(1.8);
  background: color-mix(in srgb, var(--bg) 82%, transparent);
  border-bottom: 1px solid var(--border);
}
.xnav-inner {
  max-width: 1100px; margin: 0 auto; padding: 0 28px;
  height: 56px; display: flex; align-items: center; justify-content: space-between;
}
.xnav-left { display: flex; align-items: center; gap: 10px; }
.xnav-logo {
  font-weight: 800; font-size: 16px; letter-spacing: -0.03em;
  color: var(--text); user-select: none;
}
.xnav-logo.clickable { cursor: pointer; }
.xnav-logo.clickable:hover { opacity: 0.7; }
.xnav-back {
  width: 32px; height: 32px; border: none;
  background: color-mix(in srgb, var(--text) 6%, transparent);
  color: var(--text-sub); border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all 0.2s;
}
.xnav-back:hover { background: color-mix(in srgb, var(--text) 12%, transparent); color: var(--text); }
.xnav-crumb { font-size: 13px; color: var(--text-dim); font-weight: 500; }
.xnav-right { display: flex; align-items: center; gap: 18px; }
.xnav-link { font-size: 13px; color: var(--text-sub); text-decoration: none; font-weight: 500; transition: color 0.2s; }
.xnav-link:hover { color: var(--text); }
.xnav-dark {
  width: 32px; height: 32px; border: none; background: none; border-radius: 50%;
  display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 14px;
}

/* ═══════════════════════════════════════════════════════════════════════════
   SCENE
   ═══════════════════════════════════════════════════════════════════════════ */
.scene {
  position: absolute; inset: 56px 0 0 0;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
}

/* ═══════════════════════════════════════════════════════════════════════════
   BIG FOLDER (Landing)
   ═══════════════════════════════════════════════════════════════════════════ */
.folder-stage {
  position: absolute; inset: 0;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
}

.big-folder {
  position: relative;
  width: 420px; height: 320px;
  cursor: pointer;
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.big-folder:hover { transform: scale(1.03); }

.bf-tab {
  position: absolute; top: -36px; left: 24px;
  width: 130px; height: 40px;
  background: var(--folder-bg);
  border-radius: 10px 10px 0 0;
  display: flex; align-items: center; justify-content: center; z-index: 1;
}
.bf-tab-label {
  font-size: 11px; font-weight: 600; letter-spacing: 0.12em;
  text-transform: uppercase; color: var(--text-sub);
}

.bf-body {
  position: relative; width: 100%; height: 100%;
  background: var(--folder-bg);
  border-radius: 6px 16px 16px 16px;
  overflow: visible;
}

.bf-front {
  position: absolute; bottom: 0; left: 0; right: 0; height: 55%;
  background: var(--folder-front);
  border-radius: 0 0 16px 16px;
  backdrop-filter: blur(4px); z-index: 10;
  border-top: 1px solid rgba(255,255,255,0.04);
}

/* Peek documents */
.bf-peek {
  position: absolute; bottom: 0; left: 50%;
  transform: translateX(-50%);
  width: 84%; height: 100%; z-index: 4;
}
.bf-doc {
  position: absolute; bottom: 0; width: 100%; height: 92%;
  background: var(--paper);
  border-radius: 6px 6px 0 0;
  padding: 20px 28px;
  box-shadow: 0 -2px 12px rgba(0,0,0,0.1);
  transition: transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease;
}
.bf-doc-1 { z-index: 7; transform: translateY(-36px); opacity: 0.92; transition-delay: 0.02s; }
.bf-doc-2 { z-index: 6; transform: translateY(-20px) rotate(-1.2deg); opacity: 0.78; transition-delay: 0.08s; }
.bf-doc-3 { z-index: 5; transform: translateY(-8px) rotate(1deg); opacity: 0.65; transition-delay: 0.14s; }

.big-folder.hovered .bf-doc-1 { transform: translateY(-170px); opacity: 1; }
.big-folder.hovered .bf-doc-2 { transform: translateY(-115px) rotate(-1.5deg); opacity: 0.9; }
.big-folder.hovered .bf-doc-3 { transform: translateY(-60px) rotate(1.5deg); opacity: 0.78; }

.pk { height: 5px; border-radius: 3px; margin-bottom: 7px; background: var(--paper-line); }
.w40{width:40%}.w45{width:45%}.w50{width:50%}.w55{width:55%}
.w60{width:60%}.w65{width:65%}.w70{width:70%}.w75{width:75%}
.w80{width:80%}.w90{width:90%}

.bf-hint {
  margin-top: 32px; font-size: 12px; letter-spacing: 0.16em;
  text-transform: uppercase; color: var(--text-dim);
  opacity: 0; transform: translateY(-6px);
  transition: opacity 0.3s, transform 0.3s;
}
.bf-hint.visible { opacity: 1; transform: translateY(0); }

/* ═══════════════════════════════════════════════════════════════════════════
   BROWSE (Top-down file flipping)
   ═══════════════════════════════════════════════════════════════════════════ */
.browse-stage {
  position: absolute; inset: 0;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: 24px 20px;
  gap: 24px;
}

/* Subtle top-down tilt */
.browse-tilt {
  flex: 1; display: flex; align-items: center; justify-content: center;
  width: 100%;
  transform: perspective(1600px) rotateX(6deg);
  transform-origin: center 60%;
}

/* Wrapper: holds stack + side tabs */
.fstack-wrap {
  position: relative;
  width: 620px; max-width: 88vw;
}

/* ── Left tabs container ── */
.left-tabs {
  position: absolute;
  left: -1px; top: 24px;
  transform: translateX(-100%);
  z-index: 5;
  display: flex; flex-direction: column;
  gap: 3px;
}

/* ── Section tab (left) ── */
.section-tab {
}
.section-tab-label {
  display: block;
  background: var(--paper-stack-1);
  color: #555;
  padding: 10px 16px;
  border-radius: 10px 0 0 10px;
  font-size: 10px; font-weight: 800;
  text-transform: uppercase; letter-spacing: 0.1em;
  box-shadow: -3px 3px 10px rgba(0,0,0,0.12);
  white-space: nowrap;
}

/* ── Previous file tabs (left, below section tab) ── */
.prev-tabs {
  display: flex; flex-direction: column;
  gap: 3px;
}
.prev-tab {
  display: flex; align-items: center; gap: 8px;
  background: var(--paper-stack-1);
  padding: 6px 10px 6px 14px;
  border-radius: 10px 0 0 10px;
  cursor: pointer;
  box-shadow: -3px 3px 10px rgba(0,0,0,0.1);
  transition: all 0.25s ease;
  max-width: 160px;
  justify-content: flex-end;
}
.prev-tab:hover {
  background: var(--paper);
  max-width: 200px;
  box-shadow: -3px 3px 16px rgba(0,0,0,0.18);
}
.prev-tab-num {
  font-size: 11px; font-weight: 800; color: #999;
  flex-shrink: 0;
}
.prev-tab-name {
  font-size: 10px; font-weight: 600; color: #777;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}

/* ── Peek tabs (right) ── */
.peek-tabs {
  position: absolute;
  right: -1px; top: 48px;
  transform: translateX(100%);
  display: flex; flex-direction: column;
  gap: 3px; z-index: 5;
}

.peek-tab {
  display: flex; align-items: center; gap: 8px;
  background: var(--paper-stack-1);
  padding: 6px 14px 6px 10px;
  border-radius: 0 10px 10px 0;
  cursor: pointer;
  box-shadow: 3px 3px 10px rgba(0,0,0,0.1);
  transition: all 0.25s ease;
  max-width: 160px;
}
.peek-tab:hover {
  background: var(--paper);
  max-width: 200px;
  box-shadow: 3px 3px 16px rgba(0,0,0,0.18);
}
.peek-tab-num {
  font-size: 11px; font-weight: 800; color: #999;
  flex-shrink: 0;
}
.peek-tab-name {
  font-size: 10px; font-weight: 600; color: #777;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}

/* ── File stack ── */
.fstack {
  position: relative; width: 100%;
}

/* Physical depth layers behind current sheet */
.fstack-depth {
  position: absolute; inset: 0;
  pointer-events: none;
}
.fstack-layer {
  position: absolute; left: 0; right: 0; top: 0; bottom: 0;
  border-radius: 10px;
}
.fstack-layer.l1 {
  background: var(--paper-stack-1);
  transform: translate(2px, 4px); z-index: -1;
}
.fstack-layer.l2 {
  background: var(--paper-stack-2);
  transform: translate(4px, 8px); z-index: -2;
}
.fstack-layer.l3 {
  background: var(--paper-stack-3);
  transform: translate(6px, 12px); z-index: -3;
}

/* ── File sheet (paper document) ── */
.fsheet {
  position: relative;
  width: 100%;
  background: var(--paper);
  border-radius: 10px;
  box-shadow:
    0 1px 0 rgba(0,0,0,0.04),
    0 8px 30px rgba(0,0,0,0.12),
    0 30px 60px rgba(0,0,0,0.08);
  overflow: hidden;
}

.fsheet-scroll {
  max-height: calc(100vh - 240px);
  overflow-y: auto;
  padding: 32px 40px 44px;
  scrollbar-width: thin;
  scrollbar-color: rgba(0,0,0,0.15) transparent;
}

/* ── Paper content (always dark-on-light, like real paper) ── */
.fsheet-head {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 20px;
  padding-bottom: 14px;
  border-bottom: 1px solid rgba(0,0,0,0.06);
}
.fsheet-cat {
  font-size: 10px; font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.1em;
  color: var(--ink-dim);
  background: rgba(0,0,0,0.04);
  padding: 4px 10px; border-radius: 5px;
}
.fsheet-idx {
  font-size: 13px; font-weight: 700; color: #ccc;
  font-variant-numeric: tabular-nums;
}

.fsheet-title {
  font-size: 28px; font-weight: 800;
  color: var(--ink); letter-spacing: -0.02em;
  line-height: 1.2; margin-bottom: 18px;
}

.fsheet-links {
  display: flex; gap: 8px; margin-bottom: 22px;
}
.fsheet-link {
  font-size: 12px; font-weight: 600; padding: 8px 18px;
  border-radius: 8px; text-decoration: none;
  background: var(--ink); color: #fff;
  transition: opacity 0.2s;
}
.fsheet-link:hover { opacity: 0.8; }
.fsheet-link.outline {
  background: none; border: 1px solid #ddd; color: var(--ink-sub);
}

.fsheet-thumb {
  border-radius: 10px; overflow: hidden;
  margin-bottom: 22px; background: #eee;
}
.fsheet-thumb img {
  width: 100%; display: block;
  object-fit: cover; max-height: 320px;
}

.fsheet-desc {
  font-size: 15px; line-height: 1.8;
  color: var(--ink-sub);
  white-space: pre-line;
  margin-bottom: 28px;
}

.fsheet-section { margin-bottom: 28px; }
.fsheet-label {
  font-size: 10px; font-weight: 700;
  letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--ink-dim); margin-bottom: 12px;
}

.fsheet-pills { display: flex; flex-wrap: wrap; gap: 6px; }
.fsheet-pill {
  padding: 5px 12px; border-radius: 7px; font-size: 12px;
  border: 1px solid #ddd; color: var(--ink-sub);
}

.fsheet-gallery {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;
}
.fsheet-gimg {
  border-radius: 8px; overflow: hidden;
  cursor: pointer; background: #eee;
}
.fsheet-gimg img {
  width: 100%; display: block; object-fit: cover;
  transition: transform 0.3s;
}
.fsheet-gimg:hover img { transform: scale(1.05); }

/* ── Navigation controls ── */
.browse-nav {
  display: flex; align-items: center; gap: 16px;
  flex-shrink: 0;
}

.nav-btn {
  width: 44px; height: 44px; border: none;
  background: color-mix(in srgb, var(--text) 6%, transparent);
  color: var(--text-sub); border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all 0.2s;
}
.nav-btn:hover:not(:disabled) {
  background: color-mix(in srgb, var(--text) 14%, transparent);
  color: var(--text);
}
.nav-btn:disabled { opacity: 0.25; cursor: default; }

.nav-counter {
  display: flex; align-items: baseline; gap: 4px;
  font-variant-numeric: tabular-nums;
  min-width: 60px; justify-content: center;
}
.nav-cur { font-size: 18px; font-weight: 800; color: var(--text); }
.nav-sep { font-size: 13px; color: var(--text-dim); margin: 0 2px; }
.nav-tot { font-size: 13px; color: var(--text-dim); font-weight: 500; }

/* ═══════════════════════════════════════════════════════════════════════════
   TRANSITIONS
   ═══════════════════════════════════════════════════════════════════════════ */
/* Folder exit */
.folder-out-leave-active { transition: opacity 0.4s ease, transform 0.5s cubic-bezier(0.4,0,0.2,1); }
.folder-out-leave-to { opacity: 0; transform: scale(1.1) translateY(-20px); }

/* Browse enter / exit */
.browse-in-enter-active { transition: opacity 0.5s ease 0.25s, transform 0.6s cubic-bezier(0.22,1,0.36,1) 0.25s; }
.browse-in-enter-from { opacity: 0; transform: translateY(40px) scale(0.97); }
.browse-in-leave-active { transition: opacity 0.3s ease, transform 0.35s ease; }
.browse-in-leave-to { opacity: 0; transform: translateY(30px) scale(0.97); }

/* File flip: NEXT (lift current up, new rises from stack) */
.flip-next-enter-active { transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1); }
.flip-next-leave-active { transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1); position: absolute; left: 0; right: 0; top: 0; z-index: 5; }
.flip-next-enter-from { opacity: 0; transform: translateY(14px) scale(0.99); }
.flip-next-leave-to { opacity: 0; transform: translateY(-70px) scale(1.01) rotateX(3deg); }

/* File flip: PREV (drop from above, current sinks) */
.flip-prev-enter-active { transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1); z-index: 5; }
.flip-prev-leave-active { transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1); position: absolute; left: 0; right: 0; top: 0; }
.flip-prev-enter-from { opacity: 0; transform: translateY(-50px) scale(1.01) rotateX(3deg); }
.flip-prev-leave-to { opacity: 0; transform: translateY(14px) scale(0.99); }

/* Tab swap */
.tab-swap-enter-active { transition: opacity 0.25s ease, transform 0.25s ease; }
.tab-swap-enter-from { opacity: 0; transform: translateX(-6px); }
.tab-swap-leave-active { transition: opacity 0.15s ease; }
.tab-swap-leave-to { opacity: 0; }

/* Tab list (peek tabs) */
.tab-list-enter-active { transition: all 0.3s ease; }
.tab-list-leave-active { transition: all 0.2s ease; }
.tab-list-enter-from { opacity: 0; transform: translateX(-8px); }
.tab-list-leave-to { opacity: 0; transform: translateX(-8px); }
.tab-list-move { transition: transform 0.3s ease; }

/* Nav back button */
.btn-fade-enter-active { transition: opacity 0.3s ease 0.1s, transform 0.3s ease 0.1s; }
.btn-fade-enter-from { opacity: 0; transform: translateX(-6px); }
.btn-fade-leave-active { transition: opacity 0.15s; }
.btn-fade-leave-to { opacity: 0; }

/* Breadcrumb */
.crumb-enter-active { transition: opacity 0.3s ease 0.2s, transform 0.3s ease 0.2s; }
.crumb-enter-from { opacity: 0; transform: translateX(-8px); }
.crumb-leave-active { transition: opacity 0.15s; }
.crumb-leave-to { opacity: 0; }

/* Lightbox */
.lb-enter-active { transition: opacity 0.3s; }
.lb-enter-from { opacity: 0; }
.lb-leave-active { transition: opacity 0.25s; }
.lb-leave-to { opacity: 0; }

/* ═══════════════════════════════════════════════════════════════════════════
   LIGHTBOX
   ═══════════════════════════════════════════════════════════════════════════ */
.lightbox {
  position: fixed; inset: 0; z-index: 500;
  background: rgba(0,0,0,0.92);
  display: flex; align-items: center; justify-content: center;
  padding: 24px; cursor: zoom-out;
}
.lightbox img { max-width: 100%; max-height: 100%; border-radius: 12px; object-fit: contain; }

/* ═══════════════════════════════════════════════════════════════════════════
   RESPONSIVE
   ═══════════════════════════════════════════════════════════════════════════ */
@media (max-width: 700px) {
  .big-folder { width: 300px; height: 230px; }
  .bf-tab { width: 100px; height: 32px; top: -28px; }
  .bf-tab-label { font-size: 10px; }
  .big-folder.hovered .bf-doc-1 { transform: translateY(-110px); }
  .big-folder.hovered .bf-doc-2 { transform: translateY(-75px) rotate(-1.5deg); }
  .big-folder.hovered .bf-doc-3 { transform: translateY(-40px) rotate(1.5deg); }

  .fstack-wrap { max-width: 94vw; }
  .fsheet-scroll { padding: 24px 22px 32px; max-height: calc(100vh - 200px); }
  .fsheet-title { font-size: 22px; }
  .fsheet-gallery { grid-template-columns: 1fr; }

  .left-tabs { display: none; }
  .peek-tabs { display: none; }

  .browse-tilt { transform: perspective(1600px) rotateX(3deg); }
}

@media (max-width: 440px) {
  .xnav-inner { padding: 0 16px; }
  .fsheet-scroll { padding: 20px 18px 28px; }
  .fsheet-title { font-size: 20px; }
  .fsheet-desc { font-size: 14px; }
}
</style>
