<template>
  <div class="panel h-full flex flex-col">
    <div class="panel-title">
      DEEP SPACE NETWORK — COBERTURA ACTIVA
      <span class="ml-auto flex items-center gap-1.5">
        <span class="w-1.5 h-1.5 rounded-full" :style="{ background: activeStation ? '#34d399' : '#fbbf24', boxShadow: `0 0 5px ${activeStation ? '#34d399' : '#fbbf24'}` }" />
        <span class="text-[9px] mono" :style="{ color: activeStation ? '#34d399' : '#fbbf24' }">
          {{ activeStation ? activeStation.code + ' · ENLACE ACTIVO' : 'TRANSICIÓN' }}
        </span>
      </span>
    </div>

    <div class="flex-1 flex flex-col gap-0 min-h-0">
      <!-- Globe SVG -->
      <div class="flex-1 flex items-center justify-center px-3 pt-2" style="min-height:0">
        <svg :viewBox="`0 0 ${W} ${H}`" class="w-full" :style="`max-height:${H}px`"
          style="font-family:'Share Tech Mono',monospace">

          <!-- Space bg gradient -->
          <defs>
            <radialGradient id="earthGrad" cx="50%" cy="45%" r="50%">
              <stop offset="0%"   stop-color="#1a3a5c" />
              <stop offset="60%"  stop-color="#0d2040" />
              <stop offset="100%" stop-color="#060e20" />
            </radialGradient>
            <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stop-color="rgba(167,139,250,0.12)" />
              <stop offset="100%" stop-color="rgba(167,139,250,0)" />
            </radialGradient>
            <filter id="blur2">
              <feGaussianBlur stdDeviation="2" />
            </filter>
            <filter id="blur4">
              <feGaussianBlur stdDeviation="4" />
            </filter>
          </defs>

          <!-- Stars -->
          <circle v-for="s in stars" :key="s.id"
            :cx="s.x" :cy="s.y" :r="s.r" :fill="`rgba(255,255,255,${s.o})`" />

          <!-- Earth glow -->
          <ellipse :cx="cx" :cy="cy" :rx="R+18" :ry="R+12"
            fill="url(#glowGrad)" filter="url(#blur4)" />

          <!-- Earth body -->
          <circle :cx="cx" :cy="cy" :r="R"
            fill="url(#earthGrad)" stroke="rgba(100,140,200,0.25)" stroke-width="0.8" />

          <!-- Continent blobs (simplified) -->
          <g opacity="0.35">
            <!-- N America -->
            <ellipse cx="117" cy="68" rx="22" ry="18" fill="#2a5" transform="rotate(-15 117 68)" />
            <!-- S America -->
            <ellipse cx="130" cy="108" rx="13" ry="22" fill="#2a5" transform="rotate(10 130 108)" />
            <!-- Europe -->
            <ellipse cx="178" cy="62" rx="12" ry="10" fill="#2a5" />
            <!-- Africa -->
            <ellipse cx="182" cy="93" rx="14" ry="22" fill="#2a5" transform="rotate(5 182 93)" />
            <!-- Asia -->
            <ellipse cx="220" cy="65" rx="28" ry="18" fill="#2a5" transform="rotate(-5 220 65)" />
            <!-- Australia -->
            <ellipse cx="238" cy="108" rx="16" ry="11" fill="#2a5" transform="rotate(-10 238 108)" />
          </g>

          <!-- Atmosphere rim -->
          <circle :cx="cx" :cy="cy" :r="R"
            fill="none" stroke="rgba(100,160,255,0.18)" stroke-width="3" />

          <!-- Station signal arcs (behind dots) -->
          <g v-for="st in stations" :key="'arc-'+st.id">
            <line v-if="st.id === activeStation?.id"
              :x1="st.sx" :y1="st.sy"
              :x2="orionScreen.x" :y2="orionScreen.y"
              stroke="rgba(167,139,250,0.25)" stroke-width="1"
              stroke-dasharray="4 3"
              style="animation: blink-active 2s ease-in-out infinite"
            />
          </g>

          <!-- Station dots -->
          <g v-for="st in stations" :key="st.id">
            <!-- Coverage circle -->
            <circle :cx="st.sx" :cy="st.sy" r="18"
              :fill="`rgba(${st.id === activeStation?.id ? '167,139,250' : '80,80,120'},0.06)`"
              :stroke="`rgba(${st.id === activeStation?.id ? '167,139,250' : '80,80,120'},0.15)`"
              stroke-width="0.5" />
            <!-- Dot -->
            <circle :cx="st.sx" :cy="st.sy" r="3.5"
              :fill="st.id === activeStation?.id ? '#a78bfa' : 'rgba(100,90,140,0.6)'"
              :stroke="st.id === activeStation?.id ? 'rgba(167,139,250,0.6)' : 'none'"
              stroke-width="1"
              :style="st.id === activeStation?.id ? 'filter:drop-shadow(0 0 4px rgba(167,139,250,0.8))' : ''"
            />
            <!-- Label -->
            <text :x="st.lx" :y="st.ly" font-size="6.5" text-anchor="middle"
              :fill="st.id === activeStation?.id ? 'rgba(167,139,250,0.9)' : 'rgba(100,90,140,0.7)'"
              font-weight="bold">{{ st.code }}</text>
            <text :x="st.lx" :y="st.ly + 8" font-size="5.5" text-anchor="middle"
              :fill="st.id === activeStation?.id ? 'rgba(167,139,250,0.6)' : 'rgba(80,70,110,0.7)'">
              {{ st.label }}
            </text>
          </g>

          <!-- Orion position (top right, deep space) -->
          <circle :cx="orionScreen.x" :cy="orionScreen.y" r="5"
            fill="rgba(167,139,250,0.15)" stroke="#a78bfa" stroke-width="1.2"
            style="animation: orion-pulse 2.5s ease-in-out infinite" />
          <polygon :points="orionTri" fill="#a78bfa"
            style="filter:drop-shadow(0 0 3px #a78bfa)" />
          <text :x="orionScreen.x + 9" :y="orionScreen.y - 5" font-size="6.5"
            fill="#a78bfa" font-weight="bold">ORION</text>
          <text :x="orionScreen.x + 9" :y="orionScreen.y + 4" font-size="5.5"
            fill="rgba(167,139,250,0.55)">{{ formatDist(telemetry?.distEarth) }} km</text>

        </svg>
      </div>

      <!-- Station status row -->
      <div class="grid grid-cols-3 gap-px border-t border-white/5 flex-shrink-0">
        <div v-for="st in stations" :key="'row-'+st.id"
          class="px-3 py-2 flex flex-col gap-0.5"
          :class="st.id === activeStation?.id ? 'bg-violet-950/30' : ''">
          <div class="flex items-center gap-1.5">
            <div class="w-1.5 h-1.5 rounded-full flex-shrink-0"
              :style="{ background: st.id === activeStation?.id ? '#34d399' : 'rgba(80,80,120,0.5)',
                boxShadow: st.id === activeStation?.id ? '0 0 4px #34d399' : 'none',
                animation: st.id === activeStation?.id ? 'pulse-dot 2s ease-in-out infinite' : 'none' }" />
            <span class="mono text-[10px] font-bold"
              :style="{ color: st.id === activeStation?.id ? '#a78bfa' : '#3a3060' }">
              {{ st.code }}
            </span>
          </div>
          <div class="text-[9px]" style="color:#35304a">{{ st.location }}</div>
          <div class="mono text-[9px]"
            :style="{ color: st.id === activeStation?.id ? '#34d399' : '#2a2040' }">
            {{ st.id === activeStation?.id ? '70m · ACTIVO' : '34m · STANDBY' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { MISSION_EPOCH } from '../composables/useMissionData.js'

const props = defineProps({ telemetry: Object })

const W = 320, H = 155
const cx = W / 2, cy = H / 2 - 5
const R = 66

// Project lat/lon → SVG coords on the globe ellipse (simple equirectangular on circle)
function project(lat, lon) {
  const phi = (lat  * Math.PI) / 180
  const lam = (lon  * Math.PI) / 180
  // Simple orthographic-ish projection
  const x = cx + R * Math.cos(phi) * Math.sin(lam) * 0.92
  const y = cy - R * Math.sin(phi) * 0.85
  return { x, y }
}

const stations = [
  {
    id: 'gold',
    code: 'DSS-14',
    label: 'GOLDSTONE',
    location: 'Goldstone, CA',
    lat: 35.4, lon: -116.9,
    // label offset
    lox: 0, loy: -14,
  },
  {
    id: 'mad',
    code: 'DSS-63',
    label: 'MADRID',
    location: 'Robledo, España',
    lat: 40.4, lon: -4.2,
    lox: 0, loy: -14,
  },
  {
    id: 'can',
    code: 'DSS-43',
    label: 'CANBERRA',
    location: 'Tidbinbilla, AU',
    lat: -35.4, lon: 148.9,
    lox: 0, loy: 18,
  },
].map(st => {
  const p = project(st.lat, st.lon)
  return {
    ...st,
    sx: p.x,
    sy: p.y,
    lx: p.x + st.lox,
    ly: p.y + st.loy,
  }
})

// Determine active station by UTC hour (simplified but realistic rotation)
const now = ref(new Date())
let timer = null
onMounted(() => { timer = setInterval(() => now.value = new Date(), 5000) })
onUnmounted(() => clearInterval(timer))

const activeStation = computed(() => {
  const h = now.value.getUTCHours() + now.value.getUTCMinutes() / 60
  // Goldstone:  14-26 UTC (= 14-02 wrapping)
  // Madrid:     06-18 UTC
  // Canberra:   22-10 UTC (wrapping)
  if (h >= 14 && h < 22) return stations.find(s => s.id === 'gold')
  if (h >= 6  && h < 14) return stations.find(s => s.id === 'mad')
  return stations.find(s => s.id === 'can')
})

// Orion position in screen space (deep space, upper right)
const ORION_SX = W - 38
const ORION_SY = 28

const orionScreen = { x: ORION_SX, y: ORION_SY }

const orionTri = computed(() => {
  const ox = ORION_SX, oy = ORION_SY, sz = 4
  return `${ox},${oy - sz*1.4} ${ox - sz*0.7},${oy + sz*0.7} ${ox + sz*0.7},${oy + sz*0.7}`
})

const stars = Array.from({ length: 55 }, (_, i) => ({
  id: i,
  x: Math.random() * W,
  y: Math.random() * H,
  r: Math.random() * 0.7 + 0.15,
  o: Math.random() * 0.4 + 0.08,
}))

function formatDist(n) {
  if (!n) return '--'
  return Number(n).toLocaleString('en-US')
}
</script>
