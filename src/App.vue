<template>
  <div class="min-h-screen relative select-none">
    <!-- Scanlines -->
    <div class="scanlines-overlay" />
    <!-- Ambient glow -->
    <div class="fixed inset-0 pointer-events-none"
      style="background: radial-gradient(ellipse 80% 40% at 50% 0%, rgba(80,40,160,0.12) 0%, transparent 60%)" />

    <TopBar />

    <!-- ═══════════════ HEADER ═══════════════ -->
    <header class="sticky top-[30px] z-50 border-b"
      style="background: rgba(10,8,20,0.97); backdrop-filter: blur(10px);
             border-color: rgba(167,139,250,0.12);
             box-shadow: 0 1px 0 rgba(167,139,250,0.06), 0 4px 24px rgba(0,0,0,0.7)">
      <div class="px-5 py-2 flex items-center gap-3 flex-wrap">

        <!-- NASA logo + Mission name -->
        <div class="flex items-center gap-3 flex-shrink-0">
          <svg width="36" height="36" viewBox="0 0 36 36" aria-label="NASA">
            <circle cx="18" cy="18" r="17" fill="#0b3d91" stroke="#fc3d21" stroke-width="1.5"/>
            <text x="18" y="22" text-anchor="middle" font-size="7.5" font-weight="bold"
              font-family="Arial,sans-serif" fill="white" letter-spacing="0.8">NASA</text>
            <ellipse cx="18" cy="18" rx="16" ry="5.5" fill="none" stroke="#fc3d21" stroke-width="1.3"
              transform="rotate(-28 18 18)" opacity="0.8"/>
          </svg>
          <div>
            <div class="text-white font-black tracking-widest text-sm leading-tight"
              style="font-family:'Orbitron',monospace; letter-spacing:.2em">
              ARTEMIS II — MISSION CONTROL
            </div>
            <div class="flex items-center gap-2 mt-0.5 flex-wrap">
              <span class="text-[9px] mono tracking-widest" style="color:#4e4470">@</span>
              <StatusBadge :label="overallStatus"  :color="overallColor.color"  :shadow="overallColor.shadow" />
              <span class="text-[9px]" style="color:#2a2040">·</span>
              <StatusBadge label="CREW"  :suffix="crewStatus"    :color="crewColor.color"    :shadow="crewColor.shadow" />
              <span class="text-[9px]" style="color:#2a2040">·</span>
              <StatusBadge label="VEH"   :suffix="vehicleStatus" :color="vehicleColor.color" :shadow="vehicleColor.shadow" />
            </div>
          </div>
        </div>

        <div class="w-px h-7 flex-shrink-0" style="background:rgba(167,139,250,0.12)" />

        <!-- Status dot -->
        <div class="flex items-center gap-2 flex-shrink-0">
          <div class="status-dot"
            :class="overallStatus === 'NOMINAL' ? '' : overallStatus === 'CRITICAL' ? 'red' : 'amber'" />
          <span class="mono text-xs font-bold tracking-widest"
            :style="{ color: overallColor.color, textShadow: `0 0 10px ${overallColor.shadow}` }">
            {{ overallStatus }}
          </span>
        </div>

        <div class="flex-1" />

        <!-- ── Countdown to splashdown ── -->
        <div v-if="splashdownCountdown" class="flex-shrink-0 text-right hidden sm:block">
          <div class="text-[9px] mono uppercase tracking-widest" style="color:#4e4470">
            {{ splashdownPast ? 'MISIÓN COMPLETADA' : 'T- AMERIZAJE' }}
          </div>
          <div class="mono text-sm font-bold leading-tight"
            :style="{ color: splashdownPast ? '#34d399' : '#fbbf24',
                      textShadow: splashdownPast ? '0 0 10px rgba(52,211,153,0.5)' : '0 0 10px rgba(251,191,36,0.5)' }">
            {{ splashdownCountdown }}
          </div>
        </div>

        <div class="w-px h-7 flex-shrink-0 hidden sm:block" style="background:rgba(167,139,250,0.12)" />

        <!-- UTC + MET -->
        <div class="text-right flex-shrink-0">
          <div class="mono text-sm text-white font-semibold tracking-widest">{{ headerDate }} {{ utc }} UTC</div>
          <div class="mono text-xs tracking-widest" style="color:#a78bfa">MET {{ met }}</div>
        </div>

        <div class="w-px h-7 flex-shrink-0" style="background:rgba(167,139,250,0.12)" />

        <!-- Fullscreen button -->
        <button @click="toggleFullscreen"
          class="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded border transition-all"
          style="border-color:rgba(167,139,250,0.18); background:rgba(167,139,250,0.04); color:rgba(167,139,250,0.5)"
          @mouseenter="e=>{ e.currentTarget.style.borderColor='rgba(167,139,250,0.45)'; e.currentTarget.style.color='rgba(167,139,250,0.9)' }"
          @mouseleave="e=>{ e.currentTarget.style.borderColor='rgba(167,139,250,0.18)'; e.currentTarget.style.color='rgba(167,139,250,0.5)' }"
          :title="isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'">
          <!-- Expand icon -->
          <svg v-if="!isFullscreen" width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <polyline points="15 3 21 3 21 9"/>
            <polyline points="9 21 3 21 3 15"/>
            <line x1="21" y1="3" x2="14" y2="10"/>
            <line x1="3" y1="21" x2="10" y2="14"/>
          </svg>
          <!-- Compress icon -->
          <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <polyline points="8 3 3 3 3 8"/>
            <polyline points="21 16 21 21 16 21"/>
            <line x1="3" y1="3" x2="10" y2="10"/>
            <line x1="21" y1="21" x2="14" y2="14"/>
          </svg>
        </button>

      </div>
    </header>

    <!-- ═══════════════ GRID ═══════════════ -->
    <main class="px-4 py-3 space-y-3 max-w-[1700px] mx-auto">

      <!-- ROW 1 -->
      <div class="row-1">
        <MissionClock class="r1-left" />
        <TelemetryPanel class="r1-right" :telemetry="telemetry" :dataSource="dataSource" />
      </div>

      <!-- PHASE ALERT -->
      <PhaseAlert />

      <!-- ROW 2 -->
      <div class="row-2">
        <TrajectoryMap class="r2-left" :telemetry="telemetry" />
        <SystemStatus  class="r2-right" />
      </div>

      <!-- ROW 2.5: Live stream + timeline -->
      <div class="row-25">
        <LiveStream class="r25-main" />
        <div class="r25-side space-y-3">
          <MissionTimeline />
        </div>
      </div>

      <!-- ROW 3 -->
      <div class="row-3">
        <CrewPanel  class="r3-a" />
        <AlertsLog  class="r3-b" :spaceWeather="spaceWeather" />
      </div>

      <!-- ROW 4: Distance + DSN Map -->
      <div class="row-4">
        <DistanceGauge class="r4-a" :telemetry="telemetry" :dataSource="dataSource" />
        <DSNMap        class="r4-b" :telemetry="telemetry" />
      </div>

      <!-- INFO CARD -->
      <InfoCard />

    </main>

    <ShareBar />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { h } from 'vue'
import { useMissionData, MISSION_EPOCH } from './composables/useMissionData.js'
import { useSystemStatus } from './composables/useSystemStatus.js'

// Inline component — no template compiler needed
const StatusBadge = {
  props: ['label', 'suffix', 'color', 'shadow'],
  setup(p) {
    return () => h('span', {
      style: `font-family:'Share Tech Mono',monospace; font-size:0.6rem; letter-spacing:0.1em; color:${p.color}; text-shadow:0 0 8px ${p.shadow}; font-weight:700`,
    }, p.suffix ? `${p.label} ${p.suffix}` : p.label)
  }
}
import LiveStream      from './components/LiveStream.vue'
import InfoCard        from './components/InfoCard.vue'
import ShareBar        from './components/ShareBar.vue'
import TopBar          from './components/TopBar.vue'
import MissionClock    from './components/MissionClock.vue'
import TelemetryPanel  from './components/TelemetryPanel.vue'
import TrajectoryMap   from './components/TrajectoryMap.vue'
import SystemStatus    from './components/SystemStatus.vue'
import MissionTimeline from './components/MissionTimeline.vue'
import CrewPanel       from './components/CrewPanel.vue'
import AlertsLog       from './components/AlertsLog.vue'
import DistanceGauge   from './components/DistanceGauge.vue'
import DSNMap          from './components/DSNMap.vue'
import PhaseAlert      from './components/PhaseAlert.vue'

const { telemetry, spaceWeather, newsItems, dataSource, lastUpdate } = useMissionData()
const { vehicleStatus, crewStatus, dispose: disposeStatus } = useSystemStatus()
onUnmounted(disposeStatus)

const STATUS_COLOR = {
  NOMINAL:  { color: '#34d399', shadow: 'rgba(52,211,153,0.5)'  },
  CAUTION:  { color: '#fbbf24', shadow: 'rgba(251,191,36,0.5)'  },
  ADVISORY: { color: '#fbbf24', shadow: 'rgba(251,191,36,0.5)'  },
  CRITICAL: { color: '#f87171', shadow: 'rgba(248,113,113,0.5)' },
}
const vehicleColor  = computed(() => STATUS_COLOR[vehicleStatus.value]  ?? STATUS_COLOR.NOMINAL)
const crewColor     = computed(() => STATUS_COLOR[crewStatus.value]     ?? STATUS_COLOR.NOMINAL)
const overallStatus = computed(() => {
  if (vehicleStatus.value === 'CRITICAL' || crewStatus.value === 'CRITICAL') return 'CRITICAL'
  if (vehicleStatus.value === 'CAUTION'  || crewStatus.value === 'CAUTION')  return 'CAUTION'
  if (vehicleStatus.value === 'ADVISORY' || crewStatus.value === 'ADVISORY') return 'ADVISORY'
  return 'NOMINAL'
})
const overallColor = computed(() => STATUS_COLOR[overallStatus.value] ?? STATUS_COLOR.NOMINAL)

// ── Clock ──────────────────────────────────────────────────────────────────
const now = ref(new Date())
let timer = null
onMounted(() => { timer = setInterval(() => now.value = new Date(), 1000) })
onUnmounted(() => clearInterval(timer))

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const headerDate = computed(() => {
  const d = now.value
  return `${String(d.getUTCDate()).padStart(2,'0')} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`
})
const utc = computed(() => now.value.toISOString().slice(11, 19))
const met = computed(() => {
  const ms = Math.max(0, now.value - MISSION_EPOCH)
  const s = Math.floor(ms / 1000)
  const d = Math.floor(s / 86400)
  const h = Math.floor((s % 86400) / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return `${String(d).padStart(2,'0')}:${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
})

// ── Splashdown countdown ───────────────────────────────────────────────────
// D10 splashdown: 9.5 days after launch epoch
const SPLASHDOWN = new Date(MISSION_EPOCH.getTime() + 9.5 * 86400_000)

const splashdownPast = computed(() => now.value >= SPLASHDOWN)
const splashdownCountdown = computed(() => {
  if (splashdownPast.value) return 'AMERIZADO ✓'
  const diff = Math.floor((SPLASHDOWN - now.value) / 1000)
  const d = Math.floor(diff / 86400)
  const h = Math.floor((diff % 86400) / 3600)
  const m = Math.floor((diff % 3600) / 60)
  const s = diff % 60
  if (d > 0) return `${d}d ${String(h).padStart(2,'0')}h ${String(m).padStart(2,'0')}m`
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
})

// ── Fullscreen ─────────────────────────────────────────────────────────────
const isFullscreen = ref(false)

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {})
    isFullscreen.value = true
  } else {
    document.exitFullscreen().catch(() => {})
    isFullscreen.value = false
  }
}

onMounted(() => {
  document.addEventListener('fullscreenchange', () => {
    isFullscreen.value = !!document.fullscreenElement
  })
})
</script>

<style scoped>
/* ROW 1: 40% / 60% */
.row-1 { display: grid; grid-template-columns: 5fr 7fr; gap: 12px; }

/* ROW 2: 65% / 35% */
.row-2 { display: grid; grid-template-columns: 7fr 5fr; gap: 12px; }

/* ROW 2.5: stream 58% / timeline 42% */
.row-25 { display: grid; grid-template-columns: 7fr 5fr; gap: 12px; }

/* ROW 3: 50/50 */
.row-3 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

/* ROW 4: 60% / 40% */
.row-4 { display: grid; grid-template-columns: 7fr 5fr; gap: 12px; }

@media (max-width: 1100px) {
  .row-1, .row-2, .row-25, .row-4 { grid-template-columns: 1fr; }
  .row-3 { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 680px) {
  .row-1, .row-2, .row-25, .row-3, .row-4 { grid-template-columns: 1fr; }
}
</style>
