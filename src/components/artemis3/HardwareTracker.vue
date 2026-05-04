<template>
  <div class="panel flex flex-col">
    <div class="panel-title a3">
      HARDWARE STATUS
      <span class="ml-auto mono text-[11px]" style="color:var(--t-mute)">SLS · ORION · HLS</span>
    </div>

    <div class="p-4 flex flex-col gap-4">

      <!-- Status cards grid -->
      <div class="grid grid-cols-2 gap-3">
        <div v-for="hw in hardware" :key="hw.id" class="hw-card">
          <div class="flex items-start justify-between gap-2 mb-1.5">
            <div>
              <div class="hw-name">{{ hw.name }}</div>
              <div class="hw-sub">{{ hw.sub }}</div>
            </div>
            <span class="status-pill" :class="hw.status">{{ STATUS_LABELS[hw.status] }}</span>
          </div>
          <p class="hw-desc">{{ hw.desc }}</p>
          <div v-if="hw.target" class="hw-target">
            <span class="mono text-[11px]" style="color:var(--t-mute)">TARGET:</span>
            <span class="mono text-[11px] font-bold" style="color:var(--t-hi)">{{ hw.target }}</span>
          </div>
          <a v-if="hw.link" :href="hw.link" target="_blank" rel="noopener" class="hw-link">↗ fuente</a>
        </div>
      </div>

      <!-- Latest hardware news -->
      <div>
        <div class="section-sep">ÚLTIMAS ACTUALIZACIONES DE HARDWARE</div>
        <div v-if="loadingNews" class="mono text-xs py-2" style="color:var(--t-mute)">
          Cargando noticias…
        </div>
        <div v-else class="space-y-1.5 mt-2">
          <a v-for="n in newsItems" :key="n.link" :href="n.link"
            target="_blank" rel="noopener"
            class="news-row">
            <span class="news-tag">{{ n.tag }}</span>
            <span class="news-title">{{ n.title }}</span>
            <span class="news-date mono">{{ fmtDate(n.date) }}</span>
          </a>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const STATUS_LABELS = {
  active:   'EN PROCESO',
  done:     'COMPLETADO',
  pending:  'PENDIENTE',
  delayed:  'RETRASADO',
}

const hardware = [
  {
    id: 'sls',
    name: 'SLS Block 1',
    sub: 'Space Launch System — Core Stage',
    status: 'active',
    desc: 'Core stage entregado en KSC el 27-28 Abr 2026. Motores RS-25 instalados. Stack con Orion pendiente.',
    target: 'Integración 2027',
    link: 'https://www.nasa.gov/humans-in-space/space-launch-system/',
  },
  {
    id: 'orion',
    name: 'Orion CM-004',
    sub: 'Cápsula tripulada',
    status: 'active',
    desc: 'Producción en marcha en Lockheed Martin. Production readiness target Enero 2028.',
    target: 'Prod. readiness Ene 2028',
    link: 'https://www.nasa.gov/humans-in-space/orion-spacecraft/',
  },
  {
    id: 'hls-sx',
    name: 'Starship HLS',
    sub: 'SpaceX — Human Landing System',
    status: 'active',
    desc: 'Rendezvous/docking en LEO para Artemis III. Vuelos de demostración Starship en progreso. Certificación de vuelo pendiente.',
    target: 'Cert. vuelo TBD',
    link: 'https://www.spacex.com/human-spaceflight/starship/',
  },
  {
    id: 'hls-bo',
    name: 'Blue Moon MK2',
    sub: 'Blue Origin — HLS alternativo',
    status: 'pending',
    desc: 'Contrato NASA adjudicado 2023. Sistema de aterrizaje lunar para misiones futuras. Blue Moon MK1 en desarrollo.',
    target: 'Artemis V+',
    link: 'https://www.blueorigin.com/blue-moon',
  },
]

const loadingNews = ref(true)
const newsItems = ref([])

const QUERIES = [
  { q: 'SLS Space Launch System', tag: 'SLS' },
  { q: 'Orion spacecraft', tag: 'ORION' },
  { q: 'Starship HLS Human Landing', tag: 'HLS' },
]

const FALLBACK_NEWS = [
  { title: 'SLS Block 1 Core Stage Arrives at Kennedy Space Center for Artemis III', date: '2026-04-28', link: 'https://www.nasa.gov/news-release/nasa-rolls-out-artemis-iii-moon-rocket-core-stage/', tag: 'SLS' },
  { title: 'Orion CM-004 Production on Track for January 2028 Readiness', date: '2026-03-15', link: 'https://www.nasa.gov/humans-in-space/orion-spacecraft/', tag: 'ORION' },
  { title: 'SpaceX Starship Completes Full-Duration Static Fire Ahead of HLS Demo', date: '2026-02-20', link: 'https://www.spacex.com/human-spaceflight/starship/', tag: 'HLS' },
  { title: 'Blue Origin Blue Moon MK2 Passes PDR Milestone', date: '2026-01-10', link: 'https://www.blueorigin.com/blue-moon', tag: 'HLS' },
  { title: 'NASA OIG: HLS Contracts Face Schedule Risk — Artemis III Redesign Imminent', date: '2026-03-01', link: 'https://oig.nasa.gov/wp-content/uploads/2026/03/final-report-ig-26-004-nasas-management-of-the-human-landing-system-contracts.pdf', tag: 'HLS' },
]

async function fetchHardwareNews() {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8_000)
    const results = await Promise.allSettled(
      QUERIES.map(({ q, tag }) =>
        fetch(`https://api.spaceflightnewsapi.net/v4/articles/?search=${encodeURIComponent(q)}&limit=3&ordering=-published_at`, { signal: controller.signal })
          .then(r => r.json())
          .then(d => (d.results ?? []).map(i => ({ title: i.title, date: i.published_at, link: i.url, tag })))
      )
    )
    clearTimeout(timeout)
    const merged = results
      .flatMap(r => r.status === 'fulfilled' ? r.value : [])
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 8)
    if (merged.length) newsItems.value = merged
    else newsItems.value = FALLBACK_NEWS
  } catch {
    newsItems.value = FALLBACK_NEWS
  } finally {
    loadingNews.value = false
  }
}

onMounted(fetchHardwareNews)

function fmtDate(s) {
  try { return new Date(s).toLocaleDateString('es-MX', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase() }
  catch { return '' }
}
</script>

<style scoped>
.hw-card {
  background: rgba(0,0,0,0.15);
  border: 1px solid rgba(0,0,0,0.15);
  border-radius: 8px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.hw-name { font-family: 'Inter', system-ui, sans-serif; font-size: 0.78rem; font-weight: 700; color: var(--t-hi); }
.hw-sub  { font-family: 'Inter', system-ui, sans-serif; font-size: 0.6rem; color: var(--t-mute); letter-spacing: 0.04em; }
.hw-desc { font-family: 'Inter', system-ui, sans-serif; font-size: 0.68rem; line-height: 1.45; color: var(--t-text); opacity: 0.8; }
.hw-target { display: flex; align-items: center; gap: 5px; margin-top: 2px; }
.hw-link {
  font-family: 'Inter', system-ui, sans-serif; font-size: 0.6rem;
  color: var(--t-link, #b35a3c); text-decoration: none; margin-top: 2px;
  align-self: flex-start;
}
.hw-link:hover { opacity: 0.85; }

.status-pill {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 0.5rem; font-weight: 700;
  letter-spacing: 0.1em; padding: 2px 6px;
  border-radius: 3px; flex-shrink: 0; white-space: nowrap;
  text-transform: uppercase;
}
.status-pill.active  { background: rgba(56,189,248,0.15); color: #38bdf8; }
.status-pill.done    { background: rgba(52,211,153,0.15); color: #34d399; }
.status-pill.pending { background: rgba(251,191,36,0.12); color: #fbbf24; }
.status-pill.delayed { background: rgba(248,113,113,0.12); color: #f87171; }

.section-sep {
  font-family: 'Inter', system-ui, sans-serif; font-size: 0.55rem;
  font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase;
  color: var(--t-mute); border-top: 1px solid rgba(0,0,0,0.15);
  padding-top: 10px;
}

.news-row {
  display: grid; grid-template-columns: auto 1fr auto;
  align-items: baseline; gap: 8px;
  padding: 5px 8px; border-radius: 5px;
  text-decoration: none;
  transition: background 0.15s;
}
.news-row:hover { background: rgba(0,0,0,0.12); }
.news-tag  { font-family: 'Inter', system-ui, sans-serif; font-size: 0.5rem; font-weight: 700; letter-spacing: 0.1em; padding: 1px 5px; border-radius: 3px; background: rgba(0,0,0,0.2); color: var(--t-hi); flex-shrink: 0; }
.news-title { font-size: 0.68rem; color: var(--t-text); line-height: 1.35; }
.news-row:hover .news-title { color: var(--t-hi); }
.news-date { font-size: 0.55rem; color: var(--t-mute); white-space: nowrap; }
</style>
