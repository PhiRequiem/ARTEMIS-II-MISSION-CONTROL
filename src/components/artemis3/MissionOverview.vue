<template>
  <div class="panel h-full flex flex-col">
    <div class="panel-title a3">
      MISSION OVERVIEW
      <span class="ml-auto mono text-[11px]">ARTEMIS III</span>
    </div>

    <div class="flex-1 p-4 flex flex-col gap-4 overflow-y-auto">

      <!-- Mission description -->
      <p class="text-xs leading-relaxed" style="color:var(--t-dim)">
        {{ mission.description }}
      </p>

      <!-- Objectives -->
      <div>
        <div class="section-label">OBJETIVOS DE MISIÓN</div>
        <ul class="space-y-1.5 mt-2">
          <li v-for="(obj, i) in mission.objectives" :key="i"
            class="flex items-start gap-2 text-xs" style="color:var(--t-text)">
            <span class="shrink-0 mono font-bold obj-num">{{ String(i+1).padStart(2,'0') }}.</span>
            {{ obj }}
          </li>
        </ul>
      </div>

      <!-- Vehicle / HLS -->
      <div>
        <div class="section-label">VEHÍCULOS</div>
        <div class="grid grid-cols-2 gap-2 mt-2">
          <div class="vehicle-card">
            <div class="vehicle-label">SLS</div>
            <div class="vehicle-value">{{ mission.vehicle_details?.sls ?? '—' }}</div>
          </div>
          <div class="vehicle-card">
            <div class="vehicle-label">ORION</div>
            <div class="vehicle-value">{{ mission.vehicle_details?.orion ?? '—' }}</div>
          </div>
          <div class="vehicle-card col-span-2">
            <div class="vehicle-label">HLS PRIMARIO</div>
            <div class="vehicle-value">{{ mission.vehicle_details?.hls_primary ?? '—' }}</div>
          </div>
          <div class="vehicle-card col-span-2">
            <div class="vehicle-label">HLS ALTERNATIVO</div>
            <div class="vehicle-value">{{ mission.vehicle_details?.hls_backup ?? '—' }}</div>
          </div>
        </div>
      </div>

      <!-- Notice -->
      <div class="notice-bar">
        <span class="notice-icon">⚠</span>
        <span class="text-xs" style="color:#7a4800">
          Alunizaje removido — movido a <strong>Artemis IV (~2028)</strong>. Anunciado 27 Feb 2026.
        </span>
      </div>

      <!-- Crew -->
      <div>
        <div class="section-label">TRIPULACIÓN</div>
        <div class="crew-tbd text-xs mt-2" style="color:var(--t-dim)">
          ◈ Por anunciarse — NASA informará próximo al lanzamiento
        </div>
      </div>

      <!-- Sources -->
      <div class="sources-row">
        <a href="https://www.nasa.gov/mission/artemis-iii/" target="_blank" rel="noopener" class="src-link">↗ NASA Artemis III</a>
        <span class="src-sep">·</span>
        <a href="https://www.spacex.com/human-spaceflight/starship/" target="_blank" rel="noopener" class="src-link">↗ SpaceX HLS</a>
        <span class="src-sep">·</span>
        <a href="https://www.blueorigin.com/blue-moon" target="_blank" rel="noopener" class="src-link">↗ Blue Moon</a>
      </div>

    </div>
  </div>
</template>

<script setup>
defineProps({ mission: Object })
</script>

<style scoped>
.section-label {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  color: var(--t-mute);
  text-transform: uppercase;
}

.obj-num { color: var(--t-hi); }

.vehicle-card {
  background: var(--t-cell);
  border: 1px solid var(--t-border);
  border-radius: 8px;
  padding: 7px 10px;
}
.vehicle-label {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  color: var(--t-mute);
  text-transform: uppercase;
}
.vehicle-value {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 0.75rem;
  color: var(--t-text);
  margin-top: 3px;
  line-height: 1.4;
}

.notice-bar {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  padding: 8px 10px;
  background: rgba(227,169,87,0.15);
  border: 1px solid rgba(180,120,20,0.3);
  border-radius: 6px;
}
.notice-icon { color: #a06000; flex-shrink: 0; }

.crew-tbd {
  padding: 8px 10px;
  background: var(--t-cell);
  border: 1px dashed var(--t-border);
  border-radius: 6px;
}

.sources-row {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  padding-top: 8px;
  border-top: 1px solid var(--t-border);
}
.src-link {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 0.68rem;
  color: var(--t-link);
  text-decoration: none;
  transition: opacity 0.2s;
}
.src-link:hover { opacity: 0.7; }
.src-sep { color: var(--t-border); }
</style>
