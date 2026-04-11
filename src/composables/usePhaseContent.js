import { computed, ref, onMounted, onUnmounted } from 'vue'
import { MISSION_EPOCH } from './useMissionData.js'

// ── Key mission timestamps (seconds after epoch) ──────────────────────────
const T = {
  LAUNCH:          0,
  ORBIT:           0.5  * 86400,   // D1 +12h
  TLI_START:       1.0  * 86400,   // D2
  TLI_BURN_START:  1.02 * 86400,   // TLI ignition
  TLI_BURN_END:    1.025 * 86400,  // ~6 min burn
  MCC1:            2.5  * 86400,   // Mid-course correction 1
  MCC2:            4.5  * 86400,   // Mid-course correction 2
  FLYBY_APPROACH:  5.5  * 86400,   // Flyby prep begins
  FLYBY_CLOSEST:   5.75 * 86400,   // Closest approach ~6,400 km
  BLACKOUT_START:  5.748 * 86400,  // -11 min from closest
  BLACKOUT_END:    5.763 * 86400,  // +11 min from closest (~22 min)
  RETURN_BURN:     6.5  * 86400,   // TEI burn
  MCC3:            8.0  * 86400,   // Mid-course return
  ENTRY_MINUS_1H:  8.95 * 86400,   // Entry interface -1h
  ENTRY_INTERFACE: 9.0  * 86400,   // EI ~120km altitude
  PEAK_HEATING:    9.008 * 86400,  // ~7 min after EI
  CHUTE_DEPLOY:    9.02 * 86400,   // Parachute deploy
  SPLASHDOWN:      9.04 * 86400,   // Splashdown
  MISSION_END:     9.05 * 86400,
}

export function ms2s(ms) { return ms / 1000 }
export function s2ms(s)  { return s * 1000  }

export function usePhaseContent() {
  const now = ref(new Date())
  let timer = null
  onMounted(() => { timer = setInterval(() => now.value = new Date(), 1000) })
  onUnmounted(() => clearInterval(timer))

  const elapsedS = computed(() => ms2s(now.value - MISSION_EPOCH))

  // ── Helpers ──────────────────────────────────────────────────────────────
  function secUntil(key)  { return Math.max(0, T[key] - elapsedS.value) }
  function secSince(key)  { return Math.max(0, elapsedS.value - T[key]) }
  function between(a, b)  { return elapsedS.value >= T[a] && elapsedS.value < T[b] }
  function past(key)      { return elapsedS.value >= T[key] }
  function fmtHMS(s) {
    s = Math.max(0, Math.floor(s))
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = s % 60
    if (h > 0)  return `${h}h ${String(m).padStart(2,'0')}m ${String(sec).padStart(2,'0')}s`
    if (m > 0)  return `${String(m).padStart(2,'0')}m ${String(sec).padStart(2,'0')}s`
    return `${String(sec).padStart(2,'0')}s`
  }
  function fmtMS(s) {
    s = Math.max(0, Math.floor(s))
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
  }

  // ── Phase detection ───────────────────────────────────────────────────────
  const activePhase = computed(() => {
    const s = elapsedS.value
    if (s < 0)                            return 'pre'
    if (between('LAUNCH', 'ORBIT'))       return 'launch'
    if (between('ORBIT', 'TLI_START'))    return 'orbit'
    if (between('TLI_START', 'MCC1'))     return 'tli'
    if (between('MCC1', 'FLYBY_APPROACH'))return 'transit'
    if (between('FLYBY_APPROACH', 'RETURN_BURN')) return 'flyby'
    if (between('RETURN_BURN', 'ENTRY_MINUS_1H')) return 'return'
    if (between('ENTRY_MINUS_1H', 'MISSION_END')) return 'reentry'
    return 'complete'
  })

  // ── Phase-specific payload ────────────────────────────────────────────────
  const phaseContent = computed(() => {
    const s  = elapsedS.value
    const ph = activePhase.value

    // ── PRE-LAUNCH ──
    if (ph === 'pre') {
      return {
        type: 'countdown',
        severity: 'nominal',
        title: 'LAUNCH COUNTDOWN',
        subtitle: 'SLS Block 1B · Launch Complex 39B',
        countdown: fmtHMS(secUntil('LAUNCH')),
        lines: [
          { label: 'LIFTOFF', value: 'T-' + fmtHMS(secUntil('LAUNCH')), color: '#fbbf24' },
          { label: 'STATUS',  value: 'GO FOR LAUNCH', color: '#34d399' },
        ],
      }
    }

    // ── LAUNCH / ASCENT ──
    if (ph === 'launch') {
      const burnTime = Math.min(secSince('LAUNCH'), 480)
      return {
        type: 'launch',
        severity: 'active',
        title: 'ASCENT IN PROGRESS',
        subtitle: `MET + ${fmtHMS(secSince('LAUNCH'))}`,
        lines: [
          { label: 'FASE',      value: burnTime < 130 ? 'MAX-Q' : burnTime < 260 ? 'CORE STAGING' : 'ORBIT INSERT', color: '#a78bfa' },
          { label: 'ALTITUD',   value: `~${Math.round(burnTime * 0.6)} km`, color: '#c4b5fd' },
          { label: 'NEXT',      value: 'Inserción órbita D1 +12h', color: '#4e4470' },
        ],
      }
    }

    // ── EARTH ORBIT ──
    if (ph === 'orbit') {
      return {
        type: 'orbit',
        severity: 'nominal',
        title: 'PARKING ORBIT — NOMINAL',
        subtitle: 'Preparando Trans-Lunar Injection',
        lines: [
          { label: 'ALTITUD',  value: '~322 km circular', color: '#a78bfa' },
          { label: 'PERÍODO',  value: '~90 min', color: '#c4b5fd' },
          { label: 'TLI EN',   value: fmtHMS(secUntil('TLI_BURN_START')), color: '#fbbf24' },
        ],
      }
    }

    // ── TLI ──
    if (ph === 'tli') {
      const burnActive = between('TLI_BURN_START', 'TLI_BURN_END')
      const burnProgress = burnActive
        ? Math.min(100, (secSince('TLI_BURN_START') / (T.TLI_BURN_END - T.TLI_BURN_START)) * 100)
        : past('TLI_BURN_END') ? 100 : 0

      return {
        type: 'tli',
        severity: burnActive ? 'active' : 'nominal',
        title: burnActive ? '🔥 TLI BURN IN PROGRESS' : past('TLI_BURN_END') ? 'TLI COMPLETE — EN RUTA' : 'TLI PROGRAMADO',
        subtitle: burnActive ? 'ICPS Engine · ΔV ~3.1 km/s' : past('TLI_BURN_END') ? 'Órbita terrestre abandonada' : 'Preparando ICPS',
        burnProgress,
        lines: [
          { label: 'ΔV OBJETIVO', value: '3.126 km/s',  color: '#a78bfa' },
          { label: 'DURACIÓN',    value: '~6 min 00s',  color: '#c4b5fd' },
          { label: 'PROGRESO',    value: burnProgress.toFixed(0) + '%', color: burnActive ? '#fbbf24' : '#34d399' },
          { label: 'MCC-1 EN',    value: fmtHMS(secUntil('MCC1')), color: '#4e4470' },
        ],
      }
    }

    // ── TRANSIT ──
    if (ph === 'transit') {
      const toFlyby  = secUntil('FLYBY_CLOSEST')
      const nearMCC2 = Math.abs(s - T.MCC2) < 7200 // within 2h of MCC2
      return {
        type: 'transit',
        severity: nearMCC2 ? 'advisory' : 'nominal',
        title: nearMCC2 ? '⚡ MID-COURSE CORRECTION' : 'TRÁNSITO LUNAR — NOMINAL',
        subtitle: nearMCC2 ? 'ESM Burn #2 · Refinamiento de trayectoria' : 'Free-return trajectory confirmada',
        lines: [
          { label: 'FLYBY EN',  value: fmtHMS(toFlyby), color: '#fbbf24' },
          { label: 'APRÓACH',   value: '~6,400 km superficie', color: '#c4b5fd' },
          { label: 'TRAYEC.',   value: 'FREE-RETURN NOMINAL', color: '#34d399' },
          ...(nearMCC2 ? [{ label: 'BURN EN', value: fmtHMS(secUntil('MCC2')), color: '#fbbf24' }] : []),
        ],
      }
    }

    // ── FLYBY ──
    if (ph === 'flyby') {
      const inBlackout  = between('BLACKOUT_START', 'BLACKOUT_END')
      const toBlackout  = secUntil('BLACKOUT_START')
      const toClosest   = secUntil('FLYBY_CLOSEST')
      const toBlackEnd  = secUntil('BLACKOUT_END')
      const blackProg   = inBlackout
        ? (secSince('BLACKOUT_START') / (T.BLACKOUT_END - T.BLACKOUT_START)) * 100
        : 0

      return {
        type: 'flyby',
        severity: inBlackout ? 'blackout' : toBlackout < 3600 ? 'warning' : 'advisory',
        title: inBlackout
          ? '📡 BLACKOUT — SEÑAL PERDIDA'
          : past('FLYBY_CLOSEST')
          ? '✓ FLYBY COMPLETADO — RETORNO'
          : toBlackout < 3600
          ? `⚠ BLACKOUT EN ${fmtHMS(toBlackout)}`
          : 'APROXIMACIÓN LUNAR',
        subtitle: inBlackout
          ? `Blackout esperado ~22 min · Fin en ${fmtHMS(toBlackEnd)}`
          : past('FLYBY_CLOSEST')
          ? 'Burn de retorno programado · Trans-Earth Injection'
          : 'Cara oculta lunar · Pérdida temporal de señal DSN',
        blackoutProgress: blackProg,
        inBlackout,
        lines: inBlackout ? [
          { label: 'BLACKOUT',   value: 'ACTIVO', color: '#f87171' },
          { label: 'DURACIÓN',   value: '~22 min', color: '#fbbf24' },
          { label: 'PROG.',      value: blackProg.toFixed(0) + '%', color: '#fbbf24' },
          { label: 'FIN EN',     value: fmtHMS(toBlackEnd), color: '#c4b5fd' },
        ] : past('FLYBY_CLOSEST') ? [
          { label: 'CLOSEST',   value: `~6,400 km ✓`, color: '#34d399' },
          { label: 'TEI EN',    value: fmtHMS(secUntil('RETURN_BURN')), color: '#fbbf24' },
          { label: 'STATUS',    value: 'ALL SYSTEMS GO', color: '#34d399' },
        ] : [
          { label: 'CLOSEST EN', value: fmtHMS(toClosest), color: '#fbbf24' },
          { label: 'DIST. MÍN',  value: '6,400 km', color: '#c4b5fd' },
          { label: 'BLACKOUT',   value: `en ${fmtHMS(toBlackout)}`, color: '#f87171' },
          { label: 'DURACIÓN',   value: '~22 min', color: '#4e4470' },
        ],
      }
    }

    // ── RETURN ──
    if (ph === 'return') {
      const teiActive = between('RETURN_BURN', 'MCC3') && s < T.RETURN_BURN + 480
      return {
        type: 'return',
        severity: teiActive ? 'active' : 'nominal',
        title: teiActive ? '🔥 TEI BURN — TRANS-EARTH INJECTION' : 'TRAYECTORIA DE RETORNO',
        subtitle: teiActive ? 'ESM Main Engine · ΔV ~900 m/s' : 'En ruta hacia la Tierra',
        lines: [
          { label: 'ENTRY EN',   value: fmtHMS(secUntil('ENTRY_INTERFACE')), color: '#fbbf24' },
          { label: 'SPLASHDOWN', value: fmtHMS(secUntil('SPLASHDOWN')), color: '#a78bfa' },
          { label: 'ZONA RECUP', value: '28°N 122°W · Pacífico', color: '#c4b5fd' },
          { label: 'TRAYEC.',    value: 'NOMINAL', color: '#34d399' },
        ],
      }
    }

    // ── REENTRY ──
    if (ph === 'reentry') {
      const toEI       = secUntil('ENTRY_INTERFACE')
      const sinceEI    = secSince('ENTRY_INTERFACE')
      const preEntry   = !past('ENTRY_INTERFACE')
      const inEntry    = between('ENTRY_INTERFACE', 'CHUTE_DEPLOY')
      const inChutes   = between('CHUTE_DEPLOY', 'SPLASHDOWN')
      const splashed   = past('SPLASHDOWN')

      // G-force curve: 0→8G over 7min then drop
      let gforce = 0
      if (inEntry) {
        const t = sinceEI / (T.CHUTE_DEPLOY - T.ENTRY_INTERFACE)
        gforce = t < 0.5 ? t * 2 * 8 : (1 - t) * 2 * 8
        gforce = Math.max(0.5, gforce)
      } else if (inChutes) {
        gforce = 1.2
      }

      return {
        type: 'reentry',
        severity: splashed ? 'complete' : inEntry ? 'critical' : inChutes ? 'advisory' : 'warning',
        title: splashed  ? '🎉 AMERIZAJE CONFIRMADO'
             : inChutes  ? '🪂 PARACAÍDAS DESPLEGADOS'
             : inEntry   ? '🔥 REENTRADA ATMOSFÉRICA'
             : preEntry  ? `⚠ REENTRADA EN ${fmtHMS(toEI)}`
             : 'REENTRADA',
        subtitle: splashed  ? 'Equipo de recuperación en ruta · Océano Pacífico'
                : inChutes  ? 'Descenso nominal · Impacto en ~' + fmtHMS(secUntil('SPLASHDOWN'))
                : inEntry   ? `Vel. ~40,000 km/h · Escudo térmico activo · ${gforce.toFixed(1)}G`
                : `EI en ${fmtHMS(toEI)} · Escudo térmico listo`,
        gforce: gforce,
        showGForce: inEntry || inChutes,
        lines: splashed ? [
          { label: 'STATUS',    value: 'AMERIZADO ✓', color: '#34d399' },
          { label: 'UBICACIÓN', value: '28°N 122°W', color: '#a78bfa' },
          { label: 'MISIÓN',    value: 'COMPLETADA', color: '#34d399' },
        ] : inEntry ? [
          { label: 'G-FORCE',   value: gforce.toFixed(1) + ' G', color: gforce > 5 ? '#f87171' : '#fbbf24' },
          { label: 'ALTITUD',   value: `~${Math.max(0, Math.round(120 - sinceEI * 0.02))} km`, color: '#c4b5fd' },
          { label: 'PARACAÍDAS',value: 'T-' + fmtHMS(secUntil('CHUTE_DEPLOY')), color: '#a78bfa' },
          { label: 'SPLASHDOWN',value: 'T-' + fmtHMS(secUntil('SPLASHDOWN')), color: '#fbbf24' },
        ] : [
          { label: 'ENTRY IF.', value: 'T-' + fmtHMS(toEI), color: '#fbbf24' },
          { label: 'SPLASHDOWN',value: 'T-' + fmtHMS(secUntil('SPLASHDOWN')), color: '#a78bfa' },
          { label: 'ZONA RECUP',value: '28°N 122°W', color: '#c4b5fd' },
          { label: 'ESCUDO',    value: 'NOMINAL', color: '#34d399' },
        ],
      }
    }

    // ── COMPLETE ──
    if (ph === 'complete') {
      return {
        type: 'complete',
        severity: 'complete',
        title: '🎉 MISIÓN COMPLETADA',
        subtitle: 'Orion recuperada · Objetivos técnicos cumplidos',
        lines: [
          { label: 'STATUS',    value: 'RECUPERADA ✓', color: '#34d399' },
          { label: 'UBICACIÓN', value: 'Base Naval', color: '#a78bfa' },
          { label: 'DATOS',     value: 'ANALIZANDO', color: '#fbbf24' },
          { label: 'MISIÓN',    value: 'ÉXITO', color: '#34d399' },
        ],
      }
    }

    return null
  })

  return { activePhase, phaseContent, elapsedS }
}
