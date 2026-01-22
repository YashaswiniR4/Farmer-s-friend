import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Users, Package, ShoppingCart, IndianRupee, TrendingUp, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Stats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  activeProducts: number;
}

interface AdminOverviewProps {
  isFieldOfficer?: boolean;
}

const AdminOverview = ({ isFieldOfficer = false }: AdminOverviewProps) => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, productsRes, ordersRes] = await Promise.all([
          supabase.from("profiles").select("id", { count: "exact", head: true }),
          supabase.from("products").select("id, status", { count: "exact" }),
          supabase.from("orders").select("id, status, total_price"),
        ]);

        const activeProducts = productsRes.data?.filter(p => p.status === "active").length || 0;
        const pendingOrders = ordersRes.data?.filter(o => o.status === "pending").length || 0;
        const totalRevenue = ordersRes.data?.reduce((sum, o) => sum + Number(o.total_price), 0) || 0;

        setStats({
          totalUsers: usersRes.count || 0,
          totalProducts: productsRes.count || 0,
          totalOrders: ordersRes.data?.length || 0,
          totalRevenue,
          pendingOrders,
          activeProducts,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const adminStatCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Products",
      value: stats?.totalProducts || 0,
      icon: Package,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Active Products",
      value: stats?.activeProducts || 0,
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Pending Orders",
      value: stats?.pendingOrders || 0,
      icon: AlertCircle,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Total Revenue",
      value: `₹${stats?.totalRevenue?.toLocaleString() || 0}`,
      icon: IndianRupee,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ];

  const fieldOfficerStatCards = [
    {
      title: "Total Products",
      value: stats?.totalProducts || 0,
      icon: Package,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Active Products",
      value: stats?.activeProducts || 0,
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      title: "Pending Orders",
      value: stats?.pendingOrders || 0,
      icon: AlertCircle,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  const statCards = isFieldOfficer ? fieldOfficerStatCards : adminStatCards;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          {isFieldOfficer ? (
            <>
              <p>As a Field Officer, you can:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Review and approve/reject product listings</li>
                <li>View order status and track deliveries</li>
                <li>Monitor marketplace activity</li>
                <li>Access audit logs for your actions</li>
              </ul>
            </>
          ) : (
            <>
              <p>Use the tabs above to manage products, orders, and users. As an admin, you have full access to:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>View and manage all products across the platform</li>
                <li>Update order statuses and handle customer issues</li>
                <li>Manage user accounts and assign roles</li>
                <li>Add and edit product categories</li>
              </ul>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOverview;
