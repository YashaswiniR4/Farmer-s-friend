import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Sprout, 
  Home, 
  Camera, 
  Droplets, 
  TrendingUp, 
  FileText, 
  History as HistoryIcon, 
  Settings, 
  LogOut,
  Menu,
  Bell,
  User,
  Calendar,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Search
} from "lucide-react";
import { Input } from "@/components/ui/input";

const DashboardSidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: Camera, label: "Scan Crop", path: "/dashboard/scan" },
    { icon: Droplets, label: "Soil Analysis", path: "/dashboard/soil" },
    { icon: TrendingUp, label: "Yield Prediction", path: "/dashboard/yield" },
    { icon: FileText, label: "Reports", path: "/dashboard/reports" },
    { icon: HistoryIcon, label: "History", path: "/dashboard/history", active: true },
    { icon: Settings, label: "Settings", path: "/dashboard/settings" },
  ];

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}
      
      <aside className={`fixed top-0 left-0 h-full w-72 bg-sidebar text-sidebar-foreground z-50 transform transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-sidebar-border">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-sidebar-primary rounded-xl flex items-center justify-center">
                <Sprout className="w-6 h-6 text-sidebar-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-serif font-bold">Krushi Mitra</span>
                <span className="text-[10px] text-sidebar-foreground/70">AI Smart Farming</span>
              </div>
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  item.active 
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                    : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-sidebar-border">
            <button className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sidebar-foreground/80 hover:bg-sidebar-accent/50 transition-colors">
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

const History = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const historyItems = [
    { id: 1, type: "scan", crop: "Rice", result: "Bacterial Leaf Blight", confidence: 92, date: "2026-01-12", time: "10:30 AM", status: "warning" },
    { id: 2, type: "scan", crop: "Wheat", result: "Healthy", confidence: 98, date: "2026-01-11", time: "02:15 PM", status: "success" },
    { id: 3, type: "soil", crop: "Tomato Field", result: "Moderate Fertility", confidence: 85, date: "2026-01-11", time: "09:00 AM", status: "warning" },
    { id: 4, type: "scan", crop: "Tomato", result: "Early Blight", confidence: 87, date: "2026-01-10", time: "04:45 PM", status: "warning" },
    { id: 5, type: "yield", crop: "Rice Field A", result: "High Yield Expected", confidence: 91, date: "2026-01-10", time: "11:20 AM", status: "success" },
    { id: 6, type: "scan", crop: "Cotton", result: "Healthy", confidence: 95, date: "2026-01-09", time: "03:30 PM", status: "success" },
    { id: 7, type: "soil", crop: "Wheat Field", result: "Good Fertility", confidence: 88, date: "2026-01-08", time: "10:00 AM", status: "success" },
    { id: 8, type: "scan", crop: "Maize", result: "Leaf Spot Disease", confidence: 79, date: "2026-01-07", time: "01:00 PM", status: "warning" },
  ];

  const filteredItems = historyItems.filter(item => 
    item.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.result.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "scan": return "Crop Scan";
      case "soil": return "Soil Analysis";
      case "yield": return "Yield Prediction";
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "scan": return "bg-red-100 text-red-700";
      case "soil": return "bg-blue-100 text-blue-700";
      case "yield": return "bg-green-100 text-green-700";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-muted">
      <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:ml-72">
        <header className="sticky top-0 z-30 bg-card border-b border-border px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden p-2 rounded-lg hover:bg-muted"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-serif font-bold text-foreground">History</h1>
                <p className="text-sm text-muted-foreground">View all your past analyses</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-lg hover:bg-muted">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
              </button>
              <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-primary-foreground" />
                </div>
              </button>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search history..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
            <Button variant="outline" className="gap-2">
              <Calendar className="w-4 h-4" />
              Date Range
            </Button>
          </div>

          {/* History List */}
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="font-serif">Analysis History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.status === 'success' ? 'bg-green-100' : 'bg-amber-100'}`}>
                      {item.status === 'success' ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-amber-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-foreground truncate">{item.crop}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getTypeColor(item.type)}`}>
                          {getTypeLabel(item.type)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{item.result}</p>
                    </div>
                    <div className="text-right hidden sm:block">
                      <p className="font-medium text-foreground">{item.confidence}%</p>
                      <p className="text-xs text-muted-foreground">{item.date}</p>
                      <p className="text-xs text-muted-foreground">{item.time}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default History;
