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

    const FEATHERLESS_API_KEY = Deno.env.get('API2');
    
    if (!FEATHERLESS_API_KEY) {
      throw new Error('API2 key is not configured');
    }

    const knownConceptsInstruction = knownKeywords && knownKeywords.length > 0
      ? `L'apprenant connaît déjà : ${knownKeywords.join(', ')}. Évite de répéter ces bases.`
      : '';

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
            content: `Tu es un expert pédagogue. Crée un planning de cours sur "${theme}" réparti sur ${durationDays} jours.

Niveau : ${levelNames[level]}
${knownConceptsInstruction}

Pour chaque jour, définis un titre de session et 2-3 concepts clés.

Tu DOIS répondre UNIQUEMENT avec ce JSON, sans texte avant ou après :
{"courseTitle":"Titre du cours","courseDescription":"Description en 2-3 phrases","category":"Technologie","icon":"📚","days":[{"day":1,"title":"Session 1","concepts":["Concept A","Concept B"]},{"day":2,"title":"Session 2","concepts":["Concept C","Concept D"]}],"totalConcepts":4}`
          }
        ],
        max_tokens: 2048,
        temperature: 0.3
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
    const content = aiResponse.choices?.[0]?.message?.content || '';
    
    console.log('Raw AI response:', content.substring(0, 500));

    let planData;
    
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        planData = JSON.parse(jsonMatch[0]);
        console.log('Parsed with strategy 1 (JSON match)');
      } catch (e) {
        console.log('Strategy 1 failed:', e);
      }
    }
    
    if (!planData) {
      const codeBlockMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (codeBlockMatch) {
        try {
          planData = JSON.parse(codeBlockMatch[1].trim());
          console.log('Parsed with strategy 2 (code block)');
        } catch (e) {
          console.log('Strategy 2 failed:', e);
        }
      }
    }
    
    if (!planData) {
      try {
        planData = JSON.parse(content.trim());
        console.log('Parsed with strategy 3 (full content)');
      } catch (e) {
        console.log('Strategy 3 failed:', e);
      }
    }
    
    if (!planData || !planData.days) {
      console.log('All parsing strategies failed, using fallback plan');
      
      const days = [];
      const conceptsPerDay = ['Introduction', 'Fondamentaux', 'Applications', 'Pratique', 'Révision'];
      
      for (let i = 0; i < durationDays; i++) {
        days.push({
          day: i + 1,
          title: `${conceptsPerDay[i % conceptsPerDay.length]} - ${theme}`,
          concepts: [
            `Concept ${i * 2 + 1} de ${theme}`,
            `Concept ${i * 2 + 2} de ${theme}`
          ]
        });
      }
      
      planData = {
        courseTitle: `Cours sur ${theme}`,
        courseDescription: `Un parcours d'apprentissage complet sur ${theme}, adapté au niveau ${levelNames[level]}.`,
        category: 'Autre',
        icon: '📚',
        days: days,
        totalConcepts: durationDays * 2
      };
    }

    const result = {
      courseTitle: planData.courseTitle || `Cours sur ${theme}`,
      courseDescription: planData.courseDescription || `Parcours d'apprentissage sur ${theme}`,
      category: planData.category || 'Autre',
      icon: planData.icon || '📚',
      level,
      dailyMinutes,
      durationDays,
      days: (planData.days || []).map((day: any, index: number) => ({
        day: day.day || index + 1,
        title: day.title || `Session ${index + 1}`,
        concepts: Array.isArray(day.concepts) ? day.concepts : [],
        estimatedMinutes: dailyMinutes
      })),
      totalConcepts: planData.totalConcepts || planData.days?.reduce((sum: number, d: any) => sum + (d.concepts?.length || 0), 0) || 0
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
