<template>
  <div class="panel">
    <div class="panel-title">
      DISTANCIAS Y NAVEGACIÓN
      <span class="ml-auto mono text-[9px] text-green-400">FLY-COMPLETE</span>
    </div>
    <div class="p-4 grid grid-cols-3 gap-6">

      <!-- Distance bars (col-span-1) -->
      <div class="col-span-1 space-y-4">
        <!-- Earth -->
        <div>
          <div class="flex justify-between items-baseline mb-1.5">
            <span class="mono text-[10px] text-slate-500 uppercase tracking-wider">TIERRA</span>
            <span class="mono text-sm font-bold" style="color:#a78bfa">{{ fmtNum(telemetry?.distEarth) }} km</span>
          </div>
          <div class="h-2 bg-slate-800/60 rounded-sm overflow-hidden">
            <div class="h-full rounded-sm transition-all duration-700"
              style="background: linear-gradient(90deg, #1a5080, #a78bfa)"
              :style="{ width: earthPct + '%' }" />
          </div>
        </div>
        <!-- Moon -->
        <div>
          <div class="flex justify-between items-baseline mb-1.5">
            <span class="mono text-[10px] text-slate-500 uppercase tracking-wider">LUNA</span>
            <span class="mono text-sm font-bold text-slate-300">{{ fmtNum(telemetry?.distMoon) }} km</span>
          </div>
          <div class="h-2 bg-slate-800/60 rounded-sm overflow-hidden">
            <div class="h-full rounded-sm transition-all duration-700"
              style="background: linear-gradient(90deg, #2a3040, #6080a0)"
              :style="{ width: moonPct + '%' }" />
          </div>
        </div>
      </div>

      <!-- Nav stats (col-span-1) -->
      <div class="col-span-1 grid grid-cols-2 gap-x-6 gap-y-3">
        <div>
          <div class="text-[10px] mono uppercase tracking-widest font-semibold" style="color:#7cb9d4">ÁNGULO TRAY.</div>
          <div class="mono text-lg font-bold mt-1" style="color:#f59e0b">{{ angle }}°</div>
        </div>
        <div>
          <div class="text-[10px] mono uppercase tracking-widest font-semibold" style="color:#7cb9d4">INCLINACIÓN</div>
          <div class="mono text-lg font-bold mt-1" style="color:#f59e0b">{{ incl }}°</div>
        </div>
        <div>
          <div class="text-[10px] mono uppercase tracking-widest font-semibold" style="color:#7cb9d4">DSN ENLACE</div>
          <div class="mono text-base font-black mt-1" style="color:#00ff88; text-shadow: 0 0 10px rgba(0,255,136,0.5)">ACTIVO</div>
        </div>
        <div>
          <div class="text-[10px] mono uppercase tracking-widest font-semibold" style="color:#7cb9d4">LATENCIA</div>
          <div class="mono text-lg font-bold mt-1" style="color:#a78bfa">{{ telemetry?.dsn ?? '--' }}s</div>
        </div>
      </div>

      <!-- Mission totals (col-span-1) -->
      <div class="col-span-1 flex flex-col justify-between">
        <div class="space-y-2">
          <div>
            <div class="text-[10px] mono uppercase tracking-widest font-semibold" style="color:#7cb9d4">DIST. TOTAL MISIÓN</div>
            <div class="mono text-sm mt-0.5" style="color:#9ab8cc">{{ totalMission }}</div>
          </div>
          <div>
            <div class="text-[10px] mono uppercase tracking-widest font-semibold" style="color:#7cb9d4">DSN DISTANCIA</div>
            <div class="mono text-sm mt-0.5" style="color:#9ab8cc">{{ dsnDist }} <span style="color:#2a4055">(Ok flyby)</span></div>
          </div>
          <div>
            <div class="text-[10px] mono uppercase tracking-widest font-semibold" style="color:#7cb9d4">FUENTE TRAY.</div>
            <div class="mono text-[10px] mt-0.5" style="color:#6a9ab8">
              {{ dataSourceLabel }}
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { missionEpoch } from '../composables/useMission.js'

const props = defineProps({ telemetry: Object, dataSource: String })

const elapsed = computed(() => (Date.now() - (missionEpoch.value ?? 0)) / 86400000)

const earthPct = computed(() => Math.min(100, ((props.telemetry?.distEarth || 0) / 400000) * 100))
const moonPct  = computed(() => Math.min(100, ((props.telemetry?.distMoon  || 0) / 384400) * 100))

const angle = computed(() => (24.4 + Math.sin(elapsed.value * 0.4) * 2.1).toFixed(1))
const incl  = computed(() => (29.5 + Math.cos(elapsed.value * 0.3) * 1.4).toFixed(1))

const totalMission = computed(() => {
  const distE = props.telemetry?.distEarth || 0
  const estimate = 5159000
  return `${(estimate).toLocaleString('en-US')} km (estimado)`
})

const dsnDist = computed(() => {
  const d = props.telemetry?.distEarth || 0
  return `${(d).toLocaleString('en-US')} km`
})

const dataSourceLabel = computed(() =>
  props.dataSource === 'jpl' ? 'JPL HORIZONS / ARDU-NASA' : 'FALLBACK / ARDU-NASA'
)

function fmtNum(n) {
  if (n === undefined || n === null) return '--'
  return Number(n).toLocaleString('en-US')
}
</script>
