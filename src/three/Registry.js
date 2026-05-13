/**
 * FUSION BOARD v2.1 COORDINATE REGISTRY
 * UV space [0.0 - 1.0], origin bottom-left.
 * Image aspect: 2048x1024 (2:1)
 */

export const COMPONENT_REGISTRY = {
  PROCESSORS: {
    CENTRAL_HEX:     { uv: [0.500, 0.500], type: 'processor', heat: 1.0,  label: 'NEXUS-7 CORE' },
    REACT_SPRING_IC: { uv: [0.280, 0.680], type: 'ic',        heat: 0.7,  label: 'REACT_SPRING_CORE' },
    IOT_ENGINE:      { uv: [0.620, 0.420], type: 'ic',        heat: 0.65, label: 'IOT_AI_ENGINE' },
    SPRING_BOOT_IC:  { uv: [0.480, 0.200], type: 'ic',        heat: 0.6,  label: 'SPRING_BOOT_V2' },
  },

  LEDS: {
    LED_GREEN_TL:  { uv: [0.155, 0.820], color: '#00FF41', type: 'status'   },
    LED_GREEN_TR:  { uv: [0.340, 0.840], color: '#00FF41', type: 'status'   },
    LED_GREEN_ML:  { uv: [0.100, 0.520], color: '#00FF41', type: 'status'   },
    LED_GREEN_BL:  { uv: [0.135, 0.340], color: '#00FF41', type: 'status'   },
    LED_GREEN_BR:  { uv: [0.340, 0.085], color: '#00FF41', type: 'status'   },
    LED_GREEN_MR:  { uv: [0.900, 0.460], color: '#00FF41', type: 'status'   },
    LED_GREEN_BR2: { uv: [0.830, 0.190], color: '#00FF41', type: 'status'   },
    LED_GREEN_CTR: { uv: [0.500, 0.080], color: '#00FF41', type: 'status'   },
    LED_YELLOW_ML: { uv: [0.145, 0.540], color: '#FFD700', type: 'activity' },
    LED_YELLOW_TR: { uv: [0.870, 0.870], color: '#FFD700', type: 'activity' },
    LED_RED_C:     { uv: [0.455, 0.730], color: '#FF2020', type: 'error'    },
    LED_RED_MR:    { uv: [0.760, 0.560], color: '#FF2020', type: 'error'    },
    LED_RED_BL:    { uv: [0.195, 0.380], color: '#FF2020', type: 'error'    },
    LED_RED_BR:    { uv: [0.600, 0.155], color: '#FF2020', type: 'error'    },
    LED_RED_BR2:   { uv: [0.820, 0.120], color: '#FF2020', type: 'error'    },
  },

  PASSIVES: {
    SMD_CAP_01:  { uv: [0.260, 0.600], type: 'capacitor', heat: 0.3  },
    SMD_CAP_02:  { uv: [0.720, 0.700], type: 'capacitor', heat: 0.25 },
    SMD_RES_BANK:{ uv: [0.380, 0.760], type: 'resistor',  heat: 0.2  },
  },

  CONNECTORS: {
    CONNECTOR_T: { uv: [0.500, 0.960], type: 'port', heat: 0.15 },
    CONNECTOR_B: { uv: [0.500, 0.040], type: 'port', heat: 0.15 },
  },
};

/**
 * PULSE TRACES — all originate from CENTRAL_HEX [0.5, 0.5]
 * and travel outward along PCB rails to endpoints.
 * Each array is an ordered list of UV waypoints.
 */
export const PULSE_TRACES = [
  // North → top rail
  { id: 'N',  points: [[0.50,0.50],[0.50,0.65],[0.50,0.85],[0.20,0.85],[0.05,0.85]] },
  // North-East → top-right corner
  { id: 'NE', points: [[0.50,0.50],[0.62,0.60],[0.78,0.72],[0.90,0.85],[0.95,0.85]] },
  // East → right rail
  { id: 'E',  points: [[0.50,0.50],[0.65,0.50],[0.82,0.50],[0.95,0.50],[0.95,0.35]] },
  // South-East → bottom-right
  { id: 'SE', points: [[0.50,0.50],[0.62,0.38],[0.76,0.25],[0.88,0.15],[0.95,0.15]] },
  // South → bottom rail
  { id: 'S',  points: [[0.50,0.50],[0.50,0.35],[0.50,0.20],[0.50,0.15],[0.75,0.15]] },
  // South-West → bottom-left
  { id: 'SW', points: [[0.50,0.50],[0.38,0.38],[0.25,0.25],[0.12,0.15],[0.05,0.15]] },
  // West → left rail
  { id: 'W',  points: [[0.50,0.50],[0.35,0.50],[0.18,0.50],[0.05,0.50],[0.05,0.65]] },
  // North-West → top-left
  { id: 'NW', points: [[0.50,0.50],[0.38,0.62],[0.24,0.72],[0.12,0.82],[0.05,0.85]] },
];
