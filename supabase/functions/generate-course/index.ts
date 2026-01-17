import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GenerateCourseRequest {
  theme: string;
  dailyMinutes: number;
  level: 'beginner' | 'intermediate' | 'expert';
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

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { theme, dailyMinutes, level }: GenerateCourseRequest = await req.json();
    
    console.log(`Generating course: theme="${theme}", minutes=${dailyMinutes}, level=${level}`);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Calculate number of cards based on daily minutes
    // Assuming ~1 minute per card on average
    const cardCount = Math.max(5, Math.min(20, dailyMinutes));
    
    // Determine card distribution
    const infoCards = Math.floor(cardCount * 0.5);
    const quizCards = Math.floor(cardCount * 0.25);
    const flashcardCards = Math.floor(cardCount * 0.15);
    const sliderCards = Math.max(1, cardCount - infoCards - quizCards - flashcardCards);

    const systemPrompt = `Tu es un expert pédagogue spécialisé dans la création de micro-cours éducatifs gamifiés. 
Tu crées des cours engageants avec des cartes variées pour un apprentissage efficace.

Niveau de difficulté : ${levelNames[level]}
${levelInstructions[level]}

IMPORTANT:
- Le contenu doit être en français
- Chaque carte doit être concise mais informative
- Les quiz doivent avoir exactement 4 options avec une seule bonne réponse
- Les flashcards doivent avoir une question courte au recto et une réponse claire au verso
- Les sliders doivent utiliser une échelle numérique cohérente
- Le contenu doit être factuel et éducatif`;

    const userPrompt = `Crée un cours complet sur le thème suivant : "${theme}"

Le cours doit contenir exactement ${cardCount} cartes avec cette répartition :
- ${infoCards} cartes d'information (type: "info")
- ${quizCards} cartes de quiz à choix multiples (type: "quiz")
- ${flashcardCards} cartes mémoire/flashcard (type: "flashcard")
- ${sliderCards} cartes avec slider numérique (type: "slider")

Pour chaque type de carte :
- INFO : Texte explicatif de 2-4 phrases, peut inclure des émojis pour illustrer
- QUIZ : Question + 4 options dont une seule correcte (correctIndex: 0-3)
- FLASHCARD : Question/terme au recto, explication au verso
- SLIDER : Question avec réponse numérique, min/max/correct/unit`;

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
              description: 'Crée un cours éducatif complet avec ses cartes',
              parameters: {
                type: 'object',
                properties: {
                  title: {
                    type: 'string',
                    description: 'Titre accrocheur du cours (max 50 caractères)'
                  },
                  description: {
                    type: 'string',
                    description: 'Description courte du cours (1-2 phrases)'
                  },
                  category: {
                    type: 'string',
                    description: 'Catégorie du cours (ex: Science, Histoire, Psychologie, Finance, Santé, Art, Technologie)'
                  },
                  icon: {
                    type: 'string',
                    description: 'Emoji représentant le cours (un seul emoji)'
                  },
                  cards: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        type: {
                          type: 'string',
                          enum: ['info', 'quiz', 'flashcard', 'slider']
                        },
                        title: {
                          type: 'string',
                          description: 'Titre court de la carte'
                        },
                        content: {
                          type: 'string',
                          description: 'Contenu principal de la carte'
                        },
                        options: {
                          type: 'array',
                          items: { type: 'string' },
                          description: 'Options pour les quiz (4 options)'
                        },
                        correctIndex: {
                          type: 'number',
                          description: 'Index de la bonne réponse (0-3) pour les quiz'
                        },
                        flashcardBack: {
                          type: 'string',
                          description: 'Verso de la flashcard'
                        },
                        sliderConfig: {
                          type: 'object',
                          properties: {
                            min: { type: 'number' },
                            max: { type: 'number' },
                            correct: { type: 'number' },
                            unit: { type: 'string' }
                          }
                        },
                        xpReward: {
                          type: 'number',
                          description: 'Points XP (10 pour info, 15 pour quiz/flashcard, 20 pour slider)'
                        }
                      },
                      required: ['type', 'title', 'content', 'xpReward']
                    }
                  }
                },
                required: ['title', 'description', 'category', 'icon', 'cards']
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
    console.log('AI Response received:', JSON.stringify(aiResponse).substring(0, 500));

    // Extract the tool call result
    const toolCall = aiResponse.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall || toolCall.function.name !== 'create_course') {
      throw new Error('Invalid AI response format');
    }

    const courseData = JSON.parse(toolCall.function.arguments);
    
    // Add level and estimated_minutes
    courseData.level = level;
    courseData.estimated_minutes = dailyMinutes;
    courseData.total_xp = courseData.cards.reduce((sum: number, card: any) => sum + (card.xpReward || 10), 0);

    console.log(`Course generated: "${courseData.title}" with ${courseData.cards.length} cards`);

    return new Response(JSON.stringify(courseData), {
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
