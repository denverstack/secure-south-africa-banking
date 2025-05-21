import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';

type KeystrokeAnalyzerProps = {
  onSubmit: (text: string) => void;
  children?: React.ReactNode;
};

const KeystrokeAnalyzer: React.FC<KeystrokeAnalyzerProps> = ({ onSubmit, children }) => {
  const [text, setText] = useState('');
  const [keyTimes, setKeyTimes] = useState<{ [key: string]: number }>({});
  const [pattern, setPattern] = useState('');
  const { recordTypingPattern } = useAuth();

  // Record the timing between keystrokes
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const now = Date.now();
    const key = e.key;
    
    setKeyTimes(prev => ({
      ...prev,
      [key]: now
    }));
  };

  // Calculate typing pattern based on time intervals between keys
  useEffect(() => {
    if (text.length >= 2) {
      const timingPattern = [];
      for (let i = 1; i < text.length; i++) {
        const prevKey = text[i-1];
        const currentKey = text[i];
        
        if (keyTimes[prevKey] && keyTimes[currentKey]) {
          const timeDiff = keyTimes[currentKey] - keyTimes[prevKey];
          timingPattern.push(timeDiff);
        }
      }
      
      // Create a fingerprint from the timing pattern
      if (timingPattern.length > 0) {
        const newPattern = timingPattern.join('|');
        setPattern(newPattern);
        recordTypingPattern(newPattern);
      }
    }
  }, [text, keyTimes, recordTypingPattern]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(text);
    setText('');
    setKeyTimes({});
  };

  // If children are provided, clone them to add keystroke monitoring
  if (children) {
    return (
      <div onKeyDown={handleKeyDown}>
        {children}
      </div>
    );
  }

  // Otherwise, render the default input
  return (
    <form onSubmit={handleSubmit} className="w-full">
      <Input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message or command..."
        className="w-full"
      />
    </form>
  );
};

export default KeystrokeAnalyzer;
