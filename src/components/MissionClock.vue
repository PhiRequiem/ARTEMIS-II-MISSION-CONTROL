<template>
  <div class="panel flex flex-col h-full">
    <div class="panel-title">
      MISSION ELAPSED TIME
      <span class="ml-auto mono text-[9px] text-slate-600">T+{{ met }}</span>
    </div>

    <div class="flex-1 p-4 flex flex-col gap-4">

      <!-- Giant MET -->
      <div class="text-center">
        <div class="mono font-bold leading-none tracking-wider"
          style="font-size: clamp(2rem, 5vw, 3.2rem); color:#f59e0b; text-shadow: 0 0 20px rgba(245,158,11,0.5), 0 0 40px rgba(245,158,11,0.2)">
          {{ met }}
        </div>
        <div class="text-[9px] text-slate-600 mono tracking-widest mt-1 uppercase">MET — Mission Elapsed Time</div>
      </div>

      <!-- Phase label -->
      <div>
        <div class="text-xs mono uppercase tracking-widest mb-2 font-semibold" style="color:#7cb9d4">FASE ACTIVA: {{ currentPhase.label.toUpperCase() }}</div>

        <!-- Segmented bar -->
        <div class="flex gap-0.5">
          <div
            v-for="(phase, i) in phasesWithShort"
            :key="phase.id"
            class="flex-1 py-1 flex items-center justify-center rounded-sm text-[8px] font-bold mono tracking-wide cursor-default transition-all duration-300"
            :class="[
              getPhaseState(i) === 'done'    ? 'bg-violet-900/60 text-cyan-500/60 border border-cyan-500/20' : '',
              getPhaseState(i) === 'active'  ? 'bg-violet-400 text-black border border-cyan-300' : '',
              getPhaseState(i) === 'pending' ? 'bg-slate-900/40 text-slate-700 border border-slate-700/30' : '',
            ]"
            :style="getPhaseState(i) === 'active' ? 'animation: blink-active 2s ease-in-out infinite' : ''"
          >
            {{ phase.short }}
          </div>
        </div>
      </div>

      <!-- Próximo hito box -->
      <div v-if="nextMilestone" class="border border-violet-400/20 rounded bg-violet-950/20 p-3 flex-1">
        <div class="text-[9px] text-slate-500 mono uppercase tracking-widest mb-1.5">PRÓXIMO HITO</div>
        <div class="text-base font-black text-violet-300 uppercase tracking-wide leading-tight"
          style="font-family:'Orbitron',monospace; font-size:1rem; text-shadow: 0 0 12px rgba(167,139,250,0.4)">
          {{ nextMilestone.label }}
        </div>
        <div class="text-xs mt-1 leading-relaxed" style="color:#7cb9d4">{{ nextMilestone.desc }}</div>
        <div class="mono text-sm font-bold mt-2" style="color:#f59e0b">T- {{ countdown }}</div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { missionEpoch, missionPhases, useFrozenNow } from '../composables/useMission.js'

const phasesWithShort = computed(() => missionPhases.value.map(p => ({
  ...p,
  short: p.label.slice(0,6).toUpperCase(),
})))

const now = useFrozenNow()

const elapsedMs = computed(() => Math.max(0, now.value - (missionEpoch.value ?? now.value)))
const elapsedDays = computed(() => elapsedMs.value / 86400000)

const met = computed(() => {
  const s = Math.floor(elapsedMs.value / 1000)
  const d = Math.floor(s / 86400)
  const h = Math.floor((s % 86400) / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return `${String(d).padStart(2,'0')}:${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
})

const currentPhase = computed(() => {
  const d = elapsedDays.value
  const phases = missionPhases.value
  for (let i = phases.length - 1; i >= 0; i--) {
    if (d >= phases[i].day - 1) return phases[i]
  }
  return phases[0]
})

function getPhaseState(index) {
  const d = elapsedDays.value
  const phase = missionPhases.value[index]
  if (!phase) return 'pending'
  if (d >= phase.end) return 'done'
  if (d >= phase.day - 1) return 'active'
  return 'pending'
}

const MILESTONES = [
  { epoch: 0,   label: 'Despegue — SLS T+0',      desc: 'KSC 39B · 22:35 UTC · Paneles solares desplegados' },
  { epoch: 1.0, label: 'Perigee Raise Burn + TLI', desc: '43s burn → órbita alta → TLI 6min → salida órbita terrestre' },
  { epoch: 2.5, label: 'Mid-Course Correction',    desc: 'ESM burn #1, refinamiento de trayectoria' },
  { epoch: 5.5, label: 'Lunar Flyby — Cara Oculta',desc: 'Orion cruza a 6,400 km de la superficie. Ventana: 2:45–9:48 PM EDT. Eclipse solar.' },
  { epoch: 6.5, label: 'Return Burn',               desc: 'Trans-Earth injection, trayectoria de regreso' },
  { epoch: 9.5, label: 'Reentrada & Amerizaje',     desc: 'Entrada a 40,000 km/h. Paracaídas. Océano Pacífico.' },
]

const nextMilestone = computed(() => {
  const d = elapsedDays.value
  return MILESTONES.find(m => m.epoch > d) || null
})

const countdown = computed(() => {
  if (!nextMilestone.value) return '--'
  const targetMs = (missionEpoch.value?.getTime() ?? 0) + nextMilestone.value.epoch * 86400000
  const diffS = Math.max(0, Math.floor((targetMs - now.value) / 1000))
  const h = Math.floor(diffS / 3600)
  const m = Math.floor((diffS % 3600) / 60)
  if (h >= 24) return `${Math.floor(h/24)}d ${h%24}h ${String(m).padStart(2,'0')}min`
  return `${h}h ${String(m).padStart(2,'0')}min`
})
</script>
