"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  FiSearch,
  FiFilter,
  FiDownload,
  FiCheckCircle,
  FiX,
  FiEye,
  FiTruck,
  FiArrowLeft,
} from "react-icons/fi";
import { useStore } from "@/store/index";
import { UserRole } from "@/types/user";
import { Order, OrderStatus } from "@/types/order";

export default function OrdersManagementPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const orders = useStore((state) => state.orders);
  const users = useStore((state) => state.users);
  const updateOrder = useStore((state) => state.updateOrder);

  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin?callbackUrl=/admin/orders");
    } else if (status === "authenticated") {
      if (session?.user?.role !== UserRole.EMPLOYEE) {
        router.push("/");
      } else {
        setIsLoading(false);
      }
    }
  }, [status, session, router]);

  const filteredOrders = orders.filter((order) => {
    if (statusFilter !== "all" && order.status !== statusFilter) {
      return false;
    }

    if (searchQuery) {
      const customer = users.find((user) => user.id === order.userId);
      const searchLower = searchQuery.toLowerCase();
      return (
        order.id.toLowerCase().includes(searchLower) ||
        customer?.name.toLowerCase().includes(searchLower) ||
        customer?.email.toLowerCase().includes(searchLower) ||
        order.shippingAddress.fullName.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    const orderToUpdate = orders.find((o) => o.id === orderId);
    if (orderToUpdate) {
      updateOrder({
        ...orderToUpdate,
        status: newStatus,
        updatedAt: new Date(),
      });

      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({
          ...selectedOrder,
          status: newStatus,
          updatedAt: new Date(),
        });
      }
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };

  const exportOrdersToCSV = () => {
    const headers = [
      "Order ID",
      "Customer",
      "Date",
      "Items",
      "Total",
      "Status",
    ];

    const rows = filteredOrders.map((order) => {
      const customer = users.find((user) => user.id === order.userId);
      return [
        order.id,
        customer?.name || "Unknown",
        new Date(order.createdAt).toLocaleDateString(),
        order.items.reduce((sum, item) => sum + item.quantity, 0),
        order.total.toFixed(2),
        order.status,
      ];
    });

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `orders_export_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getOrderStatusClass = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.DELIVERED:
        return "bg-green-100 text-green-800";
      case OrderStatus.SHIPPED:
        return "bg-blue-100 text-blue-800";
      case OrderStatus.PROCESSING:
        return "bg-yellow-100 text-yellow-800";
      case OrderStatus.CANCELLED:
        return "bg-red-100 text-red-800";
      case OrderStatus.PENDING:
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner h-12 w-12 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu đơn hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => router.push("/employee")}
                className="mr-4 flex items-center text-gray-600 hover:text-blue-600"
                aria-label="Quay lại Dashboard"
              >
                <FiArrowLeft className="h-5 w-5 mr-1" />
                <span>Quay lại</span>
              </button>
              <h1 className="text-3xl font-bold text-gray-800">
                Quản lý đơn hàng
              </h1>
            </div>
            <button
              onClick={exportOrdersToCSV}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
              title="Xuất danh sách đơn hàng"
            >
              <FiDownload className="mr-2" /> Xuất đơn hàng
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Tìm kiếm đơn hàng theo ID, tên khách hàng hoặc email..."
              className="w-full px-4 py-3 pl-12 border rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <div className="flex items-center">
            <FiFilter className="mr-2 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border rounded-lg min-w-[180px]"
              title="Lọc theo trạng thái đơn hàng"
              aria-label="Lọc theo trạng thái đơn hàng"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="PENDING">Chờ xử lý</option>
              <option value="PROCESSING">Đang xử lý</option>
              <option value="SHIPPED">Đã giao hàng</option>
              <option value="DELIVERED">Đã nhận hàng</option>
              <option value="CANCELLED">Đã hủy</option>
            </select>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="font-medium text-sm text-gray-500">
              Tổng đơn hàng
            </div>
            <div className="text-xl font-bold mt-1">{orders.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="font-medium text-sm text-yellow-500">
              Đang xử lý
            </div>
            <div className="text-xl font-bold mt-1">
              {
                orders.filter(
                  (order) => order.status === OrderStatus.PROCESSING,
                ).length
              }
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="font-medium text-sm text-blue-500">
              Đã giao hàng
            </div>
            <div className="text-xl font-bold mt-1">
              {
                orders.filter((order) => order.status === OrderStatus.SHIPPED)
                  .length
              }
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="font-medium text-sm text-green-500">
              Đã nhận hàng
            </div>
            <div className="text-xl font-bold mt-1">
              {
                orders.filter((order) => order.status === OrderStatus.DELIVERED)
                  .length
              }
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="font-medium text-sm text-red-500">Đã hủy</div>
            <div className="text-xl font-bold mt-1">
              {
                orders.filter((order) => order.status === OrderStatus.CANCELLED)
                  .length
              }
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
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
                    Số lượng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tổng tiền
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => {
                    const customer = users.find(
                      (user) => user.id === order.userId,
                    );

                    return (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                          {order.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {customer?.name || "Người dùng không xác định"}
                          {customer ? (
                            <div className="text-xs text-gray-500">
                              {customer.email}
                            </div>
                          ) : null}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                          <div className="text-xs">
                            {new Date(order.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.items.reduce(
                            (sum, item) => sum + item.quantity,
                            0,
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.total.toLocaleString("vi-VN")}₫
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getOrderStatusClass(order.status)}`}
                          >
                            {order.status === "PENDING"
                              ? "Chờ xử lý"
                              : order.status === "PROCESSING"
                                ? "Đang xử lý"
                                : order.status === "SHIPPED"
                                  ? "Đã giao hàng"
                                  : order.status === "DELIVERED"
                                    ? "Đã nhận hàng"
                                    : order.status === "CANCELLED"
                                      ? "Đã hủy"
                                      : order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewOrder(order)}
                              className="text-indigo-600 hover:text-indigo-900"
                              title="Xem chi tiết"
                            >
                              <FiEye />
                            </button>

                            {order.status === OrderStatus.PENDING && (
                              <button
                                onClick={() =>
                                  handleUpdateStatus(
                                    order.id,
                                    OrderStatus.PROCESSING,
                                  )
                                }
                                className="text-yellow-600 hover:text-yellow-900"
                                title="Đánh dấu đang xử lý"
                              >
                                <FiFilter />
                              </button>
                            )}

                            {order.status === OrderStatus.PROCESSING && (
                              <button
                                onClick={() =>
                                  handleUpdateStatus(
                                    order.id,
                                    OrderStatus.SHIPPED,
                                  )
                                }
                                className="text-blue-600 hover:text-blue-900"
                                title="Đánh dấu đã giao hàng"
                              >
                                <FiTruck />
                              </button>
                            )}

                            {order.status === OrderStatus.SHIPPED && (
                              <button
                                onClick={() =>
                                  handleUpdateStatus(
                                    order.id,
                                    OrderStatus.DELIVERED,
                                  )
                                }
                                className="text-green-600 hover:text-green-900"
                                title="Đánh dấu đã nhận hàng"
                              >
                                <FiCheckCircle />
                              </button>
                            )}

                            {order.status !== OrderStatus.CANCELLED &&
                              order.status !== OrderStatus.DELIVERED && (
                                <button
                                  onClick={() =>
                                    handleUpdateStatus(
                                      order.id,
                                      OrderStatus.CANCELLED,
                                    )
                                  }
                                  className="text-red-600 hover:text-red-900"
                                  title="Hủy đơn hàng"
                                >
                                  <FiX />
                                </button>
                              )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      Không tìm thấy đơn hàng phù hợp với tìm kiếm của bạn.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isDetailsModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-gray-900/25 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto transition-all duration-300 animate-[fadeIn_0.3s_ease-in-out">
          <div className="bg-white rounded-lg w-full max-w-4xl mx-4">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                Chi tiết đơn hàng - {selectedOrder.id}
              </h2>
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium text-gray-700 mb-2">
                    Thông tin đơn hàng
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Trạng thái:</span>
                      <span
                        className={`font-medium ${
                          selectedOrder.status === OrderStatus.DELIVERED
                            ? "text-green-600"
                            : selectedOrder.status === OrderStatus.SHIPPED
                              ? "text-blue-600"
                              : selectedOrder.status === OrderStatus.PROCESSING
                                ? "text-yellow-600"
                                : selectedOrder.status === OrderStatus.CANCELLED
                                  ? "text-red-600"
                                  : "text-gray-600"
                        }`}
                      >
                        {selectedOrder.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Ngày tạo:</span>
                      <span className="font-medium">
                        {new Date(selectedOrder.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Ngày cập nhật:</span>
                      <span className="font-medium">
                        {new Date(selectedOrder.updatedAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">
                        Phương thức thanh toán:
                      </span>
                      <span className="font-medium">
                        {selectedOrder.payment.method}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">
                        Trạng thái thanh toán:
                      </span>
                      <span className="font-medium">
                        {selectedOrder.payment.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-medium text-gray-700 mb-2">
                    Thông tin khách hàng
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Tên:</span>
                      <span className="font-medium">
                        {selectedOrder.shippingAddress.fullName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Email:</span>
                      <span className="font-medium">
                        {users.find((u) => u.id === selectedOrder.userId)
                          ?.email || "Unknown"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Số điện thoại:</span>
                      <span className="font-medium">
                        {selectedOrder.shippingAddress.phoneNumber}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-medium text-gray-700 mb-2">
                    Thông tin giao hàng
                  </h3>
                  <div className="space-y-1 text-sm">
                    <div className="text-gray-800 font-medium">
                      {selectedOrder.shippingAddress.fullName}
                    </div>
                    <div>{selectedOrder.shippingAddress.addressLine1}</div>
                    {selectedOrder.shippingAddress.addressLine2 && (
                      <div>{selectedOrder.shippingAddress.addressLine2}</div>
                    )}
                    <div>
                      {selectedOrder.shippingAddress.city},{" "}
                      {selectedOrder.shippingAddress.state}{" "}
                      {selectedOrder.shippingAddress.postalCode}
                    </div>
                    <div>{selectedOrder.shippingAddress.country}</div>
                    <div className="mt-2 text-gray-500">
                      Phone: {selectedOrder.shippingAddress.phoneNumber}
                    </div>
                    <div className="mt-2">
                      <span className="font-medium text-gray-500">
                        Phương thức giao hàng:
                      </span>{" "}
                      {selectedOrder.shippingMethod}
                    </div>
                    {selectedOrder.trackingNumber && (
                      <div className="mt-1">
                        <span className="font-medium text-gray-500">
                          Mã vận đơn:
                        </span>{" "}
                        {selectedOrder.trackingNumber}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-6 border rounded-lg p-4">
                <h3 className="font-medium text-gray-700 mb-2">
                  Cập nhật trạng thái đơn hàng
                </h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() =>
                      handleUpdateStatus(selectedOrder.id, OrderStatus.PENDING)
                    }
                    className={`px-3 py-1 text-xs rounded-full ${selectedOrder.status === OrderStatus.PENDING ? "bg-gray-600 text-white" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`}
                  >
                    Chờ xử lý
                  </button>
                  <button
                    onClick={() =>
                      handleUpdateStatus(
                        selectedOrder.id,
                        OrderStatus.PROCESSING,
                      )
                    }
                    className={`px-3 py-1 text-xs rounded-full ${selectedOrder.status === OrderStatus.PROCESSING ? "bg-yellow-600 text-white" : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"}`}
                  >
                    Đang xử lý
                  </button>
                  <button
                    onClick={() =>
                      handleUpdateStatus(selectedOrder.id, OrderStatus.SHIPPED)
                    }
                    className={`px-3 py-1 text-xs rounded-full ${selectedOrder.status === OrderStatus.SHIPPED ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-800 hover:bg-blue-200"}`}
                  >
                    Đã giao hàng
                  </button>
                  <button
                    onClick={() =>
                      handleUpdateStatus(
                        selectedOrder.id,
                        OrderStatus.DELIVERED,
                      )
                    }
                    className={`px-3 py-1 text-xs rounded-full ${selectedOrder.status === OrderStatus.DELIVERED ? "bg-green-600 text-white" : "bg-green-100 text-green-800 hover:bg-green-200"}`}
                  >
                    Đã nhận hàng
                  </button>
                  <button
                    onClick={() =>
                      handleUpdateStatus(
                        selectedOrder.id,
                        OrderStatus.CANCELLED,
                      )
                    }
                    className={`px-3 py-1 text-xs rounded-full ${selectedOrder.status === OrderStatus.CANCELLED ? "bg-red-600 text-white" : "bg-red-100 text-red-800 hover:bg-red-200"}`}
                  >
                    Đã hủy
                  </button>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden ">
                <h3 className="font-medium text-gray-700 p-4 bg-gray-50 border-b">
                  Sản phẩm trong đơn hàng
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Sản phẩm
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Đơn giá
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Số lượng
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tổng tiền
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedOrder.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {item.book?.title || `Book ID: ${item.bookId}`}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            ${item.unitPrice.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {item.quantity}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            ${item.totalPrice.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td
                          colSpan={3}
                          className="px-6 py-3 text-sm font-medium text-gray-900 text-right"
                        >
                          Tổng tiền:
                        </td>
                        <td className="px-6 py-3 text-sm font-medium text-gray-900">
                          ${selectedOrder.subtotal.toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td
                          colSpan={3}
                          className="px-6 py-3 text-sm font-medium text-gray-900 text-right"
                        >
                          Thuế:
                        </td>
                        <td className="px-6 py-3 text-sm font-medium text-gray-900">
                          ${selectedOrder.tax.toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td
                          colSpan={3}
                          className="px-6 py-3 text-sm font-medium text-gray-900 text-right"
                        >
                          Phí giao hàng:
                        </td>
                        <td className="px-6 py-3 text-sm font-medium text-gray-900">
                          ${selectedOrder.shippingCost.toFixed(2)}
                        </td>
                      </tr>
                      {selectedOrder.discount > 0 && (
                        <tr>
                          <td
                            colSpan={3}
                            className="px-6 py-3 text-sm font-medium text-gray-900 text-right"
                          >
                            Giảm giá:
                          </td>
                          <td className="px-6 py-3 text-sm font-medium text-green-600">
                            -${selectedOrder.discount.toFixed(2)}
                          </td>
                        </tr>
                      )}
                      <tr>
                        <td
                          colSpan={3}
                          className="px-6 py-3 text-base font-bold text-gray-900 text-right"
                        >
                          Tổng tiền:
                        </td>
                        <td className="px-6 py-3 text-base font-bold text-gray-900">
                          ${selectedOrder.total.toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-end">
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
