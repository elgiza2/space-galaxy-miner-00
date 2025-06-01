
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { profilesService } from '@/services/profilesService';
import { useToast } from '@/hooks/use-toast';
import type { Profile } from '@/types/database';

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
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const refreshProfile = async () => {
    try {
      setIsLoading(true);
      const profileData = await profilesService.getProfile();
      setProfile(profileData);
    } catch (error) {
      console.error('Error refreshing profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateMiningEarnings = async (earnings: number, totalMined: number) => {
    try {
      await profilesService.updateMiningBalance(earnings, totalMined);
      if (profile) {
        setProfile({
          ...profile,
          mining_earnings: earnings,
          total_mined: totalMined
        });
      }
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
