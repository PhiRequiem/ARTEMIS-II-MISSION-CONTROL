<template>
  <div class="panel h-full flex flex-col">
    <div class="panel-title a3">
      LAUNCH COUNTDOWN
      <span class="ml-auto mono text-[11px]" style="color:#38bdf8; opacity:0.6">LAUNCH LIBRARY 2</span>
    </div>

    <div class="flex-1 flex flex-col items-center justify-center p-5 gap-4">

      <!-- Loading -->
      <template v-if="loading">
        <div class="mono text-xs tracking-widest animate-pulse" style="color:#38bdf8">FETCHING LAUNCH DATA...</div>
      </template>

      <!-- Data loaded -->
      <template v-else>
        <!-- Status badge -->
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full" :class="isConfirmed ? 'bg-green-400' : 'bg-sky-400 animate-pulse'"
            :style="isConfirmed ? 'box-shadow:0 0 8px rgba(52,211,153,0.7)' : 'box-shadow:0 0 8px rgba(56,189,248,0.7)'" />
          <span class="mono text-xs tracking-widest font-bold"
            :style="isConfirmed ? 'color:#34d399' : 'color:#38bdf8'">
            {{ statusLabel }}
          </span>
        </div>

        <!-- Main countdown / NET label -->
        <div class="text-center">
          <template v-if="countdown">
            <div class="countdown-num">{{ countdown }}</div>
            <div class="countdown-label">T- LANZAMIENTO</div>
          </template>
          <template v-else>
            <div class="net-label">{{ netLabel }}</div>
            <div class="countdown-label">FECHA NO CONFIRMADA</div>
          </template>
        </div>

        <!-- Detail row -->
        <div class="grid grid-cols-3 gap-3 w-full mt-1">
          <div v-for="d in details" :key="d.label" class="detail-cell">
            <div class="text-[11px] mono tracking-widest detail-label">{{ d.label }}</div>
            <div class="text-xs mono font-semibold mt-0.5 detail-value">{{ d.value }}</div>
          </div>
        </div>

        <!-- Mission description -->
        <p v-if="missionDesc" class="text-xs text-center leading-relaxed max-w-md mission-desc px-2">
          {{ missionDesc }}
        </p>

        <!-- Official source -->
        <a href="https://www.nasa.gov/mission/artemis-iii/" target="_blank" rel="noopener"
          class="source-link">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          nasa.gov/mission/artemis-iii
        </a>
      </template>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({ mission: Object })

const loading    = ref(true)
const netLabel   = ref(props.mission?.netLabel ?? 'NET 2027')
const launchDate = ref(null)
const statusDesc = ref('To Be Determined')
const isConfirmed = ref(false)
const missionDesc = ref('')

async function fetchLaunchData() {
  try {
    const url = props.mission?.apis?.launchLibrary
    if (!url) return
    const res = await fetch(url, { signal: AbortSignal.timeout(8_000) })
    if (!res.ok) throw new Error(`LL2 ${res.status}`)
    const data = await res.json()
    const launch = data.results?.[0]
    if (!launch) return

    statusDesc.value  = launch.status?.description ?? 'TBD'
    isConfirmed.value = launch.status?.abbrev === 'Go'
    missionDesc.value = launch.mission?.description ?? ''

    const net = launch.net ? new Date(launch.net) : null
    launchDate.value  = net
    if (net && launch.status?.abbrev !== 'TBD') {
      netLabel.value = net.toUTCString().slice(0, 16)
    } else if (net) {
      const y = net.getUTCFullYear()
      const m = net.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' })
      netLabel.value = `NET ${m.toUpperCase()} ${y}`
    }
  } catch {
    // keep defaults
  } finally {
    loading.value = false
  }
}

onMounted(fetchLaunchData)

const countdown = computed(() => {
  if (!launchDate.value || !isConfirmed.value) return null
  const diff = Math.floor((launchDate.value - Date.now()) / 1000)
  if (diff <= 0) return null
  const d = Math.floor(diff / 86400)
  const h = Math.floor((diff % 86400) / 3600)
  const m = Math.floor((diff % 3600) / 60)
  const s = diff % 60
  if (d > 0) return `${d}D ${String(h).padStart(2,'0')}H ${String(m).padStart(2,'0')}M`
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
})

const statusLabel = computed(() => {
  if (isConfirmed.value) return 'GO FOR LAUNCH'
  return statusDesc.value.length > 30 ? statusDesc.value.slice(0, 30) + '…' : statusDesc.value
})

const details = computed(() => [
  { label: 'VEHÍCULO',  value: props.mission?.vehicle?.split('/')[0]?.trim() ?? 'SLS Block 1' },
  { label: 'PLATAFORMA', value: 'LC-39B · KSC' },
  { label: 'MISIÓN',    value: props.mission?.name ?? 'ARTEMIS III' },
])
</script>

<style scoped>
.panel-title.a3 { color: #38bdf8; }
.panel-title.a3::before { color: rgba(56,189,248,0.7); }

.countdown-num {
  font-family: 'Inter', 'SF Pro Display', system-ui, sans-serif;
  font-size: 3.5rem;
  font-weight: 100;
  letter-spacing: 0.04em;
  color: var(--t-text, #1d3a4d);
  line-height: 1;
}

.net-label {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 2.4rem;
  font-weight: 200;
  letter-spacing: 0.06em;
  color: var(--t-text, #1d3a4d);
  line-height: 1;
}
.detail-label { color: var(--t-mute); }
.detail-value  { color: var(--t-hi); }

.countdown-label {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 0.55rem;
  font-weight: 400;
  letter-spacing: 0.28em;
  color: var(--t-mute);
  margin-top: 8px;
  text-transform: uppercase;
}

.mission-desc { color: rgba(180,200,225,0.45); font-family: 'Inter', system-ui, sans-serif; }

.detail-cell {
  background: rgba(56,189,248,0.03);
  border: 1px solid rgba(56,189,248,0.09);
  border-radius: 4px;
  padding: 6px 8px;
  text-align: center;
}

.source-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 0.6rem;
  letter-spacing: 0.06em;
  color: rgba(56,189,248,0.4);
  text-decoration: none;
  transition: color 0.2s;
  margin-top: 4px;
}
.source-link:hover { color: #38bdf8; }
</style>
