import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Validation schema for soil analysis
const SoilRequestSchema = z.object({
  ph: z.number()
    .min(0, "pH cannot be negative")
    .max(14, "pH cannot exceed 14")
    .optional(),
  nitrogen: z.number()
    .min(0, "Nitrogen level cannot be negative")
    .max(1000, "Nitrogen level exceeds reasonable range (max 1000 kg/ha)")
    .optional(),
  phosphorus: z.number()
    .min(0, "Phosphorus level cannot be negative")
    .max(500, "Phosphorus level exceeds reasonable range (max 500 kg/ha)")
    .optional(),
  potassium: z.number()
    .min(0, "Potassium level cannot be negative")
    .max(1000, "Potassium level exceeds reasonable range (max 1000 kg/ha)")
    .optional(),
  moisture: z.number()
    .min(0, "Moisture cannot be negative")
    .max(100, "Moisture cannot exceed 100%")
    .optional(),
  organicMatter: z.number()
    .min(0, "Organic matter cannot be negative")
    .max(100, "Organic matter cannot exceed 100%")
    .optional(),
  location: z.string()
    .max(200, "Location must be less than 200 characters")
    .regex(/^[a-zA-Z0-9\s,.\-]+$/, "Location contains invalid characters")
    .optional(),
  cropType: z.string()
    .max(100, "Crop type must be less than 100 characters")
    .regex(/^[a-zA-Z\s\-]+$/, "Crop type contains invalid characters")
    .optional(),
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authentication check
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Invalid or expired token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse and validate input
    const rawBody = await req.json();
    const validationResult = SoilRequestSchema.safeParse(rawBody);
    
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
      return new Response(
        JSON.stringify({ error: 'Validation failed', details: errors }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { ph, nitrogen, phosphorus, potassium, moisture, organicMatter, location, cropType } = validationResult.data;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert soil scientist AI for Krushi Mitra - AI Smart Farming System.

Your role is to analyze soil parameters and provide comprehensive recommendations for Indian farmers. Consider:
1. Soil fertility assessment
2. Nutrient deficiencies and excesses
3. Soil health indicators
4. Crop-specific recommendations
5. Fertilizer recommendations (organic and chemical options)
6. Soil improvement strategies

Provide practical, cost-effective solutions suitable for small and medium Indian farmers.`;

    // Sanitize text inputs for use in prompt
    const sanitizedLocation = location ? location.replace(/[^a-zA-Z0-9\s,.\-]/g, '').slice(0, 100) : 'Not specified';
    const sanitizedCropType = cropType ? cropType.replace(/[^a-zA-Z\s\-]/g, '').slice(0, 50) : 'General farming';

    const userPrompt = `Analyze the following soil parameters and provide recommendations:

Soil Parameters:
- pH Level: ${ph ?? 'Not provided'}
- Nitrogen (N): ${nitrogen ?? 'Not provided'} kg/ha
- Phosphorus (P): ${phosphorus ?? 'Not provided'} kg/ha
- Potassium (K): ${potassium ?? 'Not provided'} kg/ha
- Moisture Content: ${moisture ?? 'Not provided'}%
- Organic Matter: ${organicMatter ?? 'Not provided'}%
- Location/Region: ${sanitizedLocation}
- Intended Crop: ${sanitizedCropType}

Provide a comprehensive soil analysis with actionable recommendations.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "analyze_soil",
              description: "Provide structured soil analysis and recommendations",
              parameters: {
                type: "object",
                properties: {
                  fertilityScore: { 
                    type: "number", 
                    description: "Overall fertility score 0-100" 
                  },
                  fertilityRating: { 
                    type: "string", 
                    enum: ["poor", "below_average", "average", "good", "excellent"],
                    description: "Fertility rating category"
                  },
                  phAnalysis: {
                    type: "object",
                    properties: {
                      status: { type: "string", enum: ["acidic", "slightly_acidic", "neutral", "slightly_alkaline", "alkaline"] },
                      recommendation: { type: "string" }
                    },
                    required: ["status", "recommendation"]
                  },
                  nutrientAnalysis: {
                    type: "object",
                    properties: {
                      nitrogen: { 
                        type: "object",
                        properties: {
                          status: { type: "string", enum: ["deficient", "low", "adequate", "high", "excess"] },
                          recommendation: { type: "string" }
                        },
                        required: ["status", "recommendation"]
                      },
                      phosphorus: { 
                        type: "object",
                        properties: {
                          status: { type: "string", enum: ["deficient", "low", "adequate", "high", "excess"] },
                          recommendation: { type: "string" }
                        },
                        required: ["status", "recommendation"]
                      },
                      potassium: { 
                        type: "object",
                        properties: {
                          status: { type: "string", enum: ["deficient", "low", "adequate", "high", "excess"] },
                          recommendation: { type: "string" }
                        },
                        required: ["status", "recommendation"]
                      }
                    },
                    required: ["nitrogen", "phosphorus", "potassium"]
                  },
                  fertilizerRecommendations: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        type: { type: "string", enum: ["organic", "chemical", "bio-fertilizer"] },
                        quantity: { type: "string" },
                        applicationMethod: { type: "string" },
                        timing: { type: "string" }
                      },
                      required: ["name", "type", "quantity"]
                    }
                  },
                  soilImprovementTips: {
                    type: "array",
                    items: { type: "string" }
                  },
                  suitableCrops: {
                    type: "array",
                    items: { type: "string" },
                    description: "Crops suitable for this soil condition"
                  },
                  warnings: {
                    type: "array",
                    items: { type: "string" },
                    description: "Any warnings or concerns about soil health"
                  },
                  additionalNotes: { type: "string" }
                },
                required: ["fertilityScore", "fertilityRating", "nutrientAnalysis", "fertilizerRecommendations", "soilImprovementTips"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "analyze_soil" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds to continue." }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    if (!toolCall) {
      throw new Error("No analysis received from AI");
    }

    const analysis = JSON.parse(toolCall.function.arguments);

    return new Response(
      JSON.stringify({
        success: true,
        analysis,
        inputParameters: { ph, nitrogen, phosphorus, potassium, moisture, organicMatter },
        modelUsed: "google/gemini-3-flash-preview",
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Error in predict-soil:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error occurred" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});