<template>
  <div class="panel">
    <div class="panel-title">ACERCA DE ESTE DASHBOARD</div>
    <div class="p-5 grid grid-cols-1 gap-8 md:grid-cols-3">

      <!-- Fuentes de datos -->
      <div>
        <h3 class="section-heading">Fuentes de datos</h3>
        <div class="space-y-3 mt-3">

          <div v-for="src in sources" :key="src.name" class="source-row">
            <div class="flex items-start gap-2">
              <span class="source-badge">{{ src.tag }}</span>
              <div>
                <a v-if="src.nameUrl" :href="src.nameUrl" target="_blank" rel="noopener"
                  class="source-name source-name-link">{{ src.name }}</a>
                <div v-else class="source-name">{{ src.name }}</div>
                <div class="source-desc">{{ src.desc }}</div>
                <a v-if="src.url" :href="src.url" target="_blank" rel="noopener"
                  class="source-link">{{ src.urlLabel }}</a>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- Tecnología -->
      <div>
        <h3 class="section-heading">Stack técnico</h3>
        <div class="space-y-2 mt-3">
          <div v-for="t in techStack" :key="t.name" class="flex items-center gap-2.5">
            <div class="tech-dot" />
            <div>
              <span class="tech-name">{{ t.name }}</span>
              <span class="tech-ver">{{ t.ver }}</span>
            </div>
          </div>
          <div class="mt-3 pt-3 border-t border-white/5 text-xs" style="color:#4e4470">
            Single-page app. Sin backend. Sin autenticación.<br>
            Datos en tiempo real vía polling cada 30 segundos.<br>
            Fallback local cuando las APIs no responden.
          </div>
        </div>
      </div>

      <!-- Créditos -->
      <div>
        <h3 class="section-heading">Créditos</h3>
        <div class="mt-3 space-y-4">

          <div>
            <div class="text-xs" style="color:#4e4470">Desarrollado por</div>
            <a href="https://github.com/PhiRequiem" target="_blank" rel="noopener"
              class="credit-name">PHIREQUIEM</a>
            <div class="text-xs mt-1" style="color:#4e4470">
              Diseño, desarrollo y concepto visual
            </div>
          </div>

          <div class="border-t border-white/5 pt-3 space-y-1.5">
            <div class="text-xs font-semibold mb-2" style="color:#6d5fa0">Recursos externos</div>
            <div v-for="c in credits" :key="c.name"
              class="flex items-baseline gap-1.5 text-xs" style="color:#4e4470">
              <span style="color:#6d5fa0">·</span>
              <span>
                <span style="color:#9d8fd4">{{ c.name }}</span>
                — {{ c.desc }}
              </span>
            </div>
          </div>

          <div class="border-t border-white/5 pt-3">
            <div class="text-xs mb-2 font-semibold" style="color:#6d5fa0">Repositorio</div>
            <a href="https://github.com/PhiRequiem/ARTEMIS-II-MISSION-CONTROL"
              target="_blank" rel="noopener"
              class="flex items-center gap-2 text-xs group"
              style="color:#6d5fa0">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" class="flex-shrink-0">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/>
              </svg>
              <span class="group-hover:underline" style="word-break:break-all">
                PhiRequiem/ARTEMIS-II-MISSION-CONTROL
              </span>
            </a>
          </div>

        </div>
      </div>

    </div>

    <!-- Disclaimer -->
    <div class="px-5 pb-4">
      <div class="border-t border-white/5 pt-3 text-xs leading-relaxed" style="color:#35304a">
        <span style="color:#6d5fa0">⚠ AVISO:</span>
        Este dashboard es un proyecto de visualización educativa/fan-made. Los datos de telemetría son estimados
        basados en la trayectoria publicada por NASA para Artemis II. Los datos de costo provienen de informes públicos
        NASA OIG y GAO. No representa datos operacionales oficiales de la misión.
        Artemis II es una misión real de NASA programada para 2026.
      </div>
    </div>

  </div>
</template>

<script setup>
const sources = [
  {
    tag: 'DONKI',
    name: 'NASA DONKI',
    nameUrl: 'https://kauai.ccmc.gsfc.nasa.gov/DONKI/',
    desc: 'Space Weather Database of Notifications, Knowledge, Information. Alertas de eventos solares (CME, flares) en tiempo real vía api.nasa.gov.',
    url: 'https://kauai.ccmc.gsfc.nasa.gov/DONKI/',
    urlLabel: 'kauai.ccmc.gsfc.nasa.gov/DONKI',
  },
  {
    tag: 'SNAPI',
    name: 'Spaceflight News API',
    nameUrl: 'https://api.spaceflightnewsapi.net',
    desc: 'Noticias y artículos de misiones espaciales en tiempo real. JSON directo, sin proxy.',
    url: 'https://api.spaceflightnewsapi.net',
    urlLabel: 'api.spaceflightnewsapi.net',
  },
  {
    tag: 'OIG',
    name: 'NASA OIG + GAO',
    nameUrl: 'https://oig.nasa.gov/docs/IG-22-003.pdf',
    desc: 'Oficina del Inspector General de NASA y Contraloría del Gobierno de EE.UU. Fuente de los datos de costo de misión.',
    url: 'https://www.gao.gov/products/gao-23-105338',
    urlLabel: 'GAO-23-105338 · gao.gov',
  },
  {
    tag: 'EST',
    name: 'Fallback estimado',
    nameUrl: null,
    desc: 'Telemetría interpolada basada en efemérides publicadas por NASA para Artemis II (trayectoria free-return). Se activa cuando las APIs no responden.',
    url: null,
    urlLabel: null,
  },
]

const techStack = [
  { name: 'Vue 3',           ver: '— Composition API' },
  { name: 'Vite 5',          ver: '— Build tool' },
  { name: 'Tailwind CSS',    ver: 'v4 · @tailwindcss/vite' },
  { name: 'vite-plugin-pwa', ver: '— PWA + Service Worker' },
  { name: 'Inter',           ver: '— UI typography' },
  { name: 'Orbitron',        ver: '— Display / títulos' },
  { name: 'Share Tech Mono', ver: '— Datos / telemetría' },
  { name: 'Vercel',          ver: '— Deploy / CDN' },
]

const credits = [
  { name: 'NASA / JPL',              desc: 'Datos públicos, APIs y trayectoria de misión' },
  { name: 'Spaceflight News API',    desc: 'Noticias espaciales en tiempo real' },
  { name: 'NASA OIG / GAO',          desc: 'Informes públicos de costo de misión' },
  { name: 'Google Fonts',            desc: 'Inter, Orbitron, Share Tech Mono' },
  { name: 'Vercel',                  desc: 'Hosting y CDN gratuito' },
]
</script>

<style scoped>
.section-heading {
  font-family: 'Orbitron', monospace;
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(167,139,250,0.7);
  border-bottom: 1px solid rgba(167,139,250,0.1);
  padding-bottom: 0.5rem;
}
.source-row {
  padding-bottom: 0.6rem;
  border-bottom: 1px solid rgba(255,255,255,0.04);
}
.source-badge {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #a78bfa;
  background: rgba(167,139,250,0.1);
  border: 1px solid rgba(167,139,250,0.2);
  border-radius: 3px;
  padding: 1px 5px;
  flex-shrink: 0;
  margin-top: 1px;
}
.source-name  { font-size: 0.78rem; font-weight: 600; color: #c4b5fd; }
.source-name-link { text-decoration: none; transition: color 0.2s; }
.source-name-link:hover { color: #a78bfa; text-decoration: underline; }
.source-desc  { font-size: 0.7rem; color: #4e4470; margin-top: 1px; line-height: 1.4; }
.source-link  {
  font-size: 0.65rem;
  font-family: 'Share Tech Mono', monospace;
  color: rgba(167,139,250,0.45);
  text-decoration: none;
  transition: color 0.2s;
}
.source-link:hover { color: #a78bfa; text-decoration: underline; }

.tech-dot {
  width: 5px; height: 5px;
  border-radius: 50%;
  background: rgba(167,139,250,0.4);
  flex-shrink: 0;
}
.tech-name { font-size: 0.78rem; font-weight: 600; color: #9d8fd4; }
.tech-ver  { font-size: 0.7rem; color: #4e4470; margin-left: 4px; }

.credit-name {
  display: block;
  font-family: 'Orbitron', monospace;
  font-size: 0.95rem;
  font-weight: 900;
  letter-spacing: 0.15em;
  color: #a78bfa;
  text-shadow: 0 0 12px rgba(167,139,250,0.35);
  text-decoration: none;
  margin-top: 2px;
  transition: text-shadow 0.2s;
}
.credit-name:hover { text-shadow: 0 0 20px rgba(167,139,250,0.65); }
</style>
