import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Validation schema for yield prediction
const YieldRequestSchema = z.object({
  cropType: z.string()
    .min(1, "Crop type is required")
    .max(100, "Crop type must be less than 100 characters")
    .regex(/^[a-zA-Z\s\-]+$/, "Crop type contains invalid characters"),
  variety: z.string()
    .max(100, "Variety must be less than 100 characters")
    .regex(/^[a-zA-Z0-9\s\-]+$/, "Variety contains invalid characters")
    .optional(),
  farmSize: z.number()
    .min(0.01, "Farm size must be greater than 0")
    .max(10000, "Farm size exceeds reasonable range (max 10,000 acres)"),
  soilType: z.string()
    .max(100, "Soil type must be less than 100 characters")
    .regex(/^[a-zA-Z\s\-]+$/, "Soil type contains invalid characters")
    .optional(),
  irrigationType: z.string()
    .max(100, "Irrigation type must be less than 100 characters")
    .regex(/^[a-zA-Z\s\-]+$/, "Irrigation type contains invalid characters")
    .optional(),
  fertilizersUsed: z.string()
    .max(500, "Fertilizers description must be less than 500 characters")
    .regex(/^[a-zA-Z0-9\s,.\-]+$/, "Fertilizers description contains invalid characters")
    .optional(),
  sowingDate: z.string()
    .max(50, "Sowing date must be less than 50 characters")
    .regex(/^[a-zA-Z0-9\s,.\-\/]+$/, "Sowing date contains invalid characters")
    .optional(),
  location: z.string()
    .max(200, "Location must be less than 200 characters")
    .regex(/^[a-zA-Z0-9\s,.\-]+$/, "Location contains invalid characters")
    .optional(),
  previousYield: z.number()
    .min(0, "Previous yield cannot be negative")
    .max(100000, "Previous yield exceeds reasonable range")
    .optional(),
  weatherConditions: z.string()
    .max(200, "Weather conditions must be less than 200 characters")
    .regex(/^[a-zA-Z0-9\s,.\-]+$/, "Weather conditions contains invalid characters")
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
    const validationResult = YieldRequestSchema.safeParse(rawBody);
    
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
      return new Response(
        JSON.stringify({ error: 'Validation failed', details: errors }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { 
      cropType, 
      variety,
      farmSize, 
      soilType, 
      irrigationType,
      fertilizersUsed,
      sowingDate,
      location,
      previousYield,
      weatherConditions 
    } = validationResult.data;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert agricultural yield prediction AI for Krushi Mitra - AI Smart Farming System.

Your role is to predict crop yields and provide optimization recommendations for Indian farmers. Consider:
1. Historical yield data for the region
2. Crop variety characteristics
3. Soil and irrigation factors
4. Weather patterns
5. Farming practices
6. Market timing recommendations

Provide realistic predictions based on Indian agricultural conditions and practical recommendations to maximize yield and profit.`;

    // Sanitize text inputs for use in prompt
    const sanitizeName = (str: string | undefined, maxLen: number) => 
      str ? str.replace(/[^a-zA-Z\s\-]/g, '').slice(0, maxLen) : undefined;
    const sanitizeText = (str: string | undefined, maxLen: number) => 
      str ? str.replace(/[^a-zA-Z0-9\s,.\-\/]/g, '').slice(0, maxLen) : undefined;

    const userPrompt = `Predict the yield for the following farm and provide optimization recommendations:

Farm Details:
- Crop: ${sanitizeName(cropType, 50)}
- Variety: ${sanitizeName(variety, 50) ?? 'Standard variety'}
- Farm Size: ${farmSize} acres
- Soil Type: ${sanitizeName(soilType, 50) ?? 'Not specified'}
- Irrigation: ${sanitizeName(irrigationType, 50) ?? 'Not specified'}
- Fertilizers Used: ${sanitizeText(fertilizersUsed, 200) ?? 'Not specified'}
- Sowing Date: ${sanitizeText(sowingDate, 30) ?? 'Not specified'}
- Location: ${sanitizeText(location, 100) ?? 'Not specified'}
- Previous Year Yield: ${previousYield ?? 'Not available'}
- Weather Conditions: ${sanitizeText(weatherConditions, 100) ?? 'Normal'}

Provide yield prediction with confidence intervals and recommendations to improve yield.`;

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
              name: "predict_yield",
              description: "Provide structured yield prediction and farming recommendations",
              parameters: {
                type: "object",
                properties: {
                  predictedYield: {
                    type: "object",
                    properties: {
                      value: { type: "number", description: "Predicted yield in quintals" },
                      unit: { type: "string", description: "Unit of measurement (quintals/acre, kg/acre, etc.)" },
                      totalForFarm: { type: "number", description: "Total predicted yield for entire farm" }
                    },
                    required: ["value", "unit", "totalForFarm"]
                  },
                  confidenceInterval: {
                    type: "object",
                    properties: {
                      low: { type: "number" },
                      high: { type: "number" },
                      confidence: { type: "number", description: "Confidence percentage 0-100" }
                    },
                    required: ["low", "high", "confidence"]
                  },
                  yieldRating: {
                    type: "string",
                    enum: ["below_average", "average", "good", "excellent"],
                    description: "How this yield compares to regional averages"
                  },
                  marketEstimate: {
                    type: "object",
                    properties: {
                      estimatedPricePerQuintal: { type: "number" },
                      totalEstimatedRevenue: { type: "number" },
                      bestSellingPeriod: { type: "string" },
                      marketNotes: { type: "string" }
                    },
                    required: ["estimatedPricePerQuintal", "totalEstimatedRevenue"]
                  },
                  yieldOptimizationTips: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        tip: { type: "string" },
                        potentialImpact: { type: "string" },
                        priority: { type: "string", enum: ["high", "medium", "low"] }
                      },
                      required: ["tip", "potentialImpact", "priority"]
                    }
                  },
                  riskFactors: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        risk: { type: "string" },
                        likelihood: { type: "string", enum: ["low", "medium", "high"] },
                        mitigation: { type: "string" }
                      },
                      required: ["risk", "likelihood", "mitigation"]
                    }
                  },
                  harvestTimeline: {
                    type: "object",
                    properties: {
                      expectedHarvestDate: { type: "string" },
                      harvestWindow: { type: "string" },
                      preHarvestActivities: {
                        type: "array",
                        items: { type: "string" }
                      }
                    },
                    required: ["expectedHarvestDate", "harvestWindow"]
                  },
                  comparisonWithRegionalAverage: {
                    type: "object",
                    properties: {
                      regionalAverage: { type: "number" },
                      percentageDifference: { type: "number" },
                      notes: { type: "string" }
                    },
                    required: ["regionalAverage", "percentageDifference"]
                  },
                  additionalRecommendations: { type: "string" }
                },
                required: ["predictedYield", "confidenceInterval", "yieldRating", "yieldOptimizationTips", "riskFactors"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "predict_yield" } }
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
      throw new Error("No prediction received from AI");
    }

    const prediction = JSON.parse(toolCall.function.arguments);

    return new Response(
      JSON.stringify({
        success: true,
        prediction,
        inputParameters: { cropType, variety, farmSize, soilType, irrigationType, location },
        modelUsed: "google/gemini-3-flash-preview",
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Error in predict-yield:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error occurred" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});