<template>
  <div class="panel h-full flex flex-col">
    <div class="panel-title">NASA MISSION UPDATES</div>
    <div class="flex-1 overflow-y-auto p-3 space-y-2" style="max-height: 200px">
      <div v-if="!newsItems.length" class="text-xs text-slate-600 mono">Fetching feed...</div>
      <a
        v-for="item in newsItems"
        :key="item.link"
        :href="item.link"
        target="_blank"
        rel="noopener"
        class="block text-[10px] border-b border-white/5 pb-2 hover:border-violet-400/20 transition-colors group"
      >
        <div class="text-slate-300 group-hover:text-violet-300 transition-colors leading-snug">{{ item.title }}</div>
        <div class="mono text-slate-600 mt-0.5">{{ formatDate(item.date) }}</div>
      </a>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ newsItems: Array })

function formatDate(s) {
  if (!s) return ''
  try { return new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }
  catch { return s }
}
</script>
