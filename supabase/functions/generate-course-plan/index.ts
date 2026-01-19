import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation constants
const MAX_THEME_LENGTH = 200;
const MAX_DAILY_MINUTES = 120;
const MIN_DAILY_MINUTES = 5;
const MAX_DURATION_DAYS = 365;
const MIN_DURATION_DAYS = 1;
const VALID_LEVELS = ['beginner', 'intermediate', 'expert'] as const;
const MAX_KEYWORDS = 50;

interface GenerateCoursePlanRequest {
  theme: string;
  dailyMinutes: number;
  level: 'beginner' | 'intermediate' | 'expert';
  durationDays: number;
  knownKeywords?: string[];
}

// Sanitize string input
function sanitizeString(input: unknown, maxLength: number): string {
  if (typeof input !== 'string') return '';
  return input.trim().slice(0, maxLength).replace(/[<>]/g, '');
}

// Validate request input
function validateRequest(body: unknown): { valid: true; data: GenerateCoursePlanRequest } | { valid: false; error: string } {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Invalid request body' };
  }

  const { theme, dailyMinutes, level, durationDays, knownKeywords } = body as Record<string, unknown>;

  // Validate theme
  if (!theme || typeof theme !== 'string' || theme.trim().length === 0) {
    return { valid: false, error: 'Theme is required' };
  }
  if (theme.length > MAX_THEME_LENGTH) {
    return { valid: false, error: `Theme must be less than ${MAX_THEME_LENGTH} characters` };
  }

  // Validate dailyMinutes
  const minutes = Number(dailyMinutes);
  if (isNaN(minutes) || minutes < MIN_DAILY_MINUTES || minutes > MAX_DAILY_MINUTES) {
    return { valid: false, error: `Daily minutes must be between ${MIN_DAILY_MINUTES} and ${MAX_DAILY_MINUTES}` };
  }

  // Validate durationDays
  const days = Number(durationDays);
  if (isNaN(days) || days < MIN_DURATION_DAYS || days > MAX_DURATION_DAYS) {
    return { valid: false, error: `Duration must be between ${MIN_DURATION_DAYS} and ${MAX_DURATION_DAYS} days` };
  }

  // Validate level
  if (!level || !VALID_LEVELS.includes(level as typeof VALID_LEVELS[number])) {
    return { valid: false, error: `Level must be one of: ${VALID_LEVELS.join(', ')}` };
  }

  // Validate knownKeywords if provided
  if (knownKeywords !== undefined) {
    if (!Array.isArray(knownKeywords)) {
      return { valid: false, error: 'knownKeywords must be an array' };
    }
    if (knownKeywords.length > MAX_KEYWORDS) {
      return { valid: false, error: `Maximum ${MAX_KEYWORDS} keywords allowed` };
    }
  }

  return {
    valid: true,
    data: {
      theme: sanitizeString(theme, MAX_THEME_LENGTH),
      dailyMinutes: minutes,
      level: level as 'beginner' | 'intermediate' | 'expert',
      durationDays: days,
      knownKeywords: knownKeywords?.map(kw => sanitizeString(kw, 100))
    }
  };
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
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON in request body' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Validate input
    const validation = validateRequest(body);
    if (!validation.valid) {
      return new Response(JSON.stringify({ error: validation.error }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { theme, dailyMinutes, level, durationDays, knownKeywords } = validation.data;
    
    console.log(`Generating course plan: theme="${theme}", minutes=${dailyMinutes}, level=${level}, days=${durationDays}`);

    const API_KEY = Deno.env.get('API_APP');
    
    if (!API_KEY) {
      console.error('API key not configured');
      return new Response(JSON.stringify({ error: 'Service temporarily unavailable' }), {
        status: 503,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const knownConceptsInstruction = knownKeywords && knownKeywords.length > 0
      ? `L'apprenant connaît déjà : ${knownKeywords.join(', ')}. Évite de répéter ces bases.`
      : '';

    const response = await fetch('https://api.blackbox.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'blackboxai/google/gemini-2.5-flash',
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
      console.error('External API error:', response.status);
      
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
          error: 'Service temporairement indisponible.' 
        }), {
          status: 503,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      return new Response(JSON.stringify({ error: 'Erreur lors de la génération du planning' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content || '';

    let planData;
    
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        planData = JSON.parse(jsonMatch[0]);
      } catch (e) {
        // Silent fail
      }
    }
    
    if (!planData) {
      const codeBlockMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (codeBlockMatch) {
        try {
          planData = JSON.parse(codeBlockMatch[1].trim());
        } catch (e) {
          // Silent fail
        }
      }
    }
    
    if (!planData) {
      try {
        planData = JSON.parse(content.trim());
      } catch (e) {
        // Silent fail
      }
    }
    
    if (!planData || !planData.days) {
      console.log('Using fallback plan');
      
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

    console.log(`Course plan generated: "${result.courseTitle}" with ${result.days.length} days`);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error generating course plan');
    return new Response(JSON.stringify({ 
      error: 'Une erreur est survenue lors de la génération du planning' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
