import React, { createContext, useContext, useState } from 'react';

const ModeContext = createContext({
  mode: 'developer',
  toggleMode: () => {},
});

export const ModeProvider = ({ children }) => {
  const [mode, setMode] = useState('developer');
  const toggleMode = () => setMode(m => m === 'developer' ? 'recruiter' : 'developer');

  return (
    <ModeContext.Provider value={{ mode, toggleMode }}>
      {children}
    </ModeContext.Provider>
  );
};

export const useMode = () => useContext(ModeContext);
