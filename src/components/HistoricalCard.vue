<template>
  <div class="panel p-6 max-w-2xl mx-auto">
    <!-- Historical watermark -->
    <div class="watermark">HISTORICAL</div>

    <!-- Header -->
    <div class="flex items-center gap-4 mb-6">
      <div class="w-12 h-12 rounded-full flex items-center justify-center border-2 shrink-0"
        :style="`border-color: ${mission.accentColor}; box-shadow: 0 0 16px ${mission.accentShadow}`">
        <span class="mono font-bold text-xs" :style="`color: ${mission.accentColor}`">
          {{ mission.id === 'artemis1' ? 'I' : 'II' }}
        </span>
      </div>
      <div>
        <div class="mono text-lg font-bold tracking-widest" :style="`color: ${mission.accentColor}`">
          {{ mission.name }}
        </div>
        <div class="flex items-center gap-2 mt-0.5">
          <span class="px-2 py-0.5 rounded text-xs mono tracking-widest"
            :style="`color: ${mission.accentColor}; background: color-mix(in srgb, ${mission.accentColor} 12%, transparent)`">
            HISTORICAL
          </span>
          <span class="text-xs mono" style="color:#4e4470">{{ mission.vehicle }}</span>
        </div>
      </div>
    </div>

    <!-- Description -->
    <p class="text-sm leading-relaxed mb-6" style="color: rgba(167,139,250,0.7)">
      {{ mission.description }}
    </p>

    <!-- Details grid -->
    <div class="grid grid-cols-2 gap-3 mb-6">
      <div class="panel-inner p-3">
        <div class="text-xs mono tracking-widest mb-1" style="color:#4e4470">LANZAMIENTO</div>
        <div class="text-sm mono" style="color:rgba(167,139,250,0.9)">
          {{ mission.epoch ? mission.epoch.toUTCString().slice(0,16) : '—' }}
        </div>
      </div>
      <div class="panel-inner p-3">
        <div class="text-xs mono tracking-widest mb-1" style="color:#4e4470">DURACIÓN</div>
        <div class="text-sm mono" style="color:rgba(167,139,250,0.9)">{{ mission.duration }}</div>
      </div>
      <div class="panel-inner p-3">
        <div class="text-xs mono tracking-widest mb-1" style="color:#4e4470">VEHÍCULO</div>
        <div class="text-sm mono" style="color:rgba(167,139,250,0.9)">{{ mission.vehicle }}</div>
      </div>
      <div class="panel-inner p-3">
        <div class="text-xs mono tracking-widest mb-1" style="color:#4e4470">AMERIZAJE</div>
        <div class="text-sm mono" style="color:rgba(167,139,250,0.9)">{{ mission.splashdownZone || '—' }}</div>
      </div>
    </div>

    <!-- Crew (Artemis II) -->
    <template v-if="mission.crew">
      <div class="text-xs mono tracking-widest mb-3" style="color:#4e4470">TRIPULACIÓN</div>
      <div class="grid grid-cols-2 gap-2 mb-6">
        <div v-for="c in mission.crew" :key="c.name"
          class="panel-inner p-3 flex items-center gap-3">
          <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs mono font-bold shrink-0"
            :style="`background: color-mix(in srgb, ${c.color} 15%, transparent); color: ${c.color}; border: 1px solid color-mix(in srgb, ${c.color} 35%, transparent)`">
            {{ c.initials }}
          </div>
          <div>
            <div class="text-xs font-semibold" style="color:rgba(255,255,255,0.9)">{{ c.name }}</div>
            <div class="text-[10px] mono" style="color:#4e4470">{{ c.role }}</div>
          </div>
        </div>
      </div>
    </template>

    <!-- Highlights (Artemis I) -->
    <template v-if="mission.highlights">
      <div class="text-xs mono tracking-widest mb-3" style="color:#4e4470">HITOS</div>
      <ul class="space-y-2">
        <li v-for="h in mission.highlights" :key="h"
          class="flex items-start gap-2 text-sm" style="color:rgba(167,139,250,0.7)">
          <span :style="`color: ${mission.accentColor}`" class="mt-0.5 shrink-0">✓</span>
          {{ h }}
        </li>
      </ul>
    </template>
  </div>
</template>

<script setup>
defineProps({ mission: Object })
</script>

<style scoped>
.panel {
  background: rgba(10,8,20,0.6);
  border: 1px solid rgba(167,139,250,0.12);
  border-radius: 8px;
  position: relative;
  overflow: hidden;
}

.watermark {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-25deg);
  font-family: 'Orbitron', monospace;
  font-size: 5rem;
  font-weight: 900;
  letter-spacing: 0.2em;
  color: rgba(167,139,250,0.04);
  pointer-events: none;
  user-select: none;
  white-space: nowrap;
}
.panel-inner {
  background: rgba(167,139,250,0.04);
  border: 1px solid rgba(167,139,250,0.08);
  border-radius: 6px;
}
</style>
