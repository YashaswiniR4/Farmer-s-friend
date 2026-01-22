import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  ArrowLeft,
  Package,
  Store,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface Order {
  id: string;
  quantity: number;
  total_price: number;
  status: string;
  delivery_address: string;
  notes: string;
  created_at: string;
  buyer_id: string;
  seller_id: string;
  products: {
    id: string;
    title: string;
    price: number;
    unit: string;
    images: string[];
  };
  buyer_profile?: {
    full_name: string;
    phone: string;
  };
  seller_profile?: {
    full_name: string;
    phone: string;
  };
}

const statusConfig = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-800", icon: CheckCircle },
  shipped: { label: "Shipped", color: "bg-purple-100 text-purple-800", icon: Truck },
  delivered: { label: "Delivered", color: "bg-green-100 text-green-800", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800", icon: XCircle },
};

const DashboardSidebar = ({ isOpen, onClose, onSignOut }: { isOpen: boolean; onClose: () => void; onSignOut: () => void }) => {
  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: Store, label: "Marketplace", path: "/dashboard/marketplace", active: true },
    { icon: Camera, label: "Scan Crop", path: "/dashboard/scan" },
    { icon: Droplets, label: "Soil Analysis", path: "/dashboard/soil" },
    { icon: TrendingUp, label: "Yield Prediction", path: "/dashboard/yield" },
    { icon: FileText, label: "Reports", path: "/dashboard/reports" },
    { icon: History, label: "History", path: "/dashboard/history" },
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

const Orders = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [buyOrders, setBuyOrders] = useState<Order[]>([]);
  const [sellOrders, setSellOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signOut } = useAuth();

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    // Fetch orders where user is buyer
    const { data: buyData } = await supabase
      .from("orders")
      .select(`*, products:product_id(id, title, price, unit, images)`)
      .eq("buyer_id", user!.id)
      .order("created_at", { ascending: false });

    // Fetch orders where user is seller
    const { data: sellData } = await supabase
      .from("orders")
      .select(`*, products:product_id(id, title, price, unit, images)`)
      .eq("seller_id", user!.id)
      .order("created_at", { ascending: false });

    if (buyData) setBuyOrders(buyData as Order[]);
    if (sellData) setSellOrders(sellData as Order[]);
    setLoading(false);
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
    navigate("/login");
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (!error) {
      fetchOrders();
      toast({
        title: "Order Updated",
        description: `Order status updated to ${newStatus}.`,
      });
    }
  };

  const OrderCard = ({ order, isSeller }: { order: Order; isSeller: boolean }) => {
    const status = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending;
    const StatusIcon = status.icon;

    return (
      <Card className="card-elevated">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
              {order.products?.images?.[0] ? (
                <img
                  src={order.products.images[0]}
                  alt={order.products.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-6 h-6 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-foreground">{order.products?.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {order.quantity} {order.products?.unit} × ₹{order.products?.price}
                  </p>
                </div>
                <Badge className={status.color}>
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {status.label}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {format(new Date(order.created_at), "dd MMM yyyy")}
                </span>
                <span className="font-bold text-primary">₹{order.total_price}</span>
              </div>
              {order.delivery_address && (
                <p className="text-xs text-muted-foreground mt-2">
                  📍 {order.delivery_address}
                </p>
              )}
              {isSeller && order.buyer_profile && (
                <p className="text-xs text-muted-foreground mt-1">
                  Buyer: {order.buyer_profile.full_name} ({order.buyer_profile.phone})
                </p>
              )}
              {!isSeller && order.seller_profile && (
                <p className="text-xs text-muted-foreground mt-1">
                  Seller: {order.seller_profile.full_name} ({order.seller_profile.phone})
                </p>
              )}
              
              {isSeller && order.status !== "delivered" && order.status !== "cancelled" && (
                <div className="flex gap-2 mt-3">
                  {order.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => updateOrderStatus(order.id, "confirmed")}
                      >
                        Confirm
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => updateOrderStatus(order.id, "cancelled")}
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                  {order.status === "confirmed" && (
                    <Button
                      size="sm"
                      onClick={() => updateOrderStatus(order.id, "shipped")}
                    >
                      Mark Shipped
                    </Button>
                  )}
                  {order.status === "shipped" && (
                    <Button
                      size="sm"
                      onClick={() => updateOrderStatus(order.id, "delivered")}
                    >
                      Mark Delivered
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted">
      <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onSignOut={handleSignOut} />

      <div className="lg:ml-72">
        <header className="sticky top-0 z-30 bg-card border-b border-border px-4 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-muted"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link to="/dashboard/marketplace" className="p-2 rounded-lg hover:bg-muted">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-serif font-bold text-foreground">My Orders</h1>
              <p className="text-sm text-muted-foreground">Track your purchases and sales</p>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8 max-w-4xl mx-auto">
          <Tabs defaultValue="purchases" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="purchases">
                My Purchases ({buyOrders.length})
              </TabsTrigger>
              <TabsTrigger value="sales">
                My Sales ({sellOrders.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="purchases" className="space-y-4">
              {buyOrders.length === 0 ? (
                <div className="text-center py-16">
                  <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No purchases yet</h3>
                  <p className="text-muted-foreground mb-4">Start shopping in the marketplace</p>
                  <Link to="/dashboard/marketplace">
                    <Button>Browse Marketplace</Button>
                  </Link>
                </div>
              ) : (
                buyOrders.map((order) => (
                  <OrderCard key={order.id} order={order} isSeller={false} />
                ))
              )}
            </TabsContent>

            <TabsContent value="sales" className="space-y-4">
              {sellOrders.length === 0 ? (
                <div className="text-center py-16">
                  <Store className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No sales yet</h3>
                  <p className="text-muted-foreground mb-4">List your products to start selling</p>
                  <Link to="/dashboard/marketplace/sell">
                    <Button>Sell Product</Button>
                  </Link>
                </div>
              ) : (
                sellOrders.map((order) => (
                  <OrderCard key={order.id} order={order} isSeller={true} />
                ))
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Orders;
