// Shared types for courses and cards
// This file centralizes type definitions used across frontend and backend

export type CardType = 'info' | 'quiz' | 'flashcard' | 'slider' | 'open-question' | 'lesson';

export interface CourseSection {
    title: string;
    subtitle?: string;
    content: string;
    imageUrl?: string;
}

export interface CourseCard {
    id: string;
    type: CardType;
    title: string;
    content: string;
    sections?: CourseSection[];
    imageUrl?: string;
    flashcardBack?: string;
    options?: Array<{ id: string; text: string; isCorrect: boolean }>;
    sliderConfig?: {
        min: number;
        max: number;
        correct: number;
        unit: string;
    };
    xpReward: number;
}

export interface Course {
    id: string;
    user_id: string;
    title: string;
    description: string | null;
    category: string;
    icon: string | null;
    level: 'beginner' | 'intermediate' | 'expert';
    estimated_minutes: number;
    total_xp: number;
    is_published: boolean;
    duration_days?: number;
    daily_cards_count?: number;
    created_at: string;
    updated_at?: string;
}

export interface CourseProgress {
    id: string;
    user_id: string;
    course_id: string;
    course_data: any;
    current_card_index: number;
    completed_cards: number[];
    earned_xp: number;
    is_completed: boolean;
    updated_at: string;
}

export interface MemoryConcept {
    id: string;
    user_id: string;
    course_id: string | null;
    concept_title: string;
    concept_content: string | null;
    course_title?: string | null;
    repetition: number;
    easiness_factor: number;
    interval: number;
    next_review: string;
    last_reviewed: string | null;
    created_at: string;
}

export interface CourseSession {
    id: string;
    user_id: string;
    course_id: string;
    scheduled_date: string;
    session_number: number;
    cards_start_index: number;
    cards_end_index: number;
    is_completed: boolean;
    completed_at?: string;
}

// Level label mappings
export const levelLabels: Record<string, string> = {
    beginner: 'Débutant',
    intermediate: 'Intermédiaire',
    expert: 'Expert',
};
