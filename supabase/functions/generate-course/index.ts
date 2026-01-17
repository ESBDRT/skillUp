import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DayPlan {
  day: number;
  title: string;
  concepts: string[];
  estimatedMinutes: number;
}

interface CoursePlan {
  courseTitle: string;
  courseDescription: string;
  category: string;
  icon: string;
  level: string;
  dailyMinutes: number;
  durationDays: number;
  days: DayPlan[];
  totalConcepts: number;
}

interface GenerateCourseRequest {
  theme: string;
  dailyMinutes: number;
  level: 'beginner' | 'intermediate' | 'expert';
  knownKeywords?: string[];
  coursePlan?: CoursePlan;
}

const levelInstructions = {
  beginner: `
    - Utilise un vocabulaire simple et accessible
    - Explique chaque concept de base en détail
    - Donne des exemples concrets du quotidien
    - Évite le jargon technique ou explique-le
    - Progression très douce entre les concepts
  `,
  intermediate: `
    - Suppose une connaissance de base du sujet
    - Approfondis les concepts et leurs liens
    - Introduis des nuances et des cas particuliers
    - Utilise un vocabulaire plus technique avec modération
    - Propose des exercices de réflexion
  `,
  expert: `
    - Aborde des concepts avancés et complexes
    - Propose une analyse critique et des débats
    - Cite des références et des études si pertinent
    - Explore les cas limites et les controverses
    - Encourage la pensée indépendante
  `
};

const levelNames = {
  beginner: 'Notions',
  intermediate: 'Intermédiaire',
  expert: 'Expert'
};

// Fallback placeholder image
function getFallbackImage(keyword: string): string {
  const cleanKeyword = encodeURIComponent(keyword.toLowerCase().replace(/[^a-z0-9\s]/g, '').substring(0, 30) || 'education');
  return `https://placehold.co/800x600/1a1a2e/eaeaea?text=${cleanKeyword}`;
}

// Generate image using AI or fallback
async function generateImage(keyword: string, theme: string, supabaseUrl: string, supabaseKey: string): Promise<string> {
  try {
    console.log(`Generating image for keyword: ${keyword}`);
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const { data, error } = await supabase.functions.invoke('generate-image', {
      body: { keyword, theme }
    });
    
    if (error) {
      console.error('Image generation error:', error);
      return getFallbackImage(keyword);
    }
    
    const imageUrl = data?.imageUrl || data?.fallbackUrl || getFallbackImage(keyword);
    console.log(`Image result for ${keyword}: ${imageUrl?.substring(0, 50)}...`);
    return imageUrl;
  } catch (e) {
    console.error('Failed to generate image:', e);
    return getFallbackImage(keyword);
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { theme, dailyMinutes, level, knownKeywords, coursePlan }: GenerateCourseRequest = await req.json();
    
    console.log(`Generating course: theme="${theme}", minutes=${dailyMinutes}, level=${level}, knownKeywords=${knownKeywords?.length || 0}, hasPlan=${!!coursePlan}`);

    const FEATHERLESS_API_KEY = Deno.env.get('API');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || '';
    
    if (!FEATHERLESS_API_KEY) {
      throw new Error('API key is not configured');
    }

    // If we have a course plan, use it to guide generation
    const hasPlan = coursePlan && coursePlan.days && coursePlan.days.length > 0;
    
    // STRICT LIMIT: 5-7 slides maximum, regardless of plan
    const maxSlides = 7;
    const minSlides = 5;
    
    const totalConcepts = hasPlan 
      ? Math.min(maxSlides, coursePlan.days.reduce((sum, day) => sum + day.concepts.length, 0))
      : Math.min(maxSlides, Math.max(minSlides, Math.floor(dailyMinutes / 2)));
    
    // Only 2-3 tests maximum
    const quizCount = Math.min(3, Math.max(2, Math.ceil(totalConcepts / 3)));

    const knownConceptsInstruction = knownKeywords && knownKeywords.length > 0
      ? `\n\nIMPORTANT - ADAPTATION AU NIVEAU DE L'APPRENANT :
L'apprenant a indiqué qu'il connaît déjà ces concepts : ${knownKeywords.join(', ')}.
- NE PAS répéter les bases de ces concepts, l'apprenant les maîtrise déjà
- Mentionner brièvement ces concepts si nécessaire, mais aller plus loin
- Se concentrer sur les aspects avancés et les connexions avec d'autres concepts
- Proposer des nuances et des approfondissements sur ces sujets`
      : '';

    // Build the plan instruction if we have a course plan - limit to maxSlides
    const limitedDays = hasPlan ? coursePlan.days.slice(0, maxSlides) : [];
    const planInstruction = hasPlan 
      ? `\n\nPLANNING VALIDÉ - SUIT CE PLAN (limité à ${maxSlides} slides max) :
Titre du cours : "${coursePlan.courseTitle}"
Description : "${coursePlan.courseDescription}"

${limitedDays.map((day, i) => `SLIDE ${i + 1} - "${day.title}" :
  Concept : ${day.concepts[0] || day.title}`).join('\n\n')}

IMPORTANT : Crée EXACTEMENT ${Math.min(maxSlides, limitedDays.length)} slides, pas plus.`
      : '';

    const systemPrompt = `Tu es un expert pédagogue qui crée des cours éducatifs de haute qualité.

Niveau de difficulté : ${levelNames[level]}
${levelInstructions[level]}${knownConceptsInstruction}${planInstruction}

RÈGLES STRICTES :
1. MAXIMUM ${maxSlides} SLIDES - pas plus !
2. Chaque slide doit contenir 150-200 mots MINIMUM avec des exemples concrets
3. Seulement ${quizCount} questions de test (QCM ou flashcard uniquement)
4. Contenu RICHE et SUBSTANTIEL, pas superficiel

Le contenu doit être en français, éducatif et engageant.`;

    const userPrompt = `Crée un cours en EXACTEMENT ${totalConcepts} SLIDES sur : "${theme}"

RÉPONDS UNIQUEMENT avec un JSON valide dans ce format exact :
{
  "title": "Titre accrocheur du cours (max 60 caractères)",
  "description": "Description du cours (2-3 phrases)",
  "category": "Science|Histoire|Psychologie|Finance|Santé|Art|Technologie",
  "icon": "📚",
  "lessonSections": [
    {
      "title": "Titre court slide 1 (max 50 caractères)",
      "content": "Contenu RICHE de 150-200 mots avec **mots en gras** et exemples concrets. Utilise > pour les callouts.",
      "imageKeyword": "keyword english 2-3 words"
    }
  ],
  "quizQuestions": [
    {"type": "quiz", "question": "Question?", "options": ["Option A", "Option B", "Option C", "Option D"], "correctIndex": 0},
    {"type": "flashcard", "question": "Concept", "answer": "Définition détaillée de 50-100 mots"}
  ]
}

IMPORTANT:
- EXACTEMENT ${totalConcepts} slides dans lessonSections
- Titres COURTS (max 40 caractères) pour mobile
- Contenu RICHE (150-200 mots) avec **gras** et > callouts
- SEULEMENT ${quizCount} tests
- Options QCM = phrases complètes
- Flashcard DOIT avoir answer de 50-100 mots`;

    const response = await fetch('https://api.featherless.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${FEATHERLESS_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistralai/Mistral-7B-v0.1',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 4096
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Featherless API error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: 'Limite de requêtes atteinte. Veuillez réessayer dans quelques instants.' 
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      if (response.status === 402) {
        return new Response(JSON.stringify({ 
          error: 'Crédits insuffisants.' 
        }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      throw new Error(`API error: ${response.status}`);
    }

    const aiResponse = await response.json();
    console.log('AI Response received');

    let courseData;
    const messageContent = aiResponse.choices?.[0]?.message?.content;
    
    if (messageContent) {
      console.log('Attempting to parse from message content');
      try {
        const jsonMatch = messageContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          courseData = JSON.parse(jsonMatch[0]);
          console.log('Parsed course data from message content');
        }
      } catch (contentParseError) {
        console.error('Failed to parse message content:', contentParseError);
      }
    }

    if (!courseData || !courseData.lessonSections) {
      throw new Error('Impossible de générer le cours. Veuillez réessayer.');
    }

    // STRICT: Limit to maxSlides
    const limitedSections = courseData.lessonSections.slice(0, maxSlides);
    console.log(`Processing ${limitedSections.length} slides (limited from ${courseData.lessonSections.length})`);

    // Build the cards array
    const cards: any[] = [];

    // Generate images in parallel for all sections
    console.log(`Starting image generation for ${limitedSections.length} slides`);
    const imagePromises = limitedSections.map((section: any, idx: number) => {
      const keyword = section.imageKeyword || theme;
      console.log(`[Slide ${idx + 1}] Image keyword: ${keyword}`);
      return generateImage(keyword, theme, SUPABASE_URL, SUPABASE_ANON_KEY);
    });
    const imageUrls = await Promise.all(imagePromises);
    console.log(`Image generation complete. Results:`, imageUrls.map(u => u?.substring(0, 40)));

    // Each section becomes a separate "info" card (slide)
    limitedSections.forEach((section: any, index: number) => {
      const imgUrl = imageUrls[index];
      console.log(`[Card ${index}] Adding with image: ${imgUrl?.substring(0, 50)}`);
      cards.push({
        type: 'info',
        title: section.title,
        content: section.content,
        image_url: imgUrl,
        xpReward: 15
      });
    });

    // Limit quiz questions to quizCount
    const limitedQuizzes = (courseData.quizQuestions || []).slice(0, quizCount);

    // Add quiz questions - only quiz and flashcard types
    limitedQuizzes.forEach((quiz: any, index: number) => {
      const questionType = quiz.type || 'quiz';
      
      // Format and validate options for QCM
      const formatOptions = (options: any[]): Array<{id: string; text: string; isCorrect: boolean}> | null => {
        if (!options || !Array.isArray(options)) return null;
        
        const validOptions = options
          .map((opt: any, i: number) => {
            const text = typeof opt === 'string' ? opt.trim() : (opt?.text?.trim() || '');
            if (!text || text.length < 2) return null;
            return {
              id: `opt-${index}-${i}`,
              text: text,
              isCorrect: i === quiz.correctIndex
            };
          })
          .filter(Boolean) as Array<{id: string; text: string; isCorrect: boolean}>;
        
        // Need at least 2 valid options
        return validOptions.length >= 2 ? validOptions : null;
      };
      
      // Only allow quiz and flashcard types
      if (questionType === 'quiz') {
        const formattedOptions = formatOptions(quiz.options);
        if (formattedOptions) {
          cards.push({
            type: 'quiz',
            title: `Question ${index + 1}`,
            content: quiz.question,
            options: formattedOptions,
            xpReward: 25
          });
        } else {
          // Convert to flashcard if options are invalid
          cards.push({
            type: 'flashcard',
            title: `Mémorisation ${index + 1}`,
            content: quiz.question,
            flashcard_back: quiz.answer || quiz.options?.[quiz.correctIndex] || 'Réponse à découvrir',
            xpReward: 20
          });
        }
      } else if (questionType === 'flashcard') {
        // Ensure flashcard has valid back content - prioritize answer field
        const backContent = quiz.answer || quiz.expectedAnswer || quiz.backContent || '';
        
        console.log(`Flashcard ${index + 1}: question="${quiz.question?.substring(0, 50)}", answer="${backContent?.substring(0, 50)}"`);
        
        if (backContent && backContent.trim().length >= 10 && backContent.trim() !== quiz.question?.trim()) {
          cards.push({
            type: 'flashcard',
            title: `Mémorisation ${index + 1}`,
            content: quiz.question,
            flashcard_back: backContent.trim(),
            xpReward: 20
          });
        } else {
          // Fallback: create a meaningful response based on the question
          console.warn(`Flashcard ${index + 1} has no valid answer, generating placeholder`);
          const fallbackAnswer = `La réponse à "${quiz.question}" est un concept clé de ce cours. Prenez le temps de réfléchir avant de retourner la carte.`;
          cards.push({
            type: 'flashcard',
            title: `Mémorisation ${index + 1}`,
            content: quiz.question,
            flashcard_back: fallbackAnswer,
            xpReward: 20
          });
        }
      } else {
        // Convert any other type to flashcard with validation
        const backContent = quiz.answer || quiz.expectedAnswer || '';
        const finalBack = backContent.trim().length >= 10 
          ? backContent.trim() 
          : `Réflexion sur : ${quiz.question}. Ce concept est fondamental pour comprendre le sujet.`;
        cards.push({
          type: 'flashcard',
          title: `Mémorisation ${index + 1}`,
          content: quiz.question,
          flashcard_back: finalBack,
          xpReward: 20
        });
      }
    });

    const totalXP = cards.reduce((sum: number, card: any) => sum + (card.xpReward || 0), 0);

    // Calculate optimal duration based on card count
    const totalCards = cards.length;
    const cardsPerDay = Math.max(4, Math.ceil(dailyMinutes / 2));
    const durationDays = Math.max(1, Math.ceil(totalCards / cardsPerDay));

    const result = {
      title: courseData.title,
      description: courseData.description,
      category: courseData.category,
      icon: courseData.icon,
      level: level,
      estimated_minutes: dailyMinutes,
      total_xp: totalXP,
      duration_days: durationDays,
      daily_cards_count: cardsPerDay,
      cards: cards
    };

    console.log(`Course generated: "${result.title}" with ${cards.length} cards (${limitedSections.length} slides, ${limitedQuizzes.length} questions), duration: ${durationDays} days`);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error generating course:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Erreur lors de la génération du cours' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
