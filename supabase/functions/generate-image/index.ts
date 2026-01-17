import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Reliable placeholder fallback
function getFallbackImage(keyword: string): string {
  const cleanKeyword = encodeURIComponent(keyword.toLowerCase().replace(/[^a-z0-9\s]/g, '').substring(0, 30) || 'education');
  return `https://placehold.co/800x600/2d3748/eaeaea?text=${cleanKeyword}`;
}

// Upload base64 image to Supabase Storage and return public URL
async function uploadToStorage(base64Data: string, keyword: string): Promise<string | null> {
  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing Supabase credentials for storage upload');
      return null;
    }
    
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Remove data URL prefix if present
    const cleanBase64 = base64Data.replace(/^data:image\/\w+;base64,/, '');
    
    // Decode base64 to binary
    const binaryString = atob(cleanBase64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    // Generate unique filename
    const cleanKeyword = keyword.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 20);
    const fileName = `${cleanKeyword}-${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
    
    console.log(`Uploading image to storage: ${fileName}`);
    
    // Upload to storage
    const { data, error } = await supabase.storage
      .from('course-images')
      .upload(fileName, bytes, {
        contentType: 'image/png',
        upsert: false
      });
    
    if (error) {
      console.error('Storage upload error:', error);
      return null;
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('course-images')
      .getPublicUrl(fileName);
    
    console.log(`Image uploaded successfully: ${publicUrl}`);
    return publicUrl;
    
  } catch (error) {
    console.error('Error uploading to storage:', error);
    return null;
  }
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

    console.log('AI image generated, uploading to storage...');
    
    // Upload base64 image to Storage and get persistent URL
    const publicUrl = await uploadToStorage(imageData, subject);
    
    if (publicUrl) {
      console.log('Image stored successfully in Storage');
      return new Response(JSON.stringify({ 
        imageUrl: publicUrl
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Fallback to placeholder if storage upload fails
    console.log('Storage upload failed, using fallback');
    return new Response(JSON.stringify({ 
      imageUrl: getFallbackImage(subject)
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
