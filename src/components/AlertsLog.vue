<template>
  <div class="panel h-full flex flex-col">
    <div class="panel-title">
      REGISTRO DE OPERACIONES
      <span class="ml-auto mono text-[9px] text-slate-600">MCC HOUSTON · MCC</span>
    </div>

    <div class="flex-1 grid grid-cols-2 divide-x divide-white/5 overflow-hidden" style="min-height: 0">

      <!-- ALERTAS ACTIVAS -->
      <div class="flex flex-col overflow-hidden">
        <div class="text-[10px] mono uppercase tracking-widest px-3 py-1.5 border-b border-white/5 flex-shrink-0 font-semibold" style="color:#7cb9d4">
          ALERTAS ACTIVAS
        </div>
        <div class="flex-1 overflow-y-auto p-2 space-y-1.5">
          <!-- DONKI alerts -->
          <div v-for="(ev, i) in spaceWeather.slice(0,2)" :key="'sw'+i"
            class="text-[9px] p-1.5 rounded"
            style="background: rgba(245,158,11,0.06); border: 1px solid rgba(245,158,11,0.15)">
            <div class="flex gap-1.5 items-start">
              <span style="color:#f59e0b">⚠</span>
              <div>
                <div class="mono font-bold" style="color:#f59e0b">SOLAR {{ ev.type }}</div>
                <div class="text-slate-600">{{ formatDate(ev.time) }}</div>
              </div>
            </div>
          </div>

          <!-- Operational alerts -->
          <div v-for="a in alerts" :key="a.id"
            class="text-[9px] p-1.5 rounded"
            :style="{ background: a.bg, border: a.border }">
            <div class="flex gap-1.5 items-start">
              <span :style="{ color: a.iconColor }">{{ a.icon }}</span>
              <div>
                <div class="mono font-bold" :style="{ color: a.iconColor }">{{ a.code }}</div>
                <div class="text-[11px] leading-snug mt-0.5" style="color:#9ab8cc">{{ a.msg }}</div>
                <div v-if="a.sub" class="text-slate-600 text-[8px] mt-0.5">{{ a.sub }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- COMUNICACIONES MCC↔ORION -->
      <div class="flex flex-col overflow-hidden">
        <div class="text-[10px] mono uppercase tracking-widest px-3 py-1.5 border-b border-white/5 flex-shrink-0 font-semibold" style="color:#7cb9d4">
          COMUNICACIONES MCC ↔ ORION
        </div>
        <div class="flex-1 overflow-y-auto p-2 space-y-1.5">
          <div v-for="msg in commLog" :key="msg.id"
            class="text-[9px] leading-snug">
            <div class="flex items-baseline gap-1.5 mb-0.5">
              <span class="mono text-[8px] font-bold flex-shrink-0"
                :style="{ color: msg.from === 'MCC' ? '#f59e0b' : '#a78bfa' }">
                [{{ msg.from }}]
              </span>
              <span class="mono text-[8px] text-slate-600">{{ msg.time }}</span>
            </div>
            <div class="text-[11px] pl-1" style="color:#9ab8cc">{{ msg.text }}</div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { missionEpoch } from '../composables/useMission.js'

const props = defineProps({ spaceWeather: Array })

function metStr(d, h, m) {
  const epoch = (missionEpoch.value?.getTime() ?? 0) + (d * 86400 + h * 3600 + m * 60) * 1000
  const date = new Date(epoch)
  const MONTHS = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC']
  return `${String(date.getUTCDate()).padStart(2,'0')} ${MONTHS[date.getUTCMonth()]} ${String(date.getUTCHours()).padStart(2,'0')}:${String(date.getUTCMinutes()).padStart(2,'0')}`
}

const alerts = [
  {
    id: 'toilet', icon: '⚠', iconColor: '#f59e0b', code: 'TOILET',
    msg: 'Ventiladores con falla — workaround activo. Sin impacto en misión.',
    sub: null,
    bg: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)',
  },
  {
    id: 'h2o', icon: '▲', iconColor: '#c4b5fd', code: 'H2O VALVE',
    msg: 'Válvula dispensador — monitoreo continuo. Reserva asegurada.',
    sub: null,
    bg: 'rgba(196,181,253,0.05)', border: '1px solid rgba(196,181,253,0.12)',
  },
  {
    id: 'tcd', icon: '✓', iconColor: '#00ff88', code: 'TCD-1 CANCELADO',
    msg: 'Trayectoria nominal, no requirió corrección.',
    sub: null,
    bg: 'rgba(0,255,136,0.04)', border: '1px solid rgba(0,255,136,0.10)',
  },
  {
    id: 'dsn', icon: '✓', iconColor: '#00ff88', code: 'DSN',
    msg: 'Señal estable. Latencia 1.1ks. Sin interrupciones previstas.',
    sub: null,
    bg: 'rgba(0,255,136,0.04)', border: '1px solid rgba(0,255,136,0.10)',
  },
  {
    id: 'blackout', icon: '⊘', iconColor: '#64748b', code: 'BLACKOUT',
    msg: 'Comunicaciones interrumpidas ~1h durante flyby cara oculta el D6.',
    sub: null,
    bg: 'rgba(100,116,139,0.04)', border: '1px solid rgba(100,116,139,0.12)',
  },
]

const commLog = [
  { id: 1, from: 'MCC',  time: metStr(0,13,35), text: 'Rise and shine, Orion. Buenos días desde Houston.' },
  { id: 2, from: 'CREW', time: metStr(0,13,50), text: 'Houston, buenos días. Todos nominal. Vista de la Luna increíble.' },
  { id: 3, from: 'MCC',  time: metStr(1,13,15), text: 'Confirmam inicio demo trajes espaciales. Go for EVA suit check.' },
  { id: 4, from: 'CREW', time: metStr(1,14,2),  text: 'Trajes verificados. Koch reporta presión nominal. Hansen confirma.' },
  { id: 5, from: 'MCC',  time: metStr(2,14,40), text: 'Transmitiendo lista final de objetivos flyby. Copy cuando listos.' },
  { id: 6, from: 'CREW', time: metStr(2,14,52), text: 'Copy lista flyby. Preparando instrumentos ciencia. Cámaras OK.' },
]

function formatDate(s) {
  if (!s) return ''
  try {
    return new Date(s).toISOString().slice(0,16).replace('T',' ') + ' UTC'
  } catch { return s }
}
</script>
