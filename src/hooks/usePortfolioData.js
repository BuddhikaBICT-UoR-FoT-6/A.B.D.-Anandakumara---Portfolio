import { useState, useEffect } from 'react';
import defaultData from '../data/portfolioData.json';

export function usePortfolioData() {
  const [data, setData] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('portfolioData');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return defaultData;
  });


  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'portfolioData') {
        try {
          setData(JSON.parse(e.newValue));
        } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return data;
}
