import { ref, computed, onMounted, onUnmounted } from 'vue'
import { MISSIONS, MISSIONS_BY_ID } from '../missions/index.js'

const STORAGE_KEY = 'artemis_active_mission'

const _active = ref(localStorage.getItem(STORAGE_KEY) || 'artemis3')

// Module-level reactive exports — safe to import outside setup()
const _mission = computed(() => MISSIONS_BY_ID[_active.value] ?? MISSIONS_BY_ID['artemis2'])

export const missionEpoch    = computed(() => _mission.value.epoch ?? new Date('2026-04-01T22:35:00Z'))
export const missionPhases   = computed(() => _mission.value.phases ?? [])
export const missionFallback = computed(() => _mission.value.fallbackData ?? [])
export const missionSplashdown = computed(() => {
  const epoch = _mission.value.epoch
  const offset = _mission.value.splashdownOffset ?? 0
  return epoch ? new Date(epoch.getTime() + offset) : null
})

// Composable para un "now" que se congela en splashdown para misiones completadas
export function useFrozenNow(intervalMs = 1000) {
  const raw = ref(new Date())
  let timer = null
  onMounted(() => { timer = setInterval(() => { raw.value = new Date() }, intervalMs) })
  onUnmounted(() => clearInterval(timer))

  const now = computed(() => {
    const sd = missionSplashdown.value
    const mission = _mission.value
    if (mission.state === 'historical' && sd && raw.value >= sd) return sd
    return raw.value
  })
  return now
}

export function useMission() {
  const activeMissionId = _active

  function setMission(id) {
    if (!MISSIONS_BY_ID[id]) return
    _active.value = id
    localStorage.setItem(STORAGE_KEY, id)
  }

  const currentMission = computed(() => MISSIONS_BY_ID[_active.value] ?? MISSIONS_BY_ID['artemis3'])

  const missionState = computed(() => currentMission.value.state)

  const isHistorical = computed(() => missionState.value === 'historical')
  const isPreLaunch  = computed(() => missionState.value === 'pre-launch')
  const isActive     = computed(() => missionState.value === 'active')

  const accentColor  = computed(() => currentMission.value.accentColor)
  const accentShadow = computed(() => currentMission.value.accentShadow)

  return {
    activeMissionId,
    currentMission,
    missionState,
    isHistorical,
    isPreLaunch,
    isActive,
    accentColor,
    accentShadow,
    setMission,
    missions: MISSIONS,
  }
}
