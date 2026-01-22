import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useUserRole } from "@/hooks/useUserRole";
import { 
  ShieldCheck, 
  Users, 
  Package, 
  ShoppingCart, 
  LayoutDashboard,
  ArrowLeft,
  ClipboardList,
  UserCheck
} from "lucide-react";
import AdminProducts from "@/components/admin/AdminProducts";
import AdminOrders from "@/components/admin/AdminOrders";
import AdminUsers from "@/components/admin/AdminUsers";
import AdminOverview from "@/components/admin/AdminOverview";
import AdminAuditLogs from "@/components/admin/AdminAuditLogs";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { isAdmin, role } = useUserRole();

  const isFieldOfficer = role === "field_officer";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/dashboard">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            {isFieldOfficer ? (
              <UserCheck className="h-8 w-8 text-primary" />
            ) : (
              <ShieldCheck className="h-8 w-8 text-primary" />
            )}
            <div>
              <h1 className="text-3xl font-bold">
                {isFieldOfficer ? "Field Officer Panel" : "Admin Dashboard"}
              </h1>
              <p className="text-muted-foreground">
                {isFieldOfficer 
                  ? "Review products and monitor orders" 
                  : "Manage products, orders, and users"}
              </p>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className={`grid w-full max-w-3xl ${isAdmin ? 'grid-cols-5' : 'grid-cols-4'}`}>
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Products</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Orders</span>
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Users</span>
              </TabsTrigger>
            )}
            <TabsTrigger value="audit" className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              <span className="hidden sm:inline">Audit Logs</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <AdminOverview isFieldOfficer={isFieldOfficer} />
          </TabsContent>

          <TabsContent value="products">
            <AdminProducts isFieldOfficer={isFieldOfficer} />
          </TabsContent>

          <TabsContent value="orders">
            <AdminOrders readOnly={isFieldOfficer} />
          </TabsContent>

          {isAdmin && (
            <TabsContent value="users">
              <AdminUsers />
            </TabsContent>
          )}

          <TabsContent value="audit">
            <AdminAuditLogs />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
