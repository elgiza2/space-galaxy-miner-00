
import { supabase } from '@/integrations/supabase/client';
import type { Profile, ProfileInsert, ProfileUpdate } from '@/types/database';

export const profilesService = {
  // جلب ملف المستخدم
  async getProfile(): Promise<Profile | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    
    return data;
  },

  // إنشاء ملف جديد
  async createProfile(profile: ProfileInsert): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .insert(profile)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
    
    return data;
  },

  // تحديث ملف المستخدم
  async updateProfile(updates: ProfileUpdate): Promise<Profile> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
    
    return data;
  },

  // تحديث رصيد التعدين
  async updateMiningBalance(miningEarnings: number, totalMined: number): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('profiles')
      .update({
        mining_earnings: miningEarnings,
        total_mined: totalMined,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);
    
    if (error) {
      console.error('Error updating mining balance:', error);
      throw error;
    }
  }
};
