"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FiArrowLeft,
  FiLock,
  FiAlertTriangle,
  FiLogOut,
  FiEye,
  FiEyeOff,
  FiSmartphone,
  FiCheck,
  FiInfo,
  FiTrash2 as FiTrash,
} from "react-icons/fi";
import MainLayout from "@/components/layout/MainLayout";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SecurityPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(status === "loading");

  // Email for display
  const userEmail = session?.user?.email || "user@example.com";

  // Form states
  const [changePasswordForm, setChangePasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Toggle states
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);

  // For demo device list
  const [devices, setDevices] = useState([
    {
      id: "dev1",
      name: "iPhone 13",
      location: "Hồ Chí Minh, Việt Nam",
      lastActive: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
      isCurrent: true,
    },
    {
      id: "dev2",
      name: "Chrome - Windows",
      location: "Hà Nội, Việt Nam",
      lastActive: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      isCurrent: false,
    },
  ]);

  // Password validation rules
  const passwordRules = [
    {
      id: "length",
      text: "Ít nhất 8 ký tự",
      validate: (password: string) => password.length >= 8,
    },
    {
      id: "uppercase",
      text: "Ít nhất 1 chữ hoa",
      validate: (password: string) => /[A-Z]/.test(password),
    },
    {
      id: "lowercase",
      text: "Ít nhất 1 chữ thường",
      validate: (password: string) => /[a-z]/.test(password),
    },
    {
      id: "number",
      text: "Ít nhất 1 số",
      validate: (password: string) => /[0-9]/.test(password),
    },
    {
      id: "special",
      text: "Ít nhất 1 ký tự đặc biệt",
      validate: (password: string) => /[!@#$%^&*(),.?":{}|<>]/.test(password),
    },
  ];

  // Effects
  useState(() => {
    if (status === "unauthenticated") {
      router.push("/signin?callbackUrl=/account/security");
    } else if (status === "authenticated") {
      setIsLoading(false);
    }
  });

  // Handlers
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setChangePasswordForm((prev) => ({ ...prev, [name]: value }));

    // Clear success message when typing
    if (passwordSuccess) {
      setPasswordSuccess(false);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: string[] = [];

    // Check if current password is filled
    if (!changePasswordForm.currentPassword) {
      errors.push("Vui lòng nhập mật khẩu hiện tại");
    }

    // Validate new password
    const failedRules = passwordRules.filter(
      (rule) => !rule.validate(changePasswordForm.newPassword),
    );

    if (failedRules.length > 0) {
      errors.push("Mật khẩu mới không đáp ứng các yêu cầu bảo mật");
    }

    // Check if passwords match
    if (changePasswordForm.newPassword !== changePasswordForm.confirmPassword) {
      errors.push("Mật khẩu mới và xác nhận mật khẩu không khớp");
    }

    if (errors.length > 0) {
      setPasswordErrors(errors);
      setPasswordSuccess(false);
      return;
    }

    // Success case
    setPasswordSuccess(true);
    setPasswordErrors([]);

    // Reset form after successful submission
    setTimeout(() => {
      setChangePasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }, 100);
  };

  const handleRemoveDevice = (deviceId: string) => {
    setDevices(devices.filter((device) => device.id !== deviceId));
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="spinner h-12 w-12 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải cài đặt bảo mật...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <Link
            href="/account"
            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
          >
            <FiArrowLeft className="mr-1" />
            <span>Quay lại</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">
            Bảo mật tài khoản
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left column - Password Management */}
          <div className="lg:col-span-7">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="border-b border-gray-200">
                <div className="px-6 py-5 flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <FiLock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-lg font-medium text-gray-900">
                      Thay đổi mật khẩu
                    </h2>
                    <p className="text-sm text-gray-500">
                      Cập nhật mật khẩu để bảo vệ tài khoản của bạn
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {passwordSuccess && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <FiCheck className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-green-800">
                          Mật khẩu của bạn đã được thay đổi thành công!
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {passwordErrors.length > 0 && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <FiAlertTriangle className="h-5 w-5 text-red-600" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">
                          Không thể thay đổi mật khẩu
                        </h3>
                        <div className="mt-2 text-sm text-red-700">
                          <ul className="list-disc pl-5 space-y-1">
                            {passwordErrors.map((error, index) => (
                              <li key={index}>{error}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handlePasswordSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="currentPassword"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Mật khẩu hiện tại
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          name="currentPassword"
                          id="currentPassword"
                          value={changePasswordForm.currentPassword}
                          onChange={handlePasswordChange}
                          required
                          className="py-2 px-3 block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 pr-10"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                          {showCurrentPassword ? (
                            <FiEyeOff className="h-5 w-5" />
                          ) : (
                            <FiEye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="newPassword"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Mật khẩu mới
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          name="newPassword"
                          id="newPassword"
                          value={changePasswordForm.newPassword}
                          onChange={handlePasswordChange}
                          required
                          className="py-2 px-3 block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 pr-10"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                          {showNewPassword ? (
                            <FiEyeOff className="h-5 w-5" />
                          ) : (
                            <FiEye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Xác nhận mật khẩu mới
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          id="confirmPassword"
                          value={changePasswordForm.confirmPassword}
                          onChange={handlePasswordChange}
                          required
                          className="py-2 px-3 block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 pr-10"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? (
                            <FiEyeOff className="h-5 w-5" />
                          ) : (
                            <FiEye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Password requirements */}
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">
                      Yêu cầu mật khẩu:
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {passwordRules.map((rule) => (
                        <div
                          key={rule.id}
                          className={`flex items-center text-sm ${
                            rule.validate(changePasswordForm.newPassword)
                              ? "text-green-800"
                              : "text-gray-500"
                          }`}
                        >
                          {rule.validate(changePasswordForm.newPassword) ? (
                            <FiCheck className="h-4 w-4 mr-2" />
                          ) : (
                            <FiInfo className="h-4 w-4 mr-2" />
                          )}
                          <span>{rule.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      type="submit"
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cập nhật mật khẩu
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Two-Factor Authentication */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden mt-8">
              <div className="px-6 py-5 flex justify-between items-center border-b border-gray-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <FiSmartphone className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-lg font-medium text-gray-900">
                      Xác thực hai yếu tố
                    </h2>
                    <p className="text-sm text-gray-500">
                      Tăng cường bảo mật cho tài khoản của bạn
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="mr-3 text-sm">
                    {twoFactorEnabled ? "Đã bật" : "Đã tắt"}
                  </span>
                  <button
                    type="button"
                    className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none ${
                      twoFactorEnabled ? "bg-blue-600" : "bg-gray-200"
                    }`}
                    onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                  >
                    <span className="sr-only">Bật/tắt 2FA</span>
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                        twoFactorEnabled ? "translate-x-5" : "translate-x-0"
                      }`}
                    ></span>
                  </button>
                </div>
              </div>

              <div className="p-6">
                {" "}
                <p className="text-sm text-gray-600 mb-4">
                  Xác thực hai yếu tố (2FA) yêu cầu một mã bảo mật ngoài mật
                  khẩu của bạn khi đăng nhập. Bạn sẽ nhận được mã này qua tin
                  nhắn SMS hoặc gửi đến email {userEmail}.
                </p>
                {twoFactorEnabled ? (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-md flex items-start">
                    <FiCheck className="h-5 w-5 text-green-600 mt-0.5" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">
                        Xác thực hai yếu tố đã được kích hoạt
                      </h3>
                      <div className="mt-1 text-sm text-green-700">
                        <p>
                          Tài khoản của bạn đang được bảo vệ bởi xác thực hai
                          yếu tố. Mỗi khi đăng nhập, bạn sẽ cần nhập mã được gửi
                          đến số điện thoại đã đăng ký.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => setTwoFactorEnabled(true)}
                  >
                    Thiết lập xác thực hai yếu tố
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right column - Devices & Settings */}
          <div className="lg:col-span-5">
            {/* Active Devices */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  Thiết bị đăng nhập
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Các thiết bị hiện đang đăng nhập vào tài khoản của bạn
                </p>
              </div>

              <div className="divide-y divide-gray-200">
                {devices.map((device) => (
                  <div key={device.id} className="p-6">
                    <div className="flex justify-between">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <FiSmartphone
                            className={`h-6 w-6 ${device.isCurrent ? "text-green-500" : "text-gray-400"}`}
                          />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900 flex items-center">
                            {device.name}
                            {device.isCurrent && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Thiết bị hiện tại
                              </span>
                            )}
                          </p>
                          <p className="mt-1 text-sm text-gray-500">
                            {device.location}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            Hoạt động gần đây:{" "}
                            {formatLastActive(device.lastActive)}
                          </p>
                        </div>
                      </div>
                      {!device.isCurrent && (
                        <button
                          onClick={() => handleRemoveDevice(device.id)}
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          Đăng xuất
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {devices.length === 0 && (
                  <div className="p-6 text-center text-gray-500 italic">
                    Không có thiết bị nào đang hoạt động
                  </div>
                )}
              </div>
            </div>

            {/* Security Notifications */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  Thông báo bảo mật
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Quản lý cách bạn nhận thông báo về bảo mật tài khoản
                </p>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      Thông báo qua email
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Nhận email khi có hoạt động đáng ngờ hoặc thay đổi bảo mật
                    </p>
                  </div>
                  <button
                    type="button"
                    className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none ${
                      emailNotifications ? "bg-blue-600" : "bg-gray-200"
                    }`}
                    onClick={() => setEmailNotifications(!emailNotifications)}
                  >
                    <span className="sr-only">Bật/tắt thông báo email</span>
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                        emailNotifications ? "translate-x-5" : "translate-x-0"
                      }`}
                    ></span>
                  </button>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      Cảnh báo đăng nhập
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Thông báo khi có đăng nhập mới vào tài khoản của bạn
                    </p>
                  </div>
                  <button
                    type="button"
                    className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none ${
                      loginAlerts ? "bg-blue-600" : "bg-gray-200"
                    }`}
                    onClick={() => setLoginAlerts(!loginAlerts)}
                  >
                    <span className="sr-only">Bật/tắt cảnh báo đăng nhập</span>
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                        loginAlerts ? "translate-x-5" : "translate-x-0"
                      }`}
                    ></span>
                  </button>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden mt-8 border border-red-100">
              <div className="px-6 py-5 border-b border-red-100 bg-red-50">
                <div className="flex items-center">
                  <FiAlertTriangle className="h-5 w-5 text-red-600" />
                  <h2 className="ml-2 text-lg font-medium text-red-800">
                    Khu vực nguy hiểm
                  </h2>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-1">
                    Đăng xuất khỏi tất cả các thiết bị
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">
                    Đăng xuất tài khoản của bạn khỏi tất cả các thiết bị ngoại
                    trừ thiết bị hiện tại
                  </p>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <FiLogOut className="mr-2 h-4 w-4" />
                    Đăng xuất khỏi các thiết bị khác
                  </button>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-1">
                    Xóa tài khoản
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">
                    Xóa vĩnh viễn tài khoản của bạn và tất cả dữ liệu liên quan
                  </p>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <FiTrash className="mr-2 h-4 w-4" />
                    Xóa tài khoản của tôi
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

// Helper function to format relative time
function formatLastActive(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "vừa xong";
  } else if (diffInSeconds < 3600) {
    return `${Math.floor(diffInSeconds / 60)} phút trước`;
  } else if (diffInSeconds < 86400) {
    return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
  } else {
    return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
  }
}
