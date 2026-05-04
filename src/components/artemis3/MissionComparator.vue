<template>
  <div class="panel flex flex-col">
    <div class="panel-title a3">
      ARTEMIS PROGRAM — MISSION COMPARATOR
      <span class="ml-auto mono text-[11px]" style="color:var(--t-mute)">I · II · III</span>
    </div>

    <div class="overflow-x-auto">
      <table class="comp-table">
        <thead>
          <tr>
            <th class="row-label"></th>
            <th v-for="m in missions" :key="m.id" :class="`col-${m.id}`">
              <div class="mission-col-head">
                <div class="mission-num">{{ m.roman }}</div>
                <div class="mission-name">{{ m.label }}</div>
                <div class="mission-state-badge" :class="m.state">{{ STATE_LABELS[m.state] }}</div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.key" class="data-row">
            <td class="row-label">{{ row.label }}</td>
            <td v-for="m in missions" :key="m.id" :class="`col-${m.id}`">
              <div class="cell-val" :class="{ highlight: row.highlight?.[m.id] }">
                {{ row.data[m.id] ?? '—' }}
              </div>
              <div v-if="row.sub?.[m.id]" class="cell-sub">{{ row.sub[m.id] }}</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="px-4 py-2 flex items-center gap-2 flex-wrap" style="border-top:1px solid rgba(0,0,0,0.12)">
      <a href="https://www.nasa.gov/humans-in-space/artemis/" target="_blank" rel="noopener" class="src-link">↗ NASA Artemis Program</a>
      <span style="color:var(--t-mute); font-size:0.75rem">·</span>
      <a href="https://oig.nasa.gov" target="_blank" rel="noopener" class="src-link">↗ NASA OIG Reports</a>
    </div>
  </div>
</template>

<script setup>
import { MISSIONS } from '../../missions/index.js'

const STATE_LABELS = { historical: 'HIST', 'pre-launch': 'PRE-LAUNCH', active: 'LIVE' }

const missions = [
  { id: 'artemis1', roman: 'I',   label: 'Artemis I',   state: 'historical'  },
  { id: 'artemis2', roman: 'II',  label: 'Artemis II',  state: 'historical'  },
  { id: 'artemis3', roman: 'III', label: 'Artemis III', state: 'pre-launch'  },
]

const rows = [
  {
    key: 'launch',
    label: 'Lanzamiento',
    data: { artemis1: '16 Nov 2022', artemis2: '01 Abr 2026', artemis3: 'NET Late 2027' },
  },
  {
    key: 'duration',
    label: 'Duración',
    data: { artemis1: '25.5 días', artemis2: '~10 días', artemis3: 'TBD' },
  },
  {
    key: 'vehicle',
    label: 'Vehículo',
    data: { artemis1: 'SLS Block 1\nOrion CM-002', artemis2: 'SLS Block 1\nOrion CM-003', artemis3: 'SLS Block 1\nOrion CM-004' },
  },
  {
    key: 'crew',
    label: 'Tripulación',
    data: { artemis1: 'Sin tripulación', artemis2: '4 astronautas', artemis3: 'TBD' },
    sub:  { artemis2: 'Wiseman · Glover · Koch · Hansen' },
  },
  {
    key: 'objective',
    label: 'Objetivo principal',
    data: { artemis1: 'Validación SLS+Orion sin tripulación', artemis2: 'Primer vuelo tripulado, sobrevuelo lunar', artemis3: 'Rendezvous LEO con HLS comercial' },
  },
  {
    key: 'distance',
    label: 'Dist. máx. Tierra',
    data: { artemis1: '432,210 km (récord)', artemis2: '~390,000 km', artemis3: 'LEO ~400 km' },
    highlight: { artemis1: true },
  },
  {
    key: 'lunar',
    label: 'Actividad lunar',
    data: { artemis1: 'Órbita retrógrada distante', artemis2: 'Sobrevuelo 6,400 km', artemis3: 'Ninguna (rediseño 2026)' },
  },
  {
    key: 'hls',
    label: 'HLS',
    data: { artemis1: 'N/A', artemis2: 'N/A', artemis3: 'SpaceX Starship + Blue Origin MK2' },
  },
  {
    key: 'cost',
    label: 'Costo estimado',
    data: { artemis1: '~$4.1 B', artemis2: '~$4.1 B', artemis3: '~$4–5 B (est.)' },
    sub:  { artemis1: 'OIG Report 2022', artemis2: 'OIG Report 2022', artemis3: 'Estimado preliminar' },
  },
  {
    key: 'landing',
    label: 'Alunizaje',
    data: { artemis1: 'No', artemis2: 'No', artemis3: 'No → movido a Artemis IV' },
  },
  {
    key: 'next',
    label: 'Próxima misión',
    data: { artemis1: '→ Artemis II', artemis2: '→ Artemis III', artemis3: '→ Artemis IV ~2028 (alunizaje)' },
  },
]
</script>

<style scoped>
.comp-table {
  width: 100%;
  border-collapse: collapse;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 0.72rem;
}

.comp-table th, .comp-table td {
  padding: 8px 12px;
  text-align: left;
  border-bottom: 1px solid rgba(0,0,0,0.1);
  vertical-align: top;
}

/* Column header */
.mission-col-head { display: flex; flex-direction: column; align-items: center; gap: 3px; text-align: center; }
.mission-num  { font-family: 'Orbitron', monospace; font-size: 1.1rem; font-weight: 900; color: var(--t-hi); }
.mission-name { font-size: 0.58rem; letter-spacing: 0.1em; color: var(--t-dim); text-transform: uppercase; }
.mission-state-badge {
  font-size: 0.48rem; font-weight: 700; letter-spacing: 0.1em;
  padding: 1px 5px; border-radius: 3px; text-transform: uppercase;
}
.mission-state-badge.historical  { background: rgba(0,0,0,0.2); color: var(--t-mute); }
.mission-state-badge.pre-launch  { background: rgba(56,189,248,0.15); color: #38bdf8; }
.mission-state-badge.active      { background: rgba(52,211,153,0.15); color: #34d399; }

/* Row label */
.row-label {
  font-size: 0.6rem; font-weight: 600; letter-spacing: 0.1em;
  color: var(--t-mute); text-transform: uppercase;
  white-space: nowrap; min-width: 130px;
}

/* Data cells */
.data-row:nth-child(even) { background: rgba(29,58,77,0.03); }
.data-row:hover { background: rgba(29,58,77,0.06); }
.cell-val { color: var(--t-text); line-height: 1.4; white-space: pre-line; }
.cell-val.highlight { color: var(--a3-rust, #b35a3c); font-weight: 700; }
.cell-sub { font-size: 0.7rem; color: var(--t-mute); margin-top: 2px; }

/* Column tints */
.col-artemis1 { border-left: 2px solid rgba(251,146,60,0.3); }
.col-artemis2 { border-left: 2px solid rgba(167,139,250,0.3); }
.col-artemis3 { border-left: 2px solid rgba(131,176,181,0.3); }
.comp-table th.col-artemis1 .mission-num { color: #fb923c; }
.comp-table th.col-artemis2 .mission-num { color: #a78bfa; }
.comp-table th.col-artemis3 .mission-num { color: #83b0b5; }

.src-link {
  font-size: 0.6rem; color: var(--t-link, #b35a3c);
  text-decoration: none; transition: opacity 0.2s;
}
.src-link:hover { opacity: 0.75; }
</style>
