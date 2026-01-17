import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface MemoryConcept {
  id: string;
  user_id: string;
  course_id: string;
  concept_title: string;
  concept_content: string | null;
  ease_factor: number;
  interval_days: number;
  repetitions: number;
  next_review_at: string;
  last_reviewed_at: string | null;
  memory_strength: number;
  created_at: string;
}

// SM-2 Algorithm for spaced repetition
export const calculateNextReview = (quality: number, concept: MemoryConcept) => {
  let easeFactor = concept.ease_factor;
  let interval = concept.interval_days;
  let repetitions = concept.repetitions;

  if (quality >= 3) {
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 6;
    else interval = Math.round(interval * easeFactor);
    repetitions++;
  } else {
    repetitions = 0;
    interval = 1;
  }

  easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));

  const nextReviewAt = new Date();
  nextReviewAt.setDate(nextReviewAt.getDate() + interval);

  return {
    interval_days: interval,
    ease_factor: easeFactor,
    repetitions,
    next_review_at: nextReviewAt.toISOString(),
    last_reviewed_at: new Date().toISOString(),
  };
};

// Calculate current memory strength based on time since last review
export const calculateMemoryStrength = (lastReview: string | null, intervalDays: number): number => {
  if (!lastReview) return 100;

  const lastReviewDate = new Date(lastReview);
  const now = new Date();
  const daysSinceReview = Math.floor((now.getTime() - lastReviewDate.getTime()) / (1000 * 60 * 60 * 24));

  if (daysSinceReview <= intervalDays) {
    return 100;
  }

  const overdueDays = daysSinceReview - intervalDays;
  const decayRate = 0.15;
  return Math.max(0, Math.round(100 - (overdueDays * decayRate * 100 / Math.max(1, intervalDays))));
};

export const useMemoryConcepts = () => {
  const [concepts, setConcepts] = useState<MemoryConcept[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userId = localStorage.getItem('odemon_user_id');

  const fetchConcepts = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const { data, error: fetchError } = await supabase
        .from('memory_concepts')
        .select('*')
        .eq('user_id', userId)
        .order('next_review_at', { ascending: true });

      if (fetchError) throw fetchError;

      // Update memory strength for each concept
      const updatedConcepts = (data || []).map(concept => ({
        ...concept,
        memory_strength: calculateMemoryStrength(concept.last_reviewed_at, concept.interval_days),
      }));

      setConcepts(updatedConcepts as MemoryConcept[]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const addConcept = async (courseId: string, title: string, content?: string) => {
    if (!userId) return;

    const { data, error: insertError } = await supabase
      .from('memory_concepts')
      .insert({
        user_id: userId,
        course_id: courseId,
        concept_title: title,
        concept_content: content || null,
      })
      .select()
      .single();

    if (insertError) throw insertError;
    await fetchConcepts();
    return data;
  };

  const updateConceptAfterReview = async (conceptId: string, quality: number) => {
    const concept = concepts.find(c => c.id === conceptId);
    if (!concept) return;

    const updates = calculateNextReview(quality, concept);

    const { error: updateError } = await supabase
      .from('memory_concepts')
      .update({
        ...updates,
        memory_strength: 100,
      })
      .eq('id', conceptId);

    if (updateError) throw updateError;
    await fetchConcepts();
  };

  const deleteConcept = async (conceptId: string) => {
    const { error: deleteError } = await supabase
      .from('memory_concepts')
      .delete()
      .eq('id', conceptId);

    if (deleteError) throw deleteError;
    await fetchConcepts();
  };

  const getConceptsForReview = useCallback(() => {
    const now = new Date();
    return concepts.filter(c => new Date(c.next_review_at) <= now || c.memory_strength < 50);
  }, [concepts]);

  const getAtRiskConcepts = useCallback(() => {
    return concepts.filter(c => c.memory_strength < 50).sort((a, b) => a.memory_strength - b.memory_strength);
  }, [concepts]);

  const getAverageMemoryStrength = useCallback(() => {
    if (concepts.length === 0) return 100;
    return Math.round(concepts.reduce((sum, c) => sum + c.memory_strength, 0) / concepts.length);
  }, [concepts]);

  useEffect(() => {
    fetchConcepts();
  }, [fetchConcepts]);

  return {
    concepts,
    loading,
    error,
    addConcept,
    updateConceptAfterReview,
    deleteConcept,
    getConceptsForReview,
    getAtRiskConcepts,
    getAverageMemoryStrength,
    refetch: fetchConcepts,
  };
};
