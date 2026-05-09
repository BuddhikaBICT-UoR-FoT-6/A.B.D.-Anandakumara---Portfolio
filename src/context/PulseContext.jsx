import React, { createContext, useContext, useState, useCallback } from 'react';

const PulseContext = createContext();

export const usePulse = () => useContext(PulseContext);

export const PulseProvider = ({ children }) => {
  const [pulseEvent, setPulseEvent] = useState(null);

  const dispatchPulse = useCallback((x, y) => {
    setPulseEvent({ x, y, timestamp: Date.now() });
  }, []);

  return (
    <PulseContext.Provider value={{ pulseEvent, dispatchPulse }}>
      {children}
    </PulseContext.Provider>
  );
};
