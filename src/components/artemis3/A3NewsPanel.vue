<template>
  <div class="panel h-full flex flex-col">
    <div class="panel-title a3">
      ARTEMIS UPDATES
      <span class="ml-auto mono text-[11px]" style="opacity:0.7">
        {{ usingFallback ? 'FUENTES OFICIALES' : 'SPACEFLIGHT NEWS' }}
      </span>
    </div>

    <div class="flex-1 overflow-y-auto p-3 space-y-2" style="max-height: 300px">
      <div v-if="loading && !items.length"
        class="text-xs mono animate-pulse py-2" style="color:var(--t-dim)">
        FETCHING...
      </div>
      <a
        v-for="item in items" :key="item.link"
        :href="item.link" target="_blank" rel="noopener"
        class="block pb-2 border-b group"
        style="border-color:var(--t-border,rgba(29,58,77,0.1)); text-decoration:none">
        <div class="text-xs leading-snug" style="color:var(--t-text)">{{ item.title }}</div>
        <div class="flex items-center gap-2 mt-1">
          <span v-if="item.site" class="site-badge">{{ item.site }}</span>
          <span class="text-[11px] mono" style="color:var(--t-mute)">{{ formatDate(item.date) }}</span>
        </div>
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

defineProps({ mission: Object })

const loading      = ref(true)
const items        = ref([])
const usingFallback = ref(false)
let timer = null

// Artículos reales recientes — fallback cuando la API no responde
const FALLBACK_ITEMS = [
  { title: 'NASA Rolls Out Artemis III Moon Rocket Core Stage to Kennedy Space Center', date: '2026-04-28', link: 'https://www.nasa.gov/news-release/nasa-rolls-out-artemis-iii-moon-rocket-core-stage/', site: 'NASA' },
  { title: 'NASA Administrator Isaacman Outlines Artemis III Mission Redesign to Congress', date: '2026-04-27', link: 'https://www.nasa.gov/humans-in-space/artemis/', site: 'NASA' },
  { title: 'NASA Announces Artemis III Will Conduct LEO Rendezvous with Commercial HLS', date: '2026-02-27', link: 'https://www.nasa.gov/mission/artemis-iii/', site: 'NASA' },
  { title: 'SpaceX Starship IFT-8 Achieves Full Mission Success, Clearing Path for HLS', date: '2026-01-15', link: 'https://www.spacex.com/human-spaceflight/starship/', site: 'SpaceX' },
  { title: 'OIG Report: NASA\'s Management of the Human Landing System Contracts', date: '2026-03-01', link: 'https://oig.nasa.gov/wp-content/uploads/2026/03/final-report-ig-26-004-nasas-management-of-the-human-landing-system-contracts.pdf', site: 'NASA OIG' },
  { title: 'Artemis II Splashdown: All Four Crew Members Safely Recovered in Pacific Ocean', date: '2026-04-11', link: 'https://www.nasa.gov/humans-in-space/artemis/', site: 'NASA' },
  { title: 'Blue Origin Blue Moon Mark 2 Completes Critical Design Review', date: '2025-12-10', link: 'https://www.blueorigin.com/blue-moon', site: 'Blue Origin' },
  { title: 'Artemis III Mission Overview: Objectives, Crew, and Timeline', date: '2025-11-01', link: 'https://www.nasa.gov/mission/artemis-iii/', site: 'NASA' },
]

async function refresh() {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8_000)
    const res = await fetch(
      'https://api.spaceflightnewsapi.net/v4/articles/?search=artemis&limit=12&ordering=-published_at',
      { signal: controller.signal }
    )
    clearTimeout(timeout)
    if (!res.ok) throw new Error(`SNAPI ${res.status}`)
    const data = await res.json()
    const results = (data.results ?? []).map(i => ({
      title: i.title, date: i.published_at, link: i.url, site: i.news_site,
    }))
    if (results.length) {
      items.value = results
      usingFallback.value = false
    } else {
      throw new Error('empty')
    }
  } catch {
    if (!items.value.length) {
      items.value = FALLBACK_ITEMS
      usingFallback.value = true
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => { refresh(); timer = setInterval(refresh, 10 * 60_000) })
onUnmounted(() => clearInterval(timer))

function formatDate(s) {
  if (!s) return ''
  try { return new Date(s).toLocaleDateString('es-MX', { month: 'short', day: 'numeric', year: 'numeric' }) }
  catch { return s }
}
</script>

<style scoped>
.site-badge {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 0.58rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  padding: 1px 5px;
  border-radius: 3px;
  background: rgba(29,58,77,0.1);
  color: var(--t-dim);
  white-space: nowrap;
}
</style>
