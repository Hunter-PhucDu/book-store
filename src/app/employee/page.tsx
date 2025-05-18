/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  FiPackage,
  FiTruck,
  FiClock,
  FiCalendar,
  FiUser,
  FiTrendingUp,
  FiBook,
  FiShoppingCart,
} from "react-icons/fi";
import { useStore } from "@/store/index";
import { UserRole, Employee } from "@/types/user";
import { OrderStatus } from "@/types/order";
import Image from "next/image";
import Link from "next/link";

export default function EmployeeDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Tối ưu cách sử dụng store để tránh re-render không cần thiết
  const users = useStore((state) => state.users);
  const orders = useStore((state) => state.orders);

  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<
    "tổng quan" | "đơn hàng" | "khách hàng"
  >("tổng quan");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin?callbackUrl=/employee");
    } else if (status === "authenticated") {
      if (session?.user?.role !== UserRole.EMPLOYEE) {
        router.push("/");
      } else {
        setIsLoading(false);
      }
    }
  }, [status, session, router]);

  // Sử dụng useMemo cho các tính toán từ store để tránh infinite loop
  const currentEmployee = useMemo(() => {
    if (!session?.user?.email) return undefined;
    return users.find((user) => user.email === session.user?.email) as
      | Employee
      | undefined;
  }, [users, session?.user?.email]);

  // Dữ liệu giả cho đơn hàng cần xử lý
  const fakePendingOrders = Array.from({ length: 20 }, (_, index) => ({
    id: `order${index + 1}`,
    userId: `user${(index % 5) + 1}`, // Giả định có 5 người dùng
    createdAt: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString(), // Ngày tạo đơn hàng
    total: Math.floor(Math.random() * 100000) + 10000, // Tổng tiền ngẫu nhiên
    status: OrderStatus.PROCESSING, // Tất cả đều là đơn hàng đang xử lý
  }));

  const pendingOrders = useMemo(() => {
    // Thay thế bằng dữ liệu giả
    return fakePendingOrders;
  }, []);

  const todayOrders = useMemo(() => {
    const today = new Date().toDateString();
    return orders.filter(
      (order) => new Date(order.createdAt).toDateString() === today,
    );
  }, [orders]);

  const thisWeekOrders = useMemo(() => {
    const today = new Date();
    const lastWeek = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 7,
    );
    return orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= lastWeek;
    });
  }, [orders]);

  const deliveredOrders = useMemo(() => {
    return orders.filter((order) => order.status === OrderStatus.DELIVERED);
  }, [orders]);

  // Tính thời gian làm việc
  const calculateWorkDuration = (hireDate: Date) => {
    const start = new Date(hireDate);
    const now = new Date();

    let years = now.getFullYear() - start.getFullYear();
    let months = now.getMonth() - start.getMonth();

    if (months < 0) {
      years--;
      months += 12;
    }

    if (years === 0) {
      return `${months} tháng`;
    } else if (months === 0) {
      return `${years} năm`;
    } else {
      return `${years} năm, ${months} tháng`;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner h-12 w-12 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-3xl font-bold text-gray-800">
              Dashboard Nhân Viên
            </h1>
          </div>
          <button
            onClick={() => router.push("/")}
            className="flex items-center text-gray-600 hover:text-blue-600"
            aria-label="Trang chủ"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span>Trang chủ</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setSelectedTab("tổng quan")}
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                selectedTab === "tổng quan"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Tổng quan
            </button>
            <button
              onClick={() => setSelectedTab("đơn hàng")}
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                selectedTab === "đơn hàng"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Đơn hàng cần xử lý
            </button>
            <button
              onClick={() => setSelectedTab("khách hàng")}
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                selectedTab === "khách hàng"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Khách hàng
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        {selectedTab === "tổng quan" && (
          <>
            {/* Employee Information */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                <div className="flex-shrink-0">
                  {currentEmployee?.avatar ? (
                    <Image
                      src={currentEmployee.avatar}
                      alt={currentEmployee.name}
                      width={128}
                      height={128}
                      className="rounded-full h-32 w-32 object-cover"
                    />
                  ) : (
                    <div className="h-32 w-32 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                      <FiUser className="h-16 w-16" />
                    </div>
                  )}
                </div>
                <div className="flex-grow text-center md:text-left">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {currentEmployee?.name}
                  </h2>
                  <p className="text-gray-600">{currentEmployee?.email}</p>
                  <div className="mt-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      Nhân viên bán hàng
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    <FiCalendar className="inline mr-1" />
                    Thời gian làm việc:{" "}
                    {currentEmployee
                      ? calculateWorkDuration(currentEmployee.hireDate)
                      : ""}
                  </p>
                </div>
                <div className="flex flex-col justify-center items-center md:items-end">
                  <div className="text-lg font-semibold">Hiệu suất</div>
                  <div className="text-3xl font-bold text-green-600">Tốt</div>
                  <div className="text-sm text-gray-500">Tháng này</div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 text-green-600">
                    <FiPackage className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">
                      Đơn hàng hôm nay
                    </p>
                    <p className="text-xl font-semibold text-gray-800">
                      {todayOrders.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                    <FiTruck className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">
                      Đã giao trong tuần
                    </p>
                    <p className="text-xl font-semibold text-gray-800">
                      {deliveredOrders.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                    <FiClock className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">
                      Đơn chờ xử lý
                    </p>
                    <p className="text-xl font-semibold text-gray-800">
                      {pendingOrders.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                    <FiTrendingUp className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">
                      Đơn hàng tuần này
                    </p>
                    <p className="text-xl font-semibold text-gray-800">
                      {thisWeekOrders.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Công cụ quản lý
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link
                  href="/employee/books"
                  className="bg-gray-50 hover:bg-gray-100 p-4 rounded-lg flex flex-col items-center justify-center text-center transition-colors"
                >
                  <FiBook className="h-8 w-8 text-blue-600 mb-2" />
                  <span className="text-gray-700 font-medium">
                    Quản lý sách
                  </span>
                  <span className="text-sm text-gray-500 mt-1">
                    Danh sách và thông tin sách
                  </span>
                </Link>
                <Link
                  href="/employee/orders"
                  className="bg-gray-50 hover:bg-gray-100 p-4 rounded-lg flex flex-col items-center justify-center text-center transition-colors"
                >
                  <FiShoppingCart className="h-8 w-8 text-blue-600 mb-2" />
                  <span className="text-gray-700 font-medium">
                    Quản lý đơn hàng
                  </span>
                  <span className="text-sm text-gray-500 mt-1">
                    Danh sách và thông tin đơn hàng
                  </span>
                </Link>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">
                  Đơn hàng gần đây
                </h3>
                <button
                  onClick={() => setSelectedTab("đơn hàng")}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Xem tất cả
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mã đơn hàng
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Khách hàng
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ngày đặt
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tổng tiền
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
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
                            ?.name || "Khách hàng không xác định"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString(
                            "vi-VN",
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.total.toLocaleString("vi-VN")} đ
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              order.status === OrderStatus.DELIVERED
                                ? "bg-green-100 text-green-800"
                                : order.status === OrderStatus.SHIPPED
                                  ? "bg-blue-100 text-blue-800"
                                  : order.status === OrderStatus.PROCESSING
                                    ? "bg-yellow-100 text-yellow-800"
                                    : order.status === OrderStatus.CANCELLED
                                      ? "bg-red-100 text-red-800"
                                      : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {order.status === OrderStatus.DELIVERED
                              ? "Đã giao hàng"
                              : order.status === OrderStatus.SHIPPED
                                ? "Đang giao hàng"
                                : order.status === OrderStatus.PROCESSING
                                  ? "Đang xử lý"
                                  : order.status === OrderStatus.CANCELLED
                                    ? "Đã huỷ"
                                    : "Không xác định"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tasks */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Nhiệm vụ hôm nay
              </h3>
              <ul className="divide-y divide-gray-200">
                <li className="py-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 rounded border-gray-300"
                      aria-label="Nhiệm vụ: Xác nhận và đóng gói đơn hàng"
                    />
                    <span className="ml-3 text-gray-800">
                      Xác nhận và đóng gói đơn hàng #
                      {pendingOrders[0]?.id || "N/A"}
                    </span>
                    <span className="ml-auto bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                      Gấp
                    </span>
                  </div>
                </li>
                <li className="py-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 rounded border-gray-300"
                      aria-label="Nhiệm vụ: Cập nhật thông tin sản phẩm mới"
                    />
                    <span className="ml-3 text-gray-800">
                      Cập nhật thông tin sản phẩm mới
                    </span>
                  </div>
                </li>
                <li className="py-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 rounded border-gray-300"
                      defaultChecked
                      aria-label="Nhiệm vụ: Họp nhân viên buổi sáng"
                    />
                    <span className="ml-3 text-gray-500 line-through">
                      Họp nhân viên buổi sáng
                    </span>
                    <span className="ml-auto text-green-600 text-xs">
                      Hoàn thành
                    </span>
                  </div>
                </li>
                <li className="py-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 rounded border-gray-300"
                      aria-label="Nhiệm vụ: Liên hệ với khách hàng về đơn hàng"
                    />
                    <span className="ml-3 text-gray-800">
                      Liên hệ với khách hàng về đơn hàng #
                      {orders.length > 2 ? orders[2].id : "N/A"}
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </>
        )}

        {selectedTab === "đơn hàng" && (
          <>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Đơn hàng cần xử lý
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mã đơn hàng
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Khách hàng
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ngày đặt
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tổng tiền
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pendingOrders.length > 0 ? (
                      pendingOrders.map((order) => {
                        const customer = users.find(
                          (user) => user.id === order.userId,
                        );
                        return (
                          <tr key={order.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                              {order.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {customer?.name || "Khách hàng không xác định"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString(
                                "vi-VN",
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {order.total.toLocaleString("vi-VN")} đ
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                Đang xử lý
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button className="text-indigo-600 hover:text-indigo-900 mr-2">
                                Chi tiết
                              </button>
                              <button className="text-green-600 hover:text-green-900">
                                Xác nhận
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-6 py-4 text-center text-gray-500"
                        >
                          Không có đơn hàng nào cần xử lý
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {selectedTab === "khách hàng" && (
          <>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Danh sách khách hàng
              </h2>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Tìm kiếm khách hàng..."
                  className="w-full px-4 py-2 border rounded-lg"
                  aria-label="Tìm kiếm khách hàng"
                />
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Khách hàng
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Số điện thoại
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Đơn hàng
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users
                      .filter((user) => user.role === UserRole.CUSTOMER)
                      .map((customer) => (
                        <tr key={customer.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                {customer.avatar ? (
                                  <Image
                                    src={customer.avatar}
                                    alt={customer.name}
                                    className="h-10 w-10 rounded-full"
                                    width={40}
                                    height={40}
                                  />
                                ) : (
                                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                    <FiUser className="h-5 w-5 text-gray-500" />
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {customer.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {customer.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {(customer as any).phoneNumber || "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {
                              orders.filter(
                                (order) => order.userId === customer.id,
                              ).length
                            }
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-indigo-600 hover:text-indigo-900">
                              Xem chi tiết
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
