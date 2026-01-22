import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, 
  Loader2, 
  TrendingUp,
  Wheat,
  FileText,
  Info,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  DollarSign,
  Target,
  BarChart3
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { predictYield, YieldPrediction as YieldPredictionType } from "@/lib/ai-services";

const YieldPrediction = () => {
  const [formData, setFormData] = useState({
    cropType: "",
    variety: "",
    farmSize: "",
    soilType: "",
    irrigationType: "",
    fertilizersUsed: "",
    sowingDate: "",
    location: "",
    previousYield: "",
    weatherConditions: "",
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<YieldPredictionType | null>(null);
  const [modelUsed, setModelUsed] = useState<string>("");
  const { toast } = useToast();

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.cropType || !formData.farmSize) {
      toast({
        title: "Missing Information",
        description: "Please provide crop type and farm size",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      const response = await predictYield({
        cropType: formData.cropType,
        variety: formData.variety || undefined,
        farmSize: parseFloat(formData.farmSize),
        soilType: formData.soilType || undefined,
        irrigationType: formData.irrigationType || undefined,
        fertilizersUsed: formData.fertilizersUsed || undefined,
        sowingDate: formData.sowingDate || undefined,
        location: formData.location || undefined,
        previousYield: formData.previousYield ? parseFloat(formData.previousYield) : undefined,
        weatherConditions: formData.weatherConditions || undefined,
      });

      if (response.success && response.prediction) {
        setResult(response.prediction);
        setModelUsed(response.modelUsed || "AI Model");
        toast({
          title: "Prediction Complete",
          description: `Predicted yield: ${response.prediction.predictedYield.totalForFarm} ${response.prediction.predictedYield.unit}`,
        });
      } else {
        toast({
          title: "Prediction Failed",
          description: response.error || "Could not predict yield",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Prediction error:", error);
      toast({
        title: "Error",
        description: "Failed to connect to AI service. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case "excellent": return "text-green-600 bg-green-100";
      case "good": return "text-blue-600 bg-blue-100";
      case "average": return "text-amber-600 bg-amber-100";
      case "below_average": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-700";
      case "medium": return "bg-amber-100 text-amber-700";
      case "low": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getLikelihoodColor = (likelihood: string) => {
    switch (likelihood) {
      case "high": return "text-red-600";
      case "medium": return "text-amber-600";
      case "low": return "text-green-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-muted">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 lg:px-8 py-4">
        <div className="flex items-center gap-4">
          <Link to="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-serif font-bold text-foreground">Yield Prediction</h1>
            <p className="text-sm text-muted-foreground">AI-powered crop yield forecasting</p>
          </div>
        </div>
      </header>

      <main className="p-4 lg:p-8 max-w-4xl mx-auto">
        <div className="grid gap-6 lg:gap-8">
          {/* Input Form */}
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="font-serif flex items-center gap-2">
                <Wheat className="w-5 h-5 text-primary" />
                Farm & Crop Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAnalyze} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Crop Type */}
                  <div className="space-y-2">
                    <Label htmlFor="cropType">Crop Type *</Label>
                    <Input
                      id="cropType"
                      placeholder="e.g., Rice, Wheat, Cotton"
                      value={formData.cropType}
                      onChange={(e) => handleChange("cropType", e.target.value)}
                      required
                    />
                  </div>

                  {/* Variety */}
                  <div className="space-y-2">
                    <Label htmlFor="variety">Variety / Seed Type</Label>
                    <Input
                      id="variety"
                      placeholder="e.g., Basmati, IR64"
                      value={formData.variety}
                      onChange={(e) => handleChange("variety", e.target.value)}
                    />
                  </div>

                  {/* Farm Size */}
                  <div className="space-y-2">
                    <Label htmlFor="farmSize">Farm Size (acres) *</Label>
                    <Input
                      id="farmSize"
                      type="number"
                      step="0.1"
                      placeholder="e.g., 5"
                      value={formData.farmSize}
                      onChange={(e) => handleChange("farmSize", e.target.value)}
                      required
                    />
                  </div>

                  {/* Soil Type */}
                  <div className="space-y-2">
                    <Label htmlFor="soilType">Soil Type</Label>
                    <Select value={formData.soilType} onValueChange={(value) => handleChange("soilType", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select soil type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="clay">Clay</SelectItem>
                        <SelectItem value="sandy">Sandy</SelectItem>
                        <SelectItem value="loamy">Loamy</SelectItem>
                        <SelectItem value="silty">Silty</SelectItem>
                        <SelectItem value="black">Black Soil</SelectItem>
                        <SelectItem value="red">Red Soil</SelectItem>
                        <SelectItem value="alluvial">Alluvial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Irrigation Type */}
                  <div className="space-y-2">
                    <Label htmlFor="irrigationType">Irrigation Type</Label>
                    <Select value={formData.irrigationType} onValueChange={(value) => handleChange("irrigationType", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select irrigation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="drip">Drip Irrigation</SelectItem>
                        <SelectItem value="sprinkler">Sprinkler</SelectItem>
                        <SelectItem value="flood">Flood/Surface</SelectItem>
                        <SelectItem value="canal">Canal</SelectItem>
                        <SelectItem value="tubewell">Tube Well</SelectItem>
                        <SelectItem value="rainfed">Rain-fed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <Label htmlFor="location">Location / District</Label>
                    <Input
                      id="location"
                      placeholder="e.g., Pune, Maharashtra"
                      value={formData.location}
                      onChange={(e) => handleChange("location", e.target.value)}
                    />
                  </div>

                  {/* Sowing Date */}
                  <div className="space-y-2">
                    <Label htmlFor="sowingDate">Sowing Date</Label>
                    <Input
                      id="sowingDate"
                      type="date"
                      value={formData.sowingDate}
                      onChange={(e) => handleChange("sowingDate", e.target.value)}
                    />
                  </div>

                  {/* Previous Yield */}
                  <div className="space-y-2">
                    <Label htmlFor="previousYield">Previous Year Yield (quintals)</Label>
                    <Input
                      id="previousYield"
                      type="number"
                      step="0.1"
                      placeholder="e.g., 45"
                      value={formData.previousYield}
                      onChange={(e) => handleChange("previousYield", e.target.value)}
                    />
                  </div>
                </div>

                {/* Fertilizers */}
                <div className="space-y-2">
                  <Label htmlFor="fertilizersUsed">Fertilizers Used</Label>
                  <Input
                    id="fertilizersUsed"
                    placeholder="e.g., Urea, DAP, NPK 10-26-26"
                    value={formData.fertilizersUsed}
                    onChange={(e) => handleChange("fertilizersUsed", e.target.value)}
                  />
                </div>

                {/* Weather Conditions */}
                <div className="space-y-2">
                  <Label htmlFor="weatherConditions">Weather Conditions</Label>
                  <Select value={formData.weatherConditions} onValueChange={(value) => handleChange("weatherConditions", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Expected weather" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal / Average</SelectItem>
                      <SelectItem value="good_monsoon">Good Monsoon Expected</SelectItem>
                      <SelectItem value="deficit_rain">Deficit Rainfall Expected</SelectItem>
                      <SelectItem value="excess_rain">Excess Rainfall Expected</SelectItem>
                      <SelectItem value="drought">Drought Conditions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isAnalyzing}>
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Predicting with AI...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="w-4 h-4" />
                      Predict Yield
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Results Section */}
          {result && (
            <Card className="card-elevated animate-slide-up">
              <CardHeader>
                <CardTitle className="font-serif flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Yield Prediction Results
                  <span className="text-xs font-normal text-muted-foreground ml-auto">
                    Model: {modelUsed}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Main Prediction */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-6 rounded-xl bg-primary/10">
                    <Target className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <p className="text-sm text-muted-foreground mb-1">Predicted Yield</p>
                    <p className="text-3xl font-serif font-bold text-foreground">
                      {result.predictedYield.value}
                    </p>
                    <p className="text-sm text-muted-foreground">{result.predictedYield.unit}</p>
                  </div>
                  <div className="text-center p-6 rounded-xl bg-muted">
                    <Wheat className="w-8 h-8 mx-auto mb-2 text-amber-600" />
                    <p className="text-sm text-muted-foreground mb-1">Total Farm Yield</p>
                    <p className="text-3xl font-serif font-bold text-foreground">
                      {result.predictedYield.totalForFarm}
                    </p>
                    <p className="text-sm text-muted-foreground">quintals</p>
                  </div>
                  <div className="text-center p-6 rounded-xl bg-muted">
                    <TrendingUp className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <p className="text-sm text-muted-foreground mb-1">Confidence</p>
                    <p className="text-3xl font-serif font-bold text-foreground">
                      {result.confidenceInterval.confidence}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Range: {result.confidenceInterval.low} - {result.confidenceInterval.high}
                    </p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex justify-center">
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${getRatingColor(result.yieldRating)}`}>
                    {result.yieldRating.replace('_', ' ').toUpperCase()} compared to regional average
                  </span>
                </div>

                {/* Market Estimate */}
                {result.marketEstimate && (
                  <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                    <div className="flex items-center gap-2 mb-3">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      <h4 className="font-semibold text-green-800">Market Estimate</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-green-700">Price per Quintal</p>
                        <p className="text-xl font-bold text-green-800">
                          ₹{result.marketEstimate.estimatedPricePerQuintal.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-green-700">Total Estimated Revenue</p>
                        <p className="text-xl font-bold text-green-800">
                          ₹{result.marketEstimate.totalEstimatedRevenue.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {result.marketEstimate.bestSellingPeriod && (
                      <p className="text-sm text-green-700 mt-2">
                        <strong>Best Selling Period:</strong> {result.marketEstimate.bestSellingPeriod}
                      </p>
                    )}
                    {result.marketEstimate.marketNotes && (
                      <p className="text-sm text-green-600 mt-1">{result.marketEstimate.marketNotes}</p>
                    )}
                  </div>
                )}

                {/* Harvest Timeline */}
                {result.harvestTimeline && (
                  <div className="p-4 rounded-lg border border-border bg-card">
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-5 h-5 text-primary" />
                      <h4 className="font-semibold text-foreground">Harvest Timeline</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Expected Harvest Date</p>
                        <p className="font-medium text-foreground">{result.harvestTimeline.expectedHarvestDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Harvest Window</p>
                        <p className="font-medium text-foreground">{result.harvestTimeline.harvestWindow}</p>
                      </div>
                    </div>
                    {result.harvestTimeline.preHarvestActivities && result.harvestTimeline.preHarvestActivities.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-foreground mb-1">Pre-Harvest Activities:</p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {result.harvestTimeline.preHarvestActivities.map((activity, index) => (
                            <li key={index}>• {activity}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Yield Optimization Tips */}
                <div className="p-4 rounded-lg border border-border bg-card">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <h4 className="font-semibold text-foreground">Yield Optimization Tips</h4>
                  </div>
                  <div className="space-y-3">
                    {result.yieldOptimizationTips.map((tip, index) => (
                      <div key={index} className="p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-foreground">{tip.tip}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(tip.priority)}`}>
                            {tip.priority}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          <strong>Impact:</strong> {tip.potentialImpact}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Risk Factors */}
                <div className="p-4 rounded-lg border border-amber-200 bg-amber-50">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    <h4 className="font-semibold text-amber-800">Risk Factors</h4>
                  </div>
                  <div className="space-y-3">
                    {result.riskFactors.map((risk, index) => (
                      <div key={index} className="p-3 rounded-lg bg-white/50">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-amber-900">{risk.risk}</span>
                          <span className={`text-sm font-medium ${getLikelihoodColor(risk.likelihood)}`}>
                            {risk.likelihood.toUpperCase()} likelihood
                          </span>
                        </div>
                        <p className="text-sm text-amber-700">
                          <strong>Mitigation:</strong> {risk.mitigation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Regional Comparison */}
                {result.comparisonWithRegionalAverage && (
                  <div className="p-4 rounded-lg bg-muted">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="w-4 h-4 text-primary" />
                      <h4 className="font-semibold text-foreground text-sm">Regional Comparison</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Regional Average: <strong>{result.comparisonWithRegionalAverage.regionalAverage} quintals/acre</strong>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Your prediction is <strong className={result.comparisonWithRegionalAverage.percentageDifference >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {result.comparisonWithRegionalAverage.percentageDifference >= 0 ? '+' : ''}{result.comparisonWithRegionalAverage.percentageDifference}%
                      </strong> compared to average
                    </p>
                    {result.comparisonWithRegionalAverage.notes && (
                      <p className="text-xs text-muted-foreground mt-1">{result.comparisonWithRegionalAverage.notes}</p>
                    )}
                  </div>
                )}

                {/* Additional Recommendations */}
                {result.additionalRecommendations && (
                  <div className="p-4 rounded-lg bg-muted">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="w-4 h-4 text-primary" />
                      <h4 className="font-semibold text-foreground text-sm">Additional Recommendations</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{result.additionalRecommendations}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-4">
                  <Button variant="default">
                    <FileText className="w-4 h-4" />
                    Generate Report
                  </Button>
                  <Button variant="outline">
                    Save to History
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default YieldPrediction;
