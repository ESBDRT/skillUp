import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

// Get image from Unsplash (no API key required)
function getUnsplashImage(keyword: string): string {
  const cleanKeyword = keyword.trim().replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, ',');
  return `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop&q=80`;
}

// Get a themed image from Unsplash Source API
function getThemedImage(keyword: string, index: number): string {
  const keywords = encodeURIComponent(keyword.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, ''));
  // Use different seed for each image to get variety
  return `https://source.unsplash.com/800x600/?${keywords}&sig=${index}`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { theme, dailyMinutes, level, knownKeywords, coursePlan }: GenerateCourseRequest = await req.json();
    
    console.log(`Generating course: theme="${theme}", minutes=${dailyMinutes}, level=${level}, knownKeywords=${knownKeywords?.length || 0}, hasPlan=${!!coursePlan}`);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // If we have a course plan, use it to guide generation
    const hasPlan = coursePlan && coursePlan.days && coursePlan.days.length > 0;
    
    // Calculate total concepts from plan or estimate
    const totalConcepts = hasPlan 
      ? coursePlan.days.reduce((sum, day) => sum + day.concepts.length, 0)
      : (dailyMinutes <= 5 ? 4 : dailyMinutes <= 10 ? 6 : dailyMinutes <= 15 ? 8 : 10);
    
    const quizCount = Math.max(3, Math.floor(totalConcepts / 2));

    const knownConceptsInstruction = knownKeywords && knownKeywords.length > 0
      ? `\n\nIMPORTANT - ADAPTATION AU NIVEAU DE L'APPRENANT :
L'apprenant a indiqué qu'il connaît déjà ces concepts : ${knownKeywords.join(', ')}.
- NE PAS répéter les bases de ces concepts, l'apprenant les maîtrise déjà
- Mentionner brièvement ces concepts si nécessaire, mais aller plus loin
- Se concentrer sur les aspects avancés et les connexions avec d'autres concepts
- Proposer des nuances et des approfondissements sur ces sujets`
      : '';

    // Build the plan instruction if we have a course plan
    const planInstruction = hasPlan 
      ? `\n\nPLANNING VALIDÉ PAR L'UTILISATEUR - SUIT CE PLAN EXACTEMENT :
Titre du cours : "${coursePlan.courseTitle}"
Description : "${coursePlan.courseDescription}"
Catégorie : ${coursePlan.category}
Icône : ${coursePlan.icon}

${coursePlan.days.map(day => `JOUR ${day.day} - "${day.title}" :
  Concepts à couvrir : ${day.concepts.join(', ')}`).join('\n\n')}

IMPORTANT : Crée une slide pour CHAQUE concept listé ci-dessus. Le contenu doit correspondre exactement aux concepts du planning.`
      : '';

    const systemPrompt = `Tu es un expert pédagogue qui crée des cours éducatifs de haute qualité, structurés comme des présentations modernes type slides.

Niveau de difficulté : ${levelNames[level]}
${levelInstructions[level]}${knownConceptsInstruction}${planInstruction}

Tu dois créer un VRAI COURS structuré en SLIDES INDIVIDUELLES :
- Chaque section = 1 slide séparée avec un concept clair
- Contenu concis mais riche (3-5 phrases par slide max)
- Progression logique entre les slides
- Variété dans les types de tests

Le contenu doit être en français, éducatif, engageant et bien structuré.`;

    const userPrompt = hasPlan 
      ? `Crée le contenu complet du cours "${coursePlan.courseTitle}" en suivant EXACTEMENT le planning validé.

Pour chaque concept du planning, crée une slide avec :
- title: Titre du concept (reprends le concept du planning)
- content: Explication claire et pédagogique (3-5 phrases)
- imageKeyword: 2-3 mots anglais pour l'image

Ajoute aussi ${quizCount} questions de test variées (QCM, questions ouvertes, flashcards, sliders).`
      : `Crée un cours en ${totalConcepts} SLIDES sur : "${theme}"

STRUCTURE DU COURS EN SLIDES :

1. SLIDES DE CONTENU (${totalConcepts} slides) :
   Chaque slide contient UN concept clé avec :
   - title: Titre court et accrocheur (max 50 caractères)
   - content: Explication claire (3-5 phrases, ~100 mots max)
   - imageKeyword: 2-3 mots anglais pour l'image (ex: "brain neurons", "coffee beans")
2. TESTS VARIÉS (${quizCount} questions de TYPES DIFFÉRENTS) :
   OBLIGATOIRE - Utilise ces types dans l'ordre :
   
   a) "quiz" (QCM) - 2 questions minimum :
      { "type": "quiz", "question": "...", "options": ["A", "B", "C", "D"], "correctIndex": 0 }
   
   b) "open-question" (réponse argumentée) - 1 question :
      { "type": "open-question", "question": "...", "expectedAnswer": "Réponse type attendue en 2-3 phrases" }
   
   c) "flashcard" (carte mémoire) - 1 carte :
      { "type": "flashcard", "question": "Concept clé à retenir", "answer": "Définition ou explication" }
   
   d) "slider" (estimation) - 1 question si pertinent :
      { "type": "slider", "question": "Quelle estimation pour...?", "sliderConfig": { "min": 0, "max": 100, "correct": 42, "unit": "%" } }

IMPORTANT :
- Chaque slide = 1 concept = contenu COURT et PRÉCIS
- Les slides sont SÉPARÉES, pas un long texte
- Utilise TOUS les types de tests demandés
- Les imageKeyword doivent être simples et en anglais`;

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
              description: 'Crée un cours éducatif structuré en slides avec tests variés',
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
                    description: 'Les slides du cours (1 concept par slide)',
                    items: {
                      type: 'object',
                      properties: {
                        title: {
                          type: 'string',
                          description: 'Titre court de la slide (max 50 caractères)'
                        },
                        content: {
                          type: 'string',
                          description: 'Contenu concis de la slide (3-5 phrases, ~100 mots max)'
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
                    description: 'Questions de test de types variés',
                    items: {
                      type: 'object',
                      properties: {
                        type: {
                          type: 'string',
                          enum: ['quiz', 'open-question', 'flashcard', 'slider'],
                          description: 'Type de question'
                        },
                        question: {
                          type: 'string',
                          description: 'La question ou le concept'
                        },
                        options: {
                          type: 'array',
                          items: { type: 'string' },
                          description: 'Options pour QCM (4 choix)'
                        },
                        correctIndex: {
                          type: 'number',
                          description: 'Index de la bonne réponse pour QCM (0-3)'
                        },
                        answer: {
                          type: 'string',
                          description: 'Réponse pour flashcard'
                        },
                        expectedAnswer: {
                          type: 'string',
                          description: 'Réponse attendue pour question ouverte'
                        },
                        sliderConfig: {
                          type: 'object',
                          properties: {
                            min: { type: 'number' },
                            max: { type: 'number' },
                            correct: { type: 'number' },
                            unit: { type: 'string' }
                          },
                          description: 'Configuration pour slider'
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
    {"title": "Section 1", "content": "Contenu court...", "imageKeyword": "keyword"}
  ],
  "quizQuestions": [
    {"type": "quiz", "question": "Question?", "options": ["A", "B", "C", "D"], "correctIndex": 0},
    {"type": "open-question", "question": "Question ouverte?", "expectedAnswer": "Réponse attendue"},
    {"type": "flashcard", "question": "Concept", "answer": "Définition"}
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

    // Build the cards array - EACH SECTION IS A SEPARATE CARD (SLIDE)
    const cards: any[] = [];

    // Each section becomes a separate "info" card (slide)
    courseData.lessonSections.forEach((section: any, index: number) => {
      const imageUrl = getThemedImage(section.imageKeyword || theme, index);
      cards.push({
        type: 'info',
        title: section.title,
        content: section.content,
        image_url: imageUrl,
        xpReward: 15
      });
    });

    // Add varied question types
    courseData.quizQuestions.forEach((quiz: any, index: number) => {
      const questionType = quiz.type || 'quiz';
      
      switch (questionType) {
        case 'quiz':
          cards.push({
            type: 'quiz',
            title: `Question ${index + 1}`,
            content: quiz.question,
            options: quiz.options?.map((opt: string, i: number) => ({
              id: `opt-${index}-${i}`,
              text: opt,
              isCorrect: i === quiz.correctIndex
            })) || [],
            xpReward: 25
          });
          break;
          
        case 'open-question':
          cards.push({
            type: 'open-question',
            title: `Réflexion ${index + 1}`,
            content: quiz.question,
            expectedAnswer: quiz.expectedAnswer || quiz.answer || '',
            xpReward: 30
          });
          break;
          
        case 'flashcard':
          cards.push({
            type: 'flashcard',
            title: `Mémorisation ${index + 1}`,
            content: quiz.question,
            flashcard_back: quiz.answer || quiz.expectedAnswer || '',
            xpReward: 20
          });
          break;
          
        case 'slider':
          cards.push({
            type: 'slider',
            title: `Estimation ${index + 1}`,
            content: quiz.question,
            slider_config: quiz.sliderConfig || { min: 0, max: 100, correct: 50, unit: '%' },
            xpReward: 20
          });
          break;
          
        default:
          // Fallback to quiz type
          cards.push({
            type: 'quiz',
            title: `Question ${index + 1}`,
            content: quiz.question,
            options: quiz.options?.map((opt: string, i: number) => ({
              id: `opt-${index}-${i}`,
              text: opt,
              isCorrect: i === quiz.correctIndex
            })) || [],
            xpReward: 25
          });
      }
    });

    const totalXP = cards.reduce((sum: number, card: any) => sum + (card.xpReward || 0), 0);

    // Calculate optimal duration based on card count
    const totalCards = cards.length;
    const cardsPerDay = Math.max(2, Math.ceil(dailyMinutes / 3)); // ~3 min per card
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

    console.log(`Course generated: "${result.title}" with ${cards.length} cards (${courseData.lessonSections.length} slides, ${courseData.quizQuestions.length} questions), duration: ${durationDays} days`);

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
