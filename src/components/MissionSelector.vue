<template>
  <div class="flex items-center gap-1">
    <button
      v-for="m in missions"
      :key="m.id"
      @click="setMission(m.id)"
      class="mission-btn"
      :class="{ active: activeMissionId === m.id }"
      :style="activeMissionId === m.id ? `--accent: ${m.accentColor}; --shadow: ${m.accentShadow}` : ''"
    >
      <span class="btn-label" :data-short="m.name.split(' ')[1]">{{ m.label }}</span>
      <span class="btn-badge" :class="m.state">{{ STATE_LABELS[m.state] }}</span>
    </button>
  </div>
</template>

<script setup>
import { useMission } from '../composables/useMission.js'

const { missions, activeMissionId, setMission } = useMission()

const STATE_LABELS = {
  'historical': 'HIST',
  'pre-launch': 'PRE',
  'active':     'LIVE',
}
</script>

<style scoped>
.mission-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  padding: 3px 8px;
  border-radius: 4px;
  border: 1px solid rgba(167,139,250,0.12);
  background: transparent;
  cursor: pointer;
  transition: all 0.2s;
  line-height: 1;
}
.mission-btn:hover {
  border-color: rgba(167,139,250,0.35);
  background: rgba(167,139,250,0.06);
}
.mission-btn.active {
  border-color: var(--accent);
  background: color-mix(in srgb, var(--accent) 12%, transparent);
  box-shadow: 0 0 8px var(--shadow);
}

.btn-label {
  font-family: 'Orbitron', monospace;
  font-size: 0.55rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: rgba(167,139,250,0.5);
  white-space: nowrap;
}
.mission-btn.active .btn-label {
  color: var(--accent);
}

.btn-badge {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.45rem;
  letter-spacing: 0.08em;
  padding: 1px 3px;
  border-radius: 2px;
}
.btn-badge.historical {
  color: rgba(167,139,250,0.4);
  background: rgba(167,139,250,0.08);
}
.btn-badge.pre-launch {
  color: #38bdf8;
  background: rgba(56,189,248,0.1);
}
.btn-badge.active {
  color: #34d399;
  background: rgba(52,211,153,0.1);
  animation: pulse-badge 2s ease-in-out infinite;
}

@keyframes pulse-badge {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

/* En mobile solo mostrar el número romano + badge, ocultar "Artemis" */
@media (max-width: 480px) {
  .btn-label::before { content: attr(data-short); }
  .btn-label span { display: none; }
  .mission-btn { padding: 3px 6px; }
}
</style>
