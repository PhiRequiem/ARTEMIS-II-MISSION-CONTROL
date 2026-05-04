<template>
  <div class="panel h-full flex flex-col">
    <div class="panel-title a3">
      LAUNCH READINESS
      <a href="https://www.nasa.gov/humans-in-space/artemis/" target="_blank" rel="noopener"
        class="ml-auto mono text-[11px] src-link" style="opacity:0.5" @click.stop>
        {{ doneCount }}/{{ total }} COMPLETADOS ↗
      </a>
    </div>

    <div class="flex-1 p-4 flex flex-col gap-3">

      <!-- Progress bar global -->
      <div>
        <div class="flex items-center justify-between mb-1.5">
          <span class="mono text-[11px] tracking-widest" style="color:var(--t-mute)">PROGRESO GLOBAL</span>
          <span class="mono text-[11px] font-bold" style="color:var(--t-hi)">{{ pct }}%</span>
        </div>
        <div class="h-1.5 rounded-full overflow-hidden" style="background:rgba(0,0,0,0.25)">
          <div class="h-full rounded-full transition-all duration-700"
            style="background: var(--t-hi)"
            :style="{ width: pct + '%' }" />
        </div>
      </div>

      <!-- Milestones list -->
      <div class="flex-1 space-y-2 overflow-y-auto">
        <div v-for="m in milestones" :key="m.id"
          class="milestone-row"
          :class="m.done ? 'done' : 'pending'">

          <!-- Icon -->
          <div class="milestone-icon" :class="m.done ? 'done' : 'pending'">
            <svg v-if="m.done" width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 5l2.5 2.5L8 3" stroke="#34d399" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <svg v-else width="10" height="10" viewBox="0 0 10 10" fill="none">
              <circle cx="5" cy="5" r="2.5" fill="rgba(56,189,248,0.3)" stroke="rgba(56,189,248,0.5)" stroke-width="1"/>
            </svg>
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <div class="text-xs leading-tight" style="color:var(--t-text)">
              {{ m.label }}
            </div>
            <div v-if="m.date" class="mono text-[11px] mt-0.5" style="color:var(--t-mute)">
              {{ formatDate(m.date) }}
            </div>
            <div v-else class="mono text-[11px] mt-0.5" style="color:var(--t-mute)">TBD</div>
          </div>

          <!-- Done badge -->
          <div v-if="m.done" class="done-badge mono text-[11px]">✓</div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ mission: Object })

const milestones = computed(() => props.mission?.milestones ?? [])
const doneCount  = computed(() => milestones.value.filter(m => m.done).length)
const total      = computed(() => milestones.value.length)
const pct        = computed(() => total.value ? Math.round((doneCount.value / total.value) * 100) : 0)

function formatDate(s) {
  if (!s) return 'TBD'
  try {
    const d = new Date(s)
    return d.toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' }).toUpperCase()
  } catch { return s }
}
</script>

<style scoped>
.panel-title.a3 { color: #38bdf8; }
.panel-title.a3::before { color: rgba(56,189,248,0.7); }

.milestone-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 7px 8px;
  border-radius: 4px;
  border: 1px solid transparent;
  transition: border-color 0.2s;
}
.milestone-row.done {
  background: rgba(52,211,153,0.04);
  border-color: rgba(52,211,153,0.12);
}
.milestone-row.pending {
  background: rgba(56,189,248,0.03);
  border-color: rgba(56,189,248,0.08);
}

.milestone-icon {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
}
.milestone-icon.done   { background: rgba(52,211,153,0.12); }
.milestone-icon.pending { background: rgba(56,189,248,0.08); }

.done-badge {
  color: #34d399;
  font-weight: bold;
  flex-shrink: 0;
}
.src-link {
  color: rgba(56,189,248,0.45);
  text-decoration: none;
  transition: color 0.2s;
}
.src-link:hover { color: #38bdf8; }
</style>
