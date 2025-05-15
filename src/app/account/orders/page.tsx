"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FiPackage, FiClock, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { useStore } from "@/store/index";
import { Order, OrderStatus } from "@/types/order";

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const orders = useStore((state) => state.orders);
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner h-12 w-12 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải đơn hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Đơn hàng của tôi
        </h1>

        {userOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-gray-400 mx-auto h-16 w-16 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
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
            <h2 className="text-xl font-medium text-gray-700 mb-2">
              Bạn chưa có đơn hàng nào
            </h2>
            <p className="text-gray-500 mb-6">
              Khi bạn đặt hàng, chúng sẽ được hiển thị ở đây
            </p>
            <button
              onClick={() => router.push("/store")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Mua sắm ngay
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {userOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow overflow-hidden"
              >
                <div className="px-6 py-4 border-b flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">
                      Đơn hàng #{order.id}
                    </p>
                    <p className="text-sm text-gray-500">
                      Ngày đặt: {new Date(order.orderDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm flex items-center ${getStatusBadgeColor(
                        order.status,
                      )}`}
                    >
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center">
                        <div className="flex-1">
                          <p className="font-medium">{item.bookId}</p>
                          <p className="text-sm text-gray-500">
                            Số lượng: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {item.totalPrice.toLocaleString("vi-VN")} đ
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t">
                    <div className="flex justify-between">
                      <p className="font-medium">Tổng cộng</p>
                      <p className="font-bold">
                        {order.total.toLocaleString("vi-VN")} đ
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => router.push(`/account/orders/${order.id}`)}
                      className="bg-blue-100 text-blue-700 px-4 py-2 rounded hover:bg-blue-200"
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
