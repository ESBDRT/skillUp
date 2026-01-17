import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GenerateCourseRequest {
  theme: string;
  dailyMinutes: number;
  level: 'beginner' | 'intermediate' | 'expert';
  knownKeywords?: string[];
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

// Search for relevant image using Perplexity
async function searchImageWithPerplexity(keyword: string, apiKey: string): Promise<string | null> {
  try {
    console.log(`Searching image for: ${keyword}`);
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [{
          role: 'user',
          content: `Find ONE high-quality, royalty-free image URL for: "${keyword}". 
Return ONLY the direct image URL (ending in .jpg, .png, .webp), nothing else. 
Prefer Unsplash, Pexels, or Pixabay images. The URL must be a direct link to the image file.`
        }]
      })
    });

    if (!response.ok) {
      console.error('Perplexity API error:', response.status);
      return null;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    
    // Extract URL from response
    const urlMatch = content.match(/https?:\/\/[^\s"'<>]+\.(jpg|jpeg|png|webp|gif)[^\s"'<>]*/i);
    if (urlMatch) {
      console.log(`Found image URL: ${urlMatch[0]}`);
      return urlMatch[0];
    }
    
    return null;
  } catch (error) {
    console.error('Error searching image with Perplexity:', error);
    return null;
  }
}

// Fallback: Get image from Unsplash collections
function getUnsplashFallback(keyword: string, index: number): string {
  // Use Unsplash Source API with keywords
  const keywords = encodeURIComponent(keyword.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, ''));
  return `https://source.unsplash.com/800x600/?${keywords}&sig=${index}`;
}

// Get themed image - try Perplexity first, fallback to Unsplash
async function getThemedImage(keyword: string, index: number, perplexityKey: string | undefined): Promise<string> {
  if (perplexityKey) {
    const perplexityImage = await searchImageWithPerplexity(keyword, perplexityKey);
    if (perplexityImage) {
      return perplexityImage;
    }
  }
  
  // Fallback to Unsplash
  return getUnsplashFallback(keyword, index);
}

// Ensure varied question types in the generated quiz
function ensureVariedQuestionTypes(questions: any[]): any[] {
  if (!questions || questions.length === 0) return questions;
  
  const typeCount: Record<string, number> = {
    'quiz': 0,
    'open-question': 0,
    'flashcard': 0,
    'slider': 0
  };
  
  // Count existing types
  questions.forEach(q => {
    const type = q.type || 'quiz';
    typeCount[type] = (typeCount[type] || 0) + 1;
  });
  
  console.log('Question type distribution:', typeCount);
  
  // If all questions are quiz type and we have at least 3, convert some
  if (typeCount['quiz'] === questions.length && questions.length >= 3) {
    console.log('All questions are quiz type, converting for variety...');
    
    // Convert 2nd question to open-question
    if (questions[1]) {
      const correctAnswer = questions[1].options?.[questions[1].correctIndex] || 'Réponse attendue';
      questions[1] = {
        type: 'open-question',
        question: questions[1].question,
        expectedAnswer: `${correctAnswer}. Expliquez votre raisonnement en développant les points clés.`
      };
    }
    
    // Convert 3rd question to flashcard
    if (questions[2]) {
      const answer = questions[2].options?.[questions[2].correctIndex] || 'Définition';
      questions[2] = {
        type: 'flashcard',
        question: questions[2].question,
        answer: answer
      };
    }
    
    // Convert 4th question to slider if exists
    if (questions[3] && questions[3].options) {
      // Try to create a meaningful slider from the question
      questions[3] = {
        type: 'slider',
        question: `Estimez l'importance de : ${questions[3].question.replace('?', '')}`,
        sliderConfig: {
          min: 0,
          max: 100,
          correct: 75,
          unit: '%',
          description: 'Déplacez le curseur pour donner votre estimation'
        }
      };
    }
  }
  
  return questions;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { theme, dailyMinutes, level, knownKeywords }: GenerateCourseRequest = await req.json();
    
    console.log(`Generating course: theme="${theme}", minutes=${dailyMinutes}, level=${level}, knownKeywords=${knownKeywords?.length || 0}`);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const PERPLEXITY_API_KEY = Deno.env.get('PERPLEXITY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }
    
    if (PERPLEXITY_API_KEY) {
      console.log('Perplexity API key available for image search');
    } else {
      console.log('Perplexity API key not found, using Unsplash fallback');
    }

    // Calculate structure based on daily minutes
    const sectionCount = dailyMinutes <= 5 ? 4 : dailyMinutes <= 10 ? 6 : dailyMinutes <= 15 ? 8 : 10;
    const quizCount = Math.max(4, Math.floor(dailyMinutes / 2.5)); // More questions for variety

    const knownConceptsInstruction = knownKeywords && knownKeywords.length > 0
      ? `\n\nIMPORTANT - ADAPTATION AU NIVEAU DE L'APPRENANT :
L'apprenant a indiqué qu'il connaît déjà ces concepts : ${knownKeywords.join(', ')}.
- NE PAS répéter les bases de ces concepts, l'apprenant les maîtrise déjà
- Mentionner brièvement ces concepts si nécessaire, mais aller plus loin
- Se concentrer sur les aspects avancés et les connexions avec d'autres concepts
- Proposer des nuances et des approfondissements sur ces sujets`
      : '';

    const systemPrompt = `Tu es un expert pédagogue qui crée des cours éducatifs de haute qualité, structurés comme des présentations modernes type slides.

Niveau de difficulté : ${levelNames[level]}
${levelInstructions[level]}${knownConceptsInstruction}

Tu dois créer un VRAI COURS structuré en SLIDES INDIVIDUELLES :
- Chaque section = 1 slide séparée avec un concept clair
- Contenu concis mais riche (3-5 phrases par slide max)
- Progression logique entre les slides
- VARIÉTÉ OBLIGATOIRE dans les types de tests

RÈGLE CRITIQUE : Tu DOIS utiliser TOUS les types de questions demandés, pas seulement des QCM !

Le contenu doit être en français, éducatif, engageant et bien structuré.`;

    const userPrompt = `Crée un cours en ${sectionCount} SLIDES sur : "${theme}"

STRUCTURE DU COURS EN SLIDES :

1. SLIDES DE CONTENU (${sectionCount} slides) :
   Chaque slide contient UN concept clé avec :
   - title: Titre court et accrocheur (max 50 caractères)
   - content: Explication claire (3-5 phrases, ~100 mots max)
   - imageKeyword: 2-3 mots anglais pour l'image (ex: "brain neurons", "coffee beans")

2. TESTS VARIÉS - EXACTEMENT ${quizCount} QUESTIONS avec ces types OBLIGATOIRES :

   ⚠️ DISTRIBUTION IMPOSÉE :
   - 2 questions de type "quiz" (QCM classique)
   - 1 question de type "open-question" (réponse argumentée)
   - 1 question de type "flashcard" (carte mémoire)
   - ${quizCount - 4 > 0 ? `${quizCount - 4} question(s) supplémentaire(s) (slider ou quiz)` : ''}

   FORMATS EXACTS :
   
   a) type "quiz" (QCM) :
      { "type": "quiz", "question": "...", "options": ["A", "B", "C", "D"], "correctIndex": 0 }
   
   b) type "open-question" (réflexion) :
      { "type": "open-question", "question": "Expliquez en détail...", "expectedAnswer": "Réponse type en 2-3 phrases développées" }
   
   c) type "flashcard" (mémorisation) :
      { "type": "flashcard", "question": "Qu'est-ce que [concept] ?", "answer": "Définition complète du concept" }
   
   d) type "slider" (estimation numérique) :
      { "type": "slider", "question": "Quel pourcentage/nombre pour...?", "sliderConfig": { "min": 0, "max": 100, "correct": 42, "unit": "%" } }

⚠️ ATTENTION : NE PAS générer uniquement des QCM ! La variété des types est OBLIGATOIRE.
Les imageKeyword doivent être simples et en anglais (2-3 mots max).`;

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
              description: 'Crée un cours éducatif structuré en slides avec tests variés (quiz, open-question, flashcard, slider)',
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
                    description: 'Questions de test - DOIT inclure: 2 quiz, 1 open-question, 1 flashcard minimum',
                    items: {
                      type: 'object',
                      properties: {
                        type: {
                          type: 'string',
                          enum: ['quiz', 'open-question', 'flashcard', 'slider'],
                          description: 'Type de question - VARIER les types!'
                        },
                        question: {
                          type: 'string',
                          description: 'La question ou le concept'
                        },
                        options: {
                          type: 'array',
                          items: { type: 'string' },
                          description: 'Options pour QCM (4 choix) - uniquement pour type quiz'
                        },
                        correctIndex: {
                          type: 'number',
                          description: 'Index de la bonne réponse pour QCM (0-3) - uniquement pour type quiz'
                        },
                        answer: {
                          type: 'string',
                          description: 'Réponse pour flashcard - uniquement pour type flashcard'
                        },
                        expectedAnswer: {
                          type: 'string',
                          description: 'Réponse attendue développée - uniquement pour type open-question'
                        },
                        sliderConfig: {
                          type: 'object',
                          properties: {
                            min: { type: 'number' },
                            max: { type: 'number' },
                            correct: { type: 'number' },
                            unit: { type: 'string' }
                          },
                          description: 'Configuration pour slider - uniquement pour type slider'
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
    {"type": "quiz", "question": "Question 2?", "options": ["A", "B", "C", "D"], "correctIndex": 1},
    {"type": "open-question", "question": "Question ouverte?", "expectedAnswer": "Réponse attendue développée"},
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

    // Ensure varied question types
    courseData.quizQuestions = ensureVariedQuestionTypes(courseData.quizQuestions);

    // Build the cards array - EACH SECTION IS A SEPARATE CARD (SLIDE)
    const cards: any[] = [];
    const totalSlides = courseData.lessonSections.length;

    // Each section becomes a separate "info" card (slide)
    // Process images in parallel for better performance
    const imagePromises = courseData.lessonSections.map((section: any, index: number) =>
      getThemedImage(section.imageKeyword || theme, index, PERPLEXITY_API_KEY)
    );
    
    const imageUrls = await Promise.all(imagePromises);

    courseData.lessonSections.forEach((section: any, index: number) => {
      cards.push({
        type: 'info',
        title: section.title,
        content: section.content,
        image_url: imageUrls[index],
        slideNumber: index + 1,
        totalSlides: totalSlides,
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
      error: error instanceof Error ? error.message : 'Une erreur est survenue lors de la génération du cours' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
