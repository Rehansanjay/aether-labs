// app/Typewriter.tsx
'use client';
import { useState, useEffect } from 'react';

export default function Typewriter({ text, speed = 30 }: { text: string, speed?: number }) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText(''); // Reset when text changes
    let i = 0;
    
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return <span className="font-mono text-cyan-400">{displayedText}<span className="animate-pulse">_</span></span>;
}