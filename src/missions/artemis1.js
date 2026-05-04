export default {
  id: 'artemis1',
  name: 'ARTEMIS I',
  label: 'Artemis I',
  state: 'historical',
  accentColor: '#fb923c',
  accentShadow: 'rgba(251,146,60,0.5)',
  cssVars: {
    '--accent':        '#fb923c',
    '--accent-dim':    '#ea7a25',
    '--accent-glow':   'rgba(251,146,60,0.35)',
    '--accent-border': 'rgba(251,146,60,0.22)',
    '--bg-glow':       'rgba(180,80,20,0.14)',
    '--bg':            '#0d0d14',
  },

  epoch: new Date('2022-11-16T06:47:44Z'),
  splashdownOffset: 25.5 * 86400_000,

  vehicle: 'SLS Block 1 / Orion CM-002 (sin tripulación)',
  launchSite: 'LC-39B, Kennedy Space Center',
  splashdownZone: '26°N 124°W · Océano Pacífico',
  duration: '~25 días',
  description: 'Primera misión de vuelo integrado del sistema Space Launch System y la cápsula Orion, sin tripulación. Orion realizó un sobrevuelo lunar, ingresó en órbita retrógrada distante y regresó con amerizaje el 11 de diciembre de 2022.',

  crew: null, // misión no tripulada

  // Solo tarjeta histórica — sin dashboard completo
  historyOnly: true,

  highlights: [
    'Primer vuelo del SLS Block 1 — el cohete más potente de NASA',
    'Orion alcanzó 432,210 km de la Tierra — récord para cápsula tripulable',
    'Órbita lunar retrógrada distante completada sin incidentes',
    'Amerizaje el 11 Dic 2022 — 25 días, 10 horas, 53 minutos de misión',
    'Escudo térmico validado para velocidades de reentrada lunar (~40,000 km/h)',
  ],
}
