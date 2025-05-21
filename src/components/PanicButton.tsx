
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const PanicButton: React.FC = () => {
  const { activatePanicMode } = useAuth();
  const [isPressed, setIsPressed] = useState(false);
  const [progress, setProgress] = useState(0);
  const timer = useRef<NodeJS.Timeout | null>(null);

  const longPressTime = 3000; // 3 seconds for long press
  const intervalTime = 50; // Update progress every 50ms

  const handlePressStart = () => {
    setIsPressed(true);
    setProgress(0);
    
    timer.current = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (intervalTime / longPressTime) * 100;
        if (newProgress >= 100) {
          clearInterval(timer.current as NodeJS.Timeout);
          activatePanicMode();
          return 100;
        }
        return newProgress;
      });
    }, intervalTime);
  };

  const handlePressEnd = () => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
    setIsPressed(false);
    setProgress(0);
  };

  useEffect(() => {
    return () => {
      if (timer.current) {
        clearInterval(timer.current);
      }
    };
  }, []);

  return (
    <div className="mt-6 w-full">
      <p className="text-xs text-gray-500 mb-2 text-center">Hold button for 3 seconds to activate emergency mode</p>
      <div className="relative w-full h-14">
        <Button
          className={`absolute inset-0 w-full h-full bg-red-600 hover:bg-red-700 text-white font-semibold text-base rounded-lg transition-all duration-200 ${
            isPressed ? 'scale-95' : 'scale-100'
          }`}
          onTouchStart={handlePressStart}
          onMouseDown={handlePressStart}
          onTouchEnd={handlePressEnd}
          onTouchCancel={handlePressEnd}
          onMouseUp={handlePressEnd}
          onMouseLeave={handlePressEnd}
        >
          Emergency / Panic Button
        </Button>
        
        {isPressed && (
          <div 
            className="absolute bottom-0 left-0 h-1 bg-white transition-all duration-50 rounded-b-lg"
            style={{ width: `${progress}%` }}
          ></div>
        )}
      </div>
      <p className="text-xs text-center mt-2 text-gray-500">
        Use in case of emergency or coerced transactions
      </p>
    </div>
  );
};

export default PanicButton;
