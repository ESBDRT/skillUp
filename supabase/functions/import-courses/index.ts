import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation constants
const MAX_TITLE_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 1000;
const MAX_CONTENT_LENGTH = 5000;
const MAX_COURSES = 50;
const MAX_CARDS_PER_COURSE = 100;
const VALID_LEVELS = ['beginner', 'intermediate', 'advanced'] as const;
const VALID_CARD_TYPES = ['lesson', 'quiz', 'flashcard', 'info', 'slider', 'open-question'] as const;

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

// Sanitize string input
function sanitizeString(input: unknown, maxLength: number): string {
  if (typeof input !== 'string') return '';
  return input.trim().slice(0, maxLength).replace(/[<>]/g, '');
}

// Validate a single card
function validateCard(card: unknown, index: number): { valid: true; data: CourseCard } | { valid: false; error: string } {
  if (!card || typeof card !== 'object') {
    return { valid: false, error: `Card ${index + 1}: Invalid card object` };
  }

  const { type, title, content } = card as Record<string, unknown>;

  if (!type || !VALID_CARD_TYPES.includes(type as typeof VALID_CARD_TYPES[number])) {
    return { valid: false, error: `Card ${index + 1}: Invalid card type` };
  }

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return { valid: false, error: `Card ${index + 1}: Title is required` };
  }

  if (!content || typeof content !== 'string') {
    return { valid: false, error: `Card ${index + 1}: Content is required` };
  }

  const cardData = card as Record<string, unknown>;
  
  return {
    valid: true,
    data: {
      type: type as CourseCard['type'],
      title: sanitizeString(title, MAX_TITLE_LENGTH),
      content: sanitizeString(content, MAX_CONTENT_LENGTH),
      imageUrl: cardData.imageUrl ? sanitizeString(cardData.imageUrl, 500) : undefined,
      flashcardBack: cardData.flashcardBack ? sanitizeString(cardData.flashcardBack, MAX_CONTENT_LENGTH) : undefined,
      options: Array.isArray(cardData.options) ? cardData.options : undefined,
      sliderConfig: cardData.sliderConfig as CourseCard['sliderConfig'],
      xpReward: typeof cardData.xpReward === 'number' ? Math.min(Math.max(0, cardData.xpReward), 1000) : 10,
      sections: Array.isArray(cardData.sections) ? cardData.sections : undefined
    }
  };
}

// Validate a single course
function validateCourse(course: unknown, index: number): { valid: true; data: ImportCourse } | { valid: false; error: string } {
  if (!course || typeof course !== 'object') {
    return { valid: false, error: `Course ${index + 1}: Invalid course object` };
  }

  const { title, category, level, cards, description, icon, estimatedMinutes } = course as Record<string, unknown>;

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return { valid: false, error: `Course ${index + 1}: Title is required` };
  }

  if (!category || typeof category !== 'string') {
    return { valid: false, error: `Course ${index + 1}: Category is required` };
  }

  if (!level || !VALID_LEVELS.includes(level as typeof VALID_LEVELS[number])) {
    return { valid: false, error: `Course ${index + 1}: Invalid level` };
  }

  if (!Array.isArray(cards) || cards.length === 0) {
    return { valid: false, error: `Course ${index + 1}: At least one card is required` };
  }

  if (cards.length > MAX_CARDS_PER_COURSE) {
    return { valid: false, error: `Course ${index + 1}: Maximum ${MAX_CARDS_PER_COURSE} cards allowed` };
  }

  // Validate all cards
  const validatedCards: CourseCard[] = [];
  for (let i = 0; i < cards.length; i++) {
    const cardValidation = validateCard(cards[i], i);
    if (!cardValidation.valid) {
      return { valid: false, error: `Course ${index + 1}, ${cardValidation.error}` };
    }
    validatedCards.push(cardValidation.data);
  }

  return {
    valid: true,
    data: {
      title: sanitizeString(title, MAX_TITLE_LENGTH),
      description: description ? sanitizeString(description, MAX_DESCRIPTION_LENGTH) : undefined,
      icon: icon ? sanitizeString(icon, 10) : '📚',
      category: sanitizeString(category, 100),
      level: level as 'beginner' | 'intermediate' | 'advanced',
      estimatedMinutes: typeof estimatedMinutes === 'number' ? Math.min(Math.max(1, estimatedMinutes), 600) : 10,
      cards: validatedCards
    }
  };
}

// POC User ID - matches the one in src/lib/constants.ts
const POC_USER_ID = "00000000-0000-0000-0000-000000000001";

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client with service role for POC
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing database credentials');
      return new Response(
        JSON.stringify({ error: 'Service temporarily unavailable' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Use POC user ID (no auth required for POC)
    const userId = POC_USER_ID;

    // Parse request body
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (!body || typeof body !== 'object') {
      return new Response(
        JSON.stringify({ error: 'Invalid request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { courses } = body as Record<string, unknown>;
    
    if (!courses || !Array.isArray(courses)) {
      return new Response(
        JSON.stringify({ error: 'Invalid format: courses array required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (courses.length > MAX_COURSES) {
      return new Response(
        JSON.stringify({ error: `Maximum ${MAX_COURSES} courses allowed per import` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Starting import of ${courses.length} courses`);

    const result: ImportResult = {
      success: true,
      coursesImported: 0,
      cardsImported: 0,
      errors: []
    };

    // Process each course
    for (let i = 0; i < courses.length; i++) {
      // Validate course
      const validation = validateCourse(courses[i], i);
      if (!validation.valid) {
        result.errors.push({
          courseIndex: i,
          courseTitle: (courses[i] as Record<string, unknown>)?.title?.toString() || `Course ${i + 1}`,
          error: validation.error
        });
        continue;
      }

      const course = validation.data;
      
      try {
        // Calculate total XP
        const totalXp = course.cards.reduce((sum, card) => sum + (card.xpReward || 10), 0);

        // Insert course with POC user ID
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
            user_id: userId,
            is_published: false
          })
          .select('id')
          .single();

        if (courseError) {
          throw new Error('Failed to create course');
        }

        console.log(`Created course "${course.title}"`);

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
          throw new Error('Failed to create cards');
        }

        result.coursesImported++;
        result.cardsImported += course.cards.length;
        console.log(`Imported ${course.cards.length} cards for course "${course.title}"`);

      } catch (err) {
        result.errors.push({
          courseIndex: i,
          courseTitle: course.title,
          error: 'Import failed'
        });
        console.error(`Error importing course ${i}`);
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

  } catch (err) {
    console.error('Import error');
    return new Response(
      JSON.stringify({ error: 'Une erreur est survenue lors de l\'import' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
