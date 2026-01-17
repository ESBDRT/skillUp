import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalyzeRequest {
  question: string;
  expectedAnswer: string;
  userAnswer: string;
  cardTitle: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question, expectedAnswer, userAnswer, cardTitle }: AnalyzeRequest = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log(`Analyzing response for: ${cardTitle}`);

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
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content || '';
    
    // Parse the JSON response
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
      console.error('Failed to parse AI response:', parseError);
    }

    // Fallback response
    return new Response(JSON.stringify({
      isValid: true,
      message: "Bonne réflexion ! Votre réponse montre une compréhension du sujet.",
      additions: []
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error analyzing response:', error);
    return new Response(JSON.stringify({
      isValid: true,
      message: "Merci pour votre réponse !",
      additions: []
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
