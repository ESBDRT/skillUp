import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { POC_USER_ID } from '@/lib/constants';

export interface CourseSession {
  id: string;
  user_id: string;
  course_id: string;
  scheduled_date: string;
  session_number: number;
  cards_start_index: number;
  cards_end_index: number;
  is_completed: boolean;
  completed_at: string | null;
  earned_xp: number;
  course?: {
    id: string;
    title: string;
    icon: string;
    category: string;
    duration_days: number;
    daily_cards_count: number;
  };
}

export function useCourseSessions() {
  const [sessions, setSessions] = useState<CourseSession[]>([]);
  const [todaySessions, setTodaySessions] = useState<CourseSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSessions = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('course_sessions')
        .select(`
          *,
          course:courses(id, title, icon, category, duration_days, daily_cards_count)
        `)
        .eq('user_id', POC_USER_ID)
        .order('scheduled_date', { ascending: true });

      if (error) throw error;

      const formattedSessions = (data || []).map(session => ({
        ...session,
        course: session.course as CourseSession['course']
      }));

      setSessions(formattedSessions);

      // Filter today's sessions
      const today = new Date().toISOString().split('T')[0];
      const todayOnly = formattedSessions.filter(s => s.scheduled_date === today);
      setTodaySessions(todayOnly);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const createSessionsForCourse = useCallback(async (
    courseId: string,
    totalCards: number,
    durationDays: number,
    startDate: Date = new Date()
  ) => {
    const cardsPerDay = Math.ceil(totalCards / durationDays);
    const sessionsToCreate = [];

    for (let day = 0; day < durationDays; day++) {
      const sessionDate = new Date(startDate);
      sessionDate.setDate(sessionDate.getDate() + day);

      const startIndex = day * cardsPerDay;
      const endIndex = Math.min((day + 1) * cardsPerDay - 1, totalCards - 1);

      sessionsToCreate.push({
        user_id: POC_USER_ID,
        course_id: courseId,
        scheduled_date: sessionDate.toISOString().split('T')[0],
        session_number: day + 1,
        cards_start_index: startIndex,
        cards_end_index: endIndex,
        is_completed: false,
        earned_xp: 0
      });
    }

    try {
      const { error } = await supabase
        .from('course_sessions')
        .insert(sessionsToCreate);

      if (error) throw error;

      await fetchSessions();
      return true;
    } catch (error) {
      console.error('Error creating sessions:', error);
      return false;
    }
  }, [fetchSessions]);

  const completeSession = useCallback(async (sessionId: string, earnedXP: number) => {
    try {
      const { error } = await supabase
        .from('course_sessions')
        .update({
          is_completed: true,
          completed_at: new Date().toISOString(),
          earned_xp: earnedXP
        })
        .eq('id', sessionId);

      if (error) throw error;

      await fetchSessions();
      return true;
    } catch (error) {
      console.error('Error completing session:', error);
      return false;
    }
  }, [fetchSessions]);

  const getSessionsForCourse = useCallback((courseId: string) => {
    return sessions.filter(s => s.course_id === courseId);
  }, [sessions]);

  const getSessionProgress = useCallback((courseId: string) => {
    const courseSessions = sessions.filter(s => s.course_id === courseId);
    const completed = courseSessions.filter(s => s.is_completed).length;
    return {
      completed,
      total: courseSessions.length,
      percentage: courseSessions.length > 0 ? (completed / courseSessions.length) * 100 : 0
    };
  }, [sessions]);

  return {
    sessions,
    todaySessions,
    isLoading,
    createSessionsForCourse,
    completeSession,
    getSessionsForCourse,
    getSessionProgress,
    refetch: fetchSessions
  };
}
