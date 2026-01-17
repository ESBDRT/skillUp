import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { POC_USER_ID } from '@/lib/constants';

export interface MemoryConcept {
  id: string;
  user_id: string;
  course_id: string;
  course_title: string | null;
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

export interface MemoryReview {
  id: string;
  concept_id: string;
  user_id: string;
  quality: number;
  reviewed_at: string;
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

  const userId = POC_USER_ID;

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

      // Update memory strength for each concept and sync to DB if changed significantly
      const updatedConcepts: MemoryConcept[] = [];
      const conceptsToUpdate: { id: string; memory_strength: number }[] = [];

      for (const concept of (data || [])) {
        const calculatedStrength = calculateMemoryStrength(concept.last_reviewed_at, concept.interval_days);
        const dbStrength = concept.memory_strength ?? 100;
        
        // Only update in DB if difference is significant (>5%)
        if (Math.abs(calculatedStrength - dbStrength) > 5) {
          conceptsToUpdate.push({ id: concept.id, memory_strength: calculatedStrength });
        }
        
        updatedConcepts.push({
          ...concept,
          memory_strength: calculatedStrength,
        } as MemoryConcept);
      }

      // Batch update memory strengths in background
      if (conceptsToUpdate.length > 0) {
        Promise.all(
          conceptsToUpdate.map(({ id, memory_strength }) =>
            supabase
              .from('memory_concepts')
              .update({ memory_strength })
              .eq('id', id)
          )
        ).catch(console.error);
      }

      setConcepts(updatedConcepts);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const addConcept = async (courseId: string, title: string, content?: string, courseTitle?: string) => {
    if (!userId) return;

    // Check if concept already exists (prevent duplicates)
    const existingConcept = concepts.find(
      c => c.course_id === courseId && c.concept_title === title
    );
    
    if (existingConcept) {
      console.log('Concept already exists, skipping:', title);
      return existingConcept;
    }

    try {
      const { data, error: insertError } = await supabase
        .from('memory_concepts')
        .insert({
          user_id: userId,
          course_id: courseId,
          concept_title: title,
          concept_content: content || null,
          course_title: courseTitle || null,
        })
        .select()
        .single();

      if (insertError) {
        // Handle unique constraint violation
        if (insertError.code === '23505') {
          console.log('Duplicate concept prevented by DB constraint');
          return null;
        }
        throw insertError;
      }
      
      await fetchConcepts();
      return data;
    } catch (error) {
      console.error('Error adding concept:', error);
      return null;
    }
  };

  const updateConceptAfterReview = async (conceptId: string, quality: number) => {
    const concept = concepts.find(c => c.id === conceptId);
    if (!concept) return;

    const updates = calculateNextReview(quality, concept);

    // Update concept
    const { error: updateError } = await supabase
      .from('memory_concepts')
      .update({
        ...updates,
        memory_strength: 100,
      })
      .eq('id', conceptId);

    if (updateError) throw updateError;

    // Record the review in history
    await supabase
      .from('memory_reviews')
      .insert({
        concept_id: conceptId,
        user_id: userId,
        quality,
      });

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

  // Group concepts by course
  const getConceptsByCourse = useCallback(() => {
    const grouped: Record<string, { courseTitle: string; concepts: MemoryConcept[] }> = {};
    
    concepts.forEach(concept => {
      if (!grouped[concept.course_id]) {
        grouped[concept.course_id] = {
          courseTitle: concept.course_title || 'Cours sans nom',
          concepts: [],
        };
      }
      grouped[concept.course_id].concepts.push(concept);
    });
    
    return grouped;
  }, [concepts]);

  // Get review history for a concept
  const getReviewHistory = async (conceptId: string): Promise<MemoryReview[]> => {
    const { data, error } = await supabase
      .from('memory_reviews')
      .select('*')
      .eq('concept_id', conceptId)
      .order('reviewed_at', { ascending: false })
      .limit(10);
    
    if (error) {
      console.error('Error fetching review history:', error);
      return [];
    }
    
    return (data || []) as MemoryReview[];
  };

  // Get weekly review stats
  const getWeeklyStats = useCallback(async () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const { data, error } = await supabase
      .from('memory_reviews')
      .select('*')
      .eq('user_id', userId)
      .gte('reviewed_at', oneWeekAgo.toISOString());
    
    if (error) {
      console.error('Error fetching weekly stats:', error);
      return { totalReviews: 0, correctReviews: 0 };
    }
    
    const reviews = data || [];
    return {
      totalReviews: reviews.length,
      correctReviews: reviews.filter((r: any) => r.quality >= 3).length,
    };
  }, [userId]);

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
    getConceptsByCourse,
    getReviewHistory,
    getWeeklyStats,
    refetch: fetchConcepts,
  };
};
