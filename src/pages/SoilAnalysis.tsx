import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { 
  ArrowLeft, 
  Droplets, 
  Loader2, 
  CheckCircle2,
  AlertTriangle,
  Leaf,
  FileText,
  Info,
  Sprout,
  FlaskConical
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { predictSoil, SoilAnalysis as SoilAnalysisType } from "@/lib/ai-services";

const SoilAnalysis = () => {
  const [formData, setFormData] = useState({
    ph: 6.5,
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    moisture: 50,
    organicMatter: "",
    soilType: "",
    location: "",
    cropType: "",
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<SoilAnalysisType | null>(null);
  const [modelUsed, setModelUsed] = useState<string>("");
  const { toast } = useToast();

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);

    try {
      const response = await predictSoil({
        ph: formData.ph,
        nitrogen: formData.nitrogen ? parseFloat(formData.nitrogen) : undefined,
        phosphorus: formData.phosphorus ? parseFloat(formData.phosphorus) : undefined,
        potassium: formData.potassium ? parseFloat(formData.potassium) : undefined,
        moisture: formData.moisture,
        organicMatter: formData.organicMatter ? parseFloat(formData.organicMatter) : undefined,
        location: formData.location || undefined,
        cropType: formData.cropType || undefined,
      });

      if (response.success && response.analysis) {
        setResult(response.analysis);
        setModelUsed(response.modelUsed || "AI Model");
        toast({
          title: "Analysis Complete",
          description: `Soil fertility score: ${response.analysis.fertilityScore}/100`,
        });
      } else {
        toast({
          title: "Analysis Failed",
          description: response.error || "Could not analyze soil data",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Error",
        description: "Failed to connect to AI service. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent": return "text-green-600 bg-green-100";
      case "good": return "text-blue-600 bg-blue-100";
      case "average": return "text-amber-600 bg-amber-100";
      case "below_average": return "text-orange-600 bg-orange-100";
      case "poor": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getNutrientStatusColor = (status: string) => {
    switch (status) {
      case "adequate": return "text-green-600";
      case "high": 
      case "excess": return "text-blue-600";
      case "low": return "text-amber-600";
      case "deficient": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getFertilizerTypeColor = (type: string) => {
    switch (type) {
      case "organic": return "bg-green-100 text-green-700";
      case "chemical": return "bg-blue-100 text-blue-700";
      case "bio-fertilizer": return "bg-purple-100 text-purple-700";
      default: return "bg-gray-100 text-gray-700";
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
            <h1 className="text-xl font-serif font-bold text-foreground">Soil Analysis</h1>
            <p className="text-sm text-muted-foreground">AI-powered soil fertility assessment</p>
          </div>
        </div>
      </header>

      <main className="p-4 lg:p-8 max-w-4xl mx-auto">
        <div className="grid gap-6 lg:gap-8">
          {/* Input Form */}
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="font-serif flex items-center gap-2">
                <Droplets className="w-5 h-5 text-primary" />
                Soil Test Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAnalyze} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        <SelectItem value="peaty">Peaty</SelectItem>
                        <SelectItem value="chalky">Chalky</SelectItem>
                        <SelectItem value="black">Black Soil</SelectItem>
                        <SelectItem value="red">Red Soil</SelectItem>
                        <SelectItem value="alluvial">Alluvial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <Label htmlFor="location">Location / Region</Label>
                    <Input
                      id="location"
                      placeholder="e.g., Maharashtra, Punjab"
                      value={formData.location}
                      onChange={(e) => handleChange("location", e.target.value)}
                    />
                  </div>

                  {/* Crop Type */}
                  <div className="space-y-2">
                    <Label htmlFor="cropType">Intended Crop</Label>
                    <Input
                      id="cropType"
                      placeholder="e.g., Rice, Wheat, Cotton"
                      value={formData.cropType}
                      onChange={(e) => handleChange("cropType", e.target.value)}
                    />
                  </div>

                  {/* Organic Matter */}
                  <div className="space-y-2">
                    <Label htmlFor="organicMatter">Organic Matter (%)</Label>
                    <Input
                      id="organicMatter"
                      type="number"
                      step="0.1"
                      placeholder="e.g., 2.5"
                      value={formData.organicMatter}
                      onChange={(e) => handleChange("organicMatter", e.target.value)}
                    />
                  </div>
                </div>

                {/* pH Slider */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>pH Level</Label>
                    <span className="text-sm font-medium text-foreground">{formData.ph}</span>
                  </div>
                  <Slider
                    value={[formData.ph]}
                    onValueChange={(value) => handleChange("ph", value[0])}
                    min={0}
                    max={14}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Acidic (0)</span>
                    <span>Neutral (7)</span>
                    <span>Alkaline (14)</span>
                  </div>
                </div>

                {/* Moisture Slider */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>Moisture Level</Label>
                    <span className="text-sm font-medium text-foreground">{formData.moisture}%</span>
                  </div>
                  <Slider
                    value={[formData.moisture]}
                    onValueChange={(value) => handleChange("moisture", value[0])}
                    min={0}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* NPK Values */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nitrogen">Nitrogen (kg/ha)</Label>
                    <Input
                      id="nitrogen"
                      type="number"
                      placeholder="e.g., 45"
                      value={formData.nitrogen}
                      onChange={(e) => handleChange("nitrogen", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phosphorus">Phosphorus (kg/ha)</Label>
                    <Input
                      id="phosphorus"
                      type="number"
                      placeholder="e.g., 28"
                      value={formData.phosphorus}
                      onChange={(e) => handleChange("phosphorus", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="potassium">Potassium (kg/ha)</Label>
                    <Input
                      id="potassium"
                      type="number"
                      placeholder="e.g., 156"
                      value={formData.potassium}
                      onChange={(e) => handleChange("potassium", e.target.value)}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isAnalyzing}>
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyzing with AI...
                    </>
                  ) : (
                    <>
                      <Leaf className="w-4 h-4" />
                      Analyze Soil
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
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  Analysis Results
                  <span className="text-xs font-normal text-muted-foreground ml-auto">
                    Model: {modelUsed}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Fertility Score */}
                <div className="text-center p-6 rounded-xl bg-muted">
                  <p className="text-sm text-muted-foreground mb-2">Soil Fertility Score</p>
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="none"
                        className="text-muted"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={`${result.fertilityScore * 3.52} 352`}
                        className="text-primary"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-serif font-bold">{result.fertilityScore}</span>
                    </div>
                  </div>
                  <span className={`inline-block px-4 py-1 rounded-full text-sm font-medium ${getStatusColor(result.fertilityRating)}`}>
                    {result.fertilityRating.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                {/* pH Analysis */}
                {result.phAnalysis && (
                  <div className="p-4 rounded-lg bg-muted/50">
                    <h4 className="font-semibold text-foreground mb-2">pH Analysis</h4>
                    <p className="text-sm text-muted-foreground">
                      <strong>Status:</strong> {result.phAnalysis.status.replace('_', ' ')}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {result.phAnalysis.recommendation}
                    </p>
                  </div>
                )}

                {/* Nutrient Levels */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">Nutrient Analysis</h4>
                  {Object.entries(result.nutrientAnalysis).map(([key, nutrient]) => (
                    <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <span className="text-foreground capitalize">{key}</span>
                      <div className="flex items-center gap-3">
                        <span className={`text-sm font-medium ${getNutrientStatusColor(nutrient.status)}`}>
                          {nutrient.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Fertilizer Recommendations */}
                <div className="p-4 rounded-lg border border-border bg-card">
                  <div className="flex items-center gap-2 mb-3">
                    <FlaskConical className="w-5 h-5 text-primary" />
                    <h4 className="font-semibold text-foreground">Fertilizer Recommendations</h4>
                  </div>
                  <div className="space-y-3">
                    {result.fertilizerRecommendations.map((fert, index) => (
                      <div key={index} className="p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-foreground">{fert.name}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getFertilizerTypeColor(fert.type)}`}>
                            {fert.type}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          <strong>Quantity:</strong> {fert.quantity}
                        </p>
                        {fert.applicationMethod && (
                          <p className="text-sm text-muted-foreground">
                            <strong>Method:</strong> {fert.applicationMethod}
                          </p>
                        )}
                        {fert.timing && (
                          <p className="text-sm text-muted-foreground">
                            <strong>Timing:</strong> {fert.timing}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Soil Improvement Tips */}
                <div className="p-4 rounded-lg border border-border bg-card">
                  <div className="flex items-center gap-2 mb-3">
                    <Sprout className="w-5 h-5 text-green-500" />
                    <h4 className="font-semibold text-foreground">Soil Improvement Tips</h4>
                  </div>
                  <ul className="space-y-2">
                    {result.soilImprovementTips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2 text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Suitable Crops */}
                {result.suitableCrops && result.suitableCrops.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm font-medium text-foreground w-full mb-1">Suitable Crops:</span>
                    {result.suitableCrops.map((crop, index) => (
                      <span key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                        {crop}
                      </span>
                    ))}
                  </div>
                )}

                {/* Warnings */}
                {result.warnings && result.warnings.length > 0 && (
                  <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                      <h4 className="font-semibold text-red-700">Warnings</h4>
                    </div>
                    <ul className="space-y-1">
                      {result.warnings.map((warning, index) => (
                        <li key={index} className="text-sm text-red-600">• {warning}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Additional Notes */}
                {result.additionalNotes && (
                  <div className="p-4 rounded-lg bg-muted">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="w-4 h-4 text-primary" />
                      <h4 className="font-semibold text-foreground text-sm">Additional Notes</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{result.additionalNotes}</p>
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

export default SoilAnalysis;
