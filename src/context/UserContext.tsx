import React, { createContext, useContext, useState, ReactNode } from 'react';
import { mockUser, UserProgress } from '@/data/mockData';

interface UserContextType {
  user: UserProgress;
  addXP: (amount: number) => void;
  completeLesson: (lessonId: string) => void;
  incrementStreak: () => void;
  addMinutes: (minutes: number) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProgress>(mockUser);

  const addXP = (amount: number) => {
    setUser(prev => ({
      ...prev,
      xp: prev.xp + amount,
      level: Math.floor((prev.xp + amount) / 500) + 1,
    }));
  };

  const completeLesson = (lessonId: string) => {
    setUser(prev => ({
      ...prev,
      completedLessons: [...prev.completedLessons, lessonId],
    }));
  };

  const incrementStreak = () => {
    setUser(prev => ({
      ...prev,
      streak: prev.streak + 1,
    }));
  };

  const addMinutes = (minutes: number) => {
    setUser(prev => ({
      ...prev,
      todayMinutes: prev.todayMinutes + minutes,
    }));
  };

  return (
    <UserContext.Provider value={{ user, addXP, completeLesson, incrementStreak, addMinutes }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
