import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  Trash2,
  Minus,
  Plus,
  ShoppingCart,
  Store,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface CartItem {
  id: string;
  quantity: number;
  product_id: string;
  products: {
    id: string;
    title: string;
    price: number;
    unit: string;
    images: string[];
    seller_id: string;
    quantity_available: number;
  };
}

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

const Cart = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [notes, setNotes] = useState("");
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile, signOut } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCartItems();
      if (profile) {
        setDeliveryAddress(`${profile.village || ""}, ${profile.district || ""}`);
      }
    }
  }, [user, profile]);

  const fetchCartItems = async () => {
    const { data, error } = await supabase
      .from("cart_items")
      .select(`
        *,
        products:product_id(id, title, price, unit, images, seller_id, quantity_available)
      `)
      .eq("user_id", user!.id);

    if (data) setCartItems(data as CartItem[]);
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

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    await supabase
      .from("cart_items")
      .update({ quantity: newQuantity })
      .eq("id", itemId);

    setCartItems(items =>
      items.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = async (itemId: string) => {
    await supabase.from("cart_items").delete().eq("id", itemId);
    setCartItems(items => items.filter(item => item.id !== itemId));
    toast({
      title: "Removed",
      description: "Item removed from cart.",
    });
  };

  const checkout = async () => {
    if (!user || cartItems.length === 0) return;

    if (!deliveryAddress.trim()) {
      toast({
        title: "Error",
        description: "Please enter a delivery address.",
        variant: "destructive",
      });
      return;
    }

    setCheckingOut(true);

    try {
      // Create orders for each item
      for (const item of cartItems) {
        await supabase.from("orders").insert({
          buyer_id: user.id,
          product_id: item.products.id,
          seller_id: item.products.seller_id,
          quantity: item.quantity,
          total_price: item.products.price * item.quantity,
          delivery_address: deliveryAddress,
          notes: notes,
          status: "pending",
        });
      }

      // Clear cart
      await supabase.from("cart_items").delete().eq("user_id", user.id);

      toast({
        title: "Order Placed!",
        description: "Your order has been placed successfully. The seller will contact you soon.",
      });

      navigate("/dashboard/marketplace/orders");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      });
    }

    setCheckingOut(false);
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.products.price * item.quantity,
    0
  );

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
              <h1 className="text-xl font-serif font-bold text-foreground">Shopping Cart</h1>
              <p className="text-sm text-muted-foreground">{cartItems.length} items</p>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8">
          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground mb-4">Browse the marketplace to add products</p>
              <Link to="/dashboard/marketplace">
                <Button>Browse Marketplace</Button>
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <Card key={item.id} className="card-elevated">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                          {item.products.images?.[0] ? (
                            <img
                              src={item.products.images[0]}
                              alt={item.products.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Store className="w-8 h-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <Link to={`/dashboard/marketplace/product/${item.products.id}`}>
                            <h3 className="font-semibold text-foreground hover:text-primary">
                              {item.products.title}
                            </h3>
                          </Link>
                          <p className="text-sm text-muted-foreground">
                            ₹{item.products.price} per {item.products.unit}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive ml-auto"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-foreground">
                            ₹{(item.products.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Order Summary */}
              <div className="space-y-4">
                <Card className="card-elevated">
                  <CardHeader>
                    <CardTitle className="font-serif">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>₹{total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Delivery</span>
                      <span className="text-green-600">To be decided</span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span className="text-primary">₹{total.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-elevated">
                  <CardHeader>
                    <CardTitle className="font-serif text-base">Delivery Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="address">Delivery Address *</Label>
                      <Textarea
                        id="address"
                        placeholder="Enter your full address"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes (Optional)</Label>
                      <Input
                        id="notes"
                        placeholder="Any special instructions"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                    </div>
                    <Button
                      className="w-full"
                      onClick={checkout}
                      disabled={checkingOut}
                    >
                      {checkingOut ? "Placing Order..." : "Place Order"}
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      The seller will contact you to confirm delivery and payment.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Cart;
