import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// POC User ID - Single user for all tests
const POC_USER_ID = "00000000-0000-0000-0000-000000000001";

interface CourseCard {
  id: string;
  type: string;
  title: string;
  content: string;
  options?: Array<{ id: string; text: string; isCorrect: boolean }>;
  flashcardBack?: string;
  sliderConfig?: {
    min: number;
    max: number;
    correct: number;
    unit: string;
  };
  sections?: Array<{
    title: string;
    content: string;
    image_url?: string;
  }>;
  xpReward: number;
}

interface GeneratedCourse {
  title: string;
  description?: string;
  category: string;
  icon: string;
  level: string;
  estimatedMinutes: number;
  totalXP: number;
  cards: CourseCard[];
}

serve(async (req) => {
  // Handle CORS preflight requests
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
        estimated_minutes: course.estimatedMinutes || 10,
        total_xp: course.totalXP || 0,
        is_published: false,
      })
      .select()
      .single();

    if (courseError) {
      console.error('Error inserting course:', courseError);
      throw courseError;
    }

    console.log(`Course created with ID: ${courseData.id}`);

    // 2. Insert all cards
    const cardsToInsert = course.cards.map((card, index) => {
      // Convert options array to the format expected by DB
      let options = null;
      let correctIndex = null;

      if (card.options && Array.isArray(card.options)) {
        options = card.options.map(opt => opt.text || opt);
        correctIndex = card.options.findIndex(opt => opt.isCorrect);
      }

      return {
        course_id: courseData.id,
        order_index: index,
        type: card.type,
        title: card.title,
        content: card.content || (card.sections ? JSON.stringify(card.sections) : ''),
        options: options ? { options, correctIndex } : null,
        flashcard_back: card.flashcardBack || null,
        slider_config: card.sliderConfig || null,
        xp_reward: card.xpReward || 10,
      };
    });

    const { error: cardsError } = await supabase
      .from('course_cards')
      .insert(cardsToInsert);

    if (cardsError) {
      console.error('Error inserting cards:', cardsError);
      // Rollback: delete the course if cards failed
      await supabase.from('courses').delete().eq('id', courseData.id);
      throw cardsError;
    }

    console.log(`${cardsToInsert.length} cards inserted successfully`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        courseId: courseData.id,
        message: `Course "${course.title}" saved with ${cardsToInsert.length} cards`
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
