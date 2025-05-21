
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ShieldCheck, Check } from 'lucide-react';

type Movement = 'smile' | 'blink' | 'nod' | 'look-left' | 'look-right';

const FacialVerification: React.FC = () => {
  const { verifyFacialIdentity } = useAuth();
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [currentMovement, setCurrentMovement] = useState<Movement | null>(null);
  const [completedMovements, setCompletedMovements] = useState<Movement[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize random movement tests
  useEffect(() => {
    const possibleMovements: Movement[] = ['smile', 'blink', 'nod', 'look-left', 'look-right'];
    // Get 3 random movements
    const randomMovements = [...possibleMovements]
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    
    setMovements(randomMovements);
  }, []);

  // Start camera when user initiates verification
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      streamRef.current = stream;
      setIsCameraOn(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  // Stop camera when component unmounts or verification is complete
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsCameraOn(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startVerification = () => {
    setIsVerifying(true);
    setCurrentStep(1);
    setCurrentMovement(movements[0]);
  };

  const simulateMovementDetection = (movement: Movement) => {
    // In a real app, this would use facial recognition to detect the movement
    setIsVerifying(true);
    
    // Simulate processing time
    setTimeout(() => {
      setCompletedMovements(prev => [...prev, movement]);
      
      const nextIndex = completedMovements.length + 1;
      if (nextIndex < movements.length) {
        setCurrentMovement(movements[nextIndex]);
      } else {
        // All movements completed
        setCurrentMovement(null);
        setCurrentStep(2);
        setTimeout(() => {
          // Simulate verification completion
          verifyFacialIdentity(true);
          stopCamera();
          setCurrentStep(3);
          setIsVerifying(false);
        }, 1500);
      }
    }, 1500);
  };

  const getMovementInstructions = (movement: Movement) => {
    switch(movement) {
      case 'smile': return 'Smile at the camera';
      case 'blink': return 'Blink your eyes';
      case 'nod': return 'Nod your head up and down';
      case 'look-left': return 'Look to your left';
      case 'look-right': return 'Look to your right';
    }
  };

  useEffect(() => {
    if (currentStep === 1 && currentMovement) {
      // Automatically detect movement after a delay (simulation)
      const timer = setTimeout(() => {
        simulateMovementDetection(currentMovement);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [currentStep, currentMovement]);

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 text-center">
        <h2 className="text-xl font-semibold text-bank-primary">Proof of Life Verification</h2>
        <p className="text-sm text-gray-600 mt-1">
          Complete the facial movement challenges to verify your identity
        </p>
      </div>
      
      {currentStep === 0 && (
        <div className="flex flex-col items-center">
          <div className="w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
            <ShieldCheck className="h-16 w-16 text-bank-secondary opacity-50" />
          </div>
          <Button onClick={() => {
            startCamera();
            startVerification();
          }}>
            Start Verification
          </Button>
        </div>
      )}
      
      {isCameraOn && (
        <div className="relative w-64 h-64 bg-black rounded-lg overflow-hidden">
          <video 
            ref={videoRef} 
            autoPlay 
            muted 
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
          
          {currentStep === 1 && currentMovement && (
            <div className="absolute inset-x-0 bottom-0 bg-bank-primary bg-opacity-90 p-2 text-white text-center">
              <p className="text-sm font-medium">{getMovementInstructions(currentMovement)}</p>
              <div className="mt-1 h-1 bg-white bg-opacity-30 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full animate-pulse" style={{ width: '50%' }}></div>
              </div>
            </div>
          )}
          
          {currentStep === 2 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
          )}
        </div>
      )}
      
      {currentStep === 3 && (
        <div className="mt-4 flex flex-col items-center">
          <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-2">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-lg font-medium text-green-700">Verification Successful</h3>
          <p className="text-sm text-gray-600 mt-1">Your identity has been verified</p>
        </div>
      )}
      
      {(currentStep === 1 || currentStep === 2) && (
        <div className="mt-4 flex justify-center space-x-2">
          {movements.map((movement, index) => (
            <div 
              key={movement}
              className={`h-2 w-2 rounded-full ${
                completedMovements.includes(movement) 
                  ? 'bg-green-500' 
                  : currentMovement === movement 
                    ? 'bg-bank-primary animate-pulse' 
                    : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FacialVerification;
