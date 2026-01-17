import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Reliable placeholder fallback
function getFallbackImage(keyword: string): string {
  const cleanKeyword = encodeURIComponent(keyword.toLowerCase().replace(/[^a-z0-9\s]/g, '').substring(0, 30) || 'education');
  return `https://placehold.co/800x600/2d3748/eaeaea?text=${cleanKeyword}`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { keyword, theme } = await req.json();
    const subject = keyword || theme || 'education';
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      console.log('No API key, using fallback');
      return new Response(JSON.stringify({ 
        imageUrl: getFallbackImage(subject)
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const prompt = `Create a clean, modern educational illustration about "${subject}". 
Style: Flat design, vibrant colors, professional, suitable for a learning app.
The image should be visually clear and represent the concept well.
No text in the image. High quality, 800x600 aspect ratio.`;

    console.log(`Generating AI image for: ${subject}`);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image-preview',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        modalities: ['image', 'text']
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      // Always return a valid response with fallback
      return new Response(JSON.stringify({ 
        imageUrl: getFallbackImage(subject)
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const aiResponse = await response.json();
    
    // Extract the image from the response
    const imageData = aiResponse.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    if (!imageData) {
      console.log('No image in AI response, using fallback');
      return new Response(JSON.stringify({ 
        imageUrl: getFallbackImage(subject)
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log('AI image generated successfully');
    
    return new Response(JSON.stringify({ 
      imageUrl: imageData
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error generating image:', error);
    const fallbackKeyword = 'education';
    return new Response(JSON.stringify({ 
      imageUrl: getFallbackImage(fallbackKeyword)
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
