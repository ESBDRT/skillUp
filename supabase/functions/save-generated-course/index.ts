import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// POC User ID - Single user for all tests
const POC_USER_ID = "00000000-0000-0000-0000-000000000001";

interface CourseCard {
  type: string;
  title: string;
  content: string;
  options?: Array<{ id: string; text: string; isCorrect: boolean }> | string[];
  image_url?: string;
  flashcard_back?: string;
  expectedAnswer?: string;
  slider_config?: {
    min: number;
    max: number;
    correct: number;
    unit: string;
  };
  xpReward: number;
}

interface GeneratedCourse {
  title: string;
  description?: string;
  category: string;
  icon: string;
  level: string;
  estimated_minutes: number;
  total_xp: number;
  duration_days?: number;
  daily_cards_count?: number;
  cards: CourseCard[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { course } = await req.json() as { course: GeneratedCourse };

    if (!course || !course.title) {
      throw new Error('Course data is required');
    }

    console.log(`Saving course: ${course.title}`);
    console.log(`Cards: ${course.cards.length}`);

    // Calculate optimal duration based on card count
    const totalCards = course.cards.length;
    const estimatedMinutes = course.estimated_minutes || 10;
    
    // Minimum 4 cards per session for good engagement
    // Use provided values or calculate sensible defaults
    const cardsPerDay = course.daily_cards_count || Math.max(4, Math.ceil(estimatedMinutes / 2));
    const durationDays = course.duration_days || Math.max(1, Math.ceil(totalCards / cardsPerDay));
    
    console.log(`Total cards: ${totalCards}, cards/day: ${cardsPerDay}, days: ${durationDays}`);

    // 1. Insert the course
    const { data: courseData, error: courseError } = await supabase
      .from('courses')
      .insert({
        user_id: POC_USER_ID,
        title: course.title,
        description: course.description || '',
        category: course.category || 'Général',
        icon: course.icon || '📚',
        level: ['beginner', 'intermediate', 'expert'].includes(course.level) ? course.level : 'beginner',
        estimated_minutes: estimatedMinutes,
        total_xp: course.total_xp || 0,
        is_published: false,
        duration_days: durationDays,
        daily_cards_count: cardsPerDay,
      })
      .select()
      .single();

    if (courseError) {
      console.error('Error inserting course:', courseError);
      throw courseError;
    }

    console.log(`Course created with ID: ${courseData.id}`);

    // 2. Insert all cards with proper format
    const cardsToInsert = course.cards.map((card, index) => {
      // Handle options - normalize to { options: string[], correctIndex: number }
      let optionsData = null;
      if (card.options && Array.isArray(card.options) && card.options.length > 0) {
        const firstOpt = card.options[0];
        
        if (typeof firstOpt === 'string') {
          // Already string array - need correctIndex from card
          const correctIdx = (card as any).correctIndex ?? 0;
          optionsData = { options: card.options, correctIndex: correctIdx };
        } else if (typeof firstOpt === 'object' && firstOpt !== null) {
          // Object array with { id?, text, isCorrect }
          const options = card.options.map((opt: any) => 
            typeof opt === 'string' ? opt : (opt.text || String(opt))
          );
          const correctIndex = card.options.findIndex((opt: any) => opt.isCorrect === true);
          optionsData = { 
            options, 
            correctIndex: correctIndex >= 0 ? correctIndex : 0 
          };
        }
        
        console.log(`Card ${index} (${card.type}): options=${JSON.stringify(optionsData)}`);
      }

      return {
        course_id: courseData.id,
        order_index: index,
        type: card.type,
        title: card.title,
        content: card.content || '',
        options: optionsData,
        image_url: card.image_url || null,
        flashcard_back: card.flashcard_back || card.expectedAnswer || null,
        slider_config: card.slider_config || null,
        xp_reward: card.xpReward || 10,
      };
    });

    const { error: cardsError } = await supabase
      .from('course_cards')
      .insert(cardsToInsert);

    if (cardsError) {
      console.error('Error inserting cards:', cardsError);
      await supabase.from('courses').delete().eq('id', courseData.id);
      throw cardsError;
    }

    console.log(`${cardsToInsert.length} cards inserted successfully`);

    // 3. Create sessions with proper card distribution
    const sessionsToCreate = [];
    const today = new Date();
    let currentCardIndex = 0;

    for (let day = 0; day < durationDays; day++) {
      const startIndex = currentCardIndex;
      const endIndex = Math.min(currentCardIndex + cardsPerDay - 1, totalCards - 1);
      
      if (startIndex > totalCards - 1) break;

      const sessionDate = new Date(today);
      sessionDate.setDate(today.getDate() + day);

      sessionsToCreate.push({
        user_id: POC_USER_ID,
        course_id: courseData.id,
        scheduled_date: sessionDate.toISOString().split('T')[0],
        session_number: day + 1,
        cards_start_index: startIndex,
        cards_end_index: endIndex,
        is_completed: false,
        earned_xp: 0,
      });

      currentCardIndex = endIndex + 1;
    }

    if (sessionsToCreate.length > 0) {
      const { error: sessionsError } = await supabase
        .from('course_sessions')
        .insert(sessionsToCreate);

      if (sessionsError) {
        console.error('Error creating sessions:', sessionsError);
      } else {
        console.log(`${sessionsToCreate.length} sessions created successfully`);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        courseId: courseData.id,
        cardsCount: cardsToInsert.length,
        sessionsCreated: sessionsToCreate.length,
        cardsPerDay: cardsPerDay,
        message: `Course "${course.title}" saved with ${cardsToInsert.length} cards and ${sessionsToCreate.length} sessions`
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in save-generated-course:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
