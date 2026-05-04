<template>
  <div class="panel h-full flex flex-col">
    <div class="panel-title a3">
      ARTEMIS UPDATES
      <span class="ml-auto mono text-[11px]" style="color:var(--t-strip-text,var(--t-hi)); opacity:0.7">
        SPACEFLIGHT NEWS
      </span>
    </div>

    <div class="flex-1 overflow-y-auto p-3 space-y-2" style="max-height: 300px">
      <div v-if="loading && !items.length"
        class="text-xs mono animate-pulse py-2" style="color:var(--t-dim)">
        FETCHING...
      </div>
      <div v-else-if="!items.length" class="text-xs mono py-2" style="color:var(--t-mute)">
        NO DATA
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

const loading = ref(true)
const items   = ref([])
let timer     = null

async function refresh() {
  try {
    const url = 'https://api.spaceflightnewsapi.net/v4/articles/?search=artemis&limit=12&ordering=-published_at'
    const res = await fetch(url, { signal: AbortSignal.timeout(10_000) })
    if (!res.ok) throw new Error(`SNAPI ${res.status}`)
    const data = await res.json()
    const results = (data.results ?? []).map(i => ({
      title: i.title,
      date:  i.published_at,
      link:  i.url,
      site:  i.news_site,
    }))
    if (results.length) items.value = results
  } catch { /* keep existing */ }
  finally { loading.value = false }
}

onMounted(() => {
  refresh()
  timer = setInterval(refresh, 10 * 60_000)
})
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
