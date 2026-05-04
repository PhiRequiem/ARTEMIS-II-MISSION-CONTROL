export default {
  id: 'artemis2',
  name: 'ARTEMIS II',
  label: 'Artemis II',
  state: 'historical',
  accentColor: '#a78bfa',
  accentShadow: 'rgba(167,139,250,0.5)',
  cssVars: {
    '--accent':        '#a78bfa',
    '--accent-dim':    '#7c5ccc',
    '--accent-glow':   'rgba(167,139,250,0.35)',
    '--accent-border': 'rgba(167,139,250,0.22)',
    '--bg-glow':       'rgba(124,92,204,0.18)',
    '--bg':            '#0d0d14',
  },

  epoch: new Date('2026-04-01T22:35:00Z'),
  splashdownOffset: 9.5 * 86400_000, // ms after epoch

  vehicle: 'SLS Block 1 / Orion CM-003',
  launchSite: 'LC-39B, Kennedy Space Center',
  splashdownZone: '28°N 122°W · Océano Pacífico',
  duration: '~10 días',
  description: 'Primera misión tripulada del programa Artemis. Cuatro astronautas realizaron un sobrevuelo lunar a 6,400 km de la superficie, la primera vez que humanos viajaron a esa distancia desde Apollo 17 en 1972.',

  crew: [
    { name: 'Reid Wiseman', role: 'Commander',       country: 'US', agency: 'NASA',  initials: 'RW', color: '#a78bfa' },
    { name: 'Victor Glover', role: 'Pilot',           country: 'US', agency: 'NASA',  initials: 'VG', color: '#60a5fa' },
    { name: 'Christina Koch', role: 'Mission Specialist 1', country: 'US', agency: 'NASA', initials: 'CK', color: '#f472b6' },
    { name: 'Jeremy Hansen', role: 'Mission Specialist 2', country: 'CA', agency: 'CSA',  initials: 'JH', color: '#34d399' },
  ],

  phases: [
    { id: 'launch',   label: 'Launch',   day: 1,  end: 0.5  },
    { id: 'orbit',    label: 'Orbit',    day: 1,  end: 1.0  },
    { id: 'tli',      label: 'TLI',      day: 2,  end: 2.0  },
    { id: 'transit',  label: 'Transit',  day: 3,  end: 5.0  },
    { id: 'flyby',    label: 'Flyby',    day: 6,  end: 6.5  },
    { id: 'return',   label: 'Return',   day: 7,  end: 9.5  },
    { id: 'reentry',  label: 'Reentry',  day: 10, end: 10.5 },
  ],

  fallbackData: [
    { day: 1,  distEarth: 400,     distMoon: 384000, vel: 7.8,  phase: 'orbit'   },
    { day: 2,  distEarth: 85000,   distMoon: 299000, vel: 3.2,  phase: 'tli'     },
    { day: 3,  distEarth: 195000,  distMoon: 189000, vel: 1.8,  phase: 'transit' },
    { day: 4,  distEarth: 270000,  distMoon: 115000, vel: 1.2,  phase: 'transit' },
    { day: 5,  distEarth: 342000,  distMoon: 43000,  vel: 1.0,  phase: 'transit' },
    { day: 6,  distEarth: 390000,  distMoon: 6400,   vel: 0.9,  phase: 'flyby'   },
    { day: 7,  distEarth: 350000,  distMoon: 35000,  vel: 1.1,  phase: 'return'  },
    { day: 8,  distEarth: 270000,  distMoon: 115000, vel: 1.4,  phase: 'return'  },
    { day: 9,  distEarth: 160000,  distMoon: 225000, vel: 2.1,  phase: 'return'  },
    { day: 10, distEarth: 8000,    distMoon: 377000, vel: 7.2,  phase: 'reentry' },
  ],
}
