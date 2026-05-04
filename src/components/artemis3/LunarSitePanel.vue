<template>
  <div class="panel flex flex-col">
    <div class="panel-title a3">
      ARTEMIS IV — LUNAR SOUTH POLE
      <span class="ml-auto mono text-[11px]" style="color:var(--t-mute)">TARGET: ~2028</span>
    </div>

    <div class="p-4 flex flex-col gap-4">

      <!-- Context note -->
      <div class="context-bar">
        <strong style="color:var(--t-hi)">Artemis III:</strong>
        Sin alunizaje (rediseño Feb 2026). El primer alunizaje tripulado desde Apollo 17 (1972) está ahora programado para <strong style="color:var(--t-hi)">Artemis IV (~2028)</strong>.
      </div>

      <!-- Why south pole -->
      <div>
        <div class="section-sep">¿POR QUÉ EL POLO SUR?</div>
        <ul class="why-list mt-2">
          <li v-for="r in whyReasons" :key="r.icon" class="why-item">
            <span class="why-icon">{{ r.icon }}</span>
            <div>
              <div class="why-title">{{ r.title }}</div>
              <div class="why-desc">{{ r.desc }}</div>
            </div>
          </li>
        </ul>
      </div>

      <!-- South pole SVG map -->
      <div>
        <div class="section-sep">REGIÓN DEL POLO SUR LUNAR</div>
        <div class="map-wrap mt-3">
          <svg viewBox="0 0 320 320" class="lunar-map" aria-label="Mapa polo sur lunar">
            <!-- Background -->
            <circle cx="160" cy="160" r="155" fill="#1a2535" />
            <!-- Rough terrain rings -->
            <circle cx="160" cy="160" r="140" fill="none" stroke="rgba(131,176,181,0.12)" stroke-width="1"/>
            <circle cx="160" cy="160" r="110" fill="none" stroke="rgba(131,176,181,0.10)" stroke-width="0.8"/>
            <circle cx="160" cy="160" r="80"  fill="none" stroke="rgba(131,176,181,0.10)" stroke-width="0.8"/>
            <!-- Shackleton crater (main) -->
            <circle cx="160" cy="160" r="28" fill="rgba(10,18,30,0.8)" stroke="#83b0b5" stroke-width="1.5"/>
            <text x="160" y="156" text-anchor="middle" font-size="7" font-family="Inter,sans-serif" fill="#83b0b5" font-weight="600">SHACKLETON</text>
            <text x="160" y="166" text-anchor="middle" font-size="6" font-family="Inter,sans-serif" fill="rgba(131,176,181,0.6)">~21 km</text>

            <!-- Candidate landing sites (NASA 9 regions) -->
            <g v-for="site in sites" :key="site.id">
              <circle :cx="site.x" :cy="site.y" r="6"
                :fill="site.primary ? 'rgba(227,169,87,0.25)' : 'rgba(131,176,181,0.15)'"
                :stroke="site.primary ? '#e3a957' : '#83b0b5'" stroke-width="1.2"/>
              <text :x="site.x + 9" :y="site.y + 3" font-size="6"
                font-family="Inter,sans-serif"
                :fill="site.primary ? '#e3a957' : 'rgba(131,176,181,0.7)'">
                {{ site.label }}
              </text>
            </g>

            <!-- Polar marker -->
            <circle cx="160" cy="160" r="3" fill="#e3a957"/>
            <text x="160" y="198" text-anchor="middle" font-size="7.5" font-family="Inter,sans-serif" fill="rgba(249,241,211,0.4)">POLO SUR (90°S)</text>

            <!-- Legend -->
            <circle cx="18" cy="298" r="5" fill="rgba(227,169,87,0.25)" stroke="#e3a957" stroke-width="1"/>
            <text x="27" y="302" font-size="6.5" font-family="Inter,sans-serif" fill="rgba(249,241,211,0.5)">Sitios candidatos NASA</text>
          </svg>
        </div>
      </div>

      <!-- Candidate sites list -->
      <div>
        <div class="section-sep">9 REGIONES CANDIDATAS (NASA, 2023)</div>
        <div class="grid grid-cols-2 gap-1.5 mt-2">
          <div v-for="s in candidateSites" :key="s" class="site-chip">{{ s }}</div>
        </div>
        <a href="https://www.nasa.gov/news-release/nasa-provides-update-on-artemis-iii-moon-landing-regions/"
          target="_blank" rel="noopener" class="src-link mt-2 inline-block">
          ↗ NASA: Artemis III Moon Landing Regions
        </a>
      </div>

      <!-- Permanently shadowed regions -->
      <div class="psr-box">
        <div class="psr-title">Regiones Permanentemente Sombreadas (PSR)</div>
        <p class="psr-desc">Las cráteras del polo sur nunca reciben luz solar directa. Temperatura: –196°C. Contienen agua en estado sólido (hielo) — recurso clave para futuras misiones de larga duración y producción de combustible in-situ (ISRU).</p>
      </div>

    </div>
  </div>
</template>

<script setup>
const whyReasons = [
  { icon: '💧', title: 'Agua helada en cráteres sombreados', desc: 'Las PSR contienen depósitos de hielo confirmados por LCROSS (2009) y LRO. Recurso para vida y combustible.' },
  { icon: '☀️', title: 'Picos de luz solar casi permanente', desc: 'Crestas como Mons Malapert reciben luz ~90% del tiempo — energía solar continua para bases.' },
  { icon: '🔬', title: 'Ciencia inédita', desc: 'Material pristino sin alterar por 4 mil millones de años. Historia temprana del Sistema Solar.' },
  { icon: '🚀', title: 'Base para misiones profundas', desc: 'Posición estratégica para la futura Base Camp lunar y misiones hacia Marte.' },
]

// Approximate positions on the SVG for key crater/region markers around south pole
const sites = [
  { id: 1, x: 135, y: 115, label: 'Haworth',         primary: true  },
  { id: 2, x: 195, y: 110, label: 'Nobile Rim 1',    primary: true  },
  { id: 3, x: 215, y: 145, label: 'Nobile Rim 2',    primary: false },
  { id: 4, x: 100, y: 150, label: 'Malapert Massif', primary: true  },
  { id: 5, x: 115, y: 195, label: 'de Gerlache',     primary: false },
  { id: 6, x: 200, y: 200, label: 'Mons Mouton',     primary: false },
  { id: 7, x: 170, y: 105, label: 'Cabeus B',        primary: false },
]

const candidateSites = [
  'Haworth', 'Nobile Rim 1', 'Nobile Rim 2',
  'Malapert Massif', 'Mons Mouton', 'Mons Mouton Plateau',
  'De Gerlache Rim 2', 'Peak near Cabeus B', 'Slater Plain',
]
</script>

<style scoped>
.context-bar {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 0.72rem;
  line-height: 1.5;
  color: var(--t-text);
  padding: 10px 12px;
  background: rgba(0,0,0,0.15);
  border-radius: 7px;
  border-left: 3px solid var(--t-hi);
}

.section-sep { font-family:'Inter',sans-serif; font-size:0.72rem; font-weight:600; letter-spacing:0.2em; text-transform:uppercase; color:var(--t-mute); }

.why-list  { list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:8px; }
.why-item  { display:flex; align-items:flex-start; gap:10px; }
.why-icon  { font-size:1rem; flex-shrink:0; margin-top:1px; }
.why-title { font-family:'Inter',sans-serif; font-size:0.72rem; font-weight:600; color:var(--t-hi); }
.why-desc  { font-family:'Inter',sans-serif; font-size:0.78rem; color:var(--t-text); opacity:0.75; line-height:1.4; margin-top:1px; }

.map-wrap { display:flex; justify-content:center; }
.lunar-map { width:100%; max-width:280px; border-radius:50%; }

.site-chip {
  font-family:'Inter',sans-serif; font-size:0.75rem;
  padding: 3px 8px; border-radius:4px;
  background:rgba(0,0,0,0.15); border:1px solid rgba(0,0,0,0.12);
  color:var(--t-text);
}

.psr-box {
  padding:10px 12px; background:rgba(0,0,0,0.15);
  border-radius:7px; border:1px solid rgba(131,176,181,0.2);
}
.psr-title { font-family:'Inter',sans-serif; font-size:0.80rem; font-weight:700; color:var(--t-hi); margin-bottom:4px; }
.psr-desc  { font-family:'Inter',sans-serif; font-size:0.78rem; color:var(--t-text); opacity:0.75; line-height:1.5; }

.src-link { font-size:0.75rem; color:var(--t-link,#b35a3c); text-decoration:none; transition:opacity 0.2s; }
.src-link:hover { opacity:0.75; }
</style>
