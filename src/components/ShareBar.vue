<template>
  <footer class="border-t mt-2"
    style="border-color: rgba(167,139,250,0.1); background: rgba(2,8,18,0.95)">

    <div class="max-w-[1700px] mx-auto px-5 py-3 flex flex-wrap items-center gap-4">

      <!-- Credits -->
      <div class="flex items-center gap-3">
        <div class="w-px h-6 bg-violet-400/20" />
        <div>
          <div class="text-[9px] mono text-slate-600 uppercase tracking-widest">DESARROLLADO POR</div>
          <a href="https://github.com/PhiRequiem" target="_blank" rel="noopener"
            class="mono font-bold text-sm tracking-widest transition-colors"
            style="color:#a78bfa; text-shadow: 0 0 10px rgba(167,139,250,0.3)"
            @mouseenter="e => e.target.style.textShadow='0 0 16px rgba(167,139,250,0.7)'"
            @mouseleave="e => e.target.style.textShadow='0 0 10px rgba(167,139,250,0.3)'">
            PHIREQUIEM
          </a>
        </div>
        <div class="w-px h-6 bg-violet-400/20" />
      </div>

      <!-- GitHub repo -->
      <a :href="REPO_URL" target="_blank" rel="noopener"
        class="flex items-center gap-2 px-3 py-1.5 rounded border transition-all group"
        style="border-color: rgba(167,139,250,0.2); background: rgba(167,139,250,0.04)"
        @mouseenter="e => e.currentTarget.style.borderColor='rgba(167,139,250,0.45)'"
        @mouseleave="e => e.currentTarget.style.borderColor='rgba(167,139,250,0.2)'">
        <!-- GitHub icon -->
        <svg width="14" height="14" viewBox="0 0 24 24" fill="rgba(167,139,250,0.7)">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/>
        </svg>
        <span class="mono text-[10px] tracking-widest" style="color: rgba(167,139,250,0.8)">DESCARGAR REPO</span>
      </a>

      <div class="flex-1" />

      <!-- Share label -->
      <div class="mono text-[9px] text-slate-600 uppercase tracking-widest">COMPARTIR</div>

      <!-- Share buttons -->
      <div class="flex items-center gap-2">

        <!-- X / Twitter -->
        <button @click="shareX"
          class="share-btn" title="Compartir en X / Twitter">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </button>

        <!-- LinkedIn -->
        <button @click="shareLinkedIn"
          class="share-btn" title="Compartir en LinkedIn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </button>

        <!-- Facebook -->
        <button @click="shareFacebook"
          class="share-btn" title="Facebook">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </button>

        <!-- Instagram — copy link -->
        <button @click="copyForInstagram"
          class="share-btn" title="Copiar para Instagram">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
          </svg>
        </button>

        <!-- TikTok — copy link -->
        <button @click="copyForTikTok"
          class="share-btn" title="Copiar para TikTok">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z"/>
          </svg>
        </button>

      </div>

      <!-- Toast -->
      <transition name="toast">
        <div v-if="toast"
          class="fixed bottom-14 right-5 mono text-xs px-3 py-2 rounded border z-50"
          style="background: rgba(0,20,40,0.95); border-color: rgba(167,139,250,0.3); color: #a78bfa; backdrop-filter: blur(8px)">
          {{ toast }}
        </div>
      </transition>

    </div>

    <!-- Bottom line -->
    <div class="px-5 pb-2 flex flex-wrap items-center gap-x-4 gap-y-1">
      <span class="text-[8px] mono text-slate-700 uppercase tracking-widest">
        BASE TCC · MISSION CONTROL CENTER · HOUSTON TX · ARTEMIS II TEST FLIGHT
      </span>
      <span class="text-[8px] mono text-slate-700">|</span>
      <span class="text-[8px] mono text-slate-700 uppercase tracking-widest">
        DATOS: JPL HORIZONS · NASA DONKI · ARTEMIS BLOG RSS
      </span>
      <span class="text-[8px] mono text-slate-700">|</span>
      <span class="text-[8px] mono text-slate-700 uppercase tracking-widest">
        SYS NOMINAL · ALL GREEN
      </span>
    </div>

  </footer>
</template>

<script setup>
import { ref } from 'vue'

const REPO_URL  = 'https://github.com/PhiRequiem/ARTEMIS-II-MISSION-CONTROL'
const PAGE_URL  = typeof window !== 'undefined' ? window.location.href : REPO_URL
const SHARE_TEXT = '🚀 Siguiendo Artemis II en tiempo real — Dashboard de misión lunar por @PhiRequiem #Artemis2 #NASA #SpaceExploration'

const toast = ref('')
let toastTimer = null

function showToast(msg) {
  toast.value = msg
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => toast.value = '', 2500)
}

function shareX() {
  const url = `https://x.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}&url=${encodeURIComponent(PAGE_URL)}`
  window.open(url, '_blank', 'width=550,height=420')
}

function shareLinkedIn() {
  const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(PAGE_URL)}`
  window.open(url, '_blank', 'width=600,height=520')
}

function shareFacebook() {
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(PAGE_URL)}`, '_blank', 'width=580,height=480')
}

function copyForInstagram() {
  navigator.clipboard.writeText(`${SHARE_TEXT}\n\n${PAGE_URL}`)
    .then(() => showToast('📋 Copiado — pega en Instagram'))
    .catch(() => showToast('No se pudo copiar'))
}

function copyForTikTok() {
  navigator.clipboard.writeText(`${SHARE_TEXT}\n\n${PAGE_URL}`)
    .then(() => showToast('📋 Copiado — pega en TikTok'))
    .catch(() => showToast('No se pudo copiar'))
}
</script>

<style scoped>
.share-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 4px;
  border: 1px solid rgba(255,255,255,0.07);
  background: transparent;
  color: rgba(255,255,255,0.35);
  transition: all 0.18s;
  cursor: pointer;
}
.share-btn:hover {
  color: rgba(255,255,255,0.75);
  border-color: rgba(255,255,255,0.2);
  background: rgba(255,255,255,0.05);
  transform: translateY(-1px);
}

.toast-enter-active, .toast-leave-active { transition: all 0.25s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(6px); }
</style>
