import { ref, computed } from 'vue'
import { missionEpoch, missionFallback } from './useMission.js'

function getMissionDay() {
  const epoch = missionEpoch.value
  if (!epoch) return 1
  const elapsed = (new Date() - epoch) / (1000 * 60 * 60 * 24)
  const len = missionFallback.value.length || 10
  return Math.max(1, Math.min(len, Math.floor(elapsed) + 1))
}

// ── System definitions with dynamic values ────────────────────────────────
// Base values interpolated slightly by mission day to feel alive
function computeSystems() {
  const day = getMissionDay()
  const t   = (day - 1) / 9   // 0→1 over mission

  return [
    { id: 'prop',   label: 'PROP/ESM',  pct: Math.round(96 - t * 8),   warn: 75, crit: 60,  barColor: '#a78bfa', dotColor: '#34d399' },
    { id: 'elec',   label: 'ELEC/PWR',  pct: Math.round(94 - t * 6),   warn: 75, crit: 60,  barColor: '#a78bfa', dotColor: '#34d399' },
    { id: 'life',   label: 'LIFE SUP',  pct: Math.round(99 - t * 3),   warn: 85, crit: 70,  barColor: '#a78bfa', dotColor: '#34d399' },
    { id: 'comms',  label: 'COMM/DSN',  pct: 100,                       warn: 80, crit: 65,  barColor: '#a78bfa', dotColor: '#34d399' },
    { id: 'therm',  label: 'THERMAL',   pct: Math.round(96 - t * 4),   warn: 78, crit: 65,  barColor: '#a78bfa', dotColor: '#34d399' },
    { id: 'toilet', label: 'TOILET',    pct: Math.round(85 - t * 18),  warn: 50, crit: 25,  barColor: '#fbbf24', dotColor: '#fbbf24' },
  ]
}

// ── Derive overall status from systems ────────────────────────────────────
function deriveStatus(systems) {
  const critical = systems.filter(s => s.id !== 'toilet' && s.pct < s.crit)
  const warning  = systems.filter(s => s.id !== 'toilet' && s.pct < s.warn)
  if (critical.length)            return 'CRITICAL'
  if (warning.length)             return 'CAUTION'
  const toiletPct = systems.find(s => s.id === 'toilet')?.pct ?? 100
  if (toiletPct < 40)             return 'ADVISORY'
  return 'NOMINAL'
}

export function useSystemStatus() {
  const systems = ref(computeSystems())

  // Recompute every 60s (values change slowly over mission days)
  let timer = null
  function refresh() { systems.value = computeSystems() }

  if (typeof window !== 'undefined') {
    timer = setInterval(refresh, 60_000)
  }
  function dispose() { clearInterval(timer) }

  const vehicleStatus = computed(() => deriveStatus(systems.value))

  const crewStatus = computed(() => {
    const ls  = systems.value.find(s => s.id === 'life')?.pct ?? 100
    const th  = systems.value.find(s => s.id === 'therm')?.pct ?? 100
    if (ls < 70 || th < 65)  return 'CRITICAL'
    if (ls < 85 || th < 78)  return 'CAUTION'
    return 'NOMINAL'
  })

  // Per-system dot state
  const systemsWithState = computed(() => systems.value.map(s => ({
    ...s,
    state: s.pct < s.crit ? 'crit' : s.pct < s.warn ? 'warn' : 'ok',
    dotColor: s.pct < s.crit ? '#f87171' : s.pct < s.warn ? '#fbbf24' : s.dotColor,
    barColor: s.pct < s.crit ? '#f87171' : s.pct < s.warn ? '#fbbf24' : s.barColor,
  })))

  return { systems: systemsWithState, vehicleStatus, crewStatus, dispose }
}
