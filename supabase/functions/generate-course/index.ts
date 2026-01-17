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

// Generate image using Lovable AI
async function generateImage(prompt: string, apiKey: string): Promise<string | null> {
  try {
    console.log(`Generating image for: ${prompt.substring(0, 50)}...`);
    
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image-preview',
        messages: [
          {
            role: 'user',
            content: `Create a clean, educational illustration for a course: ${prompt}. Style: modern, minimalist, professional, suitable for educational content. No text in the image.`
          }
        ],
        modalities: ['image', 'text']
      })
    });

    if (!response.ok) {
      console.error('Image generation failed:', response.status);
      return null;
    }

    const data = await response.json();
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    if (imageUrl) {
      console.log('Image generated successfully');
      return imageUrl;
    }
    
    return null;
  } catch (error) {
    console.error('Error generating image:', error);
    return null;
  }
}

serve(async (req) => {
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
    const sectionCount = dailyMinutes <= 5 ? 3 : dailyMinutes <= 10 ? 4 : dailyMinutes <= 15 ? 5 : 6;
    const quizQuestions = Math.max(2, Math.floor(dailyMinutes / 5));

    const systemPrompt = `Tu es un expert pédagogue qui crée des cours éducatifs de haute qualité, similaires à des documents PDF professionnels.

Niveau de difficulté : ${levelNames[level]}
${levelInstructions[level]}

Tu dois créer un VRAI COURS structuré comme un document professionnel :
- Titre principal du cours
- Sections avec sous-titres clairs
- Paragraphes riches et détaillés (4-6 phrases par paragraphe)
- Exemples concrets et chiffres
- Transitions fluides entre les sections

Le contenu doit être en français, éducatif, engageant et approfondi.`;

    const userPrompt = `Crée un cours complet et professionnel sur : "${theme}"

STRUCTURE DU COURS (comme un PDF/document) :

1. PARTIE PRINCIPALE - LE COURS (type: "lesson")
   Une seule carte "lesson" contenant ${sectionCount} SECTIONS, chaque section avec :
   - Un titre de section clair
   - Un contenu riche de 2-3 paragraphes (chaque paragraphe = 4-6 phrases)
   - Une description d'image pour illustrer (imagePrompt)
   
   Les sections doivent couvrir le sujet de manière progressive et complète.

2. QUIZ FINAL (type: "quiz") - ${quizQuestions} questions
   Questions pour valider les connaissances acquises dans le cours.

IMPORTANT :
- Le cours doit être RICHE et DÉTAILLÉ, pas des résumés courts
- Utilise des exemples concrets, des chiffres, des faits intéressants
- Les transitions entre sections doivent être fluides
- Chaque section doit approfondir un aspect différent du sujet
- Les imagePrompt doivent décrire des schémas/illustrations éducatives pertinentes`;

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
              description: 'Crée un cours éducatif structuré comme un document PDF',
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
                    description: 'Les sections du cours principal',
                    items: {
                      type: 'object',
                      properties: {
                        title: {
                          type: 'string',
                          description: 'Titre de la section'
                        },
                        content: {
                          type: 'string',
                          description: 'Contenu détaillé de la section (2-3 paragraphes, chaque paragraphe séparé par deux retours à la ligne)'
                        },
                        imagePrompt: {
                          type: 'string',
                          description: 'Description de l\'image/schéma à générer pour illustrer cette section'
                        }
                      },
                      required: ['title', 'content', 'imagePrompt']
                    }
                  },
                  quizQuestions: {
                    type: 'array',
                    description: 'Questions de quiz pour valider les connaissances',
                    items: {
                      type: 'object',
                      properties: {
                        question: {
                          type: 'string',
                          description: 'La question du quiz'
                        },
                        options: {
                          type: 'array',
                          items: { type: 'string' },
                          description: '4 options de réponse'
                        },
                        correctIndex: {
                          type: 'number',
                          description: 'Index de la bonne réponse (0-3)'
                        }
                      },
                      required: ['question', 'options', 'correctIndex']
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

    const toolCall = aiResponse.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall || toolCall.function.name !== 'create_course') {
      throw new Error('Invalid AI response format');
    }

    const courseData = JSON.parse(toolCall.function.arguments);
    
    // Generate images for each section (in parallel for speed)
    console.log('Generating images for sections...');
    const imagePromises = courseData.lessonSections.map((section: any) => 
      generateImage(section.imagePrompt, LOVABLE_API_KEY)
    );
    const images = await Promise.all(imagePromises);

    // Build the lesson sections with generated images
    const sections = courseData.lessonSections.map((section: any, index: number) => ({
      id: `section-${index}`,
      title: section.title,
      content: section.content,
      imagePrompt: section.imagePrompt,
      imageUrl: images[index] || null
    }));

    // Build the cards array
    const cards = [
      // Main lesson card with all sections
      {
        type: 'lesson',
        title: courseData.title,
        content: courseData.description,
        sections: sections,
        xpReward: 50
      },
      // Quiz cards
      ...courseData.quizQuestions.map((quiz: any, index: number) => ({
        type: 'quiz',
        title: `Quiz - Question ${index + 1}`,
        content: quiz.question,
        options: quiz.options,
        correctIndex: quiz.correctIndex,
        xpReward: 25
      }))
    ];

    const totalXP = cards.reduce((sum: number, card: any) => sum + (card.xpReward || 0), 0);

    const result = {
      title: courseData.title,
      description: courseData.description,
      category: courseData.category,
      icon: courseData.icon,
      level: level,
      estimated_minutes: dailyMinutes,
      total_xp: totalXP,
      cards: cards
    };

    console.log(`Course generated: "${result.title}" with ${sections.length} sections and ${courseData.quizQuestions.length} quiz questions`);

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
