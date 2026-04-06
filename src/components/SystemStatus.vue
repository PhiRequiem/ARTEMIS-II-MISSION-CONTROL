<template>
  <div class="panel flex flex-col h-full">
    <div class="panel-title">
      SISTEMAS ORION
      <span class="ml-auto mono text-[9px]" style="color:#4e4470">ESM · LSS · TM</span>
    </div>
    <div class="flex-1 p-3 flex flex-col gap-2.5">

      <!-- System bars -->
      <div v-for="sys in systems" :key="sys.id" class="flex items-center gap-2">
        <div class="mono text-xs w-20 flex-shrink-0 uppercase tracking-wide font-semibold"
          style="color:#9d8fd4">{{ sys.label }}</div>
        <div class="flex-1 h-2 rounded-sm overflow-hidden" style="background:rgba(255,255,255,0.05)">
          <div class="h-full rounded-sm transition-all duration-700"
            :style="{ width: sys.pct + '%', background: sys.barColor }" />
        </div>
        <div class="mono text-xs font-bold w-8 text-right flex-shrink-0"
          :style="{ color: sys.barColor }">{{ sys.pct }}%</div>
        <div class="w-2 h-2 rounded-full flex-shrink-0"
          :style="{ background: sys.dotColor, boxShadow: `0 0 5px ${sys.dotColor}` }" />
      </div>

      <!-- Gauges -->
      <div class="border-t pt-3 flex gap-3 justify-around mt-auto" style="border-color:rgba(255,255,255,0.05)">
        <div v-for="g in gauges" :key="g.id" class="flex flex-col items-center gap-1">
          <svg width="62" height="62" viewBox="0 0 62 62">
            <circle cx="31" cy="31" r="24" fill="none"
              stroke="rgba(167,139,250,0.07)" stroke-width="5.5" />
            <circle cx="31" cy="31" r="24" fill="none"
              :stroke="g.color" stroke-width="5.5" stroke-linecap="round"
              :stroke-dasharray="`${(g.pct / 100) * circumference} ${circumference}`"
              stroke-dashoffset="37.7"
              transform="rotate(-90 31 31)"
              style="transition: stroke-dasharray 1s ease" />
            <text x="31" y="28" text-anchor="middle" font-size="13" font-weight="bold"
              font-family="'Share Tech Mono',monospace" :fill="g.color">{{ g.pct }}</text>
            <text x="31" y="38" text-anchor="middle" font-size="7"
              font-family="'Share Tech Mono',monospace" fill="rgba(255,255,255,0.2)">%</text>
          </svg>
          <div class="text-[10px] mono uppercase tracking-widest font-semibold" style="color:#7c6aaa">{{ g.label }}</div>
          <div class="text-xs font-bold mono" :style="{ color: g.color }">{{ g.pct }}%</div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { onUnmounted } from 'vue'
import { useSystemStatus } from '../composables/useSystemStatus.js'

const circumference = 2 * Math.PI * 24
const { systems, dispose } = useSystemStatus()
onUnmounted(dispose)

const gauges = [
  { id: 'o2',  label: 'O₂',   pct: 98, color: '#a78bfa' },
  { id: 'h2o', label: 'H₂O',  pct: 87, color: '#c4b5fd' },
  { id: 'bat', label: 'BATT', pct: 84, color: '#34d399'  },
]
</script>
