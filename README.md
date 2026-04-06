# 🚀 ARTEMIS II — MISSION CONTROL DASHBOARD

> Dashboard de misión lunar en tiempo real para Artemis II — estética NASA/SpaceX cockpit.

![Artemis II Dashboard](https://img.shields.io/badge/STATUS-NOMINAL-00ff88?style=for-the-badge&labelColor=0d0d14)
![Vue 3](https://img.shields.io/badge/Vue-3.x-42b883?style=for-the-badge&logo=vue.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.x-646cff?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Deploy](https://img.shields.io/badge/Vercel-Live-a78bfa?style=for-the-badge&logo=vercel&logoColor=white)

---

## ✨ Features

- **MET en tiempo real** — Mission Elapsed Time desde `2026-04-01T22:35:00Z` + reloj UTC
- **Barra de fases segmentada** — Launch → Orbit → TLI → Transit → Flyby → Return → Reentry
- **Telemetría de vuelo** — 6 métricas (velocidad, altitud, dist. Tierra/Luna, temperaturas, latencia DSN)
- **Trayectoria orbital SVG** — animación 2D Earth → Moon → Earth con posición de Orion en tiempo real
- **Sistemas Orion** — barras de estado + gauges circulares O₂ / H₂O / Battery
- **Línea de tiempo** — D1–D10 con evento activo animado y countdown al próximo hito
- **Estado tripulación** — 4 astronautas con roles, agencia e hitos históricos
- **Registro de operaciones** — alertas activas + log de comunicaciones MCC ↔ ORION
- **Transmisión en vivo** — embed de NASA TV (YouTube)
- **Distancias y navegación** — barras visuales + ángulo/inclinación + estado DSN
- **Compartir en redes** — X, Facebook, LinkedIn, Instagram, TikTok

---

## 📡 Fuentes de datos

| Fuente | Endpoint | Uso |
|--------|----------|-----|
| **JPL Horizons** | `ssd.jpl.nasa.gov/api/horizons.api` | Posición y velocidad de Orion (fallback si CORS) |
| **NASA DONKI** | `api.nasa.gov/DONKI/CME` | Alertas de clima espacial (CMEs) |
| **NASA Blog RSS** | via `api.rss2json.com` | Actualizaciones de misión |
| **Fallback** | Interpolación local por día de misión | Datos estimados cuando las APIs no responden |

> Los datos se actualizan cada 30 segundos. Si JPL Horizons bloquea CORS, se activa silenciosamente el fallback calculado basado en efemérides reales de la misión.

---

## 🛠 Stack

```
Vue 3 (Composition API)
Vite 5
Tailwind CSS v4 (via @tailwindcss/vite)
Inter + Share Tech Mono + Orbitron (Google Fonts)
```

Sin backend. Single-page application. No router necesario.

---

## 🚀 Correr localmente

```bash
git clone https://github.com/PhiRequiem/ARTEMIS-II-MISSION-CONTROL.git
cd ARTEMIS-II-MISSION-CONTROL
npm install
npm run dev
```

Abre `http://localhost:5173`

---

## 📦 Build

```bash
npm run build
# output en /dist
```

---

## ☁️ Deploy en Vercel

El proyecto incluye `vercel.json` con rewrite para SPA. Solo conecta el repo en [vercel.com](https://vercel.com) e importa el proyecto — Vercel detecta Vite automáticamente.

```
Build command:  npm run build
Output dir:     dist
```

---

## 🗂 Estructura

```
src/
├── components/
│   ├── MissionClock.vue      # MET, UTC, fases, próximo hito
│   ├── TelemetryPanel.vue    # 6 métricas de vuelo
│   ├── TrajectoryMap.vue     # SVG trayectoria 2D
│   ├── SystemStatus.vue      # Barras de sistema + gauges
│   ├── MissionTimeline.vue   # Timeline D1–D10
│   ├── CrewPanel.vue         # 4 astronautas
│   ├── AlertsLog.vue         # Alertas + comm log
│   ├── DistanceGauge.vue     # Distancias + navegación
│   ├── LiveStream.vue        # Embed NASA TV
│   ├── TopBar.vue            # Barra superior: créditos + share
│   └── ShareBar.vue          # Footer: créditos + share
├── composables/
│   └── useMissionData.js     # Polling APIs + fallback
├── App.vue
├── main.js
└── style.css
```

---

## 👨‍🚀 Tripulación Artemis II

| Nombre | Rol | Agencia | Hito |
|--------|-----|---------|------|
| Reid Wiseman | Commander | NASA | — |
| Victor Glover | Pilot | NASA | 1er afroamericano más allá de LEO |
| Christina Koch | Mission Specialist | NASA | 1ª mujer en vuelo lunar |
| Jeremy Hansen | Mission Specialist | CSA | 1er canadiense en espacio profundo |

---

## 📅 Datos de fallback por día de misión

| Día | Dist. Tierra | Dist. Luna | Vel. | Fase |
|-----|-------------|------------|------|------|
| D1  | 400 km      | 384,000 km | 7.8 km/s | Launch/Orbit |
| D2  | 85,000 km   | 299,000 km | 3.2 km/s | TLI |
| D3  | 195,000 km  | 189,000 km | 1.8 km/s | Transit |
| D4  | 270,000 km  | 115,000 km | 1.2 km/s | Transit |
| D5  | 342,000 km  | 43,000 km  | 1.0 km/s | Transit |
| D6  | 390,000 km  | 6,400 km   | 0.9 km/s | Flyby |
| D7  | 350,000 km  | 35,000 km  | 1.1 km/s | Return |
| D8  | 270,000 km  | 115,000 km | 1.4 km/s | Return |
| D9  | 160,000 km  | 225,000 km | 2.1 km/s | Return |
| D10 | 8,000 km    | 377,000 km | 7.2 km/s | Reentry |

---

## 📄 Licencia

MIT — haz lo que quieras con esto. Si lo usas en algo cool, menciona a [@PhiRequiem](https://github.com/PhiRequiem).

---

<div align="center">

**Desarrollado por [PhiRequiem](https://github.com/PhiRequiem)**

*"Per aspera ad astra"*

</div>
