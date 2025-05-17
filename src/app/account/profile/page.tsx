"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  FiEdit2,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiArrowLeft,
} from "react-icons/fi";
import { useStore } from "@/store/index";
import { User, UserRole, Customer } from "@/types/user";
import MainLayout from "@/components/layout/MainLayout";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const users = useStore((state) => state.users);
  const updateUser = useStore((state) => state.updateUser);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    avatar: "",
  });

  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin?callbackUrl=/account/profile");
    } else if (status === "authenticated" && session?.user?.email) {
      const user = users.find((u) => u.email === session.user.email);
      if (user) {
        setCurrentUser(user);
        setFormData({
          name: user.name,
          email: user.email,
          phoneNumber:
            user.role === UserRole.CUSTOMER
              ? (user as Customer).phoneNumber || ""
              : "",
          address:
            user.role === UserRole.CUSTOMER
              ? (user as Customer).address || ""
              : "",
          avatar: user.avatar || "",
        });
      }
      setIsLoading(false);
    }
  }, [status, session, router, users]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) return;

    const updatedUser = {
      ...currentUser,
      name: formData.name,
      email: formData.email,
      avatar: formData.avatar,
      ...(currentUser.role === UserRole.CUSTOMER
        ? {
            phoneNumber: formData.phoneNumber,
            address: formData.address,
          }
        : {}),
    };

    updateUser(updatedUser);
    setCurrentUser(updatedUser);
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="spinner h-12 w-12 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải thông tin...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!currentUser) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">
              Không tìm thấy thông tin người dùng
            </h1>
            <p className="text-gray-600 mb-6">Vui lòng đăng nhập lại</p>
            <Link
              href="/signin"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Đăng nhập
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen py-10">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-1">
                Thông tin cá nhân
              </h1>
              <p className="text-gray-600">
                Xem và cập nhật thông tin cá nhân của bạn
              </p>
            </div>
            <button
              onClick={() => router.push("/account")}
              className="bg-white text-blue-600 border border-blue-200 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors flex items-center"
            >
              <FiArrowLeft className="mr-2" />
              Quay lại
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 sm:p-8">
              {!isEditing ? (
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 flex justify-center mb-6 md:mb-0">
                    {formData.avatar ? (
                      <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-gray-100 shadow-sm">
                        <Image
                          src={formData.avatar}
                          alt={formData.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-40 h-40 rounded-full bg-blue-100 flex items-center justify-center border-4 border-gray-100 shadow-sm">
                        <FiUser className="w-20 h-20 text-blue-400" />
                      </div>
                    )}
                  </div>

                  <div className="md:w-2/3">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-800">
                        {formData.name}
                      </h2>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <FiEdit2 className="mr-2" />
                        Chỉnh sửa
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="flex items-center mb-4">
                          <div className="bg-blue-50 rounded-full p-3 mr-3">
                            <FiMail className="text-blue-500" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium">{formData.email}</p>
                          </div>
                        </div>

                        {currentUser.role === UserRole.CUSTOMER &&
                          formData.phoneNumber && (
                            <div className="flex items-center mb-4">
                              <div className="bg-blue-50 rounded-full p-3 mr-3">
                                <FiPhone className="text-blue-500" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">
                                  Số điện thoại
                                </p>
                                <p className="font-medium">
                                  {formData.phoneNumber}
                                </p>
                              </div>
                            </div>
                          )}
                      </div>

                      <div>
                        {currentUser.role === UserRole.CUSTOMER &&
                          formData.address && (
                            <div className="flex items-start mb-4">
                              <div className="bg-blue-50 rounded-full p-3 mr-3 mt-1">
                                <FiMapPin className="text-blue-500" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Địa chỉ</p>
                                <p className="font-medium">
                                  {formData.address}
                                </p>
                              </div>
                            </div>
                          )}

                        <div className="flex items-center">
                          <div className="bg-blue-50 rounded-full p-3 mr-3">
                            <FiUser className="text-blue-500" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Vai trò</p>
                            <p className="font-medium">
                              {currentUser.role === UserRole.CUSTOMER
                                ? "Khách hàng"
                                : currentUser.role === UserRole.EMPLOYEE
                                  ? "Nhân viên"
                                  : currentUser.role ===
                                      UserRole.INVENTORY_MANAGER
                                    ? "Quản lý kho"
                                    : "Quản trị viên"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        <Link
                          href="/account/addresses"
                          className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors group"
                        >
                          <FiMapPin className="h-6 w-6 mx-auto mb-2 text-gray-400 group-hover:text-blue-500" />
                          <h3 className="font-medium">Địa chỉ</h3>
                        </Link>
                        <Link
                          href="/account/orders"
                          className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors group"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 mx-auto mb-2 text-gray-400 group-hover:text-blue-500"
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
                          <h3 className="font-medium">Đơn hàng</h3>
                        </Link>
                        <Link
                          href="/account/security"
                          className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors group"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 mx-auto mb-2 text-gray-400 group-hover:text-blue-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                          </svg>
                          <h3 className="font-medium">Bảo mật</h3>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                      Chỉnh sửa thông tin
                    </h2>
                    <div>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="mr-3 text-gray-600 hover:text-gray-800"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Lưu thay đổi
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Họ và tên
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    {currentUser.role === UserRole.CUSTOMER && (
                      <>
                        <div>
                          <label
                            htmlFor="phoneNumber"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Số điện thoại
                          </label>
                          <input
                            id="phoneNumber"
                            name="phoneNumber"
                            type="tel"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="address"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Địa chỉ
                          </label>
                          <textarea
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </>
                    )}

                    <div className="md:col-span-2">
                      <label
                        htmlFor="avatar"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        URL hình đại diện
                      </label>
                      <input
                        id="avatar"
                        name="avatar"
                        type="text"
                        value={formData.avatar}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
