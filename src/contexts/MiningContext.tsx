
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  mining_earnings: number;
  total_mined: number;
  mining_speed: number;
  ton_balance: number;
}

interface MiningContextType {
  profile: Profile | null;
  isLoading: boolean;
  updateMiningEarnings: (earnings: number, totalMined: number) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const MiningContext = createContext<MiningContextType | undefined>(undefined);

export const useMining = () => {
  const context = useContext(MiningContext);
  if (!context) {
    throw new Error('useMining must be used within a MiningProvider');
  }
  return context;
};

interface MiningProviderProps {
  children: ReactNode;
}

export const MiningProvider: React.FC<MiningProviderProps> = ({ children }) => {
  const [profile, setProfile] = useState<Profile | null>({
    mining_earnings: 0,
    total_mined: 0,
    mining_speed: 1,
    ton_balance: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const refreshProfile = async () => {
    try {
      setIsLoading(true);
      // Load from localStorage
      const savedProfile = localStorage.getItem('mining_profile');
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }
    } catch (error) {
      console.error('Error refreshing profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateMiningEarnings = async (earnings: number, totalMined: number) => {
    try {
      const updatedProfile = {
        ...profile!,
        mining_earnings: earnings,
        total_mined: totalMined
      };
      setProfile(updatedProfile);
      // Save to localStorage
      localStorage.setItem('mining_profile', JSON.stringify(updatedProfile));
    } catch (error) {
      console.error('Error updating mining earnings:', error);
      toast({
        title: "خطأ",
        description: "فشل في حفظ أرباح التعدين",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    refreshProfile();
  }, []);

  const value: MiningContextType = {
    profile,
    isLoading,
    updateMiningEarnings,
    refreshProfile
  };

  return (
    <MiningContext.Provider value={value}>
      {children}
    </MiningContext.Provider>
  );
};
