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
    
    console.log(`Generating course: theme="${theme}", minutes=${dailyMinutes}, level=${level}`);

    const FEATHERLESS_API_KEY = Deno.env.get('API');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || '';
    
    if (!FEATHERLESS_API_KEY) {
      throw new Error('API key is not configured');
    }

    const hasPlan = coursePlan && coursePlan.days && coursePlan.days.length > 0;
    const maxSlides = 5;
    const quizCount = 2;

    const response = await fetch('https://api.featherless.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${FEATHERLESS_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistralai/Mistral-7B-v0.1',
        messages: [
          {
            role: 'user',
            content: `Crée un cours éducatif sur "${theme}" avec ${maxSlides} slides et ${quizCount} quiz.
Niveau: ${levelNames[level]}

Tu DOIS répondre UNIQUEMENT avec ce JSON, sans texte avant ou après :
{"title":"Titre du cours","description":"Description courte","category":"Science","icon":"🔬","lessonSections":[{"title":"Slide 1","content":"Contenu de 100 mots avec des **mots en gras**. Explique le concept avec un exemple concret.","imageKeyword":"keyword english"}],"quizQuestions":[{"type":"quiz","question":"Question?","options":["Option A","Option B","Option C","Option D"],"correctIndex":0},{"type":"flashcard","question":"Concept?","answer":"Réponse détaillée de 50 mots"}]}`
          }
        ],
        max_tokens: 4096,
        temperature: 0.4
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
      
      throw new Error(`API error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content || '';
    
    console.log('Raw AI response:', content.substring(0, 500));

    let courseData;
    
    // Strategy 1: Direct JSON match
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        courseData = JSON.parse(jsonMatch[0]);
        console.log('Parsed with strategy 1');
      } catch (e) {
        console.log('Strategy 1 failed');
      }
    }
    
    // Strategy 2: Code block
    if (!courseData) {
      const codeBlockMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (codeBlockMatch) {
        try {
          courseData = JSON.parse(codeBlockMatch[1].trim());
          console.log('Parsed with strategy 2');
        } catch (e) {
          console.log('Strategy 2 failed');
        }
      }
    }
    
    // Fallback: Generate basic course
    if (!courseData || !courseData.lessonSections) {
      console.log('Using fallback course structure');
      courseData = {
        title: `Cours sur ${theme}`,
        description: `Découvrez les bases de ${theme} dans ce cours adapté au niveau ${levelNames[level]}.`,
        category: 'Autre',
        icon: '📚',
        lessonSections: [
          {
            title: `Introduction à ${theme}`,
            content: `**${theme}** est un sujet fascinant que nous allons explorer ensemble. Ce cours vous permettra de comprendre les concepts fondamentaux et de les appliquer dans des situations concrètes. Nous commencerons par les bases avant d'approfondir progressivement.`,
            imageKeyword: theme.split(' ')[0]
          },
          {
            title: 'Les concepts clés',
            content: `Pour bien comprendre **${theme}**, il faut maîtriser plusieurs concepts importants. Nous allons les découvrir un par un, avec des exemples pratiques pour faciliter l'apprentissage.`,
            imageKeyword: 'learning concept'
          },
          {
            title: 'Applications pratiques',
            content: `**${theme}** a de nombreuses applications dans la vie quotidienne. Comprendre ces applications vous aidera à mieux retenir les concepts théoriques et à les utiliser efficacement.`,
            imageKeyword: 'practice application'
          }
        ],
        quizQuestions: [
          {
            type: 'quiz',
            question: `Quel est l'objectif principal de l'étude de ${theme} ?`,
            options: [
              'Comprendre les concepts fondamentaux',
              'Mémoriser des formules',
              'Passer un examen',
              'Aucune réponse'
            ],
            correctIndex: 0
          },
          {
            type: 'flashcard',
            question: `Qu'est-ce que ${theme} ?`,
            answer: `${theme} est un domaine d'étude qui permet de comprendre des concepts importants et de les appliquer dans diverses situations pratiques.`
          }
        ]
      };
    }

    // Limit sections
    const limitedSections = (courseData.lessonSections || []).slice(0, maxSlides);
    console.log(`Processing ${limitedSections.length} slides`);

    // Build cards
    const cards: any[] = [];

    // Generate images
    const imagePromises = limitedSections.map((section: any) => {
      const keyword = section.imageKeyword || theme;
      return generateImage(keyword, theme, SUPABASE_URL, SUPABASE_ANON_KEY);
    });
    const imageUrls = await Promise.all(imagePromises);

    // Add info cards
    limitedSections.forEach((section: any, index: number) => {
      cards.push({
        type: 'info',
        title: section.title || `Slide ${index + 1}`,
        content: section.content || 'Contenu du cours.',
        image_url: imageUrls[index],
        xpReward: 15
      });
    });

    // Add quiz cards
    const limitedQuizzes = (courseData.quizQuestions || []).slice(0, quizCount);
    limitedQuizzes.forEach((quiz: any, index: number) => {
      if (quiz.type === 'quiz' && Array.isArray(quiz.options)) {
        const formattedOptions = quiz.options.map((opt: any, i: number) => ({
          id: `opt-${index}-${i}`,
          text: typeof opt === 'string' ? opt : opt.text || `Option ${i + 1}`,
          isCorrect: i === (quiz.correctIndex || 0)
        }));
        
        cards.push({
          type: 'quiz',
          title: `Question ${index + 1}`,
          content: quiz.question,
          options: formattedOptions,
          xpReward: 25
        });
      } else {
        cards.push({
          type: 'flashcard',
          title: `Mémorisation ${index + 1}`,
          content: quiz.question,
          flashcard_back: quiz.answer || 'Réponse à découvrir.',
          xpReward: 20
        });
      }
    });

    const totalXP = cards.reduce((sum: number, card: any) => sum + (card.xpReward || 0), 0);

    const result = {
      title: courseData.title || `Cours sur ${theme}`,
      description: courseData.description || `Cours sur ${theme}`,
      category: courseData.category || 'Autre',
      icon: courseData.icon || '📚',
      level: level,
      estimated_minutes: dailyMinutes,
      total_xp: totalXP,
      duration_days: 1,
      daily_cards_count: cards.length,
      cards: cards
    };

    console.log(`Course generated: "${result.title}" with ${cards.length} cards`);

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
