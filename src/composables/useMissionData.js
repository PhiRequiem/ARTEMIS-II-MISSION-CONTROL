import { ref, computed, onMounted, onUnmounted } from 'vue'
import { missionEpoch, missionFallback } from './useMission.js'

// Re-export for backward compat
export { missionEpoch as MISSION_EPOCH, missionFallback as FALLBACK_DATA }
export { missionPhases as MISSION_PHASES } from './useMission.js'

export function getMissionDay() {
  const epoch = missionEpoch.value
  if (!epoch) return 1
  const elapsed = (new Date() - epoch) / (1000 * 60 * 60 * 24)
  const data = missionFallback.value
  return Math.max(1, Math.min(data.length || 10, Math.floor(elapsed) + 1))
}

export function getFallbackForDay(day) {
  const epoch = missionEpoch.value
  const data  = missionFallback.value
  if (!epoch || !data.length) return { distEarth: 0, distMoon: 384000, vel: '0.00', tempExt: '20.0', tempCabin: '21.0', dsn: '1.30', phase: 'unknown', source: 'fallback' }

  const d = data.find(f => f.day === day) || data[data.length - 1]
  const elapsed = (new Date() - epoch) / (1000 * 60 * 60 * 24)
  const frac = Math.max(0, elapsed - Math.floor(elapsed))
  const next = data.find(f => f.day === day + 1)

  let distEarth = next ? d.distEarth + (next.distEarth - d.distEarth) * frac : d.distEarth
  let distMoon  = next ? d.distMoon  + (next.distMoon  - d.distMoon)  * frac : d.distMoon
  let vel       = next ? d.vel       + (next.vel       - d.vel)       * frac : d.vel
  let phase     = d.phase

  const missionDays = data.length
  if (elapsed >= missionDays - 0.95) {
    distEarth = 0
    vel = 0
    phase = 'splashdown'
  }

  return {
    distEarth:   Math.round(distEarth),
    distMoon:    Math.round(distMoon),
    vel:         vel.toFixed(2),
    tempExt:     phase === 'splashdown' ? '20.0' : (-90 + Math.sin(elapsed * 0.7) * 40).toFixed(1),
    tempCabin:   phase === 'splashdown' ? '21.0' : (20 + Math.sin(elapsed * 0.3) * 3).toFixed(1),
    dsn:         (1.3 + distEarth / 400000 * 1.8).toFixed(2),
    phase,
    source:      'fallback',
  }
}

// ── Static fallback space weather events (realistic CME data) ──────────────
const STATIC_WEATHER = [
  { id: 'sw1', type: 'CME', time: '2026-04-04T14:24Z', speed: 487, note: 'C-class flare associated. Low geomagnetic impact expected.' },
  { id: 'sw2', type: 'CME', time: '2026-04-03T08:12Z', speed: 623, note: 'Partial halo CME. NOAA SWPC monitoring.' },
  { id: 'sw3', type: 'CME', time: '2026-04-01T21:36Z', speed: 312, note: 'Slow CME, minimal radiation risk for crew.' },
]

// ── Static fallback news items ───────────────────────────────────────────────
const STATIC_NEWS = [
  { title: 'Artemis II crew completes first deep-space manual piloting test', date: '2026-04-04', link: 'https://www.nasa.gov' },
  { title: "Orion's life support systems performing nominally at 4-day mark", date: '2026-04-04', link: 'https://www.nasa.gov' },
  { title: 'Koch and Hansen conduct suit pressure checks ahead of lunar flyby', date: '2026-04-03', link: 'https://www.nasa.gov' },
  { title: 'Mission Control confirms free-return trajectory — no burn needed', date: '2026-04-02', link: 'https://www.nasa.gov' },
  { title: 'Victor Glover becomes first Black astronaut to reach deep space', date: '2026-04-02', link: 'https://www.nasa.gov' },
  { title: 'SLS Block 1B performs nominally; ESM solar arrays at full power', date: '2026-04-01', link: 'https://www.nasa.gov' },
]

export function useMissionData() {
  const telemetry    = ref(getFallbackForDay(getMissionDay()))
  const spaceWeather = ref(STATIC_WEATHER)
  const newsItems    = ref(STATIC_NEWS)
  const dataSource   = ref('fallback')
  const lastUpdate   = ref(null)

  // Separate timers: telemetry every 30s, DONKI every 20min (avoids 429)
  let telemetryTimer = null
  let donkiTimer     = null
  let newsTimer      = null

  // ── Telemetry: interpolated fallback only (JPL Horizons blocks CORS) ──────
  function refreshTelemetry() {
    telemetry.value  = getFallbackForDay(getMissionDay())
    dataSource.value = 'fallback'
    lastUpdate.value = new Date()
  }

  // ── DONKI via api.nasa.gov (CORS OK, 1000 req/hr) ───────────────────────────
  const NASA_API_KEY = import.meta.env.VITE_NASA_API_KEY
  async function fetchDONKI() {
    const end   = new Date().toISOString().slice(0, 10)
    const start = new Date(Date.now() - 7 * 86400_000).toISOString().slice(0, 10)
    const url   = `https://api.nasa.gov/DONKI/CME?startDate=${start}&endDate=${end}&api_key=${NASA_API_KEY}`
    const res   = await fetch(url, { signal: AbortSignal.timeout(10_000) })
    if (!res.ok) throw new Error(`DONKI ${res.status}`)
    const data  = await res.json()
    if (!Array.isArray(data) || !data.length) throw new Error('empty')
    spaceWeather.value = data.slice(0, 5).map(e => ({
      id:    e.activityID,
      type:  'CME',
      time:  e.startTime,
      note:  e.note || '',
      speed: e.cmeAnalyses?.[0]?.speed || null,
    }))
  }

  // ── Spaceflight News API (JSON, no key, no proxy) ────────────────────────
  async function fetchNews() {
    try {
      const url = 'https://api.spaceflightnewsapi.net/v4/articles/?search=artemis&limit=6&ordering=-published_at'
      const res = await fetch(url, { signal: AbortSignal.timeout(10_000) })
      if (!res.ok) throw new Error(`SNAPI ${res.status}`)
      const data = await res.json()
      if (data.results?.length) {
        newsItems.value = data.results.map(i => ({
          title: i.title,
          date:  i.published_at,
          link:  i.url,
        }))
        return
      }
    } catch { /* keep static fallback */ }
  }

  onMounted(() => {
    // Telemetry: update every 1s (pure local calculation, no network)
    refreshTelemetry()
    telemetryTimer = setInterval(refreshTelemetry, 1000)

    // DONKI: once at boot, then every 20min to stay under rate limit
    fetchDONKI().catch(() => {})
    donkiTimer = setInterval(() => fetchDONKI().catch(() => {}), 20 * 60_000)

    // News: once at boot, then every 10min
    fetchNews()
    newsTimer = setInterval(fetchNews, 10 * 60_000)
  })

  onUnmounted(() => {
    clearInterval(telemetryTimer)
    clearInterval(donkiTimer)
    clearInterval(newsTimer)
  })

  return { telemetry, spaceWeather, newsItems, dataSource, lastUpdate }
}
