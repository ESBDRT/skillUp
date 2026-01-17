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

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const levelDescriptions = {
      beginner: 'débutant complet, concepts de base',
      intermediate: 'connaissance de base, approfondissement',
      expert: 'maîtrise avancée, concepts complexes'
    };

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
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
      const errorText = await response.text();
      console.error('Lovable AI error:', response.status, errorText);
      
      if (response.status === 402) {
        return new Response(JSON.stringify({ 
          error: 'Crédits AI insuffisants. Veuillez ajouter des crédits à votre workspace Lovable.' 
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
    
    console.log('Raw AI response:', content);
    
    // Try multiple parsing strategies
    let analysis;
    
    // Strategy 1: Direct JSON match
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        analysis = JSON.parse(jsonMatch[0]);
        console.log('Parsed with strategy 1 (JSON match)');
      } catch (e) {
        console.log('Strategy 1 failed:', e);
      }
    }
    
    // Strategy 2: Try to extract from markdown code blocks
    if (!analysis) {
      const codeBlockMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (codeBlockMatch) {
        try {
          analysis = JSON.parse(codeBlockMatch[1].trim());
          console.log('Parsed with strategy 2 (code block)');
        } catch (e) {
          console.log('Strategy 2 failed:', e);
        }
      }
    }
    
    // Strategy 3: Try parsing the entire content as JSON
    if (!analysis) {
      try {
        analysis = JSON.parse(content.trim());
        console.log('Parsed with strategy 3 (full content)');
      } catch (e) {
        console.log('Strategy 3 failed:', e);
      }
    }
    
    // Fallback: Generate a valid response based on the theme
    if (!analysis || typeof analysis.isValid === 'undefined') {
      console.log('All parsing strategies failed, using fallback');
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
    
    // Ensure proper structure
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
    console.error('Error analyzing theme:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Erreur lors de l\'analyse du thème' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
