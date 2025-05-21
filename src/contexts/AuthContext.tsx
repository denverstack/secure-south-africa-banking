
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

type User = {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
  lastLogin: Date;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  typingPatterns: string[];
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  verifyFacialIdentity: (verified: boolean) => void;
  recordTypingPattern: (pattern: string) => void;
  isPanicMode: boolean;
  activatePanicMode: () => void;
  deactivatePanicMode: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [typingPatterns, setTypingPatterns] = useState<string[]>([]);
  const [isPanicMode, setIsPanicMode] = useState(false);
  const { toast } = useToast();

  // Mock user data for demo
  const mockUser: User = {
    id: "user-123",
    name: "John Dlamini",
    email: "john.dlamini@example.com",
    isVerified: false,
    lastLogin: new Date(),
  };

  useEffect(() => {
    // Simulate loading user from storage
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // This would be an API call in a real app
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUser({ ...mockUser, email });
      setIsLoading(false);
      
      return true;
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Authentication Error",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const verifyFacialIdentity = (verified: boolean) => {
    if (user) {
      setUser({ ...user, isVerified: verified });
      
      if (verified) {
        toast({
          title: "Identity Verified",
          description: "Facial verification successful.",
        });
      } else {
        toast({
          title: "Verification Failed",
          description: "Please try the facial verification again.",
          variant: "destructive",
        });
      }
    }
  };

  const recordTypingPattern = (pattern: string) => {
    setTypingPatterns(prev => [...prev, pattern]);
    
    // Simple AI analysis (in a real app, this would be more sophisticated)
    if (typingPatterns.length > 3) {
      const isAnomalous = Math.random() < 0.2; // 20% chance of detecting anomaly for demo
      
      if (isAnomalous) {
        toast({
          title: "Security Alert",
          description: "Unusual typing pattern detected. Verify your identity.",
          variant: "destructive",
        });
      }
    }
  };

  const activatePanicMode = () => {
    setIsPanicMode(true);
    toast({
      title: "Emergency Protocol Activated",
      description: "Account temporarily frozen. Contact support immediately.",
      variant: "destructive",
    });
  };

  const deactivatePanicMode = () => {
    setIsPanicMode(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        typingPatterns,
        login,
        logout,
        verifyFacialIdentity,
        recordTypingPattern,
        isPanicMode,
        activatePanicMode,
        deactivatePanicMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
