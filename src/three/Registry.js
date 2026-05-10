/**
 * FUSION BOARD v2.1 COORDINATE REGISTRY
 * All coordinates are in UV space [0.0 - 1.0], origin bottom-left.
 * DERIVED FROM: react_spring_pcb_board.png
 */

export const COMPONENT_REGISTRY = {
  // Main Processing Units
  PROCESSORS: {
    CENTRAL_HEX: { uv: [0.500, 0.500], type: 'processor', heat: 1.0, label: 'NEXUS-7 CORE' },
    REACT_SPRING_IC: { uv: [0.280, 0.680], type: 'ic', heat: 0.7, label: 'REACT_SPRING_CORE' },
    IOT_ENGINE: { uv: [0.620, 0.420], type: 'ic', heat: 0.65, label: 'IOT_AI_ENGINE' },
    SPRING_BOOT_IC: { uv: [0.480, 0.200], type: 'ic', heat: 0.6, label: 'SPRING_BOOT_V2' },
  },

  // Light Emitting Diodes
  LEDS: {
    LED_GREEN_TL:    { uv: [0.155, 0.820], color: '#00FF41', type: 'status' },
    LED_GREEN_TR:    { uv: [0.340, 0.840], color: '#00FF41', type: 'status' },
    LED_GREEN_ML:    { uv: [0.100, 0.520], color: '#00FF41', type: 'status' },
    LED_GREEN_BL:    { uv: [0.135, 0.340], color: '#00FF41', type: 'status' },
    LED_GREEN_BR:    { uv: [0.340, 0.085], color: '#00FF41', type: 'status' },
    LED_GREEN_MR:    { uv: [0.900, 0.460], color: '#00FF41', type: 'status' },
    LED_GREEN_BR2:   { uv: [0.830, 0.190], color: '#00FF41', type: 'status' },
    LED_GREEN_CTR:   { uv: [0.500, 0.080], color: '#00FF41', type: 'status' },
    
    LED_YELLOW_ML:   { uv: [0.145, 0.540], color: '#FFD700', type: 'activity' },
    LED_YELLOW_TR:   { uv: [0.870, 0.870], color: '#FFD700', type: 'activity' },
    
    LED_RED_C:       { uv: [0.455, 0.730], color: '#FF2020', type: 'error' },
    LED_RED_MR:      { uv: [0.760, 0.560], color: '#FF2020', type: 'error' },
    LED_RED_BL:      { uv: [0.195, 0.380], color: '#FF2020', type: 'error' },
    LED_RED_BR:      { uv: [0.600, 0.155], color: '#FF2020', type: 'error' },
    LED_RED_BR2:     { uv: [0.820, 0.120], color: '#FF2020', type: 'error' },
  },

  // Passive Components
  PASSIVES: {
    SMD_CAP_01:      { uv: [0.260, 0.600], type: 'capacitor', heat: 0.3 },
    SMD_CAP_02:      { uv: [0.720, 0.700], type: 'capacitor', heat: 0.25 },
    SMD_RES_BANK:    { uv: [0.380, 0.760], type: 'resistor', heat: 0.2 },
  },

  // Connectors
  CONNECTORS: {
    CONNECTOR_T:     { uv: [0.500, 0.960], type: 'port', heat: 0.15 },
    CONNECTOR_B:     { uv: [0.500, 0.040], type: 'port', heat: 0.15 },
  }
};

export const TRACE_GRAPH = {
  TRACE_N:  [[0.50,0.50],[0.50,0.73],[0.46,0.73],[0.46,0.84]],
  TRACE_NE: [[0.50,0.50],[0.62,0.62],[0.76,0.70],[0.87,0.87]],
  TRACE_E:  [[0.50,0.50],[0.70,0.50],[0.87,0.50],[0.96,0.50]],
  TRACE_SE: [[0.50,0.50],[0.62,0.38],[0.76,0.28],[0.87,0.18]],
  TRACE_S:  [[0.50,0.50],[0.50,0.30],[0.50,0.15],[0.50,0.04]],
  TRACE_SW: [[0.50,0.50],[0.38,0.38],[0.28,0.28],[0.18,0.18]],
  TRACE_W:  [[0.50,0.50],[0.32,0.50],[0.18,0.50],[0.04,0.50]],
  TRACE_NW: [[0.50,0.50],[0.38,0.62],[0.28,0.72],[0.16,0.82]],
};
