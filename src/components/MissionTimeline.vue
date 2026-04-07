<template>
  <div class="panel h-full flex flex-col">
    <div class="panel-title">
      LÍNEA DE TIEMPO DE MISIÓN
      <span class="ml-auto mono text-[9px] text-slate-600">{{ dateLabel }} · 2026</span>
    </div>
    <div class="flex-1 overflow-y-auto p-3 space-y-0" style="max-height: 400px">
      <div
        v-for="(event, i) in timeline"
        :key="event.id"
        class="relative flex gap-3 pb-3"
      >
        <!-- Connector line -->
        <div class="flex flex-col items-center w-5 flex-shrink-0">
          <div class="w-3 h-3 rounded-full mt-0.5 flex-shrink-0 relative z-10"
            :style="{
              background: event.status === 'active' ? '#00ff88' :
                          event.status === 'done'   ? '#a78bfa66' : '#1e3040',
              border: `1px solid ${event.status === 'active' ? '#00ff88' : event.status === 'done' ? '#a78bfa40' : '#1e3040'}`,
              boxShadow: event.status === 'active' ? '0 0 8px #00ff88, 0 0 16px rgba(0,255,136,0.4)' : 'none',
              animation: event.status === 'active' ? 'blink-active 1.5s ease-in-out infinite' : 'none',
            }"
          />
          <div v-if="i < timeline.length - 1" class="w-px flex-1 mt-1 min-h-6"
            :style="{ background: event.status === 'done' ? 'rgba(167,139,250,0.25)' : 'rgba(30,48,64,0.8)' }" />
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0 pb-1">
          <div class="flex items-start gap-2">
            <div class="flex flex-col">
              <div class="flex items-center gap-2">
                <span class="mono text-[9px] font-bold px-1.5 py-0.5 rounded"
                  :style="{
                    background: event.status === 'active' ? 'rgba(0,255,136,0.12)' : 'rgba(255,255,255,0.04)',
                    color: event.status === 'done' ? '#a78bfa88' : event.status === 'active' ? '#00ff88' : '#1e3040',
                    border: `1px solid ${event.status === 'active' ? 'rgba(0,255,136,0.3)' : event.status === 'done' ? 'rgba(167,139,250,0.15)' : 'rgba(30,48,64,0.5)'}`,
                  }">
                  DÍA {{ event.day }}
                </span>
                <span v-if="event.status === 'active'"
                  class="text-[8px] mono font-bold tracking-widest"
                  style="color:#00ff88; animation: blink-active 1.5s ease-in-out infinite">
                  ◉ ACTIVO
                </span>
              </div>
              <div class="text-sm font-bold mt-1 leading-tight"
                :class="[
                  event.status === 'active'  ? 'text-white' : '',
                  event.status === 'done'    ? 'text-slate-500' : '',
                  event.status === 'pending' ? 'text-slate-700' : '',
                ]"
                :style="event.status === 'active' ? 'text-shadow: 0 0 8px rgba(255,255,255,0.3)' : ''">
                {{ event.label }}
              </div>
              <div class="text-[11px] mt-0.5 leading-snug"
                :style="{ color: event.status === 'pending' ? '#2a4055' : '#6a9ab8' }">
                {{ event.desc }}
              </div>
            </div>
            <div class="ml-auto mono text-[10px] flex-shrink-0" style="color:#2a4055"># {{ String(event.id).padStart(2,'0') }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { MISSION_EPOCH } from '../composables/useMissionData.js'

const now = ref(new Date())
let timer = null
onMounted(() => { timer = setInterval(() => now.value = new Date(), 1000) })
onUnmounted(() => clearInterval(timer))

const MONTHS_ES = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC']

const dateLabel = computed(() => {
  const d = now.value
  return `${String(d.getUTCDate()).padStart(2,'0')} ${MONTHS_ES[d.getUTCMonth()]}`
})

const EVENTS = [
  {
    id: 1, day: 1, epoch: 0, label: 'Despegue — SLS T+0',
    desc: 'KSC 39B · 22:35 UTC · Paneles solares desplegados',
  },
  {
    id: 2, day: 2, epoch: 1.0, label: 'Perigee Raise Burn + TLI',
    desc: '43s burn → órbita alta → TLI 6min → salida órbita terrestre',
  },
  {
    id: 3, day: 3, epoch: 2.0, label: 'En ruta — primer burn cancelado',
    desc: 'Trayectoria nominal. Fotos de la Tierra. Olor a inodoro.',
  },
  {
    id: 4, day: 4, epoch: 3.0, label: 'Pilotaje manual en espacio profundo',
    desc: 'Koch y Hansen: 41min, 2 modos de propulsores. Prep flyby.',
  },
  {
    id: 5, day: 5, epoch: 4.0, label: 'Prueba trajes + revisión lunar',
    desc: 'Demo EVA suits. Briefing objetivos ciencia. Selfies Orion.',
  },
  {
    id: 6, day: 6, epoch: 5.0, label: 'Lunar Flyby — Cara Oculta',
    desc: 'Closest approach 6,400 km. Blackout comms ~22min.',
  },
  {
    id: 7, day: 7, epoch: 6.0, label: 'Return Burn — TPI',
    desc: 'Trans-Earth injection burn. Partida órbita lunar.',
  },
  {
    id: 8, day: 8, epoch: 7.0, label: 'Trayectoria de retorno',
    desc: 'Mid-course correction #2. Revisión sistemas reentrada.',
  },
  {
    id: 9, day: 9, epoch: 8.0, label: 'Preparación reentrada',
    desc: 'Separación módulo de servicio. Config guía terminal.',
  },
  {
    id: 10, day: 10, epoch: 9.0, label: 'Reentrada & Amerizaje',
    desc: 'Entrada 40,000 km/h. Paracaídas. Pacífico. Recovery ops.',
  },
]

const elapsedDays = computed(() => (now.value - MISSION_EPOCH) / 86400000)

const timeline = computed(() =>
  EVENTS.map((e, i) => {
    const d = elapsedDays.value
    const nextEpoch = EVENTS[i + 1]?.epoch ?? 11
    let status
    if (d >= nextEpoch) status = 'done'
    else if (d >= e.epoch) status = 'active'
    else status = 'pending'
    return { ...e, status }
  })
)
</script>
