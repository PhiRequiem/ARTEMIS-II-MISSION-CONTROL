<template>
  <div class="panel flex flex-col">
    <div class="panel-title a3">
      NASA — VIDEOS RECIENTES
      <a href="https://www.youtube.com/@NASA/videos" target="_blank" rel="noopener"
        class="ml-auto text-[11px] src-link">↗ Ver canal</a>
    </div>

    <!-- YouTube playlist embed — últimos uploads del canal NASA, sin proxy -->
    <div style="aspect-ratio:16/9; background:#000">
      <iframe
        :src="embedUrl"
        width="100%" height="100%"
        style="border:none; display:block"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        loading="lazy"
        title="NASA — últimos videos"
      />
    </div>

    <!-- Links -->
    <div class="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2.5"
      style="background:rgba(0,0,0,0.08); border-top:1px solid rgba(29,58,77,0.08)">
      <a href="https://plus.nasa.gov/scheduled-events/" target="_blank" rel="noopener" class="src-link">
        ↗ Eventos programados
      </a>
      <a href="https://plus.nasa.gov" target="_blank" rel="noopener" class="src-link">
        ↗ NASA+
      </a>
      <a href="https://www.youtube.com/@NASAKennedy/videos" target="_blank" rel="noopener" class="src-link">
        ↗ NASA Kennedy
      </a>
      <a href="https://www.youtube.com/@NASAHubble/videos" target="_blank" rel="noopener" class="src-link">
        ↗ Hubble
      </a>
    </div>
  </div>
</template>

<script setup>
// Canal NASA: UCNwkvBoDag92nHiZBzbYicA
// Playlist de uploads: reemplazar UC → UU en el channel ID
const UPLOADS_PLAYLIST = 'UUNwkvBoDag92nHiZBzbYicA'

const embedUrl = `https://www.youtube.com/embed?listType=playlist&list=${UPLOADS_PLAYLIST}&index=1&modestbranding=1&rel=0`
</script>

<style scoped>
.src-link {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 0.68rem;
  color: var(--t-link, #b35a3c);
  text-decoration: none;
  transition: opacity 0.2s;
}
.src-link:hover { opacity: 0.7; }
</style>
