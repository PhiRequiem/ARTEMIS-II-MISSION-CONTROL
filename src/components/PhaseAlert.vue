<template>
  <div v-if="phaseContent" class="phase-alert" :class="`sev-${phaseContent.severity}`">

    <!-- Top accent line -->
    <div class="accent-line" />

    <div class="pa-inner">

      <!-- Left: icon + title block -->
      <div class="pa-left">
        <div class="pa-phase-tag mono">{{ activePhase.toUpperCase() }}</div>
        <div class="pa-title">{{ phaseContent.title }}</div>
        <div class="pa-subtitle">{{ phaseContent.subtitle }}</div>
      </div>

      <!-- Center: special visualizations -->
      <div class="pa-center">

        <!-- TLI / burn progress bar -->
        <template v-if="phaseContent.burnProgress !== undefined">
          <div class="bar-label mono">BURN PROGRESS</div>
          <div class="prog-track">
            <div class="prog-fill burn-fill" :style="{ width: phaseContent.burnProgress + '%' }" />
          </div>
          <div class="bar-pct mono">{{ phaseContent.burnProgress.toFixed(0) }}%</div>
        </template>

        <!-- Blackout progress bar -->
        <template v-else-if="phaseContent.inBlackout">
          <div class="bar-label mono" style="color:#f87171">BLACKOUT ACTIVO</div>
          <div class="prog-track blackout-track">
            <div class="prog-fill blackout-fill" :style="{ width: phaseContent.blackoutProgress + '%' }" />
          </div>
          <div class="bar-pct mono" style="color:#f87171">{{ phaseContent.blackoutProgress.toFixed(0) }}%</div>
        </template>

        <!-- G-force meter (reentry) -->
        <template v-else-if="phaseContent.showGForce">
          <div class="bar-label mono">G-FORCE</div>
          <div class="gforce-display" :class="phaseContent.gforce > 5 ? 'gforce-high' : 'gforce-mid'">
            {{ phaseContent.gforce.toFixed(1) }}<span class="gforce-unit">G</span>
          </div>
          <div class="gforce-bar">
            <div v-for="i in 8" :key="i"
              class="gforce-seg"
              :class="i <= Math.ceil(phaseContent.gforce) ? (phaseContent.gforce > 5 ? 'seg-red' : 'seg-amber') : 'seg-off'" />
          </div>
        </template>

        <!-- Countdown (pre-launch) -->
        <template v-else-if="phaseContent.type === 'countdown'">
          <div class="bar-label mono">T-MINUS</div>
          <div class="countdown-big mono">{{ phaseContent.countdown }}</div>
        </template>

        <!-- Default: phase mini-map -->
        <template v-else>
          <div class="phase-icon">
            <!-- ORBIT -->
            <svg v-if="activePhase === 'orbit'" width="120" height="56" viewBox="0 0 120 56" fill="none">
              <circle cx="60" cy="28" r="14" fill="rgba(0,80,200,0.18)" stroke="rgba(100,160,255,0.45)" stroke-width="1.2"/>
              <text x="60" y="32" text-anchor="middle" font-size="6" fill="rgba(100,160,255,0.7)" font-family="monospace">TIERRA</text>
              <ellipse cx="60" cy="28" rx="42" ry="14" fill="none" stroke="rgba(167,139,250,0.3)" stroke-width="1" stroke-dasharray="4 3"/>
              <circle cx="60" cy="14" r="4" fill="rgba(167,139,250,0.2)" stroke="#a78bfa" stroke-width="1.5"/>
              <circle cx="60" cy="14" r="2" fill="#a78bfa"/>
            </svg>
            <!-- TRANSIT -->
            <svg v-else-if="activePhase === 'transit'" width="160" height="56" viewBox="0 0 160 56" fill="none">
              <circle cx="18" cy="30" r="11" fill="rgba(0,80,200,0.18)" stroke="rgba(100,160,255,0.45)" stroke-width="1.2"/>
              <text x="18" y="50" text-anchor="middle" font-size="6" fill="rgba(100,160,255,0.6)" font-family="monospace">TIERRA</text>
              <circle cx="142" cy="30" r="9" fill="rgba(140,150,170,0.12)" stroke="rgba(160,165,190,0.4)" stroke-width="1.2"/>
              <text x="142" y="50" text-anchor="middle" font-size="6" fill="rgba(160,165,190,0.6)" font-family="monospace">LUNA</text>
              <!-- full arc dashed -->
              <path d="M 29 30 Q 80 8 133 30" fill="none" stroke="rgba(167,139,250,0.2)" stroke-width="1.2" stroke-dasharray="5 4"/>
              <!-- completed segment -->
              <path d="M 29 30 Q 80 8 70 17" fill="none" stroke="#a78bfa" stroke-width="2" stroke-linecap="round"/>
              <!-- orion at ~40% -->
              <circle cx="70" cy="17" r="5" fill="rgba(167,139,250,0.18)" stroke="#a78bfa" stroke-width="1.5"/>
              <circle cx="70" cy="17" r="2" fill="#a78bfa"/>
            </svg>
            <!-- RETURN -->
            <svg v-else-if="activePhase === 'return'" width="160" height="56" viewBox="0 0 160 56" fill="none">
              <circle cx="18" cy="28" r="11" fill="rgba(0,80,200,0.18)" stroke="rgba(100,160,255,0.45)" stroke-width="1.2"/>
              <text x="18" y="48" text-anchor="middle" font-size="6" fill="rgba(100,160,255,0.6)" font-family="monospace">TIERRA</text>
              <circle cx="142" cy="28" r="9" fill="rgba(140,150,170,0.12)" stroke="rgba(160,165,190,0.4)" stroke-width="1.2"/>
              <text x="142" y="48" text-anchor="middle" font-size="6" fill="rgba(160,165,190,0.6)" font-family="monospace">LUNA</text>
              <path d="M 133 28 Q 80 50 29 28" fill="none" stroke="rgba(52,211,153,0.25)" stroke-width="1" stroke-dasharray="5 4"/>
              <path d="M 133 28 Q 80 50 72 33" fill="none" stroke="#34d399" stroke-width="2"/>
              <circle cx="72" cy="33" r="5" fill="rgba(52,211,153,0.15)" stroke="#34d399" stroke-width="1.5"/>
              <circle cx="72" cy="33" r="2" fill="#34d399"/>
            </svg>
            <!-- FLYBY -->
            <svg v-else-if="activePhase === 'flyby'" width="120" height="56" viewBox="0 0 120 56" fill="none">
              <circle cx="96" cy="28" r="14" fill="rgba(140,150,170,0.12)" stroke="rgba(160,165,190,0.4)" stroke-width="1.2"/>
              <text x="96" y="48" text-anchor="middle" font-size="6" fill="rgba(160,165,190,0.6)" font-family="monospace">LUNA</text>
              <path d="M 10 28 Q 50 4 82 16" fill="none" stroke="#a78bfa" stroke-width="1.5"/>
              <path d="M 82 16 Q 106 8 110 28 Q 106 48 82 40" fill="none" stroke="rgba(167,139,250,0.4)" stroke-width="1" stroke-dasharray="4 3"/>
              <circle cx="82" cy="16" r="5" fill="rgba(167,139,250,0.15)" stroke="#a78bfa" stroke-width="1.5"/>
              <circle cx="82" cy="16" r="2" fill="#a78bfa"/>
            </svg>
            <!-- DEFAULT -->
            <svg v-else width="80" height="56" viewBox="0 0 80 56" fill="none">
              <circle cx="40" cy="28" r="20" fill="none" stroke="rgba(167,139,250,0.15)" stroke-width="1"/>
              <circle cx="40" cy="28" r="5" fill="rgba(167,139,250,0.2)" stroke="#a78bfa" stroke-width="1.5"/>
            </svg>
          </div>
        </template>

      </div>

      <!-- Right: data lines -->
      <div class="pa-right">
        <div v-for="line in phaseContent.lines" :key="line.label" class="pa-line">
          <span class="pa-line-label mono">{{ line.label }}</span>
          <span class="pa-line-value mono" :style="{ color: line.color }">{{ line.value }}</span>
        </div>
      </div>

    </div>

    <!-- Bottom accent -->
    <div class="bottom-accent" />
  </div>
</template>

<script setup>
import { usePhaseContent } from '../composables/usePhaseContent.js'

const { activePhase, phaseContent } = usePhaseContent()
</script>

<style scoped>
.phase-alert {
  position: relative;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid rgba(167,139,250,0.15);
  background: rgba(14,11,26,0.97);
  transition: border-color 0.4s, box-shadow 0.4s;
}

/* ── Severity theming ── */
.sev-nominal   { border-color: rgba(52,211,153,0.2);  box-shadow: 0 0 20px rgba(52,211,153,0.04); }
.sev-active    { border-color: rgba(251,191,36,0.35); box-shadow: 0 0 24px rgba(251,191,36,0.08); }
.sev-advisory  { border-color: rgba(251,191,36,0.25); box-shadow: 0 0 20px rgba(251,191,36,0.05); }
.sev-warning   { border-color: rgba(248,113,113,0.3); box-shadow: 0 0 24px rgba(248,113,113,0.06); }
.sev-blackout  { border-color: rgba(248,113,113,0.5); box-shadow: 0 0 32px rgba(248,113,113,0.12); animation: blackout-pulse 2s ease-in-out infinite; }
.sev-critical  { border-color: rgba(248,113,113,0.5); box-shadow: 0 0 32px rgba(248,113,113,0.14); animation: blackout-pulse 1.4s ease-in-out infinite; }
.sev-complete  { border-color: rgba(52,211,153,0.4);  box-shadow: 0 0 28px rgba(52,211,153,0.10); }

@keyframes blackout-pulse {
  0%, 100% { box-shadow: 0 0 24px rgba(248,113,113,0.08); }
  50%       { box-shadow: 0 0 48px rgba(248,113,113,0.22); }
}

/* ── Accent lines ── */
.accent-line {
  height: 1.5px;
  width: 100%;
}
.sev-nominal   .accent-line { background: linear-gradient(90deg, transparent, #34d399, transparent); }
.sev-active    .accent-line { background: linear-gradient(90deg, transparent, #fbbf24, transparent); }
.sev-advisory  .accent-line { background: linear-gradient(90deg, transparent, #fbbf24 60%, transparent); opacity: 0.7; }
.sev-warning   .accent-line { background: linear-gradient(90deg, transparent, #f87171, transparent); }
.sev-blackout  .accent-line { background: linear-gradient(90deg, transparent, #f87171, transparent); }
.sev-critical  .accent-line { background: linear-gradient(90deg, transparent, #f87171, transparent); animation: crit-line 1.4s ease-in-out infinite; }
.sev-complete  .accent-line { background: linear-gradient(90deg, transparent, #34d399, transparent); }

@keyframes crit-line {
  0%, 100% { opacity: 0.6; }
  50%       { opacity: 1; }
}

.bottom-accent {
  height: 1px;
  width: 100%;
  background: linear-gradient(90deg, transparent, rgba(167,139,250,0.12), transparent);
}

/* ── Inner layout ── */
.pa-inner {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 20px;
  align-items: center;
  padding: 14px 20px;
  min-height: 72px;
}

/* ── Left block ── */
.pa-left { min-width: 0; }

.pa-phase-tag {
  font-size: 0.6rem;
  letter-spacing: 0.18em;
  color: rgba(167,139,250,0.45);
  margin-bottom: 2px;
}

.pa-title {
  font-family: 'Orbitron', 'Share Tech Mono', monospace;
  font-size: clamp(0.75rem, 1.5vw, 1rem);
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.05em;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.sev-active   .pa-title { color: #fbbf24; text-shadow: 0 0 16px rgba(251,191,36,0.5); }
.sev-blackout .pa-title { color: #f87171; text-shadow: 0 0 16px rgba(248,113,113,0.5); }
.sev-critical .pa-title { color: #f87171; text-shadow: 0 0 20px rgba(248,113,113,0.6); }
.sev-complete .pa-title { color: #34d399; text-shadow: 0 0 16px rgba(52,211,153,0.5); }

.pa-subtitle {
  font-size: 0.7rem;
  color: rgba(167,139,250,0.55);
  margin-top: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ── Center block ── */
.pa-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-width: 160px;
}

.bar-label {
  font-size: 0.6rem;
  letter-spacing: 0.15em;
  color: rgba(167,139,250,0.5);
}

.prog-track {
  width: 150px;
  height: 6px;
  background: rgba(167,139,250,0.1);
  border-radius: 3px;
  overflow: hidden;
  border: 1px solid rgba(167,139,250,0.15);
}
.blackout-track { border-color: rgba(248,113,113,0.2); background: rgba(248,113,113,0.07); }

.prog-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.8s ease;
}
.burn-fill    { background: linear-gradient(90deg, #a78bfa, #fbbf24); box-shadow: 0 0 8px rgba(251,191,36,0.4); }
.blackout-fill{ background: linear-gradient(90deg, #f87171, #fca5a5); box-shadow: 0 0 8px rgba(248,113,113,0.4); }

.bar-pct { font-size: 0.65rem; color: rgba(167,139,250,0.7); }

/* G-force */
.gforce-display {
  font-family: 'Share Tech Mono', monospace;
  font-size: 1.6rem;
  font-weight: 700;
  line-height: 1;
}
.gforce-mid  { color: #fbbf24; text-shadow: 0 0 16px rgba(251,191,36,0.5); }
.gforce-high { color: #f87171; text-shadow: 0 0 20px rgba(248,113,113,0.6); }
.gforce-unit { font-size: 0.8rem; opacity: 0.7; margin-left: 2px; }

.gforce-bar {
  display: flex;
  gap: 3px;
  margin-top: 2px;
}
.gforce-seg {
  width: 12px; height: 6px;
  border-radius: 2px;
}
.seg-off   { background: rgba(167,139,250,0.1); }
.seg-amber { background: #fbbf24; box-shadow: 0 0 4px rgba(251,191,36,0.5); }
.seg-red   { background: #f87171; box-shadow: 0 0 4px rgba(248,113,113,0.5); }

/* Countdown */
.countdown-big {
  font-size: clamp(1.2rem, 2.5vw, 1.6rem);
  font-weight: 700;
  color: #fbbf24;
  text-shadow: 0 0 16px rgba(251,191,36,0.5);
  letter-spacing: 0.08em;
}

/* Phase icon */
.phase-icon { opacity: 1; }

/* ── Right: data lines ── */
.pa-right {
  display: flex;
  flex-direction: column;
  gap: 3px;
  align-items: flex-end;
}

.pa-line {
  display: flex;
  gap: 8px;
  align-items: center;
}
.pa-line-label {
  font-size: 0.6rem;
  letter-spacing: 0.1em;
  color: rgba(167,139,250,0.4);
  text-align: right;
  min-width: 70px;
}
.pa-line-value {
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  font-weight: 600;
  min-width: 90px;
  text-align: right;
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .pa-inner {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto;
  }
  .pa-left   { grid-column: 1 / 3; }
  .pa-center { grid-column: 1; align-items: flex-start; min-width: 0; }
  .pa-right  { grid-column: 2; align-items: flex-end; }
}

@media (max-width: 480px) {
  .pa-inner { grid-template-columns: 1fr; }
  .pa-center, .pa-right { grid-column: 1; align-items: flex-start; }
  .pa-right { flex-direction: row; flex-wrap: wrap; gap: 6px 16px; }
  .pa-line  { gap: 6px; }
}
</style>
