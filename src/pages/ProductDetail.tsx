import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  MapPin,
  User,
  ShoppingCart,
  Package,
  Phone,
  Store,
  Minus,
  Plus,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  unit: string;
  quantity_available: number;
  location: string;
  images: string[];
  seller_id: string;
  category_id: string;
  created_at: string;
  profiles?: {
    full_name: string;
    village: string;
    phone: string;
  };
  product_categories?: {
    name: string;
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

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signOut } = useAuth();

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    const { data } = await supabase
      .from("products")
      .select(`*, product_categories:category_id(name)`)
      .eq("id", id)
      .single();

    if (data) {
      // Fetch seller profile separately
      const { data: sellerProfile } = await supabase
        .from("profiles")
        .select("full_name, village, phone")
        .eq("user_id", data.seller_id)
        .single();
      
      setProduct({ ...data, profiles: sellerProfile } as Product);
    }
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

  const addToCart = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to add items to cart.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (!product) return;

    setAddingToCart(true);

    // Check if already in cart
    const { data: existingItem } = await supabase
      .from("cart_items")
      .select("*")
      .eq("user_id", user.id)
      .eq("product_id", product.id)
      .single();

    if (existingItem) {
      // Update quantity
      await supabase
        .from("cart_items")
        .update({ quantity: existingItem.quantity + quantity })
        .eq("id", existingItem.id);
    } else {
      // Add new item
      await supabase.from("cart_items").insert({
        user_id: user.id,
        product_id: product.id,
        quantity: quantity,
      });
    }

    setAddingToCart(false);
    toast({
      title: "Added to Cart",
      description: `${quantity} ${product.unit} of ${product.title} added to cart.`,
    });
  };

  const buyNow = async () => {
    await addToCart();
    navigate("/dashboard/marketplace/cart");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Product Not Found</h2>
          <Link to="/dashboard/marketplace">
            <Button>Back to Marketplace</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isOwnProduct = user?.id === product.seller_id;

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
              <h1 className="text-xl font-serif font-bold text-foreground">Product Details</h1>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8">
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Images */}
            <div className="space-y-4">
              <div className="aspect-square rounded-xl overflow-hidden bg-card border">
                {product.images?.[selectedImage] ? (
                  <img
                    src={product.images[selectedImage]}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <Package className="w-24 h-24 text-muted-foreground" />
                  </div>
                )}
              </div>
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {product.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 ${
                        selectedImage === index ? "border-primary" : "border-transparent"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div>
                {product.product_categories?.name && (
                  <Badge variant="secondary" className="mb-2">
                    {product.product_categories.name}
                  </Badge>
                )}
                <h1 className="text-2xl lg:text-3xl font-serif font-bold text-foreground mb-2">
                  {product.title}
                </h1>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{product.location || product.profiles?.village || "Local"}</span>
                </div>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary">₹{product.price}</span>
                <span className="text-muted-foreground">per {product.unit}</span>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Available Quantity</p>
                <p className="text-lg font-semibold">
                  {product.quantity_available} {product.unit}
                </p>
              </div>

              {product.description && (
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">{product.description}</p>
                </div>
              )}

              {/* Seller Info */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{product.profiles?.full_name || "Farmer"}</p>
                      <p className="text-sm text-muted-foreground">{product.profiles?.village}</p>
                    </div>
                  </div>
                  {product.profiles?.phone && (
                    <a
                      href={`tel:${product.profiles.phone}`}
                      className="flex items-center gap-2 mt-3 text-primary hover:underline"
                    >
                      <Phone className="w-4 h-4" />
                      {product.profiles.phone}
                    </a>
                  )}
                </CardContent>
              </Card>

              {!isOwnProduct && (
                <>
                  {/* Quantity Selector */}
                  <div className="space-y-2">
                    <Label>Quantity ({product.unit})</Label>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <Input
                        type="number"
                        min="1"
                        max={product.quantity_available}
                        value={quantity}
                        onChange={(e) => setQuantity(Math.min(product.quantity_available, Math.max(1, parseInt(e.target.value) || 1)))}
                        className="w-24 text-center"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(Math.min(product.quantity_available, quantity + 1))}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Total: ₹{(product.price * quantity).toFixed(2)}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={addToCart}
                      disabled={addingToCart}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Button className="flex-1" onClick={buyNow} disabled={addingToCart}>
                      Buy Now
                    </Button>
                  </div>
                </>
              )}

              {isOwnProduct && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-amber-800 text-sm">This is your listing. You cannot purchase your own product.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProductDetail;
