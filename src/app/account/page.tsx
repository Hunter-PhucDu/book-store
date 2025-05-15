"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FiUser,
  FiPackage,
  FiHeart,
  FiCreditCard,
  FiMapPin,
  FiLogOut,
  FiSettings,
  FiShield,
} from "react-icons/fi";
import { useStore } from "@/store/index";
import MainLayout from "@/components/layout/MainLayout";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const orders = useStore((state) => state.orders);
  const getOrdersByUserId = useStore((state) => state.getOrdersByUserId);

  const [userOrders, setUserOrders] = useState<number>(0);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin?callbackUrl=/account");
    } else if (status === "authenticated" && session?.user?.id) {
      // Lấy số lượng đơn hàng của người dùng
      const fetchedOrders = getOrdersByUserId(session.user.id);
      setUserOrders(fetchedOrders.length);
      setIsLoading(false);
    }
  }, [status, session, router, getOrdersByUserId]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="spinner h-12 w-12 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">
              Đang tải thông tin tài khoản...
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen py-10 animate-fade-in">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 relative inline-block">
            <span className="relative z-10">Tài khoản của tôi</span>
            <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 opacity-75"></span>
          </h1>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8 transform transition-all hover:shadow-lg">
            <div className="flex flex-col md:flex-row items-center md:items-start">
              <div className="h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4 md:mb-0">
                <FiUser className="h-10 w-10" />
              </div>
              <div className="md:ml-6 text-center md:text-left">
                <h2 className="text-2xl font-semibold">
                  {session?.user?.name}
                </h2>
                <p className="text-gray-600">{session?.user?.email}</p>
                <div className="mt-3">
                  <button
                    onClick={() => router.push("/account/profile")}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center mx-auto md:mx-0"
                  >
                    <FiSettings className="mr-1" /> Chỉnh sửa thông tin
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Đơn hàng */}
            <Link href="/account/orders" className="group">
              <div className="bg-white rounded-lg shadow-md p-6 h-full transform transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    <FiPackage className="h-6 w-6" />
                  </div>
                  <h2 className="ml-4 text-lg font-semibold group-hover:text-blue-600 transition-colors">
                    Đơn hàng của tôi
                  </h2>
                </div>
                <p className="text-gray-600 mb-2">
                  Theo dõi và quản lý đơn hàng
                </p>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">{userOrders} đơn hàng</p>
                  <span className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    Xem &rarr;
                  </span>
                </div>
              </div>
            </Link>

            {/* Sản phẩm yêu thích */}
            <Link href="/account/wishlist" className="group">
              <div className="bg-white rounded-lg shadow-md p-6 h-full transform transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                    <FiHeart className="h-6 w-6" />
                  </div>
                  <h2 className="ml-4 text-lg font-semibold group-hover:text-red-600 transition-colors">
                    Sản phẩm yêu thích
                  </h2>
                </div>
                <p className="text-gray-600 mb-2">
                  Sách bạn đã đánh dấu yêu thích
                </p>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">0 sản phẩm</p>
                  <span className="text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    Xem &rarr;
                  </span>
                </div>
              </div>
            </Link>

            {/* Địa chỉ */}
            <Link href="/account/addresses" className="group">
              <div className="bg-white rounded-lg shadow-md p-6 h-full transform transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all duration-300">
                    <FiMapPin className="h-6 w-6" />
                  </div>
                  <h2 className="ml-4 text-lg font-semibold group-hover:text-green-600 transition-colors">
                    Địa chỉ của tôi
                  </h2>
                </div>
                <p className="text-gray-600 mb-2">Quản lý địa chỉ giao hàng</p>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    Thêm hoặc chỉnh sửa địa chỉ
                  </p>
                  <span className="text-green-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    Xem &rarr;
                  </span>
                </div>
              </div>
            </Link>

            {/* Phương thức thanh toán */}
            <Link href="/account/payment-methods" className="group">
              <div className="bg-white rounded-lg shadow-md p-6 h-full transform transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                    <FiCreditCard className="h-6 w-6" />
                  </div>
                  <h2 className="ml-4 text-lg font-semibold group-hover:text-purple-600 transition-colors">
                    Phương thức thanh toán
                  </h2>
                </div>
                <p className="text-gray-600 mb-2">
                  Quản lý thẻ và phương thức thanh toán
                </p>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    Thêm hoặc chỉnh sửa phương thức thanh toán
                  </p>
                  <span className="text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    Xem &rarr;
                  </span>
                </div>
              </div>
            </Link>

            {/* Thông tin cá nhân */}
            <Link href="/account/profile" className="group">
              <div className="bg-white rounded-lg shadow-md p-6 h-full transform transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 group-hover:bg-yellow-600 group-hover:text-white transition-all duration-300">
                    <FiUser className="h-6 w-6" />
                  </div>
                  <h2 className="ml-4 text-lg font-semibold group-hover:text-yellow-600 transition-colors">
                    Thông tin cá nhân
                  </h2>
                </div>
                <p className="text-gray-600 mb-2">Cập nhật thông tin cá nhân</p>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    Chỉnh sửa thông tin tài khoản
                  </p>
                  <span className="text-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    Xem &rarr;
                  </span>
                </div>
              </div>
            </Link>

            {/* Bảo mật */}
            <Link href="/account/security" className="group">
              <div className="bg-white rounded-lg shadow-md p-6 h-full transform transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 group-hover:bg-gray-600 group-hover:text-white transition-all duration-300">
                    <FiShield className="h-6 w-6" />
                  </div>
                  <h2 className="ml-4 text-lg font-semibold group-hover:text-gray-600 transition-colors">
                    Bảo mật
                  </h2>
                </div>
                <p className="text-gray-600 mb-2">
                  Quản lý mật khẩu và bảo mật tài khoản
                </p>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    Thay đổi mật khẩu và cài đặt bảo mật
                  </p>
                  <span className="text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    Xem &rarr;
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Đăng xuất */}
          <div className="mt-8">
            <button className="w-full md:w-auto px-6 py-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
              <FiLogOut className="h-5 w-5 text-gray-600" />
              <span className="font-medium">Đăng xuất</span>
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
