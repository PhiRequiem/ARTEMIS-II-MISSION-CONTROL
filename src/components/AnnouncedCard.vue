<template>
  <div class="card-wrap">

    <!-- Header -->
    <div class="flex items-center gap-4 mb-6">
      <div class="mission-badge" :style="`border-color:${mission.accentColor}; box-shadow:0 0 16px ${mission.accentShadow}`">
        <span class="mono font-black text-xl" :style="`color:${mission.accentColor}`">IV</span>
      </div>
      <div>
        <div class="mono text-xl font-black tracking-widest" :style="`color:${mission.accentColor}; text-shadow:0 0 20px ${mission.accentShadow}`">
          ARTEMIS IV
        </div>
        <div class="flex items-center gap-2 mt-1">
          <span class="state-badge">ANNOUNCED</span>
          <span class="mono text-xs" style="color:#4e4470">NET {{ mission.netLabel }}</span>
        </div>
      </div>
    </div>

    <!-- Description -->
    <p class="text-sm leading-relaxed mb-6" style="color:rgba(200,220,180,0.75)">
      {{ mission.description }}
    </p>

    <!-- Highlights -->
    <div class="mb-6">
      <div class="section-label">HITOS HISTÓRICOS</div>
      <ul class="space-y-2 mt-3">
        <li v-for="h in mission.highlights" :key="h"
          class="flex items-start gap-3 text-sm" style="color:rgba(200,220,180,0.7)">
          <span class="mt-0.5 shrink-0" :style="`color:${mission.accentColor}`">◆</span>
          {{ h }}
        </li>
      </ul>
    </div>

    <!-- Mission path -->
    <div class="mission-path mb-6">
      <div class="section-label mb-3">RUTA DE MISIÓN</div>
      <div class="path-row">
        <div v-for="(step, i) in path" :key="step.id" class="path-step">
          <div class="step-dot" :style="`background:${mission.accentColor}; opacity:${step.dim ? 0.3 : 0.9}`"/>
          <div class="step-label">{{ step.label }}</div>
          <div v-if="i < path.length - 1" class="step-line" />
        </div>
      </div>
    </div>

    <!-- Details grid -->
    <div class="grid grid-cols-2 gap-3 mb-6">
      <div class="detail-cell">
        <div class="detail-label">VEHÍCULO</div>
        <div class="detail-val">{{ mission.vehicle }}</div>
      </div>
      <div class="detail-cell">
        <div class="detail-label">PLATAFORMA</div>
        <div class="detail-val">LC-39B · KSC</div>
      </div>
      <div class="detail-cell">
        <div class="detail-label">DESTINO</div>
        <div class="detail-val">Polo Sur Lunar</div>
      </div>
      <div class="detail-cell">
        <div class="detail-label">TRIPULACIÓN</div>
        <div class="detail-val">Por anunciarse</div>
      </div>
    </div>

    <!-- Prerequisites checklist -->
    <div>
      <div class="section-label">PREREQUISITOS</div>
      <div class="space-y-1.5 mt-3">
        <div v-for="m in mission.milestones" :key="m.id"
          class="flex items-center gap-2.5 text-xs" style="color:rgba(163,230,53,0.6)">
          <div class="prereq-dot" :style="m.done ? `background:${mission.accentColor}` : 'background:rgba(163,230,53,0.2)'"/>
          {{ m.label }}
        </div>
      </div>
    </div>

    <!-- Sources -->
    <div class="flex gap-3 flex-wrap mt-6 pt-4" style="border-top:1px solid rgba(163,230,53,0.1)">
      <a href="https://www.nasa.gov/humans-in-space/artemis/" target="_blank" rel="noopener" class="src-link">↗ NASA Artemis Program</a>
      <a href="https://www.nasa.gov/humans-in-space/lunar-gateway/" target="_blank" rel="noopener" class="src-link">↗ Gateway Lunar</a>
    </div>

  </div>
</template>

<script setup>
const props = defineProps({ mission: Object })

const path = [
  { id: 'launch',  label: 'Lanzamiento',     dim: false },
  { id: 'nrho',    label: 'Órbita NRHO',      dim: false },
  { id: 'gateway', label: 'Docking Gateway',  dim: false },
  { id: 'hls',     label: 'Transfer HLS',     dim: false },
  { id: 'surface', label: 'Polo Sur Lunar',   dim: false },
  { id: 'ascent',  label: 'Ascenso + TEI',    dim: false },
  { id: 'entry',   label: 'Reentrada',        dim: false },
]
</script>

<style scoped>
.card-wrap {
  background: rgba(10,8,20,0.6);
  border: 1px solid rgba(163,230,53,0.15);
  border-radius: 10px;
  padding: 2rem;
  max-width: 860px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
}
.card-wrap::before {
  content: 'IV';
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%,-50%) rotate(-20deg);
  font-family: 'Orbitron', monospace;
  font-size: 18rem;
  font-weight: 900;
  color: rgba(163,230,53,0.025);
  pointer-events: none;
  user-select: none;
  line-height: 1;
}

.mission-badge {
  width: 52px; height: 52px;
  border-radius: 50%;
  border: 2px solid;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.state-badge {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.6rem; font-weight: 700;
  letter-spacing: 0.12em; padding: 2px 6px;
  border-radius: 3px;
  background: rgba(163,230,53,0.1);
  color: #a3e635;
  border: 1px solid rgba(163,230,53,0.25);
}

.section-label {
  font-family: 'Orbitron', monospace;
  font-size: 0.55rem; font-weight: 700;
  letter-spacing: 0.16em; text-transform: uppercase;
  color: #4e4470;
}

/* Mission path */
.path-row { display: flex; align-items: center; gap: 0; overflow-x: auto; }
.path-step { display: flex; flex-direction: column; align-items: center; position: relative; flex-shrink: 0; }
.step-dot { width: 10px; height: 10px; border-radius: 50%; }
.step-label {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.55rem; margin-top: 5px;
  color: rgba(163,230,53,0.65); white-space: nowrap;
}
.step-line {
  position: absolute;
  top: 5px; left: 100%;
  width: 40px; height: 1px;
  background: rgba(163,230,53,0.2);
}

/* Details */
.detail-cell {
  background: rgba(163,230,53,0.04);
  border: 1px solid rgba(163,230,53,0.1);
  border-radius: 6px; padding: 8px 12px;
}
.detail-label {
  font-family: 'Orbitron', monospace;
  font-size: 0.5rem; letter-spacing: 0.14em;
  color: #4e4470; text-transform: uppercase;
}
.detail-val {
  font-size: 0.78rem; color: rgba(200,220,180,0.85);
  margin-top: 3px; font-family: 'Inter', system-ui, sans-serif;
}

.prereq-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

.src-link {
  font-size: 0.65rem; color: rgba(163,230,53,0.45);
  text-decoration: none; transition: opacity 0.2s;
  font-family: 'Inter', system-ui, sans-serif;
}
.src-link:hover { opacity: 0.7; color: #a3e635; }
</style>
