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
    const quizCount = 3;

    const response = await fetch('https://api.featherless.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${FEATHERLESS_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistralai/Mistral-Nemo-Instruct-2407',
        messages: [
          {
            role: 'user',
            content: `Crée un cours éducatif sur "${theme}" avec ${maxSlides} slides et ${quizCount} QCM (questions à choix multiples).
Niveau: ${levelNames[level]}

RÈGLES STRICTES :
1. Chaque slide a un TITRE DESCRIPTIF (jamais "Slide 1")
2. Chaque slide contient 150-200 mots avec des **mots en gras**
3. UNIQUEMENT des QCM avec EXACTEMENT 4 propositions de réponses
4. INTERDIT : questions ouvertes, flashcards, vrai/faux simple
5. Chaque QCM a "options" (tableau de 4 strings) et "correctIndex" (0-3)

Réponds UNIQUEMENT avec ce JSON :
{"title":"Titre","description":"Description","category":"Catégorie","icon":"emoji","lessonSections":[{"title":"Titre descriptif","content":"Contenu riche 150-200 mots avec **mots en gras**","imageKeyword":"mot-clé anglais"}],"quizQuestions":[{"question":"Question ?","options":["Réponse A","Réponse B","Réponse C","Réponse D"],"correctIndex":0}]}`
          }
        ],
        max_tokens: 4096,
        temperature: 0.5
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
    
    // Fallback: Generate basic course with descriptive titles
    if (!courseData || !courseData.lessonSections) {
      console.log('Using fallback course structure');
      courseData = {
        title: `Cours sur ${theme}`,
        description: `Découvrez les bases de ${theme} dans ce cours adapté au niveau ${levelNames[level]}.`,
        category: 'Autre',
        icon: '📚',
        lessonSections: [
          {
            title: `Introduction et fondamentaux de ${theme}`,
            content: `**${theme}** est un sujet fascinant que nous allons explorer ensemble dans ce cours complet. Ce premier module vous permettra de comprendre les **concepts fondamentaux** et de les appliquer dans des situations concrètes de la vie quotidienne. Nous commencerons par les bases essentielles avant d'approfondir progressivement votre compréhension. L'objectif est de vous donner une vision claire et structurée du sujet, avec des exemples pratiques qui vous aideront à mieux retenir les informations. À la fin de ce module, vous aurez acquis les connaissances de base nécessaires pour aborder les concepts plus avancés.`,
            imageKeyword: theme.split(' ')[0]
          },
          {
            title: `Les concepts clés à maîtriser`,
            content: `Pour bien comprendre **${theme}**, il est essentiel de maîtriser plusieurs **concepts importants** qui forment la base de ce domaine. Dans cette section, nous allons découvrir ces concepts un par un, avec des exemples pratiques et des explications détaillées pour faciliter votre apprentissage. Chaque notion sera présentée de manière progressive, en partant du plus simple vers le plus complexe. Vous découvrirez comment ces concepts s'articulent entre eux et pourquoi ils sont fondamentaux pour une bonne compréhension du sujet. Des analogies concrètes vous aideront à visualiser et mémoriser ces notions essentielles.`,
            imageKeyword: 'learning concept'
          },
          {
            title: `Applications pratiques et exemples concrets`,
            content: `**${theme}** a de nombreuses **applications dans la vie quotidienne** que vous ne soupçonnez peut-être pas. Dans cette section, nous explorerons comment les concepts théoriques se traduisent en situations réelles et pratiques. Comprendre ces applications vous aidera non seulement à mieux retenir les notions apprises, mais aussi à les utiliser efficacement dans votre quotidien. Nous verrons des exemples variés issus de différents domaines, ce qui vous permettra de constater l'étendue et l'importance de ce sujet. Ces applications concrètes rendront votre apprentissage plus significatif et mémorable.`,
            imageKeyword: 'practice application'
          }
        ],
        quizQuestions: [
          {
            type: 'quiz',
            question: `Quel est l'objectif principal de l'étude de ${theme} ?`,
            options: [
              'Comprendre les concepts fondamentaux et leurs applications',
              'Mémoriser des formules sans les comprendre',
              'Simplement passer un examen',
              'Aucun objectif particulier'
            ],
            correctIndex: 0
          },
          {
            type: 'quiz',
            question: `Quelle approche est recommandée pour bien apprendre ${theme} ?`,
            options: [
              'Partir des bases vers les concepts avancés progressivement',
              'Commencer directement par les notions les plus complexes',
              'Ignorer les exemples pratiques',
              'Ne pas chercher à comprendre les liens entre concepts'
            ],
            correctIndex: 0
          },
          {
            type: 'quiz',
            question: `Pourquoi les applications pratiques sont-elles importantes dans l'apprentissage de ${theme} ?`,
            options: [
              'Elles aident à mieux retenir et utiliser les concepts',
              'Elles ne servent à rien',
              'Elles compliquent l\'apprentissage',
              'Elles sont réservées aux experts uniquement'
            ],
            correctIndex: 0
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
      const keyword = section.imageKeyword || section.title || theme;
      return generateImage(keyword, theme, SUPABASE_URL, SUPABASE_ANON_KEY);
    });
    const imageUrls = await Promise.all(imagePromises);

    // Add info cards with descriptive titles
    limitedSections.forEach((section: any, index: number) => {
      // Ensure title is descriptive, not generic
      let title = section.title || `Partie ${index + 1}: ${theme}`;
      if (title.toLowerCase().includes('slide')) {
        title = section.content?.substring(0, 50).split('.')[0] || `Concept ${index + 1} de ${theme}`;
      }
      
      cards.push({
        type: 'info',
        title: title,
        content: section.content || 'Contenu du cours.',
        image_url: imageUrls[index],
        xpReward: 15
      });
    });

    // Add ONLY QCM quiz cards
    const limitedQuizzes = (courseData.quizQuestions || []).slice(0, quizCount);
    limitedQuizzes.forEach((quiz: any, index: number) => {
      // Force all quizzes to be QCM type
      if (Array.isArray(quiz.options) && quiz.options.length >= 2) {
        const formattedOptions = quiz.options.map((opt: any, i: number) => ({
          id: `opt-${index}-${i}`,
          text: typeof opt === 'string' ? opt : opt.text || `Option ${i + 1}`,
          isCorrect: i === (quiz.correctIndex || 0)
        }));
        
        cards.push({
          type: 'quiz',
          title: `Quiz ${index + 1}`,
          content: quiz.question,
          options: formattedOptions,
          xpReward: 25
        });
      } else {
        // Convert to QCM if not properly formatted
        cards.push({
          type: 'quiz',
          title: `Quiz ${index + 1}`,
          content: quiz.question || `Question sur ${theme}`,
          options: [
            { id: `opt-${index}-0`, text: 'Vrai', isCorrect: true },
            { id: `opt-${index}-1`, text: 'Faux', isCorrect: false },
            { id: `opt-${index}-2`, text: 'Partiellement vrai', isCorrect: false },
            { id: `opt-${index}-3`, text: 'Aucune de ces réponses', isCorrect: false }
          ],
          xpReward: 25
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
