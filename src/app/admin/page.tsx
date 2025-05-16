"use client";

import { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { UserRole } from "@/types/user";
import {
  FiBook,
  FiDollarSign,
  FiPackage,
  FiUsers,
  FiGrid,
  FiSettings,
  FiTrendingUp,
  FiShoppingBag,
} from "react-icons/fi";
import { useStore } from "@/store/index";
import Link from "next/link";
import Image from "next/image";

// Chart.js components
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
} from "chart.js";
import { Pie, Bar, Line } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
);

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const books = useStore((state) => state.books);
  const users = useStore((state) => state.users);
  const orders = useStore((state) => state.orders);

  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">(
    "month",
  );
  const [selectedTab, setSelectedTab] = useState<
    "overview" | "sales" | "inventory"
  >("overview");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin?callbackUrl=/admin");
    } else if (status === "authenticated") {
      if (session?.user?.role !== UserRole.ADMIN) {
        router.push("/");
      } else {
        setIsLoading(false);
      }
    }
  }, [status, session, router]);

  // Calculate dashboard statistics
  const totalBooks = books.length;
  const totalCustomers = users.filter(
    (user) => user.role === UserRole.CUSTOMER,
  ).length;
  const totalEmployees = users.filter(
    (user) => user.role === UserRole.EMPLOYEE,
  ).length;
  const totalInventoryManagers = users.filter(
    (user) => user.role === UserRole.INVENTORY_MANAGER,
  ).length;
  const totalOrders = orders.length;

  // Calculate enhanced statistics
  const lowStockBooks = books.filter(
    (book) => book.stock > 0 && book.stock <= 5,
  ).length;
  const outOfStockBooks = books.filter((book) => book.stock === 0).length;

  // Calculate revenue
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Calculate date ranges for filtering
  const today = new Date();
  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(today.getDate() - 7);

  const oneMonthAgo = new Date(today);
  oneMonthAgo.setMonth(today.getMonth() - 1);

  const oneYearAgo = new Date(today);
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  const dateRangeMap = {
    week: oneWeekAgo,
    month: oneMonthAgo,
    year: oneYearAgo,
  };

  const startDate = dateRangeMap[timeRange];

  // Filter orders by date range
  const filteredOrders = orders.filter(
    (order) => new Date(order.createdAt) >= startDate,
  );
  const filteredRevenue = filteredOrders.reduce(
    (sum, order) => sum + order.total,
    0,
  );

  // Create data for Charts
  const booksByCategoryData = {
    labels: Array.from(new Set(books.map((book) => book.category))),
    datasets: [
      {
        data: Array.from(new Set(books.map((book) => book.category))).map(
          (category) =>
            books.filter((book) => book.category === category).length,
        ),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(255, 99, 255, 0.6)",
          "rgba(54, 235, 162, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(255, 99, 255, 1)",
          "rgba(54, 235, 162, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };
  // Generate data for daily revenue chart
  const generateDateLabels = () => {
    const labels: string[] = [];
    const data: number[] = [];
    const salesByDate: Record<string, number> = {};

    // Initialize all dates in the range with 0
    const daysToShow =
      timeRange === "week" ? 7 : timeRange === "month" ? 30 : 12;
    const dateFormat: Intl.DateTimeFormatOptions =
      timeRange === "year"
        ? { month: "short" as const }
        : { month: "short" as const, day: "numeric" as const };

    if (timeRange === "year") {
      // For year view, use months
      for (let i = 11; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const label = date.toLocaleDateString("en-US", { month: "short" });
        labels.push(label);
        salesByDate[label] = 0;
      }

      // Aggregate sales by month
      filteredOrders.forEach((order) => {
        const date = new Date(order.createdAt);
        const label = date.toLocaleDateString("en-US", { month: "short" });
        salesByDate[label] = (salesByDate[label] || 0) + order.total;
      });
    } else {
      // For week or month view, use days
      for (let i = daysToShow - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const label = date.toLocaleDateString("en-US", dateFormat);
        labels.push(label);
        salesByDate[label] = 0;
      }

      // Aggregate sales by day
      filteredOrders.forEach((order) => {
        const date = new Date(order.createdAt);
        const label = date.toLocaleDateString("en-US", dateFormat);
        salesByDate[label] = (salesByDate[label] || 0) + order.total;
      });
    }

    // Push sales values in the same order as labels
    labels.forEach((label) => {
      data.push(salesByDate[label] || 0);
    });

    return { labels, data };
  };

  const { labels: dateLabels, data: salesData } = useMemo(generateDateLabels, [
    filteredOrders,
    timeRange,
  ]);

  const salesChartData = {
    labels: dateLabels,
    datasets: [
      {
        label: "Revenue",
        data: salesData,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  // Top selling books data
  const topSellingBooks = useMemo(() => {
    const bookSales: Record<
      string,
      {
        id: string;
        title: string;
        author: string;
        totalSold: number;
        revenue: number;
      }
    > = {};

    // Count books sold from orders
    filteredOrders.forEach((order) => {
      order.items.forEach((item) => {
        if (!bookSales[item.bookId]) {
          const book = books.find((b) => b.id === item.bookId);
          if (book) {
            bookSales[item.bookId] = {
              id: book.id,
              title: book.title,
              author: book.author,
              totalSold: 0,
              revenue: 0,
            };
          }
        }

        if (bookSales[item.bookId]) {
          bookSales[item.bookId].totalSold += item.quantity;
          bookSales[item.bookId].revenue += item.totalPrice;
        }
      });
    });

    // Convert to array and sort
    return Object.values(bookSales)
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 5);
  }, [filteredOrders, books]);

  // Inventory value
  const totalInventoryValue = books.reduce(
    (sum, book) => sum + book.price * book.stock,
    0,
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner h-12 w-12 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Dashboard Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          </div>
          <button
            onClick={() => router.push('/')}
            className="flex items-center text-gray-600 hover:text-blue-600"
            aria-label="Trang chủ"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span>Quay về trang chủ</span>
          </button>
        </div>
      </div>

      {/* Dashboard Tabs */}
      <div className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setSelectedTab("overview")}
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                selectedTab === "overview"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setSelectedTab("sales")}
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                selectedTab === "sales"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Sales Analytics
            </button>
            <button
              onClick={() => setSelectedTab("inventory")}
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                selectedTab === "inventory"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Inventory Analysis
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        {selectedTab === "overview" && (
          <>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6 flex items-center">
                <div className="rounded-full bg-blue-100 p-3">
                  <FiBook className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h2 className="text-sm font-medium text-gray-600">
                    Total Books
                  </h2>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalBooks}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 flex items-center">
                <div className="rounded-full bg-green-100 p-3">
                  <FiDollarSign className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <h2 className="text-sm font-medium text-gray-600">
                    Total Revenue
                  </h2>
                  <p className="text-2xl font-bold text-gray-900">
                    ${totalRevenue.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 flex items-center">
                <div className="rounded-full bg-purple-100 p-3">
                  <FiUsers className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <h2 className="text-sm font-medium text-gray-600">
                    Total Customers
                  </h2>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalCustomers}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 flex items-center">
                <div className="rounded-full bg-yellow-100 p-3">
                  <FiPackage className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <h2 className="text-sm font-medium text-gray-600">
                    Total Orders
                  </h2>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalOrders}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 flex items-center">
                <div className="rounded-full bg-indigo-100 p-3">
                  <FiUsers className="h-8 w-8 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <h2 className="text-sm font-medium text-gray-600">
                    Total Staff
                  </h2>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalEmployees + totalInventoryManagers}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 flex items-center">
                <div className="rounded-full bg-red-100 p-3">
                  <FiShoppingBag className="h-8 w-8 text-red-600" />
                </div>
                <div className="ml-4">
                  <h2 className="text-sm font-medium text-gray-600">
                    Avg. Order Value
                  </h2>
                  <p className="text-2xl font-bold text-gray-900">
                    ${averageOrderValue.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 flex items-center">
                <div className="rounded-full bg-amber-100 p-3">
                  <FiBook className="h-8 w-8 text-amber-600" />
                </div>
                <div className="ml-4">
                  <h2 className="text-sm font-medium text-gray-600">
                    Low Stock Books
                  </h2>
                  <p className="text-2xl font-bold text-gray-900">
                    {lowStockBooks}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 flex items-center">
                <div className="rounded-full bg-orange-100 p-3">
                  <FiDollarSign className="h-8 w-8 text-orange-600" />
                </div>
                <div className="ml-4">
                  <h2 className="text-sm font-medium text-gray-600">
                    Inventory Value
                  </h2>
                  <p className="text-2xl font-bold text-gray-900">
                    ${totalInventoryValue.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Books by Category
                  </h2>
                </div>
                <div className="h-64">
                  <Pie
                    data={booksByCategoryData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                    }}
                  />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Revenue Over Time
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setTimeRange("week")}
                      className={`px-3 py-1 text-xs rounded ${timeRange === "week" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
                    >
                      Week
                    </button>
                    <button
                      onClick={() => setTimeRange("month")}
                      className={`px-3 py-1 text-xs rounded ${timeRange === "month" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
                    >
                      Month
                    </button>
                    <button
                      onClick={() => setTimeRange("year")}
                      className={`px-3 py-1 text-xs rounded ${timeRange === "year" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
                    >
                      Year
                    </button>
                  </div>
                </div>
                <div className="h-64">
                  <Line
                    data={salesChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            callback: (value) => `$${value}`,
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Link
                  href="/admin/books"
                  className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
                >
                  <FiGrid className="h-6 w-6 text-blue-600 mb-2" />
                  <span className="text-sm text-gray-700">Manage Books</span>
                </Link>

                <Link
                  href="/admin/users"
                  className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
                >
                  <FiUsers className="h-6 w-6 text-purple-600 mb-2" />
                  <span className="text-sm text-gray-700">Manage Users</span>
                </Link>
                
                <Link
                  href="/admin/employees"
                  className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
                >
                  <FiUsers className="h-6 w-6 text-green-600 mb-2" />
                  <span className="text-sm text-gray-700">Quản lý nhân viên</span>
                </Link>

                <Link
                  href="/admin/orders"
                  className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
                >
                  <FiPackage className="h-6 w-6 text-yellow-600 mb-2" />
                  <span className="text-sm text-gray-700">Manage Orders</span>
                </Link>

                <Link
                  href="/admin/settings"
                  className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
                >
                  <FiSettings className="h-6 w-6 text-gray-600 mb-2" />
                  <span className="text-sm text-gray-700">Settings</span>
                </Link>
              </div>
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">
                  Recent Orders
                </h2>
                <Link
                  href="/admin/orders"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View All
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                          {order.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {users.find((user) => user.id === order.userId)
                            ?.name || "Unknown User"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${order.total.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${
                              order.status === "DELIVERED"
                                ? "bg-green-100 text-green-800"
                                : order.status === "SHIPPED"
                                  ? "bg-blue-100 text-blue-800"
                                  : order.status === "PROCESSING"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : order.status === "CANCELLED"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}

                    {orders.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-4 text-center text-sm text-gray-500"
                        >
                          No orders found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {selectedTab === "sales" && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Sales Analytics
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setTimeRange("week")}
                  className={`px-3 py-1 text-sm rounded ${timeRange === "week" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
                >
                  Last 7 days
                </button>
                <button
                  onClick={() => setTimeRange("month")}
                  className={`px-3 py-1 text-sm rounded ${timeRange === "month" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
                >
                  Last 30 days
                </button>
                <button
                  onClick={() => setTimeRange("year")}
                  className={`px-3 py-1 text-sm rounded ${timeRange === "year" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
                >
                  Last 12 months
                </button>
              </div>
            </div>

            {/* Revenue Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Revenue
                </h3>
                <p className="text-2xl font-bold text-gray-900">
                  ${filteredRevenue.toFixed(2)}
                </p>
                <div className="mt-2 text-xs text-green-600">
                  <FiTrendingUp className="inline-block mr-1" />
                  {timeRange === "week"
                    ? "+12%"
                    : timeRange === "month"
                      ? "+8%"
                      : "+15%"}{" "}
                  from previous period
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Orders
                </h3>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredOrders.length}
                </p>
                <div className="mt-2 text-xs text-green-600">
                  <FiTrendingUp className="inline-block mr-1" />
                  {timeRange === "week"
                    ? "+5%"
                    : timeRange === "month"
                      ? "+7%"
                      : "+10%"}{" "}
                  from previous period
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Average Order Value
                </h3>
                <p className="text-2xl font-bold text-gray-900">
                  $
                  {filteredOrders.length > 0
                    ? (filteredRevenue / filteredOrders.length).toFixed(2)
                    : "0.00"}
                </p>
                <div className="mt-2 text-xs text-green-600">
                  <FiTrendingUp className="inline-block mr-1" />
                  {timeRange === "week"
                    ? "+3%"
                    : timeRange === "month"
                      ? "+2%"
                      : "+5%"}{" "}
                  from previous period
                </div>
              </div>
            </div>

            {/* Revenue Chart */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Revenue Over Time
              </h3>
              <div className="h-80">
                <Line
                  data={salesChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: (value) => `$${value}`,
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>

            {/* Top Selling Books */}
            <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">
                  Top Selling Books
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Book
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Author
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Units Sold
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Revenue
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {topSellingBooks.map((book) => (
                      <tr key={book.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                          {book.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {book.author}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {book.totalSold}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${book.revenue.toFixed(2)}
                        </td>
                      </tr>
                    ))}

                    {topSellingBooks.length === 0 && (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-6 py-4 text-center text-sm text-gray-500"
                        >
                          No sales data available for this period.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sales by Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Sales by Category
                </h3>
                <div className="h-64">
                  <Pie
                    data={booksByCategoryData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                    }}
                  />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Monthly Orders
                </h3>
                <div className="h-64">
                  <Bar
                    data={{
                      labels: [
                        "Jan",
                        "Feb",
                        "Mar",
                        "Apr",
                        "May",
                        "Jun",
                        "Jul",
                        "Aug",
                        "Sep",
                        "Oct",
                        "Nov",
                        "Dec",
                      ],
                      datasets: [
                        {
                          label: "Orders",
                          data: [
                            65,
                            59,
                            80,
                            81,
                            56,
                            55,
                            40,
                            45,
                            58,
                            62,
                            75,
                            filteredOrders.length,
                          ],
                          backgroundColor: "rgba(255, 99, 132, 0.5)",
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                    }}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {selectedTab === "inventory" && (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Inventory Analysis
              </h2>
            </div>

            {/* Inventory Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Total Products
                </h3>
                <p className="text-2xl font-bold text-gray-900">{totalBooks}</p>
                <div className="mt-2 text-sm text-gray-600">
                  <span className="font-medium">
                    {books.reduce((sum, book) => sum + book.stock, 0)}
                  </span>{" "}
                  items in stock
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Low Stock Items
                </h3>
                <p className="text-2xl font-bold text-gray-900">
                  {lowStockBooks}
                </p>
                <div className="mt-2 text-sm text-red-600">Needs attention</div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Out of Stock
                </h3>
                <p className="text-2xl font-bold text-gray-900">
                  {outOfStockBooks}
                </p>
                <div className="mt-2 text-sm text-red-600">
                  <Link href="/inventory" className="underline">
                    Manage inventory
                  </Link>
                </div>
              </div>
            </div>

            {/* Inventory Value */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Inventory Value
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-4xl font-bold text-gray-900">
                    ${totalInventoryValue.toFixed(2)}
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    Total value of inventory
                  </div>

                  <div className="mt-6 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Average Value per Book
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        ${(totalInventoryValue / totalBooks).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Highest Value Category
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        Science Fiction
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Low Stock Value
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        $
                        {books
                          .filter((book) => book.stock > 0 && book.stock <= 5)
                          .reduce(
                            (sum, book) => sum + book.price * book.stock,
                            0,
                          )
                          .toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="h-48">
                  <Pie
                    data={{
                      labels: ["In Stock", "Low Stock", "Out of Stock"],
                      datasets: [
                        {
                          data: [
                            books.filter((book) => book.stock > 5).length,
                            books.filter(
                              (book) => book.stock > 0 && book.stock <= 5,
                            ).length,
                            books.filter((book) => book.stock === 0).length,
                          ],
                          backgroundColor: [
                            "rgba(75, 192, 192, 0.6)",
                            "rgba(255, 206, 86, 0.6)",
                            "rgba(255, 99, 132, 0.6)",
                          ],
                          borderColor: [
                            "rgba(75, 192, 192, 1)",
                            "rgba(255, 206, 86, 1)",
                            "rgba(255, 99, 132, 1)",
                          ],
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Low Stock Books */}
            <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">
                  Low Stock Books
                </h3>
                <Link
                  href="/inventory"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View All
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Book
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {books
                      .filter((book) => book.stock <= 5)
                      .slice(0, 5)
                      .map((book) => (
                        <tr key={book.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <Image
                                  src={book.coverImage}
                                  alt={book.title}
                                  className="h-10 w-10 rounded-sm object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = "/images/book-placeholder.jpg";
                                  }}
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {book.title}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {book.author}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {book.category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${book.price.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {book.stock}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${book.stock === 0 ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}`}
                            >
                              {book.stock === 0 ? "Out of Stock" : "Low Stock"}
                            </span>
                          </td>
                        </tr>
                      ))}

                    {books.filter((book) => book.stock <= 5).length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-4 text-center text-sm text-gray-500"
                        >
                          No low stock books found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Category Distribution */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Category Distribution
              </h3>
              <div className="h-80">
                <Bar
                  data={{
                    labels: Array.from(
                      new Set(books.map((book) => book.category)),
                    ),
                    datasets: [
                      {
                        label: "Number of Books",
                        data: Array.from(
                          new Set(books.map((book) => book.category)),
                        ).map(
                          (category) =>
                            books.filter((book) => book.category === category)
                              .length,
                        ),
                        backgroundColor: "rgba(54, 162, 235, 0.5)",
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    indexAxis: "y",
                  }}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
