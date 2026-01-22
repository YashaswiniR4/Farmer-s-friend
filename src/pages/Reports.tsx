import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowLeft, 
  FileText, 
  Download, 
  Printer,
  Calendar,
  Filter,
  Search,
  Eye,
  Leaf,
  Droplets,
  TrendingUp
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Reports = () => {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const reports = [
    {
      id: "RPT-2025-001",
      type: "disease",
      title: "Crop Disease Report",
      description: "Bacterial Leaf Blight detection in Rice",
      date: "Jan 10, 2025",
      icon: Leaf,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
    },
    {
      id: "RPT-2025-002",
      type: "soil",
      title: "Soil Analysis Report",
      description: "Fertility assessment for Field A",
      date: "Jan 8, 2025",
      icon: Droplets,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      id: "RPT-2025-003",
      type: "yield",
      title: "Yield Prediction Report",
      description: "Wheat harvest forecast",
      date: "Jan 5, 2025",
      icon: TrendingUp,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      id: "RPT-2024-045",
      type: "disease",
      title: "Crop Disease Report",
      description: "Early Blight detection in Tomato",
      date: "Dec 28, 2024",
      icon: Leaf,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
    },
    {
      id: "RPT-2024-044",
      type: "soil",
      title: "Soil Analysis Report",
      description: "NPK assessment for Field B",
      date: "Dec 20, 2024",
      icon: Droplets,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
  ];

  const filteredReports = reports.filter((report) => {
    const matchesFilter = filter === "all" || report.type === filter;
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          report.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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
            <h1 className="text-xl font-serif font-bold text-foreground">Reports</h1>
            <p className="text-sm text-muted-foreground">View and download official farmer reports</p>
          </div>
        </div>
      </header>

      <main className="p-4 lg:p-8 max-w-5xl mx-auto">
        {/* Filters */}
        <Card className="card-elevated mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search reports..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reports</SelectItem>
                  <SelectItem value="disease">Disease Reports</SelectItem>
                  <SelectItem value="soil">Soil Reports</SelectItem>
                  <SelectItem value="yield">Yield Reports</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Reports List */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="font-serif flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Your Reports ({filteredReports.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredReports.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No reports found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredReports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className={`w-12 h-12 ${report.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <report.icon className={`w-6 h-6 ${report.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground truncate">{report.title}</h3>
                        <span className="text-xs text-muted-foreground">({report.id})</span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{report.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{report.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link to={`/report/${report.id}`}>
                        <Button variant="ghost" size="icon" title="View Report">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon" title="Download PDF">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Print Report">
                        <Printer className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Reports;
