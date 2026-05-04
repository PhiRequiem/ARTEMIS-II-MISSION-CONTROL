<template>
  <div class="selector">
    <button
      v-for="m in missions"
      :key="m.id"
      @click="setMission(m.id)"
      class="mission-btn"
      :class="{ active: activeMissionId === m.id }"
      :style="`--mc: ${m.accentColor}; --ms: ${m.accentShadow}`"
      :title="m.label"
    >
      <!-- Roman numeral — siempre en color de misión -->
      <span class="btn-roman">{{ ROMAN[m.id] }}</span>

      <div class="btn-info">
        <span class="btn-name">{{ m.label }}</span>
        <span class="btn-state" :class="m.state">{{ STATE_LABELS[m.state] }}</span>
      </div>
    </button>
  </div>
</template>

<script setup>
import { useMission } from '../composables/useMission.js'

const { missions, activeMissionId, setMission } = useMission()

const ROMAN = { artemis1: 'I', artemis2: 'II', artemis3: 'III', artemis4: 'IV' }

const STATE_LABELS = {
  'historical': 'HIST',
  'pre-launch': 'PRE',
  'active':     'LIVE',
  'announced':  'ANUN',
}
</script>

<style scoped>
.selector {
  display: flex;
  align-items: stretch;
  gap: 4px;
}

.mission-btn {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 4px 10px 4px 8px;
  border-radius: 6px;
  border: 1px solid rgba(255,255,255,0.06);
  background: rgba(255,255,255,0.03);
  cursor: pointer;
  transition: background 0.18s, border-color 0.18s, box-shadow 0.18s;
  position: relative;
  overflow: hidden;
}

/* borde izquierdo de color siempre visible */
.mission-btn::before {
  content: '';
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 3px;
  background: var(--mc);
  opacity: 0.45;
  border-radius: 6px 0 0 6px;
  transition: opacity 0.18s;
}

.mission-btn:hover {
  background: rgba(255,255,255,0.06);
  border-color: rgba(255,255,255,0.12);
}
.mission-btn:hover::before { opacity: 0.7; }

.mission-btn.active {
  background: color-mix(in srgb, var(--mc) 14%, transparent);
  border-color: color-mix(in srgb, var(--mc) 45%, transparent);
  box-shadow: 0 0 10px var(--ms);
}
.mission-btn.active::before { opacity: 1; }

/* Número romano — el elemento más visible */
.btn-roman {
  font-family: 'Orbitron', monospace;
  font-size: 1rem;
  font-weight: 900;
  color: var(--mc);
  opacity: 0.5;
  line-height: 1;
  min-width: 20px;
  text-align: center;
  transition: opacity 0.18s;
  letter-spacing: -0.02em;
}
.mission-btn:hover .btn-roman  { opacity: 0.75; }
.mission-btn.active .btn-roman {
  opacity: 1;
  text-shadow: 0 0 10px var(--ms);
}

/* Info secundaria */
.btn-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
}

.btn-name {
  font-family: 'Orbitron', monospace;
  font-size: 0.48rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  color: rgba(255,255,255,0.3);
  white-space: nowrap;
  text-transform: uppercase;
  transition: color 0.18s;
}
.mission-btn.active .btn-name { color: rgba(255,255,255,0.7); }

.btn-state {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.42rem;
  letter-spacing: 0.1em;
  padding: 1px 4px;
  border-radius: 2px;
  text-transform: uppercase;
}
.btn-state.historical { color: rgba(167,139,250,0.5); background: rgba(167,139,250,0.08); }
.btn-state.pre-launch { color: #38bdf8;               background: rgba(56,189,248,0.1);   }
.btn-state.announced  { color: #a3e635;               background: rgba(163,230,53,0.1);   }
.btn-state.active     {
  color: #34d399; background: rgba(52,211,153,0.1);
  animation: pulse-badge 2s ease-in-out infinite;
}

@keyframes pulse-badge {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.55; }
}

/* Mobile: solo romano + badge */
@media (max-width: 520px) {
  .btn-info { display: none; }
  .mission-btn { padding: 5px 8px; }
  .btn-roman { font-size: 0.85rem; }
}
</style>
