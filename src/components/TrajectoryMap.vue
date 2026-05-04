<template>
  <div class="panel flex flex-col h-full">
    <div class="panel-title">
      TRAYECTORIA ORBITAL — VISTA ECLÍPTICA
      <span class="ml-auto mono text-[9px] text-slate-600">JPL HORIZONS · FREE-RETURN TRAJECTORY</span>
    </div>
    <div class="flex-1 p-2 flex items-center justify-center" style="min-height: 260px">
      <svg :viewBox="`0 0 ${W} ${H}`" class="w-full h-full" style="max-height:320px; font-family:'Share Tech Mono',monospace">

        <!-- Stars -->
        <circle v-for="s in stars" :key="s.id" :cx="s.x" :cy="s.y" :r="s.r" :fill="`rgba(255,255,255,${s.o})`" />

        <!-- Distance ruler -->
        <line :x1="earthCx + 14" :y1="cy + 2" :x2="moonCx - 12" :y2="cy + 2"
          stroke="rgba(255,255,255,0.06)" stroke-width="0.5" stroke-dasharray="3 5" />
        <text :x="(earthCx + moonCx)/2" :y="cy + 12" text-anchor="middle" font-size="8"
          fill="rgba(255,255,255,0.18)">≈ 384,400 km</text>

        <!-- Outbound arc — pending -->
        <path :d="outboundPath" fill="none"
          stroke="rgba(167,139,250,0.12)" stroke-width="1.5" stroke-dasharray="5 5" />
        <!-- Return arc — pending -->
        <path :d="returnPath" fill="none"
          stroke="rgba(167,139,250,0.10)" stroke-width="1.5" stroke-dasharray="5 5" />

        <!-- Completed path -->
        <path :d="completedPath" fill="none"
          stroke="#a78bfa" stroke-width="2" stroke-linecap="round"
          style="filter: drop-shadow(0 0 3px rgba(167,139,250,0.5))" />

        <!-- Day markers on outbound -->
        <g v-for="(m, i) in outboundMarkers" :key="'mo'+i">
          <circle :cx="m.x" :cy="m.y" r="3"
            :fill="m.passed ? '#a78bfa' : 'rgba(80,120,160,0.4)'"
            :style="m.passed ? '' : ''" />
          <line :x1="m.x" :y1="m.y" :x2="m.x" :y2="m.y - 14"
            :stroke="m.passed ? 'rgba(167,139,250,0.4)' : 'rgba(80,120,160,0.2)'" stroke-width="0.5" />
          <text :x="m.x" :y="m.y - 17" text-anchor="middle" font-size="7"
            :fill="m.passed ? 'rgba(167,139,250,0.8)' : 'rgba(80,120,160,0.5)'">
            {{ m.label }}
          </text>
        </g>

        <!-- Moon -->
        <circle :cx="moonCx" :cy="cy" r="15"
          fill="rgba(140,150,170,0.10)" stroke="rgba(160,165,190,0.35)" stroke-width="1" />
        <text :x="moonCx" :y="cy + 26" text-anchor="middle" font-size="8" fill="rgba(160,165,190,0.6)">LUNA</text>

        <!-- Earth -->
        <circle :cx="earthCx" :cy="cy" r="16"
          fill="rgba(0,80,200,0.14)" stroke="rgba(0,140,255,0.4)" stroke-width="1.2" />
        <text :x="earthCx" :y="cy + 27" text-anchor="middle" font-size="8" fill="rgba(0,140,255,0.6)">TIERRA</text>

        <!-- ORION — group translates so CSS transition animates position smoothly -->
        <g v-if="orionVisible"
          :transform="`translate(${orionPos.x},${orionPos.y})`"
          class="orion-group">
          <circle cx="0" cy="0" r="7"
            fill="rgba(167,139,250,0.12)" stroke="#a78bfa" stroke-width="1.5"
            style="animation: orion-pulse 2s ease-in-out infinite" />
          <polygon :points="shipPointsRel" fill="#a78bfa"
            style="filter: drop-shadow(0 0 4px #a78bfa)" />
          <!-- Label box -->
          <rect x="10" y="-18" width="74" height="20" rx="2"
            fill="rgba(0,10,25,0.85)" stroke="rgba(167,139,250,0.3)" stroke-width="0.5" />
          <text x="12" y="-8" font-size="7" fill="#a78bfa" font-weight="bold">ORION</text>
          <text x="12" y="0" font-size="6" fill="rgba(167,139,250,0.6)">
            {{ fmtShort(telemetry?.distEarth) }} km
          </text>
        </g>

        <!-- HOY label on completed path -->
        <g v-if="progress > 0.05 && progress < 0.95">
          <text :x="orionPos.x" :y="orionPos.y + 24" text-anchor="middle" font-size="7"
            fill="rgba(167,139,250,0.5)">HOY</text>
        </g>

        <!-- Legend -->
        <line x1="12" y1="8"  x2="28" y2="8"  stroke="#a78bfa" stroke-width="2" />
        <text x="31" y="11" font-size="7" fill="rgba(167,139,250,0.7)">Completada</text>
        <line x1="12" y1="19" x2="28" y2="19" stroke="rgba(167,139,250,0.2)" stroke-width="1.5" stroke-dasharray="4 3" />
        <text x="31" y="22" font-size="7" fill="rgba(100,130,160,0.7)">Pendiente</text>

      </svg>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { missionEpoch, useFrozenNow } from '../composables/useMission.js'

const props = defineProps({ telemetry: Object })

const W = 600, H = 260
const earthCx = 72, cy = H / 2
const moonCx  = 528

// Reactive clock — updates every second so Orion moves in real-time
const now = useFrozenNow()

// Control points for arcs
const OUTBOUND_CP = { x: (earthCx + moonCx) / 2, y: 28 }
const RETURN_CP   = { x: (earthCx + moonCx) / 2, y: H - 28 }

function outboundPt(t) {
  const x = (1-t)**2 * earthCx + 2*(1-t)*t * OUTBOUND_CP.x + t**2 * moonCx
  const y = (1-t)**2 * cy       + 2*(1-t)*t * OUTBOUND_CP.y + t**2 * cy
  return { x, y }
}
function returnPt(t) {
  const x = (1-t)**2 * moonCx  + 2*(1-t)*t * RETURN_CP.x + t**2 * earthCx
  const y = (1-t)**2 * cy      + 2*(1-t)*t * RETURN_CP.y + t**2 * cy
  return { x, y }
}

function makePath(fn, n = 60) {
  return 'M ' + Array.from({ length: n + 1 }, (_, i) => {
    const p = fn(i / n)
    return `${p.x.toFixed(1)},${p.y.toFixed(1)}`
  }).join(' L ')
}

const outboundPath = computed(() => makePath(outboundPt))
const returnPath   = computed(() => makePath(returnPt))

const progress = computed(() => {
  const epoch = missionEpoch.value
  if (!epoch) return 0
  const d = (+now.value - +epoch) / 86400000
  if (d >= 9.05) return 1.0
  return Math.max(0, Math.min(1, d / 9.05))
})

const completedPath = computed(() => {
  const p = progress.value
  if (p <= 0.5) {
    // Outbound 0→p*2
    const n = Math.round(p * 2 * 60)
    if (n < 1) return ''
    return 'M ' + Array.from({ length: n + 1 }, (_, i) => {
      const pt = outboundPt(i / 60)
      return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`
    }).join(' L ')
  } else {
    // Full outbound + partial return
    const outPts = Array.from({ length: 61 }, (_, i) => outboundPt(i / 60))
    const retFrac = (p - 0.5) * 2
    const retN = Math.round(retFrac * 60)
    const retPts = Array.from({ length: retN + 1 }, (_, i) => returnPt(i / 60))
    const all = [...outPts, ...retPts]
    return 'M ' + all.map(pt => `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`).join(' L ')
  }
})

const orionPos = computed(() => {
  const p = progress.value
  if (p <= 0.5) return outboundPt(p * 2)
  return returnPt((p - 0.5) * 2)
})
const orionVisible = computed(() => progress.value > 0)

// shipPoints in absolute coords (legacy, kept for compatibility)
const shipPoints = computed(() => shipPointsRel.value)

// Relative to group origin (0,0) — used inside the translated <g>
const shipPointsRel = computed(() => {
  const p = progress.value
  const p1 = p <= 0.5 ? outboundPt(Math.max(0, p * 2 - 0.01)) : returnPt(Math.max(0,(p - 0.5)*2 - 0.01))
  const p2 = p <= 0.5 ? outboundPt(Math.min(1, p * 2 + 0.01)) : returnPt(Math.min(1,(p - 0.5)*2 + 0.01))
  const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x)
  const cos = Math.cos(angle), sin = Math.sin(angle)
  const sz = 5
  return [
    [ cos * sz * 1.5,  sin * sz * 1.5],
    [-cos * sz + sin * sz * 0.7, -sin * sz - cos * sz * 0.7],
    [-cos * sz - sin * sz * 0.7, -sin * sz + cos * sz * 0.7],
  ].map(pt => pt.join(',')).join(' ')
})

// Day markers on outbound arc (D1-D5)
const outboundMarkers = computed(() => {
  return [0, 1, 2, 3, 4].map(i => {
    const t = i / 4
    const pt = outboundPt(t)
    const passed = progress.value >= t * 0.5
    const label = i === 4 ? 'LUNA' : i === 0 ? 'D1' : `D${i + 1}`
    return { ...pt, passed, label }
  }).filter(m => m.label !== 'LUNA')
})

const stars = Array.from({ length: 80 }, (_, i) => ({
  id: i, x: Math.random() * W, y: Math.random() * H,
  r: Math.random() * 0.8 + 0.15, o: Math.random() * 0.45 + 0.05,
}))

function fmtShort(n) {
  if (!n) return '--'
  if (n >= 1000) return (n / 1000).toFixed(0) + ',000'
  return String(n)
}
</script>

<style scoped>
/* Smooth position transition for the Orion group */
.orion-group {
  transition: transform 0.95s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
