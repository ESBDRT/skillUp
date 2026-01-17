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

    // Calculate structure based on daily minutes
    // More content sections for longer courses
    const contentSections = dailyMinutes <= 5 ? 2 : dailyMinutes <= 10 ? 3 : dailyMinutes <= 15 ? 4 : 5;
    const quizQuestions = Math.max(2, Math.floor(dailyMinutes / 4));
    const flashcards = Math.max(1, Math.floor(dailyMinutes / 5));

    const systemPrompt = `Tu es un expert pédagogue spécialisé dans la création de cours éducatifs approfondis. 
Tu crées des cours avec du contenu riche et détaillé, suivis d'exercices pour valider les connaissances.

Niveau de difficulté : ${levelNames[level]}
${levelInstructions[level]}

STRUCTURE OBLIGATOIRE DU COURS :
1. D'ABORD : Toutes les cartes d'INFORMATION (contenu éducatif approfondi)
2. ENSUITE : Les FLASHCARDS pour mémoriser les points clés
3. ENFIN : Les QUIZ pour valider les connaissances

IMPORTANT POUR LES CARTES D'INFORMATION :
- Chaque carte info doit contenir un PARAGRAPHE COMPLET de 4-8 phrases
- Le contenu doit être riche, détaillé et éducatif
- Inclus des exemples concrets, des chiffres, des faits intéressants
- Utilise des émojis pour structurer et illustrer le contenu
- Chaque carte doit couvrir UN aspect spécifique du sujet en profondeur
- Le tout doit former une leçon cohérente quand lu dans l'ordre

IMPORTANT :
- Le contenu doit être en français
- Les quiz doivent avoir exactement 4 options avec une seule bonne réponse
- Les flashcards doivent avoir un terme/concept au recto et une définition claire au verso
- Les quiz doivent tester ce qui a été enseigné dans les cartes info`;

    const userPrompt = `Crée un cours COMPLET et APPROFONDI sur le thème : "${theme}"

STRUCTURE EXACTE À SUIVRE :
1. ${contentSections} CARTES D'INFORMATION (type: "info") - C'est le cœur du cours !
   Chaque carte doit contenir un paragraphe riche de 4-8 phrases expliquant en détail un aspect du sujet.
   
2. ${flashcards} FLASHCARDS (type: "flashcard") - Pour mémoriser les concepts clés

3. ${quizQuestions} QUIZ (type: "quiz") - Pour valider les connaissances acquises

ORDRE OBLIGATOIRE : Toutes les infos d'abord, puis les flashcards, puis les quiz.

Exemple de contenu info de qualité :
"Le sommeil paradoxal, aussi appelé REM (Rapid Eye Movement), représente environ 20-25% de notre temps de sommeil total. 🧠 Durant cette phase, notre cerveau est extrêmement actif - presque autant qu'en état d'éveil ! C'est pendant le sommeil paradoxal que nous rêvons le plus intensément. Les scientifiques ont découvert que cette phase est cruciale pour la consolidation de la mémoire et l'apprentissage. 💡 Fait fascinant : nos muscles sont temporairement paralysés pendant le REM pour nous empêcher d'agir nos rêves."

Crée un cours de ce niveau de qualité sur "${theme}".`;

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
                          enum: ['info', 'quiz', 'flashcard']
                        },
                        title: {
                          type: 'string',
                          description: 'Titre court de la carte'
                        },
                        content: {
                          type: 'string',
                          description: 'Contenu principal de la carte. Pour les cartes INFO: paragraphe riche de 4-8 phrases. Pour les QUIZ: la question.'
                        },
                        options: {
                          type: 'array',
                          items: { type: 'string' },
                          description: 'Options pour les quiz (4 options exactement)'
                        },
                        correctIndex: {
                          type: 'number',
                          description: 'Index de la bonne réponse (0-3) pour les quiz'
                        },
                        flashcardBack: {
                          type: 'string',
                          description: 'Verso de la flashcard avec la définition/explication'
                        },
                        xpReward: {
                          type: 'number',
                          description: 'Points XP (15 pour info, 20 pour flashcard, 25 pour quiz)'
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
