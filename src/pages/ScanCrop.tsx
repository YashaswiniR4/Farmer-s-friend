import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, 
  Upload, 
  Camera, 
  Loader2, 
  AlertTriangle, 
  CheckCircle2,
  Leaf,
  Info,
  FileText,
  ShieldCheck
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { predictDisease, fileToBase64, DiseaseDiagnosis } from "@/lib/ai-services";

const ScanCrop = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [cropType, setCropType] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DiseaseDiagnosis | null>(null);
  const [modelUsed, setModelUsed] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image under 10MB",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);

    try {
      const base64 = await fileToBase64(selectedFile);
      const response = await predictDisease(base64, cropType || undefined);

      if (response.success && response.diagnosis) {
        setResult(response.diagnosis);
        setModelUsed(response.modelUsed || "AI Model");
        toast({
          title: "Analysis Complete",
          description: response.diagnosis.isHealthy 
            ? "Your crop appears healthy!" 
            : `Disease detected: ${response.diagnosis.diseaseName}`,
        });
      } else {
        toast({
          title: "Analysis Failed",
          description: response.error || "Could not analyze the image",
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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "none": return "bg-green-100 text-green-700";
      case "mild": return "bg-yellow-100 text-yellow-700";
      case "moderate": return "bg-amber-100 text-amber-700";
      case "severe": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "none": return <CheckCircle2 className="w-6 h-6 text-green-600" />;
      case "mild": return <AlertTriangle className="w-6 h-6 text-yellow-600" />;
      case "moderate": return <AlertTriangle className="w-6 h-6 text-amber-600" />;
      case "severe": return <AlertTriangle className="w-6 h-6 text-red-600" />;
      default: return <Info className="w-6 h-6 text-gray-600" />;
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
            <h1 className="text-xl font-serif font-bold text-foreground">Crop Disease Scanner</h1>
            <p className="text-sm text-muted-foreground">AI-powered disease detection using vision models</p>
          </div>
        </div>
      </header>

      <main className="p-4 lg:p-8 max-w-4xl mx-auto">
        <div className="grid gap-6 lg:gap-8">
          {/* Upload Section */}
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="font-serif flex items-center gap-2">
                <Camera className="w-5 h-5 text-primary" />
                Upload Crop Image
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Crop Type Input */}
              <div className="space-y-2">
                <Label htmlFor="cropType">Crop Type (optional)</Label>
                <Input
                  id="cropType"
                  placeholder="e.g., Rice, Wheat, Tomato, Cotton"
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Specifying the crop type helps improve detection accuracy
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />

              {!selectedImage ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-border rounded-xl p-12 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-lg font-medium text-foreground mb-2">
                    Click to upload crop image
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Supports JPG, PNG up to 10MB
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative rounded-xl overflow-hidden">
                    <img
                      src={selectedImage}
                      alt="Selected crop"
                      className="w-full max-h-96 object-contain bg-black/5"
                    />
                  </div>
                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedImage(null);
                        setSelectedFile(null);
                        setResult(null);
                      }}
                    >
                      Change Image
                    </Button>
                    <Button
                      variant="default"
                      onClick={handleAnalyze}
                      disabled={isAnalyzing}
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Analyzing with AI...
                        </>
                      ) : (
                        <>
                          <Leaf className="w-4 h-4" />
                          Analyze Crop
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results Section */}
          {result && (
            <Card className="card-elevated animate-slide-up">
              <CardHeader>
                <CardTitle className="font-serif flex items-center gap-2">
                  {result.isHealthy ? (
                    <ShieldCheck className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                  )}
                  Analysis Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Disease Info */}
                <div className="flex items-start gap-4 p-4 rounded-lg bg-muted">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    result.isHealthy ? 'bg-green-100' : 'bg-amber-100'
                  }`}>
                    {getSeverityIcon(result.severity)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="font-serif font-bold text-lg text-foreground">
                        {result.diseaseName}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(result.severity)}`}>
                        {result.severity.toUpperCase()} Severity
                      </span>
                    </div>
                    <p className="text-muted-foreground">
                      Detected with <strong className="text-foreground">{result.confidence}%</strong> confidence
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Model: {modelUsed}
                    </p>
                  </div>
                </div>

                {/* Symptoms */}
                {result.symptoms && result.symptoms.length > 0 && (
                  <div className="p-4 rounded-lg border border-border bg-card">
                    <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      Observed Symptoms
                    </h4>
                    <ul className="space-y-1">
                      {result.symptoms.map((symptom, index) => (
                        <li key={index} className="text-muted-foreground text-sm flex items-start gap-2">
                          <span className="text-amber-500">•</span>
                          {symptom}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Affected Parts */}
                {result.affectedParts && result.affectedParts.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm font-medium text-foreground">Affected Parts:</span>
                    {result.affectedParts.map((part, index) => (
                      <span key={index} className="px-2 py-1 bg-muted rounded text-sm text-muted-foreground">
                        {part}
                      </span>
                    ))}
                  </div>
                )}

                {/* Treatment Recommendations */}
                <div className="p-4 rounded-lg border border-border bg-card">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <h4 className="font-semibold text-foreground">Treatment Recommendations</h4>
                  </div>
                  <ul className="space-y-2">
                    {result.treatmentRecommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2 text-muted-foreground">
                        <span className="text-green-500 font-bold">{index + 1}.</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Preventive Measures */}
                {result.preventiveMeasures && result.preventiveMeasures.length > 0 && (
                  <div className="p-4 rounded-lg border border-border bg-card">
                    <div className="flex items-center gap-2 mb-3">
                      <ShieldCheck className="w-5 h-5 text-blue-500" />
                      <h4 className="font-semibold text-foreground">Preventive Measures</h4>
                    </div>
                    <ul className="space-y-2">
                      {result.preventiveMeasures.map((measure, index) => (
                        <li key={index} className="flex items-start gap-2 text-muted-foreground">
                          <span className="text-blue-500">•</span>
                          {measure}
                        </li>
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

          {/* Tips */}
          <Card className="card-elevated">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Info className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Tips for Best Results</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Take clear, well-lit photos of affected leaves or plants</li>
                    <li>• Include close-up shots of discolored or damaged areas</li>
                    <li>• Avoid blurry or dark images for accurate detection</li>
                    <li>• Capture multiple angles if possible</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ScanCrop;
