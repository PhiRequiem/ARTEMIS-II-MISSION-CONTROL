<template>
  <div class="panel h-full flex flex-col">
    <div class="panel-title a3">
      SPACE WEATHER
      <span class="ml-auto mono text-[11px]" style="color:var(--t-hi); opacity:0.6">DONKI · NASA</span>
    </div>

    <div class="flex-1 overflow-y-auto p-3 space-y-2" style="max-height: 300px">
      <div v-if="!events.length" class="text-xs mono py-2" style="color:var(--t-mute)">
        NO EVENTS — MONITORING
      </div>
      <div v-for="ev in events" :key="ev.id"
        class="event-row">
        <div class="flex items-center gap-2">
          <span class="event-type-badge">{{ ev.type }}</span>
          <span v-if="ev.speed" class="mono text-[11px]" style="color:var(--t-hi)">{{ ev.speed }} km/s</span>
          <span class="mono text-[11px] ml-auto" style="color:var(--t-mute)">{{ formatTime(ev.time) }}</span>
        </div>
        <p v-if="ev.note" class="text-[11px] mt-1 leading-snug" style="color:var(--t-dim)">
          {{ ev.note.slice(0, 100) }}{{ ev.note.length > 100 ? '…' : '' }}
        </p>
      </div>
    </div>

    <!-- Environment status -->
    <div class="border-t p-3 flex items-center gap-2" style="border-color:var(--t-bar)">
      <div class="w-2 h-2 rounded-full bg-green-400" style="box-shadow:0 0 6px rgba(52,211,153,0.6)" />
      <span class="mono text-[11px] tracking-widest" style="color:rgba(52,211,153,0.7)">
        PRE-LAUNCH ENVIRONMENT MONITORING ACTIVE
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ spaceWeather: Array })

const events = computed(() => props.spaceWeather ?? [])

function formatTime(s) {
  if (!s) return ''
  try { return new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }
  catch { return s }
}
</script>

<style scoped>
.panel-title.a3 { color: #38bdf8; }
.panel-title.a3::before { color: rgba(56,189,248,0.7); }

.event-row {
  padding: 6px 8px;
  background: rgba(56,189,248,0.03);
  border: 1px solid rgba(56,189,248,0.08);
  border-radius: 4px;
}

.event-type-badge {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.6rem;
  font-weight: bold;
  letter-spacing: 0.08em;
  padding: 1px 5px;
  border-radius: 3px;
  background: rgba(56,189,248,0.1);
  color: #38bdf8;
  border: 1px solid rgba(56,189,248,0.2);
}
</style>
