import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation constants
const MAX_TITLE_LENGTH = 200;
const MAX_CONTENT_LENGTH = 2000;
const VALID_QUESTION_TYPES = ['flashcard', 'qcm', 'open'] as const;

interface Concept {
  concept_title: string;
  concept_content: string | null;
}

interface GenerateReviewRequest {
  concept: Concept;
  questionType: 'flashcard' | 'qcm' | 'open';
}

// Sanitize string input
function sanitizeString(input: unknown, maxLength: number): string {
  if (typeof input !== 'string') return '';
  return input.trim().slice(0, maxLength).replace(/[<>]/g, '');
}

// Validate request input
function validateRequest(body: unknown): { valid: true; data: GenerateReviewRequest } | { valid: false; error: string } {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Invalid request body' };
  }

  const { concept, questionType } = body as Record<string, unknown>;

  // Validate concept
  if (!concept || typeof concept !== 'object') {
    return { valid: false, error: 'Concept is required' };
  }

  const { concept_title, concept_content } = concept as Record<string, unknown>;

  if (!concept_title || typeof concept_title !== 'string' || concept_title.trim().length === 0) {
    return { valid: false, error: 'Concept title is required' };
  }

  // Validate questionType
  if (!questionType || !VALID_QUESTION_TYPES.includes(questionType as typeof VALID_QUESTION_TYPES[number])) {
    return { valid: false, error: `Question type must be one of: ${VALID_QUESTION_TYPES.join(', ')}` };
  }

  return {
    valid: true,
    data: {
      concept: {
        concept_title: sanitizeString(concept_title, MAX_TITLE_LENGTH),
        concept_content: concept_content ? sanitizeString(concept_content, MAX_CONTENT_LENGTH) : null
      },
      questionType: questionType as 'flashcard' | 'qcm' | 'open'
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

    const { concept, questionType } = validation.data;

    const API_KEY = Deno.env.get("API_APP");
    if (!API_KEY) {
      console.error('API key not configured');
      // Return fallback question
      return new Response(JSON.stringify({ 
        type: 'qcm',
        data: {
          question: `Que savez-vous sur "${concept.concept_title}" ?`,
          options: [
            { id: 'a', text: 'Je connais ce concept', isCorrect: true },
            { id: 'b', text: 'Je ne suis pas sûr', isCorrect: false },
            { id: 'c', text: 'Je dois réviser', isCorrect: false },
            { id: 'd', text: 'C\'est nouveau pour moi', isCorrect: false },
          ],
          explanation: 'Continuez à réviser ce concept.'
        }
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const prompt = `Génère une question à choix multiples (QCM) pour tester ce concept:

Titre: ${concept.concept_title}
Contenu: ${concept.concept_content || 'Non spécifié'}

RÈGLES STRICTES :
1. UNIQUEMENT un QCM avec 4 propositions de réponses
2. Une seule bonne réponse
3. Les mauvaises réponses doivent être plausibles

Réponds UNIQUEMENT avec ce JSON :
{
  "question": "La question posée ?",
  "options": [
    {"id": "a", "text": "Bonne réponse", "isCorrect": true},
    {"id": "b", "text": "Mauvaise réponse 1", "isCorrect": false},
    {"id": "c", "text": "Mauvaise réponse 2", "isCorrect": false},
    {"id": "d", "text": "Mauvaise réponse 3", "isCorrect": false}
  ],
  "explanation": "Explication de la bonne réponse"
}`;

    const response = await fetch("https://api.blackbox.ai/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "blackboxai/google/gemini-2.5-flash",
        messages: [
          { 
            role: "system", 
            content: "Tu es un expert en création de QCM pédagogiques. Tu génères UNIQUEMENT des questions à choix multiples avec 4 options. Réponds UNIQUEMENT avec du JSON valide."
          },
          { role: "user", content: prompt }
        ],
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      console.error('External API error:', response.status);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requêtes atteinte" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporairement indisponible" }), {
          status: 503,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      // Return fallback
      return new Response(JSON.stringify({ 
        type: 'qcm',
        data: {
          question: `Que savez-vous sur "${concept.concept_title}" ?`,
          options: [
            { id: 'a', text: 'Je connais ce concept', isCorrect: true },
            { id: 'b', text: 'Je ne suis pas sûr', isCorrect: false },
            { id: 'c', text: 'Je dois réviser', isCorrect: false },
            { id: 'd', text: 'C\'est nouveau pour moi', isCorrect: false },
          ],
          explanation: 'Continuez à réviser ce concept.'
        }
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    
    let result;
    try {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : content;
      const parsed = JSON.parse(jsonStr.trim());
      
      result = {
        question: parsed.question || `Question sur "${concept.concept_title}"`,
        options: Array.isArray(parsed.options) ? parsed.options : [
          { id: 'a', text: concept.concept_content?.substring(0, 50) || 'Réponse A', isCorrect: true },
          { id: 'b', text: 'Réponse incorrecte B', isCorrect: false },
          { id: 'c', text: 'Réponse incorrecte C', isCorrect: false },
          { id: 'd', text: 'Réponse incorrecte D', isCorrect: false },
        ],
        explanation: parsed.explanation || 'Revoyez ce concept.'
      };
    } catch (e) {
      console.error('Failed to parse AI response');
      result = {
        question: `Que savez-vous sur "${concept.concept_title}" ?`,
        options: [
          { id: 'a', text: concept.concept_content?.substring(0, 50) || 'Réponse A', isCorrect: true },
          { id: 'b', text: 'Réponse incorrecte B', isCorrect: false },
          { id: 'c', text: 'Réponse incorrecte C', isCorrect: false },
          { id: 'd', text: 'Réponse incorrecte D', isCorrect: false },
        ],
        explanation: concept.concept_content || 'Revoyez ce concept.'
      };
    }

    return new Response(JSON.stringify({ 
      type: 'qcm',
      data: result 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error('Error generating review question');
    return new Response(JSON.stringify({ 
      error: 'Une erreur est survenue' 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
