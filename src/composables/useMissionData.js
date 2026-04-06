import { ref, computed, onMounted, onUnmounted } from 'vue'

// Mission epoch: Artemis II launch
export const MISSION_EPOCH = new Date('2026-04-01T22:35:00Z')

// Mission phases
export const MISSION_PHASES = [
  { id: 'launch',   label: 'Launch',   day: 1,  end: 0.5  },
  { id: 'orbit',    label: 'Orbit',    day: 1,  end: 1.0  },
  { id: 'tli',      label: 'TLI',      day: 2,  end: 2.0  },
  { id: 'transit',  label: 'Transit',  day: 3,  end: 5.0  },
  { id: 'flyby',    label: 'Flyby',    day: 6,  end: 6.5  },
  { id: 'return',   label: 'Return',   day: 7,  end: 9.5  },
  { id: 'reentry',  label: 'Reentry',  day: 10, end: 10.5 },
]

// Fallback telemetry by mission day
export const FALLBACK_DATA = [
  { day: 1,  distEarth: 400,     distMoon: 384000, vel: 7.8,  phase: 'orbit'   },
  { day: 2,  distEarth: 85000,   distMoon: 299000, vel: 3.2,  phase: 'tli'     },
  { day: 3,  distEarth: 195000,  distMoon: 189000, vel: 1.8,  phase: 'transit' },
  { day: 4,  distEarth: 270000,  distMoon: 115000, vel: 1.2,  phase: 'transit' },
  { day: 5,  distEarth: 342000,  distMoon: 43000,  vel: 1.0,  phase: 'transit' },
  { day: 6,  distEarth: 390000,  distMoon: 6400,   vel: 0.9,  phase: 'flyby'   },
  { day: 7,  distEarth: 350000,  distMoon: 35000,  vel: 1.1,  phase: 'return'  },
  { day: 8,  distEarth: 270000,  distMoon: 115000, vel: 1.4,  phase: 'return'  },
  { day: 9,  distEarth: 160000,  distMoon: 225000, vel: 2.1,  phase: 'return'  },
  { day: 10, distEarth: 8000,    distMoon: 377000, vel: 7.2,  phase: 'reentry' },
]

export function getMissionDay() {
  const now = new Date()
  const elapsed = (now - MISSION_EPOCH) / (1000 * 60 * 60 * 24)
  return Math.max(1, Math.min(10, Math.floor(elapsed) + 1))
}

export function getFallbackForDay(day) {
  const d = FALLBACK_DATA.find(f => f.day === day) || FALLBACK_DATA[0]
  // Add interpolated/estimated values
  const elapsed = (new Date() - MISSION_EPOCH) / (1000 * 60 * 60 * 24)
  const frac = elapsed - Math.floor(elapsed)
  // Interpolate between days
  const next = FALLBACK_DATA.find(f => f.day === day + 1)
  const distEarth = next ? d.distEarth + (next.distEarth - d.distEarth) * frac : d.distEarth
  const distMoon  = next ? d.distMoon  + (next.distMoon  - d.distMoon)  * frac : d.distMoon
  const vel       = next ? d.vel       + (next.vel       - d.vel)       * frac : d.vel

  return {
    distEarth:   Math.round(distEarth),
    distMoon:    Math.round(distMoon),
    vel:         vel.toFixed(2),
    tempExt:     (-90 + Math.sin(elapsed * 0.7) * 40).toFixed(1),
    tempCabin:   (20 + Math.sin(elapsed * 0.3) * 3).toFixed(1),
    dsn:         (1.3 + distEarth / 400000 * 1.8).toFixed(2),
    phase:       d.phase,
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

  // ── DONKI via api.nasa.gov (CORS OK, rate-limit 30 req/hr w/ DEMO_KEY) ────
  async function fetchDONKI() {
    const end   = new Date().toISOString().slice(0, 10)
    const start = new Date(Date.now() - 7 * 86400_000).toISOString().slice(0, 10)
    const url   = `https://api.nasa.gov/DONKI/CME?startDate=${start}&endDate=${end}&api_key=DEMO_KEY`
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

  // ── RSS via rss2json.com ──────────────────────────────────────────────────
  async function fetchNews() {
    const candidates = [
      'https://www.nasa.gov/feed/',
      'https://blogs.nasa.gov/artemis/feed/',
      'https://spacenews.com/feed/',
    ]
    for (const feed of candidates) {
      try {
        const url = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed)}&count=6`
        const res = await fetch(url, { signal: AbortSignal.timeout(10_000) })
        if (!res.ok) continue
        const data = await res.json()
        if (data.status === 'ok' && data.items?.length) {
          newsItems.value = data.items.map(i => ({ title: i.title, date: i.pubDate, link: i.link }))
          return
        }
      } catch { /* try next */ }
    }
    // keep static fallback — no throw needed
  }

  onMounted(() => {
    // Telemetry: update every 30s (pure local calculation, no network)
    refreshTelemetry()
    telemetryTimer = setInterval(refreshTelemetry, 30_000)

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
