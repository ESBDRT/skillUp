import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation constants
const MAX_THEME_LENGTH = 200;
const VALID_LEVELS = ['beginner', 'intermediate', 'expert'] as const;

interface AnalyzeThemeRequest {
  theme: string;
  level: 'beginner' | 'intermediate' | 'expert';
}

// Sanitize string input
function sanitizeString(input: unknown, maxLength: number): string {
  if (typeof input !== 'string') return '';
  return input.trim().slice(0, maxLength).replace(/[<>]/g, '');
}

// Validate request input
function validateRequest(body: unknown): { valid: true; data: AnalyzeThemeRequest } | { valid: false; error: string } {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Invalid request body' };
  }

  const { theme, level } = body as Record<string, unknown>;

  // Validate theme
  if (!theme || typeof theme !== 'string' || theme.trim().length === 0) {
    return { valid: false, error: 'Theme is required' };
  }
  if (theme.length > MAX_THEME_LENGTH) {
    return { valid: false, error: `Theme must be less than ${MAX_THEME_LENGTH} characters` };
  }

  // Validate level
  if (!level || !VALID_LEVELS.includes(level as typeof VALID_LEVELS[number])) {
    return { valid: false, error: `Level must be one of: ${VALID_LEVELS.join(', ')}` };
  }

  return {
    valid: true,
    data: {
      theme: sanitizeString(theme, MAX_THEME_LENGTH),
      level: level as 'beginner' | 'intermediate' | 'expert'
    }
  };
}

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

    const { theme, level } = validation.data;
    
    console.log(`Analyzing theme: "${theme}" for level: ${level}`);

    const API_KEY = Deno.env.get('API_APP');
    
    if (!API_KEY) {
      console.error('API key not configured');
      return new Response(JSON.stringify({ error: 'Service temporarily unavailable' }), {
        status: 503,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const levelDescriptions = {
      beginner: 'débutant complet, concepts de base',
      intermediate: 'connaissance de base, approfondissement',
      expert: 'maîtrise avancée, concepts complexes'
    };

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
            content: `Tu es un expert pédagogue. Analyse ce thème de cours : "${theme}"

Niveau demandé : ${level} (${levelDescriptions[level]})

TÂCHES :
1. Évalue si le thème est assez précis pour créer un bon cours (isValid: true si spécifique comme "La photosynthèse", false si trop vague comme "Science")
2. Génère 8-10 mots-clés/concepts que l'apprenant pourrait déjà connaître

Tu DOIS répondre UNIQUEMENT avec ce JSON, sans aucun texte avant ou après :
{"isValid":true,"feedback":"Le thème est bon","suggestedTheme":null,"keywords":[{"id":"1","label":"Concept 1","description":"Description"},{"id":"2","label":"Concept 2","description":"Description"}]}`
          }
        ],
        max_tokens: 1024,
        temperature: 0.3
      }),
    });

    if (!response.ok) {
      console.error('External API error:', response.status);
      
      if (response.status === 402) {
        return new Response(JSON.stringify({ 
          error: 'Service temporairement indisponible.' 
        }), {
          status: 503,
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
      
      return new Response(JSON.stringify({ error: 'Erreur lors de l\'analyse du thème' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content || '';
    
    let analysis;
    
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        analysis = JSON.parse(jsonMatch[0]);
      } catch (e) {
        // Silent fail
      }
    }
    
    if (!analysis) {
      const codeBlockMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (codeBlockMatch) {
        try {
          analysis = JSON.parse(codeBlockMatch[1].trim());
        } catch (e) {
          // Silent fail
        }
      }
    }
    
    if (!analysis) {
      try {
        analysis = JSON.parse(content.trim());
      } catch (e) {
        // Silent fail
      }
    }
    
    if (!analysis || typeof analysis.isValid === 'undefined') {
      console.log('Using fallback analysis');
      const isValidTheme = theme.length > 5 && theme.split(' ').length >= 2;
      
      analysis = {
        isValid: isValidTheme,
        feedback: isValidTheme 
          ? "Ce thème semble adapté pour créer un cours."
          : "Ce thème pourrait être plus précis. Essayez d'ajouter plus de détails.",
        suggestedTheme: isValidTheme ? null : `${theme} - les bases`,
        keywords: [
          { id: "1", label: "Introduction", description: "Les concepts fondamentaux" },
          { id: "2", label: "Vocabulaire", description: "Les termes clés à connaître" },
          { id: "3", label: "Principes", description: "Les règles de base" },
          { id: "4", label: "Applications", description: "Comment appliquer ces connaissances" },
          { id: "5", label: "Exemples", description: "Des cas pratiques" }
        ]
      };
    }
    
    const result = {
      isValid: Boolean(analysis.isValid),
      feedback: analysis.feedback || "Thème analysé.",
      suggestedTheme: analysis.suggestedTheme || null,
      keywords: Array.isArray(analysis.keywords) ? analysis.keywords.slice(0, 12) : []
    };
    
    console.log(`Theme analysis complete: isValid=${result.isValid}, keywords=${result.keywords.length}`);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error analyzing theme');
    return new Response(JSON.stringify({ 
      error: 'Une erreur est survenue lors de l\'analyse du thème' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
