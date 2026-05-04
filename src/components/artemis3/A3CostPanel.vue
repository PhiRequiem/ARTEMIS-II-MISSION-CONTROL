<template>
  <div class="panel flex flex-col">
    <div class="panel-title a3">
      PROGRAM COSTS
      <span class="ml-auto mono text-[11px]" style="color:var(--t-mute)">OIG · GAO · NASA</span>
    </div>

    <div class="p-4 flex flex-col gap-4">

      <!-- Total cost banner -->
      <div class="cost-banner">
        <div class="cost-label">COSTO ESTIMADO ARTEMIS III</div>
        <div class="cost-number">~$4–5 <span class="cost-unit">BILLION USD</span></div>
        <div class="cost-note">Estimado preliminar. Fuente: OIG Report IG-26-004, Mar 2026</div>
      </div>

      <!-- Cost breakdown bars -->
      <div>
        <div class="section-sep">DESGLOSE POR SISTEMA</div>
        <div class="space-y-2 mt-3">
          <div v-for="item in breakdown" :key="item.id" class="cost-row">
            <div class="cost-row-label">{{ item.label }}</div>
            <div class="cost-bar-wrap">
              <div class="cost-bar" :style="{ width: item.pct + '%', background: item.color }" />
            </div>
            <div class="cost-pct mono">{{ item.pct }}%</div>
            <div class="cost-amt mono">{{ item.amt }}</div>
          </div>
        </div>
      </div>

      <!-- Program total comparison -->
      <div>
        <div class="section-sep">COSTO ACUMULADO PROGRAMA ARTEMIS</div>
        <div class="grid grid-cols-3 gap-2 mt-3">
          <div v-for="m in programCosts" :key="m.id" class="prog-card">
            <div class="prog-mission" :style="{ color: m.color }">{{ m.name }}</div>
            <div class="prog-cost">{{ m.cost }}</div>
            <div class="prog-note">{{ m.note }}</div>
          </div>
        </div>
      </div>

      <!-- Acumulado total -->
      <div class="total-row">
        <span class="total-label">INVERSIÓN TOTAL PROGRAMA (I+II+III est.)</span>
        <span class="total-val">~$93.4 B</span>
      </div>
      <div class="mono text-[11px]" style="color:var(--t-mute)">
        Incluye desarrollo SLS ($23.8B), Orion ($20.4B), Exploration Ground Systems ($4.4B), Gateway, HLS y operaciones.
        Fuentes: GAO-23-105338 · OIG IG-22-003 · OIG IG-26-004
      </div>

      <!-- Source links -->
      <div class="flex gap-3 flex-wrap" style="border-top:1px solid rgba(0,0,0,0.12); padding-top:8px">
        <a href="https://oig.nasa.gov/wp-content/uploads/2026/03/final-report-ig-26-004-nasas-management-of-the-human-landing-system-contracts.pdf" target="_blank" rel="noopener" class="src-link">↗ OIG HLS Report 2026</a>
        <a href="https://www.gao.gov/products/gao-23-105338" target="_blank" rel="noopener" class="src-link">↗ GAO Artemis Report 2023</a>
        <a href="https://oig.nasa.gov/wp-content/uploads/2022/11/ig-22-003.pdf" target="_blank" rel="noopener" class="src-link">↗ OIG Artemis Costs 2022</a>
      </div>

    </div>
  </div>
</template>

<script setup>
const breakdown = [
  { id: 'sls',    label: 'SLS Block 1',          pct: 42, amt: '~$1.7B', color: '#83b0b5' },
  { id: 'orion',  label: 'Orion + ESM',           pct: 28, amt: '~$1.1B', color: '#7facaf' },
  { id: 'hls',    label: 'HLS (SpaceX/BO)',        pct: 18, amt: '~$0.7B', color: '#e3a957' },
  { id: 'ground', label: 'Ground Systems + Ops',   pct: 12, amt: '~$0.5B', color: '#b35a3c' },
]

const programCosts = [
  { id: 'a1', name: 'ARTEMIS I',   cost: '$4.1 B',  note: 'OIG 2022',    color: '#fb923c' },
  { id: 'a2', name: 'ARTEMIS II',  cost: '$4.1 B',  note: 'OIG 2022',    color: '#a78bfa' },
  { id: 'a3', name: 'ARTEMIS III', cost: '~$4–5 B', note: 'Est. OIG 2026', color: '#83b0b5' },
]
</script>

<style scoped>
.cost-banner {
  padding: 14px 16px;
  background: rgba(0,0,0,0.2);
  border-radius: 8px;
  border: 1px solid rgba(0,0,0,0.15);
}
.cost-label { font-family:'Inter',sans-serif; font-size:0.72rem; font-weight:600; letter-spacing:0.2em; color:var(--t-mute); text-transform:uppercase; }
.cost-number { font-family:'Inter',sans-serif; font-size:2.2rem; font-weight:200; color:var(--t-hi); line-height:1.1; margin-top:4px; }
.cost-unit   { font-size:0.9rem; font-weight:500; letter-spacing:0.08em; }
.cost-note   { font-size:0.75rem; color:var(--t-mute); margin-top:4px; font-family:'Inter',sans-serif; }

.section-sep { font-family:'Inter',sans-serif; font-size:0.72rem; font-weight:600; letter-spacing:0.2em; text-transform:uppercase; color:var(--t-mute); }

.cost-row { display:grid; grid-template-columns:130px 1fr 36px 55px; align-items:center; gap:8px; }
.cost-row-label { font-family:'Inter',sans-serif; font-size:0.80rem; color:var(--t-text); }
.cost-bar-wrap  { height:6px; background:rgba(0,0,0,0.2); border-radius:3px; overflow:hidden; }
.cost-bar       { height:100%; border-radius:3px; transition:width 0.8s ease; }
.cost-pct, .cost-amt { font-size:0.75rem; color:var(--t-dim); text-align:right; }

.prog-card { background:rgba(0,0,0,0.15); border:1px solid rgba(0,0,0,0.12); border-radius:6px; padding:8px 10px; }
.prog-mission { font-family:'Orbitron',monospace; font-size:0.72rem; font-weight:700; letter-spacing:0.1em; }
.prog-cost { font-family:'Inter',sans-serif; font-size:1.1rem; font-weight:300; color:var(--t-hi); margin-top:3px; }
.prog-note { font-size:0.72rem; color:var(--t-mute); font-family:'Inter',sans-serif; margin-top:2px; }

.total-row { display:flex; align-items:center; justify-content:space-between; padding:8px 12px; background:rgba(0,0,0,0.2); border-radius:6px; }
.total-label { font-family:'Inter',sans-serif; font-size:0.74rem; font-weight:600; letter-spacing:0.1em; color:var(--t-dim); text-transform:uppercase; }
.total-val   { font-family:'Inter',sans-serif; font-size:1.2rem; font-weight:300; color:var(--t-hi); }

.src-link { font-size:0.75rem; color:var(--t-link,#b35a3c); text-decoration:none; transition:opacity 0.2s; }
.src-link:hover { opacity:0.75; }
</style>
