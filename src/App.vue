<template>
  <div class="min-h-screen relative select-none">
    <!-- Scanlines -->
    <div class="scanlines-overlay" />
    <!-- Ambient glow -->
    <div class="fixed inset-0 pointer-events-none"
      style="background: radial-gradient(ellipse 80% 40% at 50% 0%, rgba(80,40,160,0.12) 0%, transparent 60%)" />

    <TopBar />

    <!-- ═══════════════ HEADER ═══════════════ -->
    <header class="sticky top-7.5 z-50 border-b"
      style="background: rgba(10,8,20,0.97); backdrop-filter: blur(10px);
             border-color: rgba(167,139,250,0.12);
             box-shadow: 0 1px 0 rgba(167,139,250,0.06), 0 4px 24px rgba(0,0,0,0.7)">
      <div class="px-5 py-2 flex items-center gap-3 flex-wrap">

        <!-- NASA logo + Mission name -->
        <div class="flex items-center gap-3 shrink-0">
          <svg width="36" height="36" viewBox="0 0 36 36" aria-label="NASA"
            style="cursor:pointer" @click="nasaClick">
            <circle cx="18" cy="18" r="17" fill="#0b3d91" stroke="#fc3d21" stroke-width="1.5"/>
            <text x="18" y="22" text-anchor="middle" font-size="7.5" font-weight="bold"
              font-family="Arial,sans-serif" fill="white" letter-spacing="0.8">NASA</text>
            <ellipse cx="18" cy="18" rx="16" ry="5.5" fill="none" stroke="#fc3d21" stroke-width="1.3"
              transform="rotate(-28 18 18)" opacity="0.8"/>
          </svg>
          <div>
            <div class="text-white font-black tracking-widest text-sm leading-tight"
              style="font-family:'Orbitron',monospace; letter-spacing:.2em"
              :style="{ color: accentColor, textShadow: `0 0 16px ${accentShadow}` }">
              {{ currentMission.name }} — MISSION CONTROL
            </div>
            <div class="flex items-center gap-2 mt-0.5 flex-wrap">
              <template v-if="!isPreLaunch">
                <span class="text-[9px] mono tracking-widest" style="color:#4e4470">@</span>
                <StatusBadge :label="overallStatus"  :color="overallColor.color"  :shadow="overallColor.shadow" />
                <span class="text-[9px]" style="color:#2a2040">·</span>
                <StatusBadge label="CREW"  :suffix="crewStatus"    :color="crewColor.color"    :shadow="crewColor.shadow" />
                <span class="text-[9px]" style="color:#2a2040">·</span>
                <StatusBadge label="VEH"   :suffix="vehicleStatus" :color="vehicleColor.color" :shadow="vehicleColor.shadow" />
              </template>
              <template v-else>
                <span class="text-[9px] mono tracking-widest" :style="{ color: accentColor, opacity: 0.6 }">
                  PRE-LAUNCH · {{ currentMission.netLabel ?? 'NET TBD' }}
                </span>
              </template>
            </div>
          </div>
        </div>

        <div class="w-px h-7 shrink-0" style="background:rgba(167,139,250,0.12)" />

        <!-- Mission selector -->
        <MissionSelector class="shrink-0" />

        <div class="w-px h-7 shrink-0" style="background:rgba(167,139,250,0.12)" />

        <!-- Status dot -->
        <div class="flex items-center gap-2 shrink-0" v-if="!isPreLaunch">
          <div class="status-dot"
            :class="overallStatus === 'COMPLETED' ? 'done' : overallStatus === 'CRITICAL' ? 'red' : overallStatus === 'NOMINAL' ? '' : 'amber'" />
          <span class="mono text-xs font-bold tracking-widest"
            :style="{ color: overallColor.color, textShadow: `0 0 10px ${overallColor.shadow}` }">
            {{ overallStatus }}
          </span>
        </div>
        <div class="flex items-center gap-2 shrink-0" v-else>
          <div class="w-2 h-2 rounded-full animate-pulse" :style="`background:${accentColor}; box-shadow:0 0 8px ${accentShadow}`" />
          <span class="mono text-xs font-bold tracking-widest" :style="{ color: accentColor }">STANDBY</span>
        </div>

        <div class="flex-1" />

        <!-- ── Countdown to splashdown ── -->
        <div v-if="splashdownCountdown" class="shrink-0 text-right hidden sm:block">
          <div class="text-[9px] mono uppercase tracking-widest" style="color:#4e4470">
            {{ splashdownPast ? 'MISIÓN COMPLETADA' : 'T- AMERIZAJE' }}
          </div>
          <div class="mono text-sm font-bold leading-tight"
            :style="{ color: splashdownPast ? '#34d399' : '#fbbf24',
                      textShadow: splashdownPast ? '0 0 10px rgba(52,211,153,0.5)' : '0 0 10px rgba(251,191,36,0.5)' }">
            {{ splashdownCountdown }}
          </div>
        </div>

        <div class="w-px h-7 shrink-0 hidden sm:block" style="background:rgba(167,139,250,0.12)" />

        <!-- UTC + MET / NET label -->
        <div class="text-right shrink-0">
          <div class="mono text-sm text-white font-semibold tracking-widest">{{ headerDate }} {{ utc }} UTC</div>
          <div v-if="isPreLaunch" class="mono text-xs tracking-widest" :style="{ color: accentColor }">
            {{ currentMission.netLabel ?? 'NET TBD' }}
          </div>
          <div v-else class="mono text-xs tracking-widest" style="color:#a78bfa">MET {{ met }}</div>
        </div>

        <div class="w-px h-7 shrink-0" style="background:rgba(167,139,250,0.12)" />

        <!-- Fullscreen button -->
        <button @click="toggleFullscreen"
          class="shrink-0 flex items-center justify-center w-8 h-8 rounded border transition-all"
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
    <main class="px-4 py-3 space-y-3 max-w-425 mx-auto">
      <Transition name="mission" mode="out-in">
      <div :key="currentMission.id">

      <!-- ── ARTEMIS I: historical card only ── -->
      <template v-if="currentMission.id === 'artemis1'">
        <HistoricalCard :mission="currentMission" />
      </template>

      <!-- ── ARTEMIS II / any active mission: full dashboard ── -->
      <template v-else-if="isHistorical || isActive">

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

        <!-- ROW 3.5: Mission Cost -->
        <MissionCost />

        <!-- ROW 4: Distance + DSN Map -->
        <div class="row-4">
          <DistanceGauge class="r4-a" :telemetry="telemetry" :dataSource="dataSource" />
          <DSNMap        class="r4-b" :telemetry="telemetry" />
        </div>

        <!-- INFO CARD -->
        <InfoCard />

      </template>

      <!-- ── PRE-LAUNCH: Artemis III panels ── -->
      <template v-else-if="isPreLaunch">
        <PreLaunchDashboard :mission="currentMission" :spaceWeather="spaceWeather" />
      </template>

      </div>
      </Transition>

    </main>

    <ShareBar />

    <!-- 🐇 Easter egg -->
    <Transition name="bunny">
      <div v-if="bunnyActive" class="bunny-container" aria-hidden="true">
        <div class="bunny-suit">
          <!-- Body -->
          <svg width="54" height="72" viewBox="0 0 54 72" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Ears -->
            <ellipse cx="17" cy="10" rx="5" ry="12" fill="white" opacity="0.9"/>
            <ellipse cx="37" cy="10" rx="5" ry="12" fill="white" opacity="0.9"/>
            <ellipse cx="17" cy="10" rx="2.5" ry="8" fill="#f9a8d4"/>
            <ellipse cx="37" cy="10" rx="2.5" ry="8" fill="#f9a8d4"/>
            <!-- Helmet -->
            <circle cx="27" cy="26" r="16" fill="rgba(200,220,255,0.15)" stroke="white" stroke-width="2"/>
            <circle cx="27" cy="26" r="13" fill="rgba(167,139,250,0.25)" stroke="rgba(167,139,250,0.6)" stroke-width="1"/>
            <!-- Face -->
            <circle cx="23" cy="25" r="2" fill="black"/>
            <circle cx="31" cy="25" r="2" fill="black"/>
            <circle cx="23.7" cy="24.3" r="0.7" fill="white"/>
            <circle cx="31.7" cy="24.3" r="0.7" fill="white"/>
            <path d="M 23 29 Q 27 33 31 29" stroke="#f9a8d4" stroke-width="1.5" fill="none" stroke-linecap="round"/>
            <!-- Suit body -->
            <rect x="12" y="40" width="30" height="24" rx="6" fill="white" opacity="0.9"/>
            <rect x="16" y="44" width="22" height="12" rx="3" fill="rgba(167,139,250,0.3)" stroke="rgba(167,139,250,0.5)" stroke-width="1"/>
            <!-- NASA badge -->
            <circle cx="27" cy="50" r="4" fill="#0b3d91" stroke="#fc3d21" stroke-width="0.8"/>
            <text x="27" y="52" text-anchor="middle" font-size="3" fill="white" font-family="Arial" font-weight="bold">NASA</text>
            <!-- Arms -->
            <rect x="2" y="42" width="12" height="8" rx="4" fill="white" opacity="0.85"/>
            <rect x="40" y="42" width="12" height="8" rx="4" fill="white" opacity="0.85"/>
            <!-- Legs -->
            <rect x="14" y="62" width="10" height="8" rx="4" fill="white" opacity="0.85"/>
            <rect x="30" y="62" width="10" height="8" rx="4" fill="white" opacity="0.85"/>
            <!-- Tail -->
            <circle cx="44" cy="58" r="5" fill="white" opacity="0.8"/>
          </svg>
          <div class="bunny-label mono">CREW-5 · CONEJONAUTA</div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { h } from 'vue'
import { useMissionData } from './composables/useMissionData.js'
import { missionEpoch, missionSplashdown } from './composables/useMission.js'
import { useSystemStatus } from './composables/useSystemStatus.js'
import { useMission } from './composables/useMission.js'

// Inline component — no template compiler needed
const StatusBadge = {
  props: ['label', 'suffix', 'color', 'shadow'],
  setup(p) {
    return () => h('span', {
      style: `font-family:'Share Tech Mono',monospace; font-size:0.6rem; letter-spacing:0.1em; color:${p.color}; text-shadow:0 0 8px ${p.shadow}; font-weight:700`,
    }, p.suffix ? `${p.label} ${p.suffix}` : p.label)
  }
}
import LiveStream         from './components/LiveStream.vue'
import InfoCard           from './components/InfoCard.vue'
import ShareBar           from './components/ShareBar.vue'
import TopBar             from './components/TopBar.vue'
import MissionClock       from './components/MissionClock.vue'
import TelemetryPanel     from './components/TelemetryPanel.vue'
import TrajectoryMap      from './components/TrajectoryMap.vue'
import SystemStatus       from './components/SystemStatus.vue'
import MissionTimeline    from './components/MissionTimeline.vue'
import CrewPanel          from './components/CrewPanel.vue'
import AlertsLog          from './components/AlertsLog.vue'
import DistanceGauge      from './components/DistanceGauge.vue'
import DSNMap             from './components/DSNMap.vue'
import PhaseAlert         from './components/PhaseAlert.vue'
import MissionCost        from './components/MissionCost.vue'
import MissionSelector    from './components/MissionSelector.vue'
import HistoricalCard     from './components/HistoricalCard.vue'
import PreLaunchDashboard from './components/PreLaunchDashboard.vue'

const { telemetry, spaceWeather, dataSource } = useMissionData()
const { vehicleStatus, crewStatus, dispose: disposeStatus } = useSystemStatus()
const { currentMission, missionState, isHistorical, isPreLaunch, isActive, accentColor, accentShadow, setMission } = useMission()
onUnmounted(disposeStatus)

// ── Dynamic CSS vars + title + URL hash ───────────────────────────────────
function applyMissionTheme(mission) {
  const root = document.documentElement
  const vars = mission.cssVars ?? {}
  for (const [k, v] of Object.entries(vars)) root.style.setProperty(k, v)

  // CSS custom property transitions don't trigger on body background —
  // set background directly so the switch is instant and reliable
  const bg = vars['--bg']
  document.body.style.backgroundColor = bg ?? ''
  document.body.style.backgroundImage = bg
    ? `radial-gradient(ellipse 70% 40% at 50% -5%, ${vars['--bg-glow'] ?? 'transparent'} 0%, transparent 65%)`
    : ''

  document.title = `${mission.name} — Mission Control`
  history.replaceState(null, '', `#${mission.id}`)
}

watch(currentMission, applyMissionTheme, { immediate: true })

// Restore mission from URL hash on load
onMounted(() => {
  const hash = window.location.hash.slice(1)
  if (hash) setMission(hash)
})

const STATUS_COLOR = {
  NOMINAL:    { color: '#34d399', shadow: 'rgba(52,211,153,0.5)'  },
  CAUTION:    { color: '#fbbf24', shadow: 'rgba(251,191,36,0.5)'  },
  ADVISORY:   { color: '#fbbf24', shadow: 'rgba(251,191,36,0.5)'  },
  CRITICAL:   { color: '#f87171', shadow: 'rgba(248,113,113,0.5)' },
  COMPLETED:  { color: '#34d399', shadow: 'rgba(52,211,153,0.3)'  },
}
const vehicleColor  = computed(() => STATUS_COLOR[vehicleStatus.value]  ?? STATUS_COLOR.NOMINAL)
const crewColor     = computed(() => STATUS_COLOR[crewStatus.value]     ?? STATUS_COLOR.NOMINAL)
const overallStatus = computed(() => {
  if (isMissionComplete.value) return 'COMPLETED'
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
const isMissionComplete = computed(() =>
  isHistorical.value && !!missionSplashdown.value && now.value >= missionSplashdown.value
)

const met = computed(() => {
  const epoch = missionEpoch.value ?? now.value
  // Freeze at splashdown for completed historical missions
  const ref = isMissionComplete.value ? missionSplashdown.value : now.value
  const ms = Math.max(0, ref - epoch)
  const s = Math.floor(ms / 1000)
  const d = Math.floor(s / 86400)
  const h = Math.floor((s % 86400) / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return `${String(d).padStart(2,'0')}:${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
})

// ── Splashdown countdown ───────────────────────────────────────────────────
const splashdownPast = computed(() => {
  const sd = missionSplashdown.value
  return sd ? now.value >= sd : false
})
const splashdownCountdown = computed(() => {
  const sd = missionSplashdown.value
  if (!sd) return null
  if (splashdownPast.value) return 'AMERIZADO ✓'
  const diff = Math.floor((sd - now.value) / 1000)
  const d = Math.floor(diff / 86400)
  const h = Math.floor((diff % 86400) / 3600)
  const m = Math.floor((diff % 3600) / 60)
  const s = diff % 60
  if (d > 0) return `${d}d ${String(h).padStart(2,'0')}h ${String(m).padStart(2,'0')}m`
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
})

// ── Easter egg — NASA logo clicks ─────────────────────────────────────────
const bunnyActive = ref(false)
let nasaClickCount = 0
let nasaClickTimer = null

function nasaClick() {
  nasaClickCount++
  clearTimeout(nasaClickTimer)
  nasaClickTimer = setTimeout(() => { nasaClickCount = 0 }, 2000)

  if (nasaClickCount >= 5) {
    nasaClickCount = 0
    bunnyActive.value = true
    setTimeout(() => { bunnyActive.value = false }, 6000)
  }
}

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

/* ── Mission transition ── */
.mission-enter-active,
.mission-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.mission-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.mission-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* ── Easter egg bunny ── */
.bunny-container {
  position: fixed;
  bottom: 40px;
  left: -120px;
  z-index: 9999;
  animation: bunny-hop 6s ease-in-out forwards;
  pointer-events: none;
}

@keyframes bunny-hop {
  0%   { left: -120px;          bottom: 40px; }
  10%  { left: 8vw;             bottom: 55px; }
  20%  { left: 16vw;            bottom: 40px; }
  30%  { left: 26vw;            bottom: 58px; }
  40%  { left: 36vw;            bottom: 40px; }
  50%  { left: 50vw;            bottom: 62px; }
  60%  { left: 62vw;            bottom: 40px; }
  70%  { left: 74vw;            bottom: 56px; }
  80%  { left: 84vw;            bottom: 40px; }
  95%  { left: 100vw;           bottom: 50px; }
  100% { left: calc(100vw + 120px); bottom: 40px; }
}

.bunny-suit {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  filter: drop-shadow(0 0 12px rgba(167,139,250,0.6));
}

.bunny-label {
  font-size: 0.55rem;
  color: rgba(167,139,250,0.8);
  letter-spacing: 0.1em;
  white-space: nowrap;
  text-shadow: 0 0 8px rgba(167,139,250,0.5);
}

/* Transition */
.bunny-enter-active { animation: bunny-hop 6s ease-in-out forwards; }
.bunny-leave-active { opacity: 0; transition: opacity 0.3s; }
</style>
