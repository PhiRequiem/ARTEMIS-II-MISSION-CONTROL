<template>
  <div class="panel flex flex-col">
    <div class="panel-title">
      COSTO DE MISIÓN
      <span class="ml-auto mono text-[9px] text-slate-600">NASA OIG · GAO-23-105338 · EST.</span>
    </div>

    <div class="p-4 flex flex-col gap-4">

      <!-- ── Counter ── -->
      <div class="counter-block">
        <div class="counter-label mono">
          {{ missionComplete ? 'COSTO TOTAL MISIÓN' : preLaunch ? 'COSTO ESTIMADO MISIÓN' : 'GASTADO HASTA AHORA' }}
        </div>
        <div class="counter-value mono" :class="missionComplete ? 'complete' : preLaunch ? 'prelaunch' : ''">
          {{ fmtDollar(spent) }}
        </div>
        <div class="counter-sub mono">
          <span v-if="preLaunch" style="color:#4e4470">LANZAMIENTO EN {{ launchCountdown }}</span>
          <span v-else-if="missionComplete" style="color:#34d399">MISIÓN COMPLETADA ✓</span>
          <template v-else>
            <span style="color:#fbbf24">+{{ fmtDollarShort(COST_PER_SEC) }} / seg</span>
            <span style="color:#4e4470"> · </span>
            <span style="color:#a78bfa">{{ pctDone.toFixed(1) }}% ejecutado</span>
          </template>
        </div>
      </div>

      <!-- ── Progress bar total ── -->
      <div v-if="!preLaunch" class="total-bar-wrap">
        <div class="total-bar-track">
          <div class="total-bar-fill" :style="{ width: pctDone + '%' }" />
        </div>
      </div>

      <!-- ── Breakdown ── -->
      <div class="breakdown">
        <div v-for="item in BREAKDOWN" :key="item.label" class="breakdown-row">
          <div class="bd-left">
            <span class="bd-label mono">{{ item.label }}</span>
            <span class="bd-sub mono">{{ item.sub }}</span>
          </div>
          <div class="bd-bar-wrap">
            <div class="bd-bar-track">
              <div class="bd-bar-fill" :style="{ width: item.pct + '%', background: item.color }" />
            </div>
            <span class="bd-pct mono" :style="{ color: item.color }">{{ item.pct }}%</span>
          </div>
          <div class="bd-amount mono" :style="{ color: item.color }">
            {{ fmtDollarShort(item.cost) }}
          </div>
        </div>
      </div>

      <!-- ── Perspectiva ── -->
      <div class="perspective">
        <div v-for="m in METRICS" :key="m.label" class="metric-chip">
          <span class="metric-label mono">{{ m.label }}</span>
          <span class="metric-val mono">{{ m.value }}</span>
        </div>
      </div>

      <!-- ── Datos curiosos ── -->
      <div class="fun-facts">
        <div class="ff-title mono">DATOS CURIOSOS</div>
        <div class="ff-grid">
          <!-- Baño -->
          <div class="ff-item">
            <svg class="ff-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 12h16v4a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-4Z"/>
              <path d="M4 12V7a3 3 0 0 1 3-3h1a2 2 0 0 1 2 2v1"/>
              <line x1="12" y1="20" x2="12" y2="23"/>
              <line x1="8"  y1="23" x2="16" y2="23"/>
            </svg>
            <span class="ff-label mono">EL BAÑO</span>
            <span class="ff-val mono">$23M</span>
            <span class="ff-note">Sistema WMS de Orion,<br>basado en UWMS de ISS</span>
          </div>
          <!-- Comida -->
          <div class="ff-item">
            <svg class="ff-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 11h18"/>
              <path d="M5 11V6a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v5"/>
              <rect x="3" y="11" width="18" height="3" rx="1"/>
              <path d="M5 14v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5"/>
              <line x1="9" y1="7" x2="9" y2="11"/>
              <line x1="15" y1="7" x2="15" y2="11"/>
            </svg>
            <span class="ff-label mono">CADA COMIDA</span>
            <span class="ff-val mono">~$83K</span>
            <span class="ff-note">$10M provisiones ÷<br>4 crew × 3/día × 10d</span>
          </div>
          <!-- Traje -->
          <div class="ff-item">
            <svg class="ff-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="6" r="3"/>
              <path d="M6 20v-4a6 6 0 0 1 12 0v4"/>
              <path d="M6 14H4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2"/>
              <path d="M18 14h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2"/>
              <line x1="12" y1="14" x2="12" y2="20"/>
            </svg>
            <span class="ff-label mono">EL TRAJE</span>
            <span class="ff-val mono">$1B</span>
            <span class="ff-note">xEMU desarrollo total<br>NASA OIG IG-21-004</span>
          </div>
        </div>
      </div>

      <!-- ── Nota metodológica ── -->
      <div class="methodology">
        <span class="method-icon">ℹ</span>
        <p class="method-text">
          El contador distribuye el costo total ($4.1B) de forma lineal sobre los 10 días de misión
          (~$4,745/seg). En realidad, ~83% del presupuesto (SLS + Orion) se gastó durante años de
          desarrollo previos al vuelo. Solo Mission Ops (~$300M) es un costo activo durante la misión.
          El contador es una visualización del <em>costo proporcional al tiempo transcurrido</em>,
          no un reflejo del gasto operacional real segundo a segundo.
        </p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { MISSION_EPOCH } from '../composables/useMissionData.js'

// ── Constants (NASA OIG Report 2022 + GAO-23-105338) ─────────────────────────
const TOTAL_COST   = 4_100_000_000
const MISSION_SECS = 10 * 86400          // 10-day mission
const COST_PER_SEC = TOTAL_COST / MISSION_SECS  // ~$4,745/s

const BREAKDOWN = [
  { label: 'SLS Block 1B',   sub: 'Sistema de lanzamiento', cost: 2_100_000_000, pct: 51.2, color: '#a78bfa' },
  { label: 'Orion + ESM',    sub: 'Cápsula + módulo servicio', cost: 1_300_000_000, pct: 31.7, color: '#c4b5fd' },
  { label: 'Ground Systems', sub: 'Exploración KSC',         cost:   400_000_000, pct:  9.8, color: '#818cf8' },
  { label: 'Mission Ops',    sub: 'Operaciones 10 días',     cost:   300_000_000, pct:  7.3, color: '#6366f1' },
]

const METRICS = [
  { label: 'COSTO / KM',       value: '$4,100' },
  { label: 'COSTO / TRIPULANTE', value: '$1.025B' },
  { label: 'COSTO / SEGUNDO',  value: '$4,745' },
  { label: 'VS APOLLO 11',     value: '~3.1×' },
]

// ── Reactive clock ────────────────────────────────────────────────────────────
const now = ref(Date.now())
let timer = null
onMounted(() => { timer = setInterval(() => { now.value = Date.now() }, 1000) })
onUnmounted(() => clearInterval(timer))

const elapsedS   = computed(() => (now.value - MISSION_EPOCH.getTime()) / 1000)
const preLaunch  = computed(() => elapsedS.value < 0)
const missionComplete = computed(() => elapsedS.value >= MISSION_SECS)
const spent      = computed(() => {
  if (preLaunch.value) return TOTAL_COST
  return Math.min(TOTAL_COST, elapsedS.value * COST_PER_SEC)
})
const pctDone = computed(() => Math.min(100, (elapsedS.value / MISSION_SECS) * 100))

// ── Launch countdown ──────────────────────────────────────────────────────────
const launchCountdown = computed(() => {
  const s = Math.abs(Math.floor(elapsedS.value))
  const d = Math.floor(s / 86400)
  const h = Math.floor((s % 86400) / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  if (d > 0) return `${d}d ${String(h).padStart(2,'0')}h ${String(m).padStart(2,'0')}m`
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
})

// ── Formatters ────────────────────────────────────────────────────────────────
function fmtDollar(n) {
  return '$' + Math.floor(n).toLocaleString('en-US')
}
function fmtDollarShort(n) {
  if (n >= 1_000_000_000) return '$' + (n / 1_000_000_000).toFixed(2) + 'B'
  if (n >= 1_000_000)     return '$' + (n / 1_000_000).toFixed(1) + 'M'
  return '$' + Math.floor(n).toLocaleString('en-US')
}
</script>

<style scoped>
/* ── Counter block ── */
.counter-block { text-align: center; padding: 8px 0 4px; }

.counter-label {
  font-size: 0.6rem;
  letter-spacing: 0.18em;
  color: rgba(167,139,250,0.45);
  margin-bottom: 4px;
}

.counter-value {
  font-size: clamp(1.4rem, 2.5vw, 1.9rem);
  font-weight: 700;
  color: #fbbf24;
  text-shadow: 0 0 24px rgba(251,191,36,0.45), 0 0 8px rgba(251,191,36,0.2);
  letter-spacing: 0.04em;
  line-height: 1.1;
  transition: color 0.3s;
}
.counter-value.complete  { color: #34d399; text-shadow: 0 0 24px rgba(52,211,153,0.45); }
.counter-value.prelaunch { color: rgba(167,139,250,0.6); text-shadow: none; }

.counter-sub {
  font-size: 0.65rem;
  margin-top: 4px;
  letter-spacing: 0.08em;
}

/* ── Total progress bar ── */
.total-bar-wrap { padding: 0 4px; }
.total-bar-track {
  height: 4px;
  background: rgba(251,191,36,0.08);
  border-radius: 2px;
  overflow: hidden;
  border: 1px solid rgba(251,191,36,0.12);
}
.total-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #92400e, #fbbf24);
  border-radius: 2px;
  transition: width 1s linear;
  box-shadow: 0 0 6px rgba(251,191,36,0.4);
}

/* ── Breakdown ── */
.breakdown { display: flex; flex-direction: column; gap: 8px; }

.breakdown-row {
  display: grid;
  grid-template-columns: 1fr 2fr auto;
  gap: 10px;
  align-items: center;
}

.bd-left { min-width: 0; }
.bd-label {
  display: block;
  font-size: 0.68rem;
  color: rgba(255,255,255,0.75);
  letter-spacing: 0.05em;
  white-space: nowrap;
}
.bd-sub {
  display: block;
  font-size: 0.57rem;
  color: rgba(167,139,250,0.35);
  letter-spacing: 0.04em;
}

.bd-bar-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
}
.bd-bar-track {
  flex: 1;
  height: 5px;
  background: rgba(255,255,255,0.05);
  border-radius: 3px;
  overflow: hidden;
}
.bd-bar-fill {
  height: 100%;
  border-radius: 3px;
  opacity: 0.8;
}
.bd-pct {
  font-size: 0.6rem;
  min-width: 32px;
  text-align: right;
}

.bd-amount {
  font-size: 0.68rem;
  font-weight: 600;
  text-align: right;
  min-width: 52px;
  white-space: nowrap;
}

/* ── Perspective metrics ── */
.perspective {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
  padding-top: 4px;
  border-top: 1px solid rgba(167,139,250,0.08);
}

.metric-chip {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 6px 4px;
  background: rgba(167,139,250,0.04);
  border: 1px solid rgba(167,139,250,0.1);
  border-radius: 4px;
}
.metric-label {
  font-size: 0.52rem;
  color: rgba(167,139,250,0.4);
  letter-spacing: 0.08em;
  text-align: center;
}
.metric-val {
  font-size: 0.72rem;
  font-weight: 700;
  color: rgba(167,139,250,0.8);
}

/* ── Fun facts ── */
.fun-facts {
  border-top: 1px solid rgba(167,139,250,0.08);
  padding-top: 10px;
}
.ff-title {
  font-size: 0.58rem;
  letter-spacing: 0.18em;
  color: rgba(167,139,250,0.35);
  margin-bottom: 8px;
}
.ff-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}
.ff-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px 6px;
  background: rgba(167,139,250,0.03);
  border: 1px solid rgba(167,139,250,0.08);
  border-radius: 5px;
  text-align: center;
}
.ff-icon   { width: 22px; height: 22px; color: rgba(167,139,250,0.5); }
.ff-label  { font-size: 0.52rem; letter-spacing: 0.1em; color: rgba(167,139,250,0.4); margin-top: 2px; }
.ff-val    { font-size: 0.9rem; font-weight: 700; color: #fbbf24; text-shadow: 0 0 10px rgba(251,191,36,0.3); }
.ff-note   { font-size: 0.55rem; color: #4e4470; line-height: 1.4; }

/* ── Methodology note ── */
.methodology {
  display: flex;
  gap: 8px;
  padding: 8px 10px;
  background: rgba(167,139,250,0.04);
  border: 1px solid rgba(167,139,250,0.1);
  border-radius: 4px;
}
.method-icon {
  font-size: 0.7rem;
  color: rgba(167,139,250,0.4);
  flex-shrink: 0;
  margin-top: 1px;
}
.method-text {
  font-size: 0.65rem;
  line-height: 1.55;
  color: #4e4470;
  margin: 0;
}
.method-text em {
  font-style: normal;
  color: rgba(167,139,250,0.55);
}

@media (max-width: 680px) {
  .breakdown-row { grid-template-columns: 1fr 1.5fr auto; gap: 6px; }
  .perspective { grid-template-columns: repeat(2, 1fr); }
}
</style>
