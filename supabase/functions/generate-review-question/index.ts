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

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let prompt = '';
    
    if (questionType === 'qcm') {
      prompt = `Génère une question à choix multiples pour tester la connaissance de ce concept:

Titre: ${concept.concept_title}
Contenu: ${concept.concept_content || 'Non spécifié'}

Retourne UNIQUEMENT un JSON valide avec cette structure exacte:
{
  "question": "La question posée",
  "options": [
    {"id": "a", "text": "Option A", "isCorrect": false},
    {"id": "b", "text": "Option B", "isCorrect": true},
    {"id": "c", "text": "Option C", "isCorrect": false},
    {"id": "d", "text": "Option D", "isCorrect": false}
  ],
  "explanation": "Explication courte de la bonne réponse"
}

Une seule option doit être correcte. La question doit tester la compréhension, pas juste la mémorisation.`;
    } else if (questionType === 'open') {
      prompt = `Génère une question ouverte pour tester la compréhension de ce concept:

Titre: ${concept.concept_title}
Contenu: ${concept.concept_content || 'Non spécifié'}

Retourne UNIQUEMENT un JSON valide avec cette structure exacte:
{
  "question": "Une question ouverte qui demande d'expliquer ou d'appliquer le concept",
  "expectedAnswer": "Les points clés attendus dans une bonne réponse",
  "hints": ["Indice 1", "Indice 2"]
}

La question doit encourager la réflexion et l'application du concept.`;
    } else {
      prompt = `Génère une flashcard améliorée pour réviser ce concept:

Titre: ${concept.concept_title}
Contenu: ${concept.concept_content || 'Non spécifié'}

Retourne UNIQUEMENT un JSON valide avec cette structure exacte:
{
  "front": "Question ou prompt qui fait réfléchir",
  "back": "Réponse détaillée avec un exemple concret",
  "tip": "Astuce mnémotechnique ou analogie pour mieux retenir"
}`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { 
            role: "system", 
            content: "Tu es un expert en pédagogie et en création de questions d'évaluation. Tu génères des questions engageantes et efficaces pour l'apprentissage par répétition espacée. Réponds UNIQUEMENT avec du JSON valide, sans markdown ni texte supplémentaire."
          },
          { role: "user", content: prompt }
        ],
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
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    
    // Parse JSON from response
    let result;
    try {
      // Try to extract JSON if wrapped in markdown
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : content;
      result = JSON.parse(jsonStr.trim());
    } catch (e) {
      console.error('Failed to parse AI response:', content);
      // Return fallback based on type
      if (questionType === 'qcm') {
        result = {
          question: `Que savez-vous sur "${concept.concept_title}" ?`,
          options: [
            { id: 'a', text: concept.concept_content?.substring(0, 50) || 'Option A', isCorrect: true },
            { id: 'b', text: 'Réponse incorrecte B', isCorrect: false },
            { id: 'c', text: 'Réponse incorrecte C', isCorrect: false },
            { id: 'd', text: 'Réponse incorrecte D', isCorrect: false },
          ],
          explanation: concept.concept_content || 'Revoyez ce concept.'
        };
      } else if (questionType === 'open') {
        result = {
          question: `Expliquez le concept de "${concept.concept_title}" avec vos propres mots.`,
          expectedAnswer: concept.concept_content || 'Explication attendue',
          hints: ['Pensez aux points clés', 'Utilisez des exemples']
        };
      } else {
        result = {
          front: concept.concept_title,
          back: concept.concept_content || 'Contenu à réviser',
          tip: 'Essayez de créer une association mentale'
        };
      }
    }

    return new Response(JSON.stringify({ 
      type: questionType,
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
