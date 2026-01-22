import { supabase } from "@/integrations/supabase/client";

export interface DiseaseDiagnosis {
  isHealthy: boolean;
  diseaseName: string;
  confidence: number;
  severity: "none" | "mild" | "moderate" | "severe";
  affectedParts?: string[];
  symptoms?: string[];
  treatmentRecommendations: string[];
  preventiveMeasures?: string[];
  additionalNotes?: string;
}

export interface SoilAnalysis {
  fertilityScore: number;
  fertilityRating: "poor" | "below_average" | "average" | "good" | "excellent";
  phAnalysis?: {
    status: string;
    recommendation: string;
  };
  nutrientAnalysis: {
    nitrogen: { status: string; recommendation: string };
    phosphorus: { status: string; recommendation: string };
    potassium: { status: string; recommendation: string };
  };
  fertilizerRecommendations: Array<{
    name: string;
    type: "organic" | "chemical" | "bio-fertilizer";
    quantity: string;
    applicationMethod?: string;
    timing?: string;
  }>;
  soilImprovementTips: string[];
  suitableCrops?: string[];
  warnings?: string[];
  additionalNotes?: string;
}

export interface YieldPrediction {
  predictedYield: {
    value: number;
    unit: string;
    totalForFarm: number;
  };
  confidenceInterval: {
    low: number;
    high: number;
    confidence: number;
  };
  yieldRating: "below_average" | "average" | "good" | "excellent";
  marketEstimate?: {
    estimatedPricePerQuintal: number;
    totalEstimatedRevenue: number;
    bestSellingPeriod?: string;
    marketNotes?: string;
  };
  yieldOptimizationTips: Array<{
    tip: string;
    potentialImpact: string;
    priority: "high" | "medium" | "low";
  }>;
  riskFactors: Array<{
    risk: string;
    likelihood: "low" | "medium" | "high";
    mitigation: string;
  }>;
  harvestTimeline?: {
    expectedHarvestDate: string;
    harvestWindow: string;
    preHarvestActivities?: string[];
  };
  comparisonWithRegionalAverage?: {
    regionalAverage: number;
    percentageDifference: number;
    notes?: string;
  };
  additionalRecommendations?: string;
}

export async function predictDisease(imageBase64: string, cropType?: string): Promise<{
  success: boolean;
  diagnosis?: DiseaseDiagnosis;
  error?: string;
  modelUsed?: string;
  timestamp?: string;
}> {
  const { data, error } = await supabase.functions.invoke('predict-disease', {
    body: { imageBase64, cropType }
  });

  if (error) {
    console.error('Disease prediction error:', error);
    return { success: false, error: error.message };
  }

  return data;
}

export async function predictSoil(params: {
  ph?: number;
  nitrogen?: number;
  phosphorus?: number;
  potassium?: number;
  moisture?: number;
  organicMatter?: number;
  location?: string;
  cropType?: string;
}): Promise<{
  success: boolean;
  analysis?: SoilAnalysis;
  error?: string;
  modelUsed?: string;
  timestamp?: string;
}> {
  const { data, error } = await supabase.functions.invoke('predict-soil', {
    body: params
  });

  if (error) {
    console.error('Soil prediction error:', error);
    return { success: false, error: error.message };
  }

  return data;
}

export async function predictYield(params: {
  cropType: string;
  variety?: string;
  farmSize: number;
  soilType?: string;
  irrigationType?: string;
  fertilizersUsed?: string;
  sowingDate?: string;
  location?: string;
  previousYield?: number;
  weatherConditions?: string;
}): Promise<{
  success: boolean;
  prediction?: YieldPrediction;
  error?: string;
  modelUsed?: string;
  timestamp?: string;
}> {
  const { data, error } = await supabase.functions.invoke('predict-yield', {
    body: params
  });

  if (error) {
    console.error('Yield prediction error:', error);
    return { success: false, error: error.message };
  }

  return data;
}

// Helper to convert file to base64
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
}
