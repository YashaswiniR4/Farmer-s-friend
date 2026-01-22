import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Sprout, 
  Home, 
  Camera, 
  Droplets, 
  TrendingUp, 
  FileText, 
  History, 
  Settings, 
  LogOut,
  Menu,
  X,
  Bell,
  User,
  ChevronRight,
  Leaf,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";

const DashboardSidebar = ({ isOpen, onClose, onSignOut, isAdmin, isFieldOfficer }: { isOpen: boolean; onClose: () => void; onSignOut: () => void; isAdmin: boolean; isFieldOfficer: boolean }) => {
  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard", active: true },
    { icon: Camera, label: "Scan Crop", path: "/dashboard/scan" },
    { icon: Droplets, label: "Soil Analysis", path: "/dashboard/soil" },
    { icon: TrendingUp, label: "Yield Prediction", path: "/dashboard/yield" },
    { icon: FileText, label: "Reports", path: "/dashboard/reports" },
    { icon: History, label: "History", path: "/dashboard/history" },
    { icon: Settings, label: "Settings", path: "/dashboard/settings" },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}
      
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-72 bg-sidebar text-sidebar-foreground z-50 transform transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
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

          {/* Navigation */}
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
            
            {(isAdmin || isFieldOfficer) && (
              <Link
                to="/admin"
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg mt-4 ${
                  isAdmin 
                    ? 'text-red-600 bg-red-50 hover:bg-red-100' 
                    : 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                }`}
              >
                <ShieldCheck className="w-5 h-5" />
                <span className="font-medium">{isAdmin ? 'Admin Panel' : 'Field Officer Panel'}</span>
              </Link>
            )}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-sidebar-border">
            <button 
              onClick={onSignOut}
              className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sidebar-foreground/80 hover:bg-sidebar-accent/50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile, signOut } = useAuth();
  const { isAdmin, isFieldOfficer, role } = useUserRole();

  const notifications = [
    { id: 1, title: "Crop scan completed", message: "Your wheat field scan is ready", time: "2 min ago" },
    { id: 2, title: "New report available", message: "Monthly soil analysis report", time: "1 hour ago" },
    { id: 3, title: "Weather alert", message: "Heavy rain expected tomorrow", time: "3 hours ago" },
  ];

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
    navigate("/login");
  };

  const displayName = profile?.full_name || user?.email?.split("@")[0] || "Farmer";

  const recentScans = [
    { id: 1, crop: "Rice", disease: "Bacterial Leaf Blight", confidence: 92, date: "Today", status: "warning" },
    { id: 2, crop: "Wheat", disease: "Healthy", confidence: 98, date: "Yesterday", status: "success" },
    { id: 3, crop: "Tomato", disease: "Early Blight", confidence: 87, date: "2 days ago", status: "warning" },
  ];

  const stats = [
    { label: "Total Scans", value: "45", icon: Camera, color: "bg-blue-500" },
    { label: "Farms Registered", value: "3", icon: Leaf, color: "bg-green-500" },
    { label: "Reports Generated", value: "12", icon: FileText, color: "bg-amber-500" },
    { label: "Soil Tests", value: "8", icon: Droplets, color: "bg-cyan-500" },
  ];

  return (
    <div className="min-h-screen bg-muted">
      <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onSignOut={handleSignOut} isAdmin={isAdmin} isFieldOfficer={role === "field_officer"} />

      {/* Main Content */}
      <div className="lg:ml-72">
        {/* Top Header */}
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
                <h1 className="text-xl font-serif font-bold text-foreground">Dashboard</h1>
                <p className="text-sm text-muted-foreground">Welcome back, {displayName}!</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Notifications Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="relative p-2 rounded-lg hover:bg-muted">
                    <Bell className="w-5 h-5 text-muted-foreground" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="p-3 border-b">
                    <h4 className="font-semibold text-sm">Notifications</h4>
                  </div>
                  {notifications.map((notification) => (
                    <DropdownMenuItem key={notification.id} className="p-3 cursor-pointer">
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-sm">{notification.title}</span>
                        <span className="text-xs text-muted-foreground">{notification.message}</span>
                        <span className="text-xs text-muted-foreground/70">{notification.time}</span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="p-3 justify-center cursor-pointer">
                    <span className="text-sm text-primary">View all notifications</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-primary-foreground" />
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="p-3 border-b">
                    <p className="font-medium text-sm">{displayName}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                  <DropdownMenuItem onClick={() => navigate("/dashboard/settings")} className="cursor-pointer">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/dashboard/reports")} className="cursor-pointer">
                    <FileText className="w-4 h-4 mr-2" />
                    My Reports
                  </DropdownMenuItem>
                  {(isAdmin || role === "field_officer") && (
                    <DropdownMenuItem onClick={() => navigate("/admin")} className={`cursor-pointer ${isAdmin ? 'text-red-600' : 'text-blue-600'}`}>
                      <ShieldCheck className="w-4 h-4 mr-2" />
                      {isAdmin ? 'Admin Panel' : 'Field Officer Panel'}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-4 lg:p-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
            {stats.map((stat) => (
              <Card key={stat.label} className="card-elevated">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                      <p className="text-2xl lg:text-3xl font-serif font-bold text-foreground">{stat.value}</p>
                    </div>
                    <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-8">
            <Link to="/dashboard/scan" className="block">
              <Card className="card-elevated hover:shadow-elevated transition-shadow cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Camera className="w-7 h-7 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-serif font-bold text-lg text-foreground">Scan Crop</h3>
                      <p className="text-sm text-muted-foreground">Upload image for disease detection</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link to="/dashboard/soil" className="block">
              <Card className="card-elevated hover:shadow-elevated transition-shadow cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Droplets className="w-7 h-7 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-serif font-bold text-lg text-foreground">Soil Analysis</h3>
                      <p className="text-sm text-muted-foreground">Enter soil data for fertility check</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link to="/dashboard/reports" className="block">
              <Card className="card-elevated hover:shadow-elevated transition-shadow cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FileText className="w-7 h-7 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-serif font-bold text-lg text-foreground">View Reports</h3>
                      <p className="text-sm text-muted-foreground">Download official farmer reports</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Recent Scans */}
          <Card className="card-elevated">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-serif">Recent Crop Scans</CardTitle>
              <Link to="/dashboard/history">
                <Button variant="ghost" size="sm">
                  View All
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentScans.map((scan) => (
                  <div key={scan.id} className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${scan.status === 'success' ? 'bg-green-100' : 'bg-amber-100'}`}>
                      {scan.status === 'success' ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-amber-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{scan.crop}</p>
                      <p className="text-sm text-muted-foreground">{scan.disease}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">{scan.confidence}%</p>
                      <p className="text-xs text-muted-foreground">{scan.date}</p>
                    </div>
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

export default Dashboard;
