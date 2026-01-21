import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export interface UserProfile {
  id: string;
  user_id: string;
  xp: number;
  level: number;
  streak_count: number;
  last_activity_date: string | null;
  daily_goal_minutes: number;
}

export function useUserProgress() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        // Create profile if it doesn't exist
        const { data: newProfile, error: createError } = await supabase
          .from('user_profiles')
          .insert({
            user_id: user.id,
            xp: 0,
            level: 1,
            streak_count: 0,
            daily_goal_minutes: 15
          })
          .select()
          .single();

        if (createError) throw createError;
        setProfile(newProfile);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const addXP = useCallback(async (amount: number) => {
    if (!profile || !user) return;

    const newXP = profile.xp + amount;
    const newLevel = Math.floor(newXP / 500) + 1;

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ 
          xp: newXP, 
          level: newLevel 
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, xp: newXP, level: newLevel } : null);
    } catch (error) {
      console.error('Error adding XP:', error);
    }
  }, [profile, user]);

  const checkAndUpdateStreak = useCallback(async () => {
    if (!profile || !user) return;

    const today = new Date().toISOString().split('T')[0];
    const lastActivity = profile.last_activity_date;

    let newStreak = profile.streak_count;

    if (!lastActivity) {
      // First activity ever
      newStreak = 1;
    } else if (lastActivity === today) {
      // Already active today, no change
      return;
    } else {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (lastActivity === yesterdayStr) {
        // Consecutive day - increment streak
        newStreak = profile.streak_count + 1;
      } else {
        // Streak broken - reset to 1
        newStreak = 1;
      }
    }

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ 
          streak_count: newStreak,
          last_activity_date: today
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setProfile(prev => prev ? { 
        ...prev, 
        streak_count: newStreak, 
        last_activity_date: today 
      } : null);
    } catch (error) {
      console.error('Error updating streak:', error);
    }
  }, [profile, user]);

  const updateDailyGoal = useCallback(async (minutes: number) => {
    if (!profile || !user) return;

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ daily_goal_minutes: minutes })
        .eq('user_id', user.id);

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, daily_goal_minutes: minutes } : null);
    } catch (error) {
      console.error('Error updating daily goal:', error);
    }
  }, [profile, user]);

  return {
    profile,
    isLoading,
    addXP,
    checkAndUpdateStreak,
    updateDailyGoal,
    refetch: fetchProfile
  };
}
