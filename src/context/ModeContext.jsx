import React, { createContext, useContext, useState } from 'react';

const ModeContext = createContext({
  mode: 'developer',
  toggleMode: () => {},
});

export const ModeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    try { return localStorage.getItem('abd-view-mode') || 'developer'; }
    catch { return 'developer'; }
  });

  const toggleMode = () => setMode(m => {
    const next = m === 'developer' ? 'recruiter' : 'developer';
    try { localStorage.setItem('abd-view-mode', next); } catch {}
    return next;
  });

  return (
    <ModeContext.Provider value={{ mode, toggleMode }}>
      {children}
    </ModeContext.Provider>
  );
};

export const useMode = () => useContext(ModeContext);
