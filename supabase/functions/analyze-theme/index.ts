import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalyzeThemeRequest {
  theme: string;
  level: 'beginner' | 'intermediate' | 'expert';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { theme, level }: AnalyzeThemeRequest = await req.json();
    
    console.log(`Analyzing theme: "${theme}" for level: ${level}`);

    const FEATHERLESS_API_KEY = Deno.env.get('API');
    
    if (!FEATHERLESS_API_KEY) {
      throw new Error('API key is not configured');
    }

    const levelDescriptions = {
      beginner: 'débutant complet, concepts de base',
      intermediate: 'connaissance de base, approfondissement',
      expert: 'maîtrise avancée, concepts complexes'
    };

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
            role: 'system',
            content: `Tu es un expert pédagogue. Tu analyses les thèmes de cours pour aider les apprenants.`
          },
          {
            role: 'user',
            content: `Analyse ce thème de cours : "${theme}"

Niveau demandé : ${level} (${levelDescriptions[level]})

TÂCHES :
1. Évalue si le thème est assez précis pour créer un bon cours
2. Génère 8-12 mots-clés/concepts que l'apprenant pourrait déjà connaître

RETOURNE UNIQUEMENT un JSON avec ce format exact :
{
  "isValid": true/false,
  "feedback": "Message court expliquant si le thème est bon ou comment l'améliorer",
  "suggestedTheme": "Si le thème est trop vague, suggestion plus précise (sinon null)",
  "keywords": [
    {"id": "1", "label": "Concept 1", "description": "Courte description"},
    {"id": "2", "label": "Concept 2", "description": "Courte description"}
  ]
}

RÈGLES pour isValid :
- true si le thème est spécifique et clair (ex: "La photosynthèse", "Les bases du Python", "La Révolution française")
- false si trop vague (ex: "Science", "Histoire", "Programmation") ou incompréhensible

RÈGLES pour keywords :
- Concepts adaptés au niveau ${level}
- Concepts que quelqu'un pourrait déjà connaître avant d'étudier ce sujet
- Variés : basiques et plus avancés selon le niveau`
          }
        ],
        max_tokens: 1024
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Featherless API error:', response.status, errorText);
      
      if (response.status === 402) {
        return new Response(JSON.stringify({ 
          error: 'Crédits API insuffisants.' 
        }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: 'Limite de requêtes atteinte. Réessayez dans quelques instants.' 
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      throw new Error(`API error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content || '';
    
    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid AI response format');
    }
    
    const analysis = JSON.parse(jsonMatch[0]);
    
    console.log(`Theme analysis complete: isValid=${analysis.isValid}, keywords=${analysis.keywords?.length || 0}`);

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error analyzing theme:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Erreur lors de l\'analyse du thème' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
