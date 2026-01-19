import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Concept {
  concept_title: string;
  concept_content: string | null;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { concept, questionType } = await req.json() as { 
      concept: Concept; 
      questionType: 'flashcard' | 'qcm' | 'open' 
    };

    const API_KEY = Deno.env.get("API_APP");
    if (!API_KEY) {
      throw new Error("API_APP key is not configured");
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
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`API error: ${response.status}`);
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
      console.error('Failed to parse AI response:', content);
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
    console.error('Error generating review question:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
