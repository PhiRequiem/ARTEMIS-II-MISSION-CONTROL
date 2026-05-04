export default {
  id: 'artemis3',
  name: 'ARTEMIS III',
  label: 'Artemis III',
  state: 'pre-launch',
  accentColor: '#38bdf8',
  accentShadow: 'rgba(56,189,248,0.5)',
  cssVars: {
    '--accent':        '#83b0b5',
    '--accent-dim':    '#7facaf',
    '--accent-glow':   'rgba(131,176,181,0.25)',
    '--accent-border': 'rgba(131,176,181,0.2)',
    '--bg-glow':       'rgba(29,58,77,0.25)',
    '--bg':            '#83b0b5',
  },

  // NET launch date — no confirmed date yet, placeholder late 2027
  epoch: null,
  netLabel: 'NET Late 2027',

  vehicle: 'SLS Block 1 / Orion CM-004',
  launchSite: 'LC-39B, Kennedy Space Center',
  description: 'Segunda misión tripulada Artemis. Tras el rediseño anunciado en febrero 2026, la misión realizará maniobras de rendezvous y docking en LEO con el Human Landing System comercial. El alunizaje fue movido a Artemis IV (~2028).',

  objectives: [
    'Rendezvous y docking con HLS en órbita baja terrestre',
    'Prueba operacional de SpaceX Starship HLS y/o Blue Origin Blue Moon',
    'Validación de sistemas Orion para misiones de larga duración',
    'Preparación de procedimientos para Artemis IV (alunizaje)',
  ],

  vehicle_details: {
    orion: 'Orion CM-004 (production readiness: Enero 2028)',
    sls: 'SLS Block 1 (core stage en KSC desde Abril 2026)',
    hls_primary: 'SpaceX Starship HLS',
    hls_backup: 'Blue Origin Blue Moon',
  },

  crew: null, // No anunciado aún

  milestones: [
    { id: 'core_ksc',   label: 'SLS Core Stage → KSC',        date: '2026-04-27', done: true  },
    { id: 'orion_prod', label: 'Orion CM-004 production ready', date: '2028-01-01', done: false },
    { id: 'hls_cert',   label: 'HLS certificación de vuelo',    date: null,         done: false },
    { id: 'crew_ann',   label: 'Anuncio de tripulación',        date: null,         done: false },
    { id: 'frd',        label: 'Flight Readiness Review',       date: null,         done: false },
    { id: 'launch',     label: 'Lanzamiento',                   date: null,         done: false },
  ],

  apis: {
    launchLibrary: 'https://lldev.thespacedevs.com/2.3.0/launches/upcoming/?search=Artemis+III',
    newsRss: 'https://www.nasa.gov/missions/artemis/feed/',
    kscRss: 'https://www.nasa.gov/centers-and-facilities/kennedy/feed/',
    images: 'https://images-api.nasa.gov/search?q=artemis+III&media_type=image&page_size=12',
    donki: 'https://api.nasa.gov/DONKI/notifications',
  },
}
