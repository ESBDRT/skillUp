import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation constants
const MAX_QUESTION_LENGTH = 500;
const MAX_ANSWER_LENGTH = 2000;
const MAX_TITLE_LENGTH = 200;

interface AnalyzeRequest {
  question: string;
  expectedAnswer: string;
  userAnswer: string;
  cardTitle: string;
}

// Sanitize string input
function sanitizeString(input: unknown, maxLength: number): string {
  if (typeof input !== 'string') return '';
  return input.trim().slice(0, maxLength).replace(/[<>]/g, '');
}

// Validate request input
function validateRequest(body: unknown): { valid: true; data: AnalyzeRequest } | { valid: false; error: string } {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Invalid request body' };
  }

  const { question, expectedAnswer, userAnswer, cardTitle } = body as Record<string, unknown>;

  if (!question || typeof question !== 'string' || question.trim().length === 0) {
    return { valid: false, error: 'Question is required' };
  }

  if (!userAnswer || typeof userAnswer !== 'string' || userAnswer.trim().length === 0) {
    return { valid: false, error: 'User answer is required' };
  }

  return {
    valid: true,
    data: {
      question: sanitizeString(question, MAX_QUESTION_LENGTH),
      expectedAnswer: sanitizeString(expectedAnswer, MAX_ANSWER_LENGTH),
      userAnswer: sanitizeString(userAnswer, MAX_ANSWER_LENGTH),
      cardTitle: sanitizeString(cardTitle, MAX_TITLE_LENGTH)
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

    const { question, expectedAnswer, userAnswer, cardTitle } = validation.data;
    
    const API_KEY = Deno.env.get('API_APP');
    
    if (!API_KEY) {
      console.error('API key not configured');
      return new Response(JSON.stringify({
        isValid: true,
        message: "Merci pour votre réponse !",
        additions: []
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log(`Analyzing response for card: ${cardTitle.substring(0, 50)}`);

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
            role: 'system',
            content: `Tu es un professeur bienveillant qui évalue les réponses des étudiants. 
Tu dois:
1. Déterminer si la réponse est globalement correcte ou non
2. Fournir un feedback constructif et encourageant
3. Proposer 2-3 éléments complémentaires pour enrichir la compréhension

Réponds UNIQUEMENT en JSON valide avec ce format:
{
  "isValid": true/false,
  "message": "Feedback personnalisé sur la réponse",
  "additions": ["Point complémentaire 1", "Point complémentaire 2"]
}`
          },
          {
            role: 'user',
            content: `Question posée: "${question}"
            
Réponse attendue (référence): "${expectedAnswer}"

Réponse de l'étudiant: "${userAnswer}"

Évalue cette réponse.`
          }
        ],
        max_tokens: 512
      })
    });

    if (!response.ok) {
      console.error('External API error:', response.status);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: 'Limite de requêtes atteinte.' 
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
      
      // Return graceful fallback
      return new Response(JSON.stringify({
        isValid: true,
        message: "Merci pour votre réponse !",
        additions: []
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content || '';
    
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return new Response(JSON.stringify({
          isValid: Boolean(parsed.isValid),
          message: parsed.message || "Merci pour votre réponse !",
          additions: Array.isArray(parsed.additions) ? parsed.additions.slice(0, 3) : []
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    } catch (parseError) {
      console.error('Failed to parse AI response');
    }

    return new Response(JSON.stringify({
      isValid: true,
      message: "Bonne réflexion ! Votre réponse montre une compréhension du sujet.",
      additions: []
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error analyzing response');
    return new Response(JSON.stringify({
      isValid: true,
      message: "Merci pour votre réponse !",
      additions: []
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
