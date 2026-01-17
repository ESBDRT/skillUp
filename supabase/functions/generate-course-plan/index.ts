import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GenerateCoursePlanRequest {
  theme: string;
  dailyMinutes: number;
  level: 'beginner' | 'intermediate' | 'expert';
  durationDays: number;
  knownKeywords?: string[];
}

interface DayPlan {
  day: number;
  title: string;
  concepts: string[];
  estimatedMinutes: number;
}

const levelNames = {
  beginner: 'Notions',
  intermediate: 'Intermédiaire',
  expert: 'Expert'
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { theme, dailyMinutes, level, durationDays, knownKeywords }: GenerateCoursePlanRequest = await req.json();
    
    console.log(`Generating course plan: theme="${theme}", minutes=${dailyMinutes}, level=${level}, days=${durationDays}`);

    const FEATHERLESS_API_KEY = Deno.env.get('API');
    
    if (!FEATHERLESS_API_KEY) {
      throw new Error('API key is not configured');
    }

    const knownConceptsInstruction = knownKeywords && knownKeywords.length > 0
      ? `L'apprenant connaît déjà : ${knownKeywords.join(', ')}. Évite de répéter ces bases.`
      : '';

    const systemPrompt = `Tu es un expert pédagogue qui planifie des parcours d'apprentissage structurés.
Tu dois proposer un planning de cours réparti sur ${durationDays} jours, avec des concepts clairs à couvrir chaque jour.

Niveau : ${levelNames[level]}
${knownConceptsInstruction}

Le planning doit être progressif : 
- Commence par les bases (si niveau débutant)
- Progresse logiquement vers des concepts plus avancés
- Chaque jour doit avoir un thème cohérent avec 2-4 concepts`;

    const userPrompt = `Crée un planning de cours sur "${theme}" réparti sur ${durationDays} jours, avec ${dailyMinutes} minutes par jour.

Pour chaque jour, définis :
1. Un titre de session (accrocheur, max 40 caractères)
2. Les 2-4 concepts clés à couvrir
3. Une progression logique du jour 1 au jour ${durationDays}

Le planning doit couvrir tous les aspects essentiels du sujet de manière structurée.

RÉPONDS UNIQUEMENT avec un JSON valide dans ce format exact :
{
  "courseTitle": "Titre global du cours (max 60 caractères)",
  "courseDescription": "Description du parcours en 2-3 phrases",
  "category": "Science|Histoire|Psychologie|Finance|Santé|Art|Technologie|Langue|Sport|Cuisine|Autre",
  "icon": "📚",
  "days": [
    {"day": 1, "title": "Titre session jour 1", "concepts": ["Concept 1", "Concept 2"]},
    {"day": 2, "title": "Titre session jour 2", "concepts": ["Concept 3", "Concept 4"]}
  ],
  "totalConcepts": 4
}`;

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
        max_tokens: 2048
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
    console.log('AI Response received for course plan');

    let planData;
    const messageContent = aiResponse.choices?.[0]?.message?.content;
    
    if (messageContent) {
      try {
        const jsonMatch = messageContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          planData = JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        console.error('Failed to parse message content:', e);
      }
    }

    if (!planData || !planData.days) {
      throw new Error('Impossible de générer le planning. Veuillez réessayer.');
    }

    // Ensure proper structure
    const result = {
      courseTitle: planData.courseTitle || `Cours sur ${theme}`,
      courseDescription: planData.courseDescription || `Parcours d'apprentissage sur ${theme}`,
      category: planData.category || 'Autre',
      icon: planData.icon || '📚',
      level,
      dailyMinutes,
      durationDays,
      days: planData.days.map((day: any, index: number) => ({
        day: day.day || index + 1,
        title: day.title,
        concepts: day.concepts || [],
        estimatedMinutes: dailyMinutes
      })),
      totalConcepts: planData.totalConcepts || planData.days.reduce((sum: number, d: any) => sum + (d.concepts?.length || 0), 0)
    };

    console.log(`Course plan generated: "${result.courseTitle}" with ${result.days.length} days, ${result.totalConcepts} concepts`);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error generating course plan:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Erreur lors de la génération du planning' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
