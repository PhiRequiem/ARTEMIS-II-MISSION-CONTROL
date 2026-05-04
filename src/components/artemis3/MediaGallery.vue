<template>
  <div class="panel flex flex-col">
    <div class="panel-title a3">
      MISSION IMAGERY
      <span class="ml-auto mono text-[11px]" style="color:#38bdf8; opacity:0.5">NASA IMAGE LIBRARY</span>
    </div>

    <div class="p-3">
      <!-- Loading -->
      <div v-if="loading" class="grid grid-cols-3 md:grid-cols-6 gap-2">
        <div v-for="i in 6" :key="i"
          class="aspect-video rounded animate-pulse"
          style="background:rgba(56,189,248,0.06)" />
      </div>

      <!-- Error -->
      <div v-else-if="!images.length" class="text-xs mono text-center py-4"
        style="color:rgba(56,189,248,0.3)">
        NO IMAGE DATA AVAILABLE
      </div>

      <!-- Gallery grid -->
      <div v-else class="grid grid-cols-3 md:grid-cols-6 gap-2">
        <a
          v-for="img in images" :key="img.id"
          :href="img.href" target="_blank" rel="noopener"
          class="gallery-item group relative overflow-hidden rounded"
          :title="img.title">
          <img
            :src="img.thumb"
            :alt="img.title"
            class="w-full aspect-video object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            @error="e => e.target.style.display='none'"
          />
          <div class="gallery-overlay">
            <p class="text-[11px] mono leading-snug line-clamp-2" style="color:rgba(200,220,240,0.85)">
              {{ img.title }}
            </p>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({ mission: Object })

const loading = ref(true)
const images  = ref([])

async function fetchImages() {
  try {
    const url = props.mission?.apis?.images
    if (!url) return
    const res = await fetch(url, { signal: AbortSignal.timeout(10_000) })
    if (!res.ok) throw new Error(`NASA Images ${res.status}`)
    const data = await res.json()
    const items = data.collection?.items ?? []
    images.value = items
      .filter(item => item.links?.[0]?.href)
      .slice(0, 12)
      .map(item => ({
        id:    item.data?.[0]?.nasa_id ?? Math.random(),
        title: item.data?.[0]?.title ?? '',
        date:  item.data?.[0]?.date_created?.slice(0,10) ?? '',
        thumb: item.links[0].href,
        href:  `https://images.nasa.gov/details/${item.data?.[0]?.nasa_id}`,
      }))
  } catch {
    // keep empty
  } finally {
    loading.value = false
  }
}

onMounted(fetchImages)
</script>

<style scoped>
.panel-title.a3 { color: #38bdf8; }
.panel-title.a3::before { color: rgba(56,189,248,0.7); }

.gallery-item {
  cursor: pointer;
  background: rgba(56,189,248,0.05);
  border: 1px solid rgba(56,189,248,0.1);
  transition: border-color 0.2s, box-shadow 0.2s;
}
.gallery-item:hover {
  border-color: rgba(56,189,248,0.35);
  box-shadow: 0 0 10px rgba(56,189,248,0.15);
}

.gallery-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 4px 5px;
  background: linear-gradient(to top, rgba(5,8,20,0.92) 0%, transparent 100%);
  opacity: 0;
  transition: opacity 0.2s;
}
.gallery-item:hover .gallery-overlay {
  opacity: 1;
}
</style>
