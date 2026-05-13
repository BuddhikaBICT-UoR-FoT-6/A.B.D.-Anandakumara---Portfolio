import { create } from 'zustand';

export const useSimStore = create((set, get) => ({
  // Simulation Phases: 'BOOT' | 'IDLE' | 'HOVER' | 'CLICK' | 'SETTLE'
  phase: 'BOOT',
  
  // Cursor Tracking
  cursor: { x: 0, y: 0, uv: [0.5, 0.5], world: { x: 0, y: 0, z: 0 } },
  
  // Interactive Elements
  ledStates: {}, // led_id -> { intensity, color }
  activeTraces: [], // Array of trace IDs
  heatMultiplier: 1.0,
  
  // Pulse Queue for BFS flood-fill
  pulseQueue: [],
  activatedNodes: new Set(),
  
  // Particle Simulation Mode
  particleMode: 'AMBIENT', // 'AMBIENT' | 'HOVER' | 'EXPLODING' | 'SETTLING'
  lastShockTime: 0,

  // Actions
  setPhase: (phase) => set({ phase }),
  
  updateCursor: (cursorData) => set({ cursor: { ...get().cursor, ...cursorData } }),
  
  triggerClickPulse: (originUV) => {
    set({ 
      phase: 'CLICK',
      particleMode: 'EXPLODING',
      lastShockTime: performance.now() / 1000,
      activatedNodes: new Set(),
      pulseQueue: [{ uv: originUV, depth: 0 }]
    });
  },
  
  updateLED: (id, data) => set((state) => ({
    ledStates: { ...state.ledStates, [id]: { ...state.ledStates[id], ...data } }
  })),
  
  resetSim: () => set({
    phase: 'IDLE',
    particleMode: 'AMBIENT',
    pulseQueue: [],
    activatedNodes: new Set(),
    heatMultiplier: 1.0
  })
}));
