import artemis1 from './artemis1.js'
import artemis2 from './artemis2.js'
import artemis3 from './artemis3.js'

export const MISSIONS = [artemis1, artemis2, artemis3]

export const MISSIONS_BY_ID = Object.fromEntries(MISSIONS.map(m => [m.id, m]))

export { artemis1, artemis2, artemis3 }
