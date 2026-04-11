<template>
  <div class="panel h-full flex flex-col">
    <div class="panel-title">
      TELEMETRÍA DE VUELO
      <span class="ml-auto mono text-[9px]"
        :class="dataSource === 'jpl' ? 'text-green-400' : 'text-amber-400'">
        ORION · {{ dataSource === 'jpl' ? 'JPL-AS' : 'EST·AS' }}
      </span>
    </div>

    <div class="flex-1 grid grid-cols-2 divide-x divide-white/5">
      <div
        v-for="(m, i) in metrics"
        :key="m.id"
        class="p-4 flex flex-col justify-between"
        :class="{ 'border-b border-white/5': i < 4 }"
      >
        <div class="text-[11px] mono uppercase tracking-widest mb-1" style="color:#7cb9d4">{{ m.label }}</div>
        <div>
          <span class="font-bold leading-none mono"
            :style="{ color: m.color, fontSize: 'clamp(1.5rem, 2.8vw, 2rem)', textShadow: `0 0 16px ${m.color}55` }">
            {{ m.value }}
          </span>
          <span class="text-sm mono ml-1" style="color:#4e7a94">{{ m.unit }}</span>
        </div>
        <div class="flex items-center gap-1 mt-1">
          <span v-if="m.trend === 'up'"   class="text-green-400 text-xs font-bold">↑</span>
          <span v-if="m.trend === 'down'" class="text-amber-400 text-xs font-bold">↓</span>
          <!-- <span v-if="m.trend === 'up'"   class="text-green-400 text-xs font-bold">↑</span>
          <span v-if="m.trend === 'down'" class="text-amber-400 text-xs font-bold">↓</span> -->
          <span v-if="m.trend === 'flat'" class="text-xs" style="color:#4e7a94">—</span>
          <span class="text-[10px] mono uppercase tracking-widest font-semibold" :style="{ color: m.statusColor }">{{ m.status }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { MISSION_EPOCH, getMissionDay } from '../composables/useMissionData.js'

const props = defineProps({ telemetry: Object, dataSource: String })

const elapsed = computed(() => (Date.now() - MISSION_EPOCH) / 86400000)

const metrics = computed(() => {
  const t = props.telemetry || {}
  const day = getMissionDay()
  const distE = t.distEarth
  const distM = t.distMoon

  const distTrend = elapsed.value < 6 ? 'up' : 'down'
  const moonTrend = elapsed.value < 6 ? 'down' : 'up'

  return [
    {
      id: 'vel',
      label: 'VELOCIDAD',
      value: t.vel ?? '--',
      unit: 'km/s',
      color: '#a78bfa',
      trend: 'flat',
      status: 'NOMINAL',
      statusColor: '#a78bfa88',
    },
    {
      id: 'alt',
      label: 'ALTITUD',
      value: typeof distE === 'number' ? fmtNum(distE) : '--',
      unit: 'km',
      color: '#ffffff',
      trend: distTrend,
      status: (distE > 100000) ? 'ESPACIO PROF.' : (distE === 0 ? 'AMARIZAJE' : 'ÓRB. TERRESTRE'),
      statusColor: '#ffffff44',
    },
    {
      id: 'distEarth',
      label: 'DIST. TIERRA',
      value: typeof distE === 'number' ? fmtNum(distE) : '--',
      unit: 'km',
      color: '#c4b5fd',
      trend: distTrend,
      //status: distTrend === 'down' ? 'AUMENTANDO' : 'REDUCIÉNDOSE',
      status: distTrend === 'up' ? 'AUMENTANDO' : 'REDUCIÉNDOSE',
      statusColor: '#c4b5fd88',
    },
    {
      id: 'distMoon',
      label: 'DIST. LUNA',
      value: typeof distM === 'number' ? fmtNum(distM) : '--',
      unit: 'km',
      color: '#94a3b8',
      trend: moonTrend,
      //status: moonTrend === 'up' ? 'REDUCIENDO' : 'AUMENTANDO',
      status: moonTrend === 'down' ? 'REDUCIENDO' : 'AUMENTANDO',
      statusColor: '#94a3b888',
    },
    {
      id: 'tempExt',
      label: 'TEMP. EXTERNA',
      value: t.tempExt ?? '--',
      unit: '°C',
      color: '#a78bfa',
      trend: 'flat',
      status: 'NOMINAL',
      statusColor: '#a78bfa44',
    },
    {
      id: 'tempCabin',
      label: 'TEMP. CABINA',
      value: t.tempCabin ?? '--',
      unit: '°C',
      color: '#00ff88',
      trend: 'flat',
      status: 'CONFORT',
      statusColor: '#00ff8844',
    },
  ]
})

function fmtNum(n) {
  return Number(n).toLocaleString('en-US')
}
</script>
