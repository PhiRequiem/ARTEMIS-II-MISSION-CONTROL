<template>
  <div class="min-h-screen relative select-none">
    <!-- Scanlines -->
    <div class="scanlines-overlay" />
    <!-- Ambient glow -->
    <div class="fixed inset-0 pointer-events-none"
      style="background: radial-gradient(ellipse 80% 40% at 50% 0%, rgba(0,80,160,0.10) 0%, transparent 60%)" />

    <TopBar />

    <!-- ═══════════════ HEADER ═══════════════ -->
    <header class="sticky top-[30px] z-50 border-b border-cyan-400/15"
      style="background: rgba(2,8,18,0.97); backdrop-filter: blur(8px); box-shadow: 0 1px 0 rgba(0,200,255,0.08), 0 4px 24px rgba(0,0,0,0.7)">
      <div class="px-5 py-2 flex items-center gap-4">

        <!-- NASA + Mission name -->
        <div class="flex items-center gap-3 flex-shrink-0">
          <svg width="36" height="36" viewBox="0 0 36 36" aria-label="NASA">
            <circle cx="18" cy="18" r="17" fill="#0b3d91" stroke="#fc3d21" stroke-width="1.5"/>
            <text x="18" y="22" text-anchor="middle" font-size="7.5" font-weight="bold"
              font-family="Arial,sans-serif" fill="white" letter-spacing="0.8">NASA</text>
            <ellipse cx="18" cy="18" rx="16" ry="5.5" fill="none" stroke="#fc3d21" stroke-width="1.3"
              transform="rotate(-28 18 18)" opacity="0.8"/>
          </svg>
          <div>
            <div class="text-white font-black tracking-widest text-sm leading-tight" style="font-family:'Orbitron',monospace; letter-spacing:.2em">
              ARTEMIS II — MISSION CONTROL
            </div>
            <div class="text-[10px] text-slate-500 mono tracking-widest mt-0.5">
              @ NOMINAL &nbsp;·&nbsp; CREW NOMINAL &nbsp;·&nbsp; VEHICLE NOMINAL
            </div>
          </div>
        </div>

        <div class="flex-1" />

        <!-- UTC + MET -->
        <div class="text-right">
          <div class="mono text-sm text-white font-semibold tracking-widest">{{ headerDate }} {{ utc }} UTC</div>
          <div class="mono text-xs text-cyan-400 tracking-widest">MET {{ met }}</div>
        </div>

      </div>
    </header>

    <!-- ═══════════════ GRID ═══════════════ -->
    <main class="px-4 py-3 space-y-3 max-w-[1700px] mx-auto">

      <!-- ROW 1 -->
      <div class="row-1">
        <MissionClock class="r1-left" />
        <TelemetryPanel class="r1-right" :telemetry="telemetry" :dataSource="dataSource" />
      </div>

      <!-- ROW 2 -->
      <div class="row-2">
        <TrajectoryMap class="r2-left" :telemetry="telemetry" />
        <SystemStatus  class="r2-right" />
      </div>

      <!-- ROW 2.5: Live stream + systems repeat-use -->
      <div class="row-25">
        <LiveStream class="r25-main" />
        <div class="r25-side space-y-3">
          <MissionTimeline />
        </div>
      </div>

      <!-- ROW 3 -->
      <div class="row-3">
        <CrewPanel       class="r3-a" />
        <AlertsLog       class="r3-b" :spaceWeather="spaceWeather" />
      </div>

      <!-- ROW 4 -->
      <DistanceGauge :telemetry="telemetry" :dataSource="dataSource" />

      <!-- INFO CARD -->
      <InfoCard />

    </main>

    <ShareBar />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useMissionData, MISSION_EPOCH } from './composables/useMissionData.js'
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

const { telemetry, spaceWeather, newsItems, dataSource, lastUpdate } = useMissionData()

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
  const ms = now.value - MISSION_EPOCH
  if (ms < 0) return '--:--:--:--'
  const s = Math.floor(ms / 1000)
  const d = Math.floor(s / 86400)
  const h = Math.floor((s % 86400) / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return `${String(d).padStart(2,'0')}:${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
})
</script>

<style scoped>
/* ROW 1: 40% / 60% */
.row-1 {
  display: grid;
  grid-template-columns: 5fr 7fr;
  gap: 12px;
}
/* ROW 2: 65% / 35% */
.row-2 {
  display: grid;
  grid-template-columns: 7fr 5fr;
  gap: 12px;
}
/* ROW 2.5: stream (7fr) + timeline (5fr) */
.row-25 {
  display: grid;
  grid-template-columns: 7fr 5fr;
  gap: 12px;
}

/* ROW 3: two panels */
.row-3 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

@media (max-width: 1100px) {
  .row-1, .row-2, .row-25 { grid-template-columns: 1fr; }
  .row-3 { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 680px) {
  .row-1, .row-2, .row-25, .row-3 { grid-template-columns: 1fr; }
}
</style>
