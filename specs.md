# ARTEMIS II — MISSION DASHBOARD

WebApp Vue 3 + vite con estética de tablero de instrumentos/cockpit espacial. estetica de nasa moderno, o de spacex.

## Stack

- Vue 3 + Vite + Tailwind CSS v4.2+ (a menos que haya una mejor opcion para este proyecto)
- Sin backend. Single-page, no router necesario.

## Datos en tiempo real

Polling cada 30s a las siguientes APIs públicas:

- **JPL Horizons API** (`https://ssd.jpl.nasa.gov/api/horizons.api`) — posición y velocidad de Orion. Si el target body `-187` no está disponible, usar efemérides predefinidas de la misión como fallback.
- **NASA DONKI** (`https://kauai.ccmc.gsfc.nasa.gov/DONKI/WS/rest/CME`) — alertas de clima espacial activas.
- **NASA Artemis Blog RSS** via `https://api.rss2json.com/v1/api.json?rss_url=https://www.nasa.gov/blogs/missions/feed/` — log de actualizaciones recientes.

## Componentes

### `MissionClock.vue`
- MET (Mission Elapsed Time) contando desde `2026-04-01T22:35:00Z`
- Reloj UTC en tiempo real
- Fase activa con barra de progreso segmentada: `Launch → Orbit → TLI → Transit → Flyby → Return → Reentry`

### `TelemetryPanel.vue`
6 métricas desde JPL Horizons con fallback calculado por día de misión:
- Velocidad (km/s)
- Distancia Tierra (km)
- Distancia Luna (km)
- Temperatura externa (°C)
- Temperatura cabina (°C)
- Latencia DSN (s)

### `TrajectoryMap.vue`
- SVG 2D de la trayectoria Earth → Moon → Earth
- Orion animado según posición real
- Ruta completada vs pendiente con colores distintos
- Marcadores por día de misión

### `SystemStatus.vue`
Barras de estado para:
- Propulsión ESM
- Energía solar
- Soporte vital
- Comunicaciones DSN
- Thermal
- Toilet — hardcodeado al 72% con humor

Tres gauges circulares SVG para O₂, H₂O y Battery.

### `MissionTimeline.vue`
- Timeline vertical D1–D10, scrollable
- Día activo resaltado con animación blink
- Estados: completado / activo / pendiente con colores distintos
- Próximo hito con countdown

### `CrewPanel.vue`
Cards de los 4 astronautas con rol, agencia y vitales OK:

| Nombre | Rol | Agencia |
|--------|-----|---------|
| Reid Wiseman | Commander | NASA |
| Victor Glover | Pilot | NASA |
| Christina Koch | Mission Specialist | NASA |
| Jeremy Hansen | Mission Specialist | CSA |

Nota de hitos históricos (primer afroamericano más allá de LEO, primera mujer en vuelo lunar, primer canadiense).

### `AlertsLog.vue`
- Alertas operacionales reales: toilet, válvula agua, flyby blackout
- Log de comunicaciones plausibles MCC ↔ ORION

### `DistanceGauge.vue`
- Barras visuales de distancia Tierra/Luna con porcentaje
- Ángulo de trayectoria e inclinación
- Estado enlace DSN

## Diseño
animado y con efectos

### Efectos visuales
- Scanlines overlay con CSS `repeating-linear-gradient`
- Panel borders con glow sutil en cyan
- Dot de status animado (pulse)
- Animación blink para el ítem activo del timeline

### Layout responsive
- Desktop: 3 columnas
- Tablet (≤1100px): 2 columnas
- Mobile (≤680px): 1 columna

### Estructura del header (sticky)
- Badge NASA + título misión
- Status dot animado + texto NOMINAL
- Reloj UTC + MET en tiempo real

## Datos de fallback

Valores estimados por día de misión basados en datos reales publicados por NASA. Deben usarse transparentemente sin romper la UI cuando las APIs no respondan.

| Día | Dist. Tierra (km) | Dist. Luna (km) | Vel. (km/s) | Fase |
|-----|-------------------|-----------------|-------------|------|
| D1  | 400               | 384,000         | 7.8         | Launch/Orbit |
| D2  | 85,000            | 299,000         | 3.2         | TLI |
| D3  | 195,000           | 189,000         | 1.8         | Transit |
| D4  | 270,000           | 115,000         | 1.2         | Transit |
| D5  | 342,000           | 43,000          | 1.0         | Transit |
| D6  | 390,000           | 6,400           | 0.9         | Flyby |
| D7  | 350,000           | 35,000          | 1.1         | Return |
| D8  | 270,000           | 115,000         | 1.4         | Return |
| D9  | 160,000           | 225,000         | 2.1         | Return |
| D10 | 8,000             | 377,000         | 7.2         | Reentry |

## Notas técnicas

- Correr con `npm run dev` sin configuración extra
- JPL Horizons y DONKI permiten requests desde browser (no requieren proxy)
- El RSS de NASA sí requiere el proxy de `rss2json.com` por CORS
- Si JPL Horizons no devuelve datos de Orion (misión terminada o target no disponible), activar fallback calculado silenciosamente