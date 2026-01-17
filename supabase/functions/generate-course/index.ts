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

// Search for a relevant image using Perplexity
async function searchWebImage(query: string, perplexityKey: string): Promise<string | null> {
  try {
    console.log(`Searching image for: ${query.substring(0, 50)}...`);
    
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${perplexityKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [{
          role: 'user',
          content: `Find me a high-quality, free-to-use image URL for: "${query}". 
          Search on Unsplash (images.unsplash.com) or Pexels (images.pexels.com).
          Return ONLY the direct image URL starting with https://images.unsplash.com/ or https://images.pexels.com/, nothing else. No explanation, just the URL.`
        }]
      })
    });

    if (!response.ok) {
      console.error('Perplexity image search failed:', response.status);
      return null;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    
    // Extract URL from the response
    const urlMatch = content.match(/(https:\/\/images\.(unsplash|pexels)\.com\/[^\s"'<>]+)/i);
    if (urlMatch) {
      console.log('Image found:', urlMatch[1].substring(0, 60));
      return urlMatch[1];
    }
    
    // Fallback: try to extract any image URL
    const anyImageMatch = content.match(/(https:\/\/[^\s"'<>]+\.(jpg|jpeg|png|webp))/i);
    if (anyImageMatch) {
      console.log('Fallback image found:', anyImageMatch[1].substring(0, 60));
      return anyImageMatch[1];
    }
    
    return null;
  } catch (error) {
    console.error('Error searching image:', error);
    return null;
  }
}

// Search for learning resources using Perplexity
async function searchResources(theme: string, perplexityKey: string): Promise<any> {
  try {
    console.log(`Searching resources for: ${theme}`);
    
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${perplexityKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [{
          role: 'user',
          content: `Pour apprendre "${theme}", trouve-moi des ressources de qualité :
          - 2-3 vidéos YouTube (tutoriels, cours, documentaires)
          - 1-2 repos GitHub populaires et pertinents (si applicable au sujet)
          - 2-3 articles ou sites de référence

          IMPORTANT: Retourne UNIQUEMENT un JSON valide avec ce format exact, sans aucun texte avant ou après :
          {
            "youtube": [{"title": "titre exact de la vidéo", "url": "https://youtube.com/watch?v=...", "source": "nom de la chaîne"}],
            "github": [{"title": "nom-du-repo", "url": "https://github.com/...", "description": "courte description"}],
            "articles": [{"title": "titre de l'article", "url": "https://...", "source": "nom du site"}]
          }
          
          Les URLs doivent être de vraies URLs existantes et fonctionnelles.`
        }]
      })
    });

    if (!response.ok) {
      console.error('Perplexity resources search failed:', response.status);
      return { youtube: [], github: [], articles: [] };
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    
    // Try to extract JSON from the response
    try {
      // Find JSON in the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        console.log('Resources found:', {
          youtube: parsed.youtube?.length || 0,
          github: parsed.github?.length || 0,
          articles: parsed.articles?.length || 0
        });
        return {
          youtube: parsed.youtube || [],
          github: parsed.github || [],
          articles: parsed.articles || []
        };
      }
    } catch (parseError) {
      console.error('Failed to parse resources JSON:', parseError);
    }
    
    return { youtube: [], github: [], articles: [] };
  } catch (error) {
    console.error('Error searching resources:', error);
    return { youtube: [], github: [], articles: [] };
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
    const PERPLEXITY_API_KEY = Deno.env.get('PERPLEXITY_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }
    
    if (!PERPLEXITY_API_KEY) {
      throw new Error('PERPLEXITY_API_KEY is not configured');
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
   - Un mot-clé pour l'image (imageKeyword) : 2-3 mots décrivant une image pertinente
   
   Les sections doivent couvrir le sujet de manière progressive et complète.

2. QUIZ FINAL (type: "quiz") - ${quizQuestions} questions
   Questions pour valider les connaissances acquises dans le cours.

IMPORTANT :
- Le cours doit être RICHE et DÉTAILLÉ, pas des résumés courts
- Utilise des exemples concrets, des chiffres, des faits intéressants
- Les transitions entre sections doivent être fluides
- Chaque section doit approfondir un aspect différent du sujet
- Les imageKeyword doivent être simples : "sunset ocean", "brain neurons", "coffee beans"`;

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
                        imageKeyword: {
                          type: 'string',
                          description: 'Mot-clé simple pour rechercher une image (2-3 mots en anglais)'
                        }
                      },
                      required: ['title', 'content', 'imageKeyword']
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
    
    // Search for images and resources in parallel
    console.log('Searching images and resources via Perplexity...');
    
    const imagePromises = courseData.lessonSections.map((section: any) => 
      searchWebImage(section.imageKeyword || section.title, PERPLEXITY_API_KEY)
    );
    const resourcesPromise = searchResources(theme, PERPLEXITY_API_KEY);
    
    const [images, resources] = await Promise.all([
      Promise.all(imagePromises),
      resourcesPromise
    ]);

    // Build the lesson sections with web images
    const sections = courseData.lessonSections.map((section: any, index: number) => ({
      id: `section-${index}`,
      title: section.title,
      content: section.content,
      imageKeyword: section.imageKeyword,
      imageUrl: images[index] || null
    }));

    // Build the cards array
    const cards = [
      // Main lesson card with all sections and resources
      {
        type: 'lesson',
        title: courseData.title,
        content: courseData.description,
        sections: sections,
        resources: resources,
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

    console.log(`Course generated: "${result.title}" with ${sections.length} sections, ${courseData.quizQuestions.length} quiz questions, and resources`);

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