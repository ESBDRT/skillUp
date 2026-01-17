import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CourseSection {
  title: string;
  subtitle?: string;
  content: string;
  imageUrl?: string;
}

interface CourseCard {
  type: 'lesson' | 'quiz' | 'flashcard' | 'info' | 'slider' | 'open-question';
  title: string;
  content: string;
  sections?: CourseSection[];
  imageUrl?: string;
  flashcardBack?: string;
  options?: Array<{ text: string; isCorrect: boolean }>;
  sliderConfig?: { min: number; max: number; correctValue: number; unit: string };
  xpReward?: number;
}

interface ImportCourse {
  title: string;
  description?: string;
  icon?: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  estimatedMinutes?: number;
  cards: CourseCard[];
}

interface ImportRequest {
  courses: ImportCourse[];
}

interface ImportResult {
  success: boolean;
  coursesImported: number;
  cardsImported: number;
  errors: Array<{ courseIndex: number; courseTitle: string; error: string }>;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const body: ImportRequest = await req.json();
    
    if (!body.courses || !Array.isArray(body.courses)) {
      return new Response(
        JSON.stringify({ error: 'Invalid format: courses array required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Starting import of ${body.courses.length} courses for user ${user.id}`);

    const result: ImportResult = {
      success: true,
      coursesImported: 0,
      cardsImported: 0,
      errors: []
    };

    // Process each course
    for (let i = 0; i < body.courses.length; i++) {
      const course = body.courses[i];
      
      try {
        // Validate required fields
        if (!course.title || !course.category || !course.level) {
          throw new Error('Missing required fields: title, category, level');
        }

        if (!course.cards || !Array.isArray(course.cards) || course.cards.length === 0) {
          throw new Error('Course must have at least one card');
        }

        // Calculate total XP
        const totalXp = course.cards.reduce((sum, card) => sum + (card.xpReward || 10), 0);

        // Insert course
        const { data: courseData, error: courseError } = await supabase
          .from('courses')
          .insert({
            title: course.title,
            description: course.description || '',
            icon: course.icon || '📚',
            category: course.category,
            level: course.level,
            estimated_minutes: course.estimatedMinutes || 10,
            total_xp: totalXp,
            user_id: user.id,
            is_published: false
          })
          .select('id')
          .single();

        if (courseError) {
          throw new Error(`Failed to create course: ${courseError.message}`);
        }

        console.log(`Created course "${course.title}" with ID ${courseData.id}`);

        // Insert cards
        const cardsToInsert = course.cards.map((card, index) => ({
          course_id: courseData.id,
          order_index: index,
          type: card.type,
          title: card.title,
          content: card.content,
          image_url: card.imageUrl || null,
          flashcard_back: card.flashcardBack || null,
          options: card.options ? JSON.stringify(card.options) : null,
          slider_config: card.sliderConfig ? JSON.stringify(card.sliderConfig) : null,
          xp_reward: card.xpReward || 10
        }));

        // For lesson cards with sections, store sections in content as JSON
        for (let j = 0; j < cardsToInsert.length; j++) {
          const originalCard = course.cards[j];
          if (originalCard.type === 'lesson' && originalCard.sections) {
            cardsToInsert[j].content = JSON.stringify({
              text: originalCard.content,
              sections: originalCard.sections
            });
          }
        }

        const { error: cardsError } = await supabase
          .from('course_cards')
          .insert(cardsToInsert);

        if (cardsError) {
          // Rollback: delete the course if cards failed
          await supabase.from('courses').delete().eq('id', courseData.id);
          throw new Error(`Failed to create cards: ${cardsError.message}`);
        }

        result.coursesImported++;
        result.cardsImported += course.cards.length;
        console.log(`Imported ${course.cards.length} cards for course "${course.title}"`);

      } catch (error) {
        result.errors.push({
          courseIndex: i,
          courseTitle: course.title || `Course ${i + 1}`,
          error: error.message
        });
        console.error(`Error importing course ${i}: ${error.message}`);
      }
    }

    // Set success to false if any errors occurred
    if (result.errors.length > 0) {
      result.success = result.coursesImported > 0;
    }

    console.log(`Import complete: ${result.coursesImported} courses, ${result.cardsImported} cards, ${result.errors.length} errors`);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Import error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Import failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
