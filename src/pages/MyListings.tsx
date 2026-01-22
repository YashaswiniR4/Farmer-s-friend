import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
  Plus,
  Edit,
  Trash2,
  Package,
  Store,
  Eye,
  EyeOff,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  unit: string;
  quantity_available: number;
  images: string[];
  status: string;
  created_at: string;
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

const MyListings = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signOut } = useAuth();

  useEffect(() => {
    if (user) fetchProducts();
  }, [user]);

  const fetchProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select(`*, product_categories:category_id(name)`)
      .eq("seller_id", user!.id)
      .order("created_at", { ascending: false });

    if (data) setProducts(data as Product[]);
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

  const toggleStatus = async (productId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    
    await supabase
      .from("products")
      .update({ status: newStatus })
      .eq("id", productId);

    setProducts(products.map(p => 
      p.id === productId ? { ...p, status: newStatus } : p
    ));

    toast({
      title: "Status Updated",
      description: `Product is now ${newStatus}.`,
    });
  };

  const deleteProductImages = async (images: string[]) => {
    if (!images || images.length === 0) return;
    
    // Extract file paths from public URLs
    const filePaths = images
      .filter(url => url.includes('product-images'))
      .map(url => {
        // URL format: .../storage/v1/object/public/product-images/user-id/filename.ext
        const match = url.match(/product-images\/(.+)$/);
        return match ? match[1] : null;
      })
      .filter((path): path is string => path !== null);
    
    if (filePaths.length > 0) {
      const { error } = await supabase.storage
        .from('product-images')
        .remove(filePaths);
      
      if (error) {
        console.error('Error deleting images:', error);
      }
    }
  };

  const deleteProduct = async (product: Product) => {
    // Delete images from storage first
    await deleteProductImages(product.images);
    
    // Then delete the product record
    await supabase.from("products").delete().eq("id", product.id);
    setProducts(products.filter(p => p.id !== product.id));
    toast({
      title: "Deleted",
      description: "Product and images have been removed.",
    });
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
          <div className="flex items-center justify-between">
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
                <h1 className="text-xl font-serif font-bold text-foreground">My Listings</h1>
                <p className="text-sm text-muted-foreground">{products.length} products</p>
              </div>
            </div>
            <Link to="/dashboard/marketplace/sell">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Product
              </Button>
            </Link>
          </div>
        </header>

        <main className="p-4 lg:p-8 max-w-4xl mx-auto">
          {products.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No listings yet</h3>
              <p className="text-muted-foreground mb-4">Start selling your agricultural products</p>
              <Link to="/dashboard/marketplace/sell">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Product
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <Card key={product.id} className="card-elevated">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-8 h-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-foreground">{product.title}</h3>
                            {product.product_categories?.name && (
                              <Badge variant="secondary" className="mt-1">
                                {product.product_categories.name}
                              </Badge>
                            )}
                          </div>
                          <Badge
                            variant={product.status === "active" ? "default" : "outline"}
                          >
                            {product.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span>₹{product.price}/{product.unit}</span>
                          <span>•</span>
                          <span>{product.quantity_available} {product.unit} available</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Listed {format(new Date(product.created_at), "dd MMM yyyy")}
                        </p>
                        <div className="flex gap-2 mt-3">
                          <Link to={`/dashboard/marketplace/product/${product.id}`}>
                            <Button size="sm" variant="outline">
                              <Eye className="w-3 h-3 mr-1" />
                              View
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleStatus(product.id, product.status)}
                          >
                            {product.status === "active" ? (
                              <>
                                <EyeOff className="w-3 h-3 mr-1" />
                                Hide
                              </>
                            ) : (
                              <>
                                <Eye className="w-3 h-3 mr-1" />
                                Show
                              </>
                            )}
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="destructive">
                                <Trash2 className="w-3 h-3 mr-1" />
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Product?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete "{product.title}" from your listings.
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteProduct(product)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MyListings;
