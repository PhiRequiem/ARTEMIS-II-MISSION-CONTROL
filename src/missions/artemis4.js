export default {
  id: 'artemis4',
  name: 'ARTEMIS IV',
  label: 'Artemis IV',
  state: 'announced',
  accentColor: '#a3e635',
  accentShadow: 'rgba(163,230,53,0.5)',
  cssVars: {
    '--accent':        '#a3e635',
    '--accent-dim':    '#84cc16',
    '--accent-glow':   'rgba(163,230,53,0.3)',
    '--accent-border': 'rgba(163,230,53,0.2)',
    '--bg-glow':       'rgba(50,80,10,0.12)',
    '--bg':            '#0d0d14',
  },

  epoch: null,
  netLabel: '~2028',

  vehicle: 'SLS Block 1B / Orion CM-005',
  launchSite: 'LC-39B, Kennedy Space Center',

  description: 'Primera misión tripulada con alunizaje del programa Artemis. Orion se acoplará con el Gateway lunar en órbita NRHO y los astronautas descenderán al polo sur usando el Human Landing System.',

  highlights: [
    'Primer alunizaje tripulado desde Apollo 17 (diciembre 1972)',
    'Destino: polo sur lunar — Shackleton Crater o región Haworth',
    'Acoplamiento con Gateway en órbita lunar NRHO',
    'Descenso con HLS (SpaceX Starship o Blue Origin Blue Moon)',
    'Primera mujer y primera persona de color en la superficie lunar',
    'Duración estimada en superficie: ~6.5 días',
  ],

  crew: null,

  milestones: [
    { id: 'a3_complete', label: 'Artemis III completada',       date: null, done: false },
    { id: 'gateway',     label: 'Gateway HALO + PPE en órbita', date: null, done: false },
    { id: 'hls_cert',    label: 'HLS certificado vuelo lunar',  date: null, done: false },
    { id: 'crew_ann',    label: 'Anuncio tripulación',          date: null, done: false },
    { id: 'launch',      label: 'Lanzamiento (~2028)',          date: null, done: false },
  ],
}
