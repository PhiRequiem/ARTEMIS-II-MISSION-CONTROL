<template>
  <Transition name="hint">
    <div v-if="visible" class="hint-wrap" @click="dismiss">
      <!-- Arrow pointing up toward the selector -->
      <div class="hint-arrow" />

      <div class="hint-card" @click.stop>
        <div class="hint-header">
          <span class="hint-icon">🚀</span>
          <span class="hint-title">Explora el programa Artemis</span>
          <button class="hint-close" @click="dismiss" aria-label="Cerrar">✕</button>
        </div>

        <p class="hint-body">
          Este dashboard cubre las <strong>4 misiones</strong> del programa. Usa los botones
          <span class="hint-roman">I · II · III · IV</span> para cambiar entre ellas.
        </p>

        <div class="hint-missions">
          <div v-for="m in missions" :key="m.id" class="hint-mission" @click="pick(m.id)">
            <span class="hint-num" :style="`color:${m.accentColor}`">{{ ROMAN[m.id] }}</span>
            <span class="hint-mname">{{ m.label }}</span>
            <span class="hint-state" :class="m.state">{{ STATE[m.state] }}</span>
          </div>
        </div>

        <div class="hint-footer">
          <div class="hint-progress">
            <div class="hint-progress-bar" :style="`width:${progress}%`" />
          </div>
          <button class="hint-ok" @click="dismiss">Entendido</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useMission } from '../composables/useMission.js'

const DURATION = 9000  // ms antes de auto-cerrar

const { missions, setMission } = useMission()
const ROMAN = { artemis1: 'I', artemis2: 'II', artemis3: 'III', artemis4: 'IV' }
const STATE  = { historical: 'HIST', 'pre-launch': 'PRE', active: 'LIVE', announced: 'ANUN' }

const visible  = ref(false)
const progress = ref(100)

let timer    = null
let rafId    = null
let start    = null

function dismiss() {
  visible.value = false
  cancelAnimationFrame(rafId)
  clearTimeout(timer)
}

function pick(id) {
  setMission(id)
  dismiss()
}

function tick(ts) {
  if (!start) start = ts
  const elapsed = ts - start
  progress.value = Math.max(0, 100 - (elapsed / DURATION) * 100)
  if (elapsed < DURATION) {
    rafId = requestAnimationFrame(tick)
  } else {
    dismiss()
  }
}

onMounted(() => {
  timer = setTimeout(() => {
    visible.value = true
    rafId = requestAnimationFrame(tick)
  }, 1800)
})

onUnmounted(() => {
  clearTimeout(timer)
  cancelAnimationFrame(rafId)
})
</script>

<style scoped>
.hint-wrap {
  position: fixed;
  top: 72px;          /* justo debajo del header */
  left: 50%;
  transform: translateX(-50%);
  z-index: 200;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Flechita apuntando hacia arriba (al header/selector) */
.hint-arrow {
  width: 0; height: 0;
  border-left: 9px solid transparent;
  border-right: 9px solid transparent;
  border-bottom: 10px solid rgba(167,139,250,0.35);
  margin-bottom: -1px;
}

.hint-card {
  background: rgba(10, 8, 22, 0.97);
  border: 1px solid rgba(167,139,250,0.3);
  border-radius: 10px;
  padding: 16px 18px;
  width: 340px;
  box-shadow:
    0 8px 40px rgba(0,0,0,0.7),
    0 0 0 1px rgba(167,139,250,0.08);
  backdrop-filter: blur(12px);
}

.hint-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}
.hint-icon  { font-size: 1rem; line-height: 1; }
.hint-title {
  font-family: 'Orbitron', monospace;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #a78bfa;
  flex: 1;
  text-transform: uppercase;
}
.hint-close {
  background: none; border: none; cursor: pointer;
  color: rgba(167,139,250,0.4); font-size: 0.75rem;
  padding: 0 2px; transition: color 0.15s;
}
.hint-close:hover { color: #a78bfa; }

.hint-body {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 0.78rem;
  color: rgba(200,190,230,0.75);
  line-height: 1.5;
  margin-bottom: 12px;
}
.hint-body strong { color: #c4b5fd; }
.hint-roman {
  font-family: 'Orbitron', monospace;
  font-size: 0.72rem;
  font-weight: 700;
  color: #a78bfa;
  letter-spacing: 0.1em;
}

/* Mini mission picker */
.hint-missions {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
  margin-bottom: 14px;
}
.hint-mission {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 7px 4px;
  border-radius: 6px;
  border: 1px solid rgba(167,139,250,0.1);
  background: rgba(167,139,250,0.04);
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}
.hint-mission:hover {
  background: rgba(167,139,250,0.1);
  border-color: rgba(167,139,250,0.3);
}
.hint-num {
  font-family: 'Orbitron', monospace;
  font-size: 1rem;
  font-weight: 900;
  line-height: 1;
}
.hint-mname {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 0.48rem;
  color: rgba(167,139,250,0.5);
  letter-spacing: 0.06em;
  text-align: center;
}
.hint-state {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.42rem;
  letter-spacing: 0.08em;
  padding: 1px 4px;
  border-radius: 2px;
}
.hint-state.historical  { color: rgba(167,139,250,0.5); background: rgba(167,139,250,0.08); }
.hint-state.pre-launch  { color: #38bdf8;               background: rgba(56,189,248,0.1);   }
.hint-state.active      { color: #34d399;               background: rgba(52,211,153,0.1);   }
.hint-state.announced   { color: #a3e635;               background: rgba(163,230,53,0.1);   }

.hint-footer {
  display: flex;
  align-items: center;
  gap: 10px;
}
.hint-progress {
  flex: 1;
  height: 3px;
  background: rgba(167,139,250,0.1);
  border-radius: 2px;
  overflow: hidden;
}
.hint-progress-bar {
  height: 100%;
  background: rgba(167,139,250,0.4);
  border-radius: 2px;
  transition: width 0.1s linear;
}
.hint-ok {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 0.68rem;
  font-weight: 600;
  color: #a78bfa;
  background: rgba(167,139,250,0.1);
  border: 1px solid rgba(167,139,250,0.25);
  border-radius: 5px;
  padding: 4px 12px;
  cursor: pointer;
  transition: background 0.15s;
  white-space: nowrap;
}
.hint-ok:hover { background: rgba(167,139,250,0.2); }

/* Transition */
.hint-enter-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.hint-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.hint-enter-from   { opacity: 0; transform: translateX(-50%) translateY(-8px); }
.hint-leave-to     { opacity: 0; transform: translateX(-50%) translateY(-6px); }

@media (max-width: 400px) {
  .hint-card { width: 290px; }
}
</style>
