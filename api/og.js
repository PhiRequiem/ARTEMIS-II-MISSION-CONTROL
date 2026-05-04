import { ImageResponse } from '@vercel/og'

export const config = { runtime: 'edge' }

export default function handler() {
  return new ImageResponse(
    {
      type: 'div',
      props: {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #0d0d14 0%, #140a28 50%, #0a0a10 100%)',
          fontFamily: 'sans-serif',
          padding: '0',
        },
        children: [

          // Top glow
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                top: '-80px', left: '50%',
                transform: 'translateX(-50%)',
                width: '800px', height: '300px',
                background: 'radial-gradient(ellipse, rgba(124,92,204,0.25) 0%, transparent 70%)',
                pointerEvents: 'none',
              },
              children: [],
            },
          },

          // Main content
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                padding: '52px 60px',
                height: '100%',
                border: '1px solid rgba(167,139,250,0.2)',
                margin: '28px',
                borderRadius: '16px',
              },
              children: [

                // Header row
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' },
                    children: [
                      // NASA circle
                      {
                        type: 'div',
                        props: {
                          style: {
                            width: '64px', height: '64px',
                            borderRadius: '50%',
                            background: '#0b3d91',
                            border: '2px solid #fc3d21',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0,
                          },
                          children: [{
                            type: 'span',
                            props: {
                              style: { color: 'white', fontSize: '13px', fontWeight: 'bold', letterSpacing: '1px' },
                              children: 'NASA',
                            },
                          }],
                        },
                      },
                      // Title block
                      {
                        type: 'div',
                        props: {
                          style: { display: 'flex', flexDirection: 'column', gap: '4px' },
                          children: [
                            {
                              type: 'div',
                              props: {
                                style: { color: 'rgba(167,139,250,0.6)', fontSize: '14px', letterSpacing: '5px', textTransform: 'uppercase' },
                                children: 'PROGRAMA ARTEMIS',
                              },
                            },
                            {
                              type: 'div',
                              props: {
                                style: { color: '#ffffff', fontSize: '46px', fontWeight: '900', letterSpacing: '2px', lineHeight: 1 },
                                children: 'MISSION CONTROL',
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },

                // Tagline
                {
                  type: 'div',
                  props: {
                    style: { color: 'rgba(200,190,230,0.6)', fontSize: '18px', marginBottom: '40px', letterSpacing: '0.5px' },
                    children: 'Dashboard interactivo del programa lunar humano más ambicioso desde Apollo',
                  },
                },

                // Mission cards row
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex', gap: '16px', marginBottom: 'auto' },
                    children: [
                      // Artemis I
                      missionCard('I', 'ARTEMIS I', 'HISTÓRICA', '#fb923c', 'Nov 2022 · Orion sin tripulación · Récord 432,210 km'),
                      // Artemis II
                      missionCard('II', 'ARTEMIS II', 'HISTÓRICA', '#a78bfa', 'Abr 2026 · 4 astronautas · Sobrevuelo lunar'),
                      // Artemis III
                      missionCard('III', 'ARTEMIS III', 'PRE-LAUNCH', '#38bdf8', 'NET 2027 · LEO rendezvous · HLS comercial'),
                      // Artemis IV
                      missionCard('IV', 'ARTEMIS IV', 'ANUNCIADA', '#a3e635', 'NET ~2028 · Primer alunizaje desde Apollo 17'),
                    ],
                  },
                },

                // Footer
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      marginTop: '28px', paddingTop: '18px',
                      borderTop: '1px solid rgba(167,139,250,0.12)',
                    },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: { display: 'flex', gap: '20px' },
                          children: [
                            featureTag('Telemetría Real'),
                            featureTag('Hardware Tracker'),
                            featureTag('Costos NASA OIG'),
                            featureTag('Polo Sur Lunar'),
                          ],
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: { color: 'rgba(167,139,250,0.4)', fontSize: '14px', letterSpacing: '2px' },
                          children: 'BY PHIREQUIEM',
                        },
                      },
                    ],
                  },
                },

              ],
            },
          },
        ],
      },
    },
    { width: 1200, height: 630 }
  )
}

function missionCard(roman, name, state, color, desc) {
  return {
    type: 'div',
    props: {
      style: {
        flex: 1,
        padding: '16px 14px',
        borderRadius: '10px',
        border: `1px solid ${color}40`,
        background: `${color}0f`,
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
      },
      children: [
        {
          type: 'div',
          props: {
            style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
            children: [
              {
                type: 'span',
                props: {
                  style: { color, fontSize: '28px', fontWeight: '900', lineHeight: 1 },
                  children: roman,
                },
              },
              {
                type: 'span',
                props: {
                  style: {
                    color, fontSize: '9px', fontWeight: '700',
                    letterSpacing: '1px', padding: '2px 6px',
                    borderRadius: '3px', background: `${color}18`,
                    border: `1px solid ${color}35`,
                  },
                  children: state,
                },
              },
            ],
          },
        },
        {
          type: 'div',
          props: {
            style: { color: 'rgba(255,255,255,0.55)', fontSize: '9px', letterSpacing: '1.5px' },
            children: name,
          },
        },
        {
          type: 'div',
          props: {
            style: { color: 'rgba(200,190,230,0.5)', fontSize: '11px', lineHeight: 1.4, marginTop: '2px' },
            children: desc,
          },
        },
      ],
    },
  }
}

function featureTag(label) {
  return {
    type: 'div',
    props: {
      style: {
        padding: '4px 10px',
        borderRadius: '4px',
        background: 'rgba(167,139,250,0.06)',
        border: '1px solid rgba(167,139,250,0.15)',
        color: 'rgba(167,139,250,0.6)',
        fontSize: '11px',
        letterSpacing: '0.5px',
      },
      children: label,
    },
  }
}
