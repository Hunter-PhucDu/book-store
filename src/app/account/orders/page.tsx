"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FiPackage, FiClock, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { useStore } from "@/store/index";
import { Order, OrderStatus } from "@/types/order";
import MainLayout from "@/components/layout/MainLayout";

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const getOrdersByUserId = useStore((state) => state.getOrdersByUserId);

  const [userOrders, setUserOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin?callbackUrl=/account/orders");
    } else if (status === "authenticated" && session?.user?.id) {
      // Lấy đơn hàng của người dùng hiện tại
      const fetchedOrders = getOrdersByUserId(session.user.id);
      setUserOrders(fetchedOrders);
      setIsLoading(false);
    }
  }, [status, session, router, getOrdersByUserId]);

  const getStatusBadgeColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return "bg-yellow-100 text-yellow-800";
      case OrderStatus.PROCESSING:
        return "bg-blue-100 text-blue-800";
      case OrderStatus.SHIPPED:
        return "bg-purple-100 text-purple-800";
      case OrderStatus.DELIVERED:
        return "bg-green-100 text-green-800";
      case OrderStatus.CANCELLED:
        return "bg-red-100 text-red-800";
      case OrderStatus.RETURNED:
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return <FiClock className="mr-1" />;
      case OrderStatus.PROCESSING:
        return <FiPackage className="mr-1" />;
      case OrderStatus.SHIPPED:
        return <FiPackage className="mr-1" />;
      case OrderStatus.DELIVERED:
        return <FiCheckCircle className="mr-1" />;
      case OrderStatus.CANCELLED:
        return <FiXCircle className="mr-1" />;
      case OrderStatus.RETURNED:
        return <FiXCircle className="mr-1" />;
      default:
        return <FiClock className="mr-1" />;
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="spinner h-12 w-12 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải đơn hàng...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-1">
                Đơn hàng của tôi
              </h1>
              <p className="text-gray-600">
                Quản lý và theo dõi tình trạng đơn hàng của bạn
              </p>
            </div>
            <button
              onClick={() => router.push("/account")}
              className="bg-white text-blue-600 border border-blue-200 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Quay lại
            </button>
          </div>

          {userOrders.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <div className="bg-blue-50 rounded-full p-4 w-20 h-20 mx-auto flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                Bạn chưa có đơn hàng nào
              </h2>
              <p className="text-gray-600 max-w-md mx-auto mb-8">
                Khi bạn đặt hàng, những đơn hàng của bạn sẽ xuất hiện tại đây để
                bạn có thể theo dõi trạng thái và lịch sử mua sắm.
              </p>
              <button
                onClick={() => router.push("/store")}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md flex items-center mx-auto"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                Khám phá cửa hàng sách
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {userOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg"
                >
                  <div className="px-6 py-4 border-b bg-gray-50 flex flex-col md:flex-row justify-between md:items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-800">
                          Đơn hàng #{order.id}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center ${getStatusBadgeColor(
                            order.status,
                          )}`}
                        >
                          {getStatusIcon(order.status)}
                          {order.status === OrderStatus.PENDING
                            ? "Chờ xác nhận"
                            : order.status === OrderStatus.PROCESSING
                              ? "Đang xử lý"
                              : order.status === OrderStatus.SHIPPED
                                ? "Đang giao hàng"
                                : order.status === OrderStatus.DELIVERED
                                  ? "Đã giao"
                                  : order.status === OrderStatus.CANCELLED
                                    ? "Đã hủy"
                                    : order.status === OrderStatus.RETURNED
                                      ? "Đã trả hàng"
                                      : order.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="text-sm text-gray-600 flex items-center">
                          <FiClock className="mr-1 h-4 w-4" />
                          Ngày đặt:{" "}
                          {new Date(order.orderDate).toLocaleDateString(
                            "vi-VN",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.items.reduce(
                            (sum, item) => sum + item.quantity,
                            0,
                          )}{" "}
                          sản phẩm
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {order.status === OrderStatus.DELIVERED && (
                        <button className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                          </svg>
                          Hóa đơn
                        </button>
                      )}
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                        Sao chép đơn
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="border-b border-gray-100 pb-4 mb-4">
                      <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                        <FiPackage className="mr-2 text-blue-500" />
                        Chi tiết đơn hàng
                      </h4>
                      <div className="space-y-4">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center py-2 border-b border-gray-50 last:border-0"
                          >
                            <div className="flex-shrink-0 w-10 h-14 bg-gray-100 rounded flex items-center justify-center text-gray-500">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                />
                              </svg>
                            </div>
                            <div className="flex-1 ml-4">
                              <p className="font-medium text-gray-800 hover:text-blue-600 transition-colors">
                                {item.bookId}
                              </p>
                              <div className="flex justify-between items-center mt-1">
                                <p className="text-sm text-gray-600">
                                  Số lượng: {item.quantity} x{" "}
                                  {item.unitPrice.toLocaleString("vi-VN")}₫
                                </p>
                                <p className="font-semibold text-blue-700">
                                  {item.totalPrice.toLocaleString("vi-VN")}₫
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="text-sm text-gray-600">
                        Địa chỉ giao hàng: {order.shippingAddress.addressLine1},{" "}
                        {order.shippingAddress.city}
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="flex items-center text-gray-600 text-sm gap-4 mb-2">
                          <span>
                            Tổng phụ: {order.subtotal.toLocaleString("vi-VN")}₫
                          </span>
                          <span>
                            Phí vận chuyển:{" "}
                            {order.shippingCost.toLocaleString("vi-VN")}₫
                          </span>
                        </div>
                        <div className="flex items-center">
                          <p className="text-gray-700 font-medium mr-3">
                            Tổng cộng:
                          </p>
                          <p className="text-xl font-bold text-blue-700">
                            {order.total.toLocaleString("vi-VN")}₫
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={() =>
                          router.push(`/account/orders/${order.id}`)
                        }
                        className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                      >
                        Xem chi tiết đầy đủ
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
