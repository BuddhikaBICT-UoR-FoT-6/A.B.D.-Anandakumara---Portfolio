import { useState, useEffect, useRef } from 'react';

export const useTypewriter = (text, speed = 30, delay = 0, onComplete = null) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (delay > 0) {
      const delayTimer = setTimeout(() => {
        startTyping();
      }, delay);
      return () => clearTimeout(delayTimer);
    } else {
      startTyping();
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [text, speed, delay]);

  const startTyping = () => {
    let index = 0;
    timerRef.current = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timerRef.current);
        setIsComplete(true);
        if (onComplete) onComplete();
      }
    }, speed + Math.random() * speed); // Randomized for human-feel
  };

  return { displayedText, isComplete };
};
