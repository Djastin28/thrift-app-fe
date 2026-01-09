import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Plus,
  FolderTree,
  Eye,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

import { adminApi } from "../../api/admin";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { StatCard } from "../../components/ui/StatCard";
import { MiniChart } from "../../components/ui/MiniChart";
import { QuickAction, QuickActionsGrid } from "../../components/ui/QuickAction";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";

// Format currency to IDR
const formatCurrency = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value || 0);
};

// Format number with K/M suffix
const formatNumber = (value) => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value?.toString() || "0";
};

// Status badge colors
const statusColors = {
  pending: "warning",
  processing: "info",
  shipped: "info",
  delivered: "success",
  cancelled: "destructive",
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminApi.getDashboard();
      setData(response.data.data || response.data);
    } catch (err) {
      console.error("Failed to fetch dashboard:", err);
      setError(err.response?.data?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // Mock data for charts (would come from API in real scenario)
  const ordersChartData = data?.orders_chart || [12, 19, 15, 25, 22, 30, 28];
  const revenueChartData = data?.revenue_chart || [150, 230, 180, 290, 250, 350, 320];

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="rounded-full bg-destructive/10 p-4">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <h2 className="text-lg font-semibold">Failed to Load Dashboard</h2>
        <p className="text-muted-foreground text-center max-w-md">{error}</p>
        <Button onClick={fetchDashboard} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your store.
          </p>
        </div>
        <Button onClick={fetchDashboard} variant="outline" size="sm" className="gap-2 w-fit">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={formatNumber(data?.total_users)}
          icon={Users}
          trend="+12%"
          trendUp={true}
          subtitle="vs last month"
          variant="primary"
          isLoading={loading}
        />
        <StatCard
          title="Total Items"
          value={formatNumber(data?.total_items)}
          icon={Package}
          trend="+8%"
          trendUp={true}
          subtitle="active listings"
          variant="info"
          isLoading={loading}
        />
        <StatCard
          title="Total Orders"
          value={formatNumber(data?.total_orders)}
          icon={ShoppingCart}
          trend="+23%"
          trendUp={true}
          subtitle="this month"
          variant="success"
          isLoading={loading}
        />
        <StatCard
          title="Revenue"
          value={loading ? "..." : formatCurrency(data?.total_revenue)}
          icon={DollarSign}
          trend="+18%"
          trendUp={true}
          subtitle="this month"
          variant="accent"
          isLoading={loading}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium">Orders Trend</CardTitle>
            <Badge variant="outline" className="text-xs">Last 7 days</Badge>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-2xl font-bold">{data?.total_orders || 0}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="h-4 w-4 text-success" />
                  <span className="text-success">+23%</span> from last week
                </p>
              </div>
              <MiniChart
                data={ordersChartData}
                color="stroke-primary"
                width={180}
                height={80}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium">Revenue Trend</CardTitle>
            <Badge variant="outline" className="text-xs">Last 7 days</Badge>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-2xl font-bold">{formatCurrency(data?.total_revenue)}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="h-4 w-4 text-success" />
                  <span className="text-success">+18%</span> from last week
                </p>
              </div>
              <MiniChart
                data={revenueChartData}
                color="stroke-accent"
                fillColor="fill-accent/20"
                width={180}
                height={80}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders & Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Orders */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-medium">Recent Orders</CardTitle>
            <Link
              to="/admin/orders"
              className="text-sm text-primary hover:underline"
            >
              View all
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-4 animate-pulse">
                    <div className="h-10 w-10 rounded-full bg-muted" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 bg-muted rounded" />
                      <div className="h-3 w-1/2 bg-muted rounded" />
                    </div>
                    <div className="h-6 w-20 bg-muted rounded" />
                  </div>
                ))}
              </div>
            ) : data?.recent_orders?.length > 0 ? (
              <div className="space-y-4">
                {data.recent_orders.slice(0, 5).map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <ShoppingCart className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        Order #{order.id}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.user?.name || "Customer"} · {formatCurrency(order.total_amount)}
                      </p>
                    </div>
                    <Badge variant={statusColors[order.status] || "secondary"}>
                      {order.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <ShoppingCart className="h-12 w-12 text-muted-foreground/50 mb-3" />
                <p className="font-medium">No orders yet</p>
                <p className="text-sm text-muted-foreground">
                  Orders will appear here once customers start purchasing.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <QuickAction
              to="/admin/items"
              icon={Plus}
              title="Add New Item"
              description="List a new product"
              variant="primary"
            />
            <QuickAction
              to="/admin/orders"
              icon={Eye}
              title="View Orders"
              description="Manage all orders"
              variant="success"
            />
            <QuickAction
              to="/admin/users"
              icon={Users}
              title="Manage Users"
              description="View customer list"
              variant="info"
            />
            <QuickAction
              to="/admin/categories"
              icon={FolderTree}
              title="Categories"
              description="Manage categories"
              variant="warning"
            />
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="text-center p-6">
          <div className="text-3xl font-bold text-primary">{data?.pending_orders || 0}</div>
          <p className="text-sm text-muted-foreground mt-1">Pending Orders</p>
        </Card>
        <Card className="text-center p-6">
          <div className="text-3xl font-bold text-info">{data?.processing_orders || 0}</div>
          <p className="text-sm text-muted-foreground mt-1">Processing</p>
        </Card>
        <Card className="text-center p-6">
          <div className="text-3xl font-bold text-success">{data?.delivered_orders || 0}</div>
          <p className="text-sm text-muted-foreground mt-1">Delivered</p>
        </Card>
        <Card className="text-center p-6">
          <div className="text-3xl font-bold text-accent">{data?.total_categories || 0}</div>
          <p className="text-sm text-muted-foreground mt-1">Categories</p>
        </Card>
      </div>
    </div>
  );
}
