import { useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer, Download, QrCode, Sprout, CheckCircle2 } from "lucide-react";

const ReportView = () => {
  const { id } = useParams();
  const printRef = useRef<HTMLDivElement>(null);

  // Sample report data - would come from API
  const report = {
    id: id || "RPT-2025-001",
    type: "disease",
    title: "Crop Disease Detection Report",
    generatedDate: "January 10, 2025",
    farmer: {
      name: "Rajesh Kumar",
      id: "FRM-10045",
      village: "Sundarpur",
      district: "Varanasi",
      phone: "+91 98765 43210",
    },
    farm: {
      id: "FARM-A1",
      acres: 5.5,
      crop: "Rice (Paddy)",
      variety: "Basmati 370",
    },
    scan: {
      imageUrl: "/placeholder.svg",
      timestamp: "10 Jan 2025, 10:45 AM",
      model: "CropNet CNN v3.2",
    },
    result: {
      disease: "Bacterial Leaf Blight",
      confidence: 92,
      severity: "Medium",
      affectedArea: "~15%",
    },
    recommendations: [
      "Apply copper-based fungicide (2g/L) immediately",
      "Remove and destroy severely infected leaves",
      "Ensure proper field drainage to reduce humidity",
      "Avoid overhead irrigation; use drip or furrow irrigation",
      "Apply potassium fertilizer to strengthen plant immunity",
      "Consider resistant varieties for next planting season",
    ],
    officer: {
      name: "Dr. Anita Sharma",
      id: "OFF-1002",
      designation: "Agricultural Field Officer",
    },
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-muted">
      {/* Header - No Print */}
      <header className="no-print bg-card border-b border-border px-4 lg:px-8 py-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <Link to="/dashboard/reports">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-serif font-bold text-foreground">Report Preview</h1>
              <p className="text-sm text-muted-foreground">{report.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="w-4 h-4" />
              Print
            </Button>
            <Button variant="default">
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
          </div>
        </div>
      </header>

      {/* Report Document */}
      <main className="p-4 lg:p-8">
        <div ref={printRef} className="official-document max-w-4xl mx-auto">
          {/* Official Header */}
          <div className="border-b-4 border-primary pb-6 mb-8">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center">
                  <Sprout className="w-10 h-10 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl font-serif font-bold text-primary">KRUSHI MITRA</h1>
                  <p className="text-sm text-muted-foreground font-medium">
                    Farmer Service Report
                  </p>
                  <p className="text-xs text-muted-foreground italic">
                    "Serving Farmers with Faith, Science & Integrity"
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-foreground">{report.id}</p>
                <p className="text-sm text-muted-foreground">{report.generatedDate}</p>
              </div>
            </div>
          </div>

          {/* Report Title */}
          <div className="text-center mb-8">
            <h2 className="text-xl font-serif font-bold text-foreground uppercase tracking-wide">
              {report.title}
            </h2>
            <div className="w-24 h-1 bg-harvest mx-auto mt-2" />
          </div>

          {/* Farmer Details */}
          <section className="mb-8">
            <h3 className="text-sm font-bold text-primary uppercase tracking-wide border-b border-border pb-2 mb-4">
              Farmer Information
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Name:</span>
                <span className="ml-2 font-medium text-foreground">{report.farmer.name}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Farmer ID:</span>
                <span className="ml-2 font-medium text-foreground">{report.farmer.id}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Village:</span>
                <span className="ml-2 font-medium text-foreground">{report.farmer.village}</span>
              </div>
              <div>
                <span className="text-muted-foreground">District:</span>
                <span className="ml-2 font-medium text-foreground">{report.farmer.district}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Phone:</span>
                <span className="ml-2 font-medium text-foreground">{report.farmer.phone}</span>
              </div>
            </div>
          </section>

          {/* Farm Details */}
          <section className="mb-8">
            <h3 className="text-sm font-bold text-primary uppercase tracking-wide border-b border-border pb-2 mb-4">
              Farm Details
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Farm ID:</span>
                <span className="ml-2 font-medium text-foreground">{report.farm.id}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Area:</span>
                <span className="ml-2 font-medium text-foreground">{report.farm.acres} Acres</span>
              </div>
              <div>
                <span className="text-muted-foreground">Crop:</span>
                <span className="ml-2 font-medium text-foreground">{report.farm.crop}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Variety:</span>
                <span className="ml-2 font-medium text-foreground">{report.farm.variety}</span>
              </div>
            </div>
          </section>

          {/* Scan Details */}
          <section className="mb-8">
            <h3 className="text-sm font-bold text-primary uppercase tracking-wide border-b border-border pb-2 mb-4">
              Scan Information
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Scan Time:</span>
                <span className="ml-2 font-medium text-foreground">{report.scan.timestamp}</span>
              </div>
              <div>
                <span className="text-muted-foreground">AI Model:</span>
                <span className="ml-2 font-medium text-foreground">{report.scan.model}</span>
              </div>
            </div>
          </section>

          {/* Analysis Result */}
          <section className="mb-8 p-6 bg-red-50 border-2 border-red-200 rounded-xl">
            <h3 className="text-sm font-bold text-red-800 uppercase tracking-wide mb-4">
              🔬 AI Analysis Result
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-red-700">Disease Detected:</span>
                <span className="ml-2 font-bold text-red-900">{report.result.disease}</span>
              </div>
              <div>
                <span className="text-red-700">Confidence:</span>
                <span className="ml-2 font-bold text-red-900">{report.result.confidence}%</span>
              </div>
              <div>
                <span className="text-red-700">Severity:</span>
                <span className="ml-2 font-bold text-red-900">{report.result.severity}</span>
              </div>
              <div>
                <span className="text-red-700">Affected Area:</span>
                <span className="ml-2 font-bold text-red-900">{report.result.affectedArea}</span>
              </div>
            </div>
          </section>

          {/* Recommendations */}
          <section className="mb-8">
            <h3 className="text-sm font-bold text-primary uppercase tracking-wide border-b border-border pb-2 mb-4">
              📋 Recommendations
            </h3>
            <ol className="space-y-2">
              {report.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-3 text-sm">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </span>
                  <span className="text-foreground">{rec}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* Footer */}
          <div className="border-t-2 border-border pt-6 mt-8">
            <div className="flex items-end justify-between">
              <div className="text-sm">
                <p className="text-muted-foreground">Generated by:</p>
                <p className="font-medium text-foreground">{report.officer.name}</p>
                <p className="text-muted-foreground">{report.officer.designation}</p>
                <p className="text-xs text-muted-foreground">ID: {report.officer.id}</p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center mb-2">
                  <QrCode className="w-12 h-12 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">Scan to verify</p>
              </div>

              <div className="text-right text-sm">
                <div className="flex items-center gap-2 justify-end mb-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-700">Verified Document</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  This is a computer-generated document.<br />
                  No signature required.
                </p>
              </div>
            </div>
          </div>

          {/* Official Seal */}
          <div className="text-center mt-8 pt-4 border-t border-dashed border-border">
            <p className="text-xs text-muted-foreground">
              KRUSHI MITRA • Agricultural Innovation Center • support@krushimitra.in • www.krushimitra.in
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReportView;
