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
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const { data, error } = await supabase.functions.invoke('generate-image', {
      body: { keyword, theme }
    });
    
    if (error) {
      console.error('Image generation error:', error);
      return getFallbackImage(keyword);
    }
    
    return data?.imageUrl || data?.fallbackUrl || getFallbackImage(keyword);
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

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || '';
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
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

STRUCTURE OBLIGATOIRE :

1. SLIDES DE CONTENU (${totalConcepts} slides) :
   Chaque slide DOIT contenir :
   - title: Titre court (max 50 caractères)
   - content: Texte RICHE de 150-200 mots avec :
     * Une explication claire du concept
     * AU MOINS 2 exemples concrets
     * Une analogie pour simplifier
     * Une application pratique
   - imageKeyword: 2-3 mots anglais pour l'image

   EXEMPLE de contenu attendu :
   "La photosynthèse est le processus par lequel les plantes convertissent la lumière du soleil en énergie. Imaginez une usine verte : les feuilles sont les panneaux solaires, l'eau et le CO2 sont les matières premières, et le glucose produit est le carburant. Par exemple, un grand chêne peut produire assez d'oxygène pour 4 personnes par jour. Les algues marines réalisent aussi ce processus et produisent 50% de l'oxygène terrestre. En pratique, c'est pourquoi les plantes d'intérieur améliorent la qualité de l'air chez vous."

2. TESTS (EXACTEMENT ${quizCount} questions) :
   SEULEMENT 2 TYPES AUTORISÉS :
   
   - QCM : { "type": "quiz", "question": "Question claire ?", "options": ["Option complète A", "Option complète B", "Option complète C", "Option complète D"], "correctIndex": 0 }
   
   - Flashcard : { "type": "flashcard", "question": "Concept à mémoriser", "answer": "Définition complète" }

IMPORTANT :
- EXACTEMENT ${totalConcepts} slides, pas plus, pas moins
- Contenu LONG et RICHE (150-200 mots par slide)
- SEULEMENT ${quizCount} tests
- Options de QCM = phrases complètes, pas de lettres
- PAS de type "open-question" ou "slider"`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'create_course',
              description: 'Crée un cours éducatif structuré en slides',
              parameters: {
                type: 'object',
                properties: {
                  title: {
                    type: 'string',
                    description: 'Titre accrocheur du cours (max 60 caractères)'
                  },
                  description: {
                    type: 'string',
                    description: 'Description du cours (2-3 phrases)'
                  },
                  category: {
                    type: 'string',
                    description: 'Catégorie (Science, Histoire, Psychologie, Finance, Santé, Art, Technologie)'
                  },
                  icon: {
                    type: 'string',
                    description: 'Un emoji représentant le cours'
                  },
                  lessonSections: {
                    type: 'array',
                    description: 'Les slides du cours (5-7 maximum)',
                    items: {
                      type: 'object',
                      properties: {
                        title: {
                          type: 'string',
                          description: 'Titre court de la slide (max 50 caractères)'
                        },
                        content: {
                          type: 'string',
                          description: 'Contenu RICHE de 150-200 mots avec exemples concrets'
                        },
                        imageKeyword: {
                          type: 'string',
                          description: 'Mot-clé simple pour image (2-3 mots en anglais)'
                        }
                      },
                      required: ['title', 'content', 'imageKeyword']
                    }
                  },
                  quizQuestions: {
                    type: 'array',
                    description: 'Questions de test (2-3 maximum, QCM ou flashcard uniquement)',
                    items: {
                      type: 'object',
                      properties: {
                        type: {
                          type: 'string',
                          enum: ['quiz', 'flashcard'],
                          description: 'Type de question (quiz ou flashcard uniquement)'
                        },
                        question: {
                          type: 'string',
                          description: 'La question ou le concept'
                        },
                        options: {
                          type: 'array',
                          items: { type: 'string' },
                          description: 'Options pour QCM (4 choix, phrases complètes)'
                        },
                        correctIndex: {
                          type: 'number',
                          description: 'Index de la bonne réponse pour QCM (0-3)'
                        },
                        answer: {
                          type: 'string',
                          description: 'Réponse pour flashcard'
                        }
                      },
                      required: ['type', 'question']
                    }
                  }
                },
                required: ['title', 'description', 'category', 'icon', 'lessonSections', 'quizQuestions']
              }
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: 'create_course' } }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
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
          error: 'Crédits insuffisants. Veuillez recharger votre compte.' 
        }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    console.log('AI Response received');

    // Try to get course data from tool call first
    let courseData;
    const toolCall = aiResponse.choices?.[0]?.message?.tool_calls?.[0];
    
    if (toolCall && toolCall.function?.name === 'create_course') {
      try {
        courseData = JSON.parse(toolCall.function.arguments);
        console.log('Parsed course data from tool call');
      } catch (parseError) {
        console.error('Failed to parse tool call arguments:', parseError);
      }
    }
    
    // Fallback: try to extract from message content if tool call failed
    if (!courseData) {
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
    }
    
    // If still no course data, try a simpler request
    if (!courseData || !courseData.lessonSections) {
      console.log('Creating fallback course structure');
      const fallbackResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            { role: 'system', content: systemPrompt },
            { 
              role: 'user', 
              content: `${userPrompt}

RÉPONDS UNIQUEMENT avec un JSON valide dans ce format exact, sans aucun texte avant ou après :
{
  "title": "Titre du cours",
  "description": "Description en 2-3 phrases",
  "category": "Catégorie",
  "icon": "📚",
  "lessonSections": [
    {"title": "Section 1", "content": "Contenu riche de 150-200 mots avec exemples...", "imageKeyword": "keyword"}
  ],
  "quizQuestions": [
    {"type": "quiz", "question": "Question?", "options": ["Option A complète", "Option B complète", "Option C complète", "Option D complète"], "correctIndex": 0},
    {"type": "flashcard", "question": "Concept", "answer": "Définition complète"}
  ]
}`
            }
          ]
        })
      });

      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        const fallbackContent = fallbackData.choices?.[0]?.message?.content || '';
        console.log('Fallback response received');
        
        try {
          const jsonMatch = fallbackContent.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            courseData = JSON.parse(jsonMatch[0]);
            console.log('Parsed course data from fallback');
          }
        } catch (fallbackParseError) {
          console.error('Failed to parse fallback content:', fallbackParseError);
        }
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
    const imagePromises = limitedSections.map((section: any) => 
      generateImage(section.imageKeyword || theme, theme, SUPABASE_URL, SUPABASE_ANON_KEY)
    );
    const imageUrls = await Promise.all(imagePromises);

    // Each section becomes a separate "info" card (slide)
    limitedSections.forEach((section: any, index: number) => {
      cards.push({
        type: 'info',
        title: section.title,
        content: section.content,
        image_url: imageUrls[index],
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
        // Ensure flashcard has valid back content
        const backContent = quiz.answer || quiz.expectedAnswer || quiz.question || '';
        if (backContent && backContent.trim().length >= 3) {
          cards.push({
            type: 'flashcard',
            title: `Mémorisation ${index + 1}`,
            content: quiz.question,
            flashcard_back: backContent,
            xpReward: 20
          });
        } else {
          console.log(`Skipping flashcard ${index + 1} without valid answer`);
        }
      } else {
        // Convert any other type to flashcard with validation
        const backContent = quiz.answer || quiz.expectedAnswer || 'Concept clé à retenir';
        cards.push({
          type: 'flashcard',
          title: `Mémorisation ${index + 1}`,
          content: quiz.question,
          flashcard_back: backContent,
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
