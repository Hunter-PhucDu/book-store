"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  FiUser,
  FiMail,
  FiLock,
  FiPhone,
  FiMapPin,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";
import { useStore } from "@/store/index";
import { UserRole } from "@/types/user";

export default function SignUp() {
  const router = useRouter();
  const addUser = useStore((state) => state.addUser);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    address: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [step, setStep] = useState(1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Form validation
    if (!formData.name || !formData.email || !formData.password) {
      setErrorMessage("Tên, email và mật khẩu là bắt buộc");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Mật khẩu không khớp");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage("");
      // Add user to our mock database
      addUser({
        name: formData.name,
        email: formData.email,
        role: UserRole.CUSTOMER,
      });

      // Redirect to sign-in page after successful registration
      router.push("/signin?registered=true");
    } catch (err) {
      console.error("Registration error:", err);
      setErrorMessage("Đã xảy ra lỗi khi đăng ký");
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.name || !formData.email) {
        setErrorMessage("Vui lòng điền đầy đủ thông tin");
        return;
      }
      setErrorMessage("");
      setStep(2);
    }
  };

  const prevStep = () => {
    setStep(1);
    setErrorMessage("");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left side - Form */}
      <div className="flex flex-col justify-center w-full md:w-1/2 p-6 sm:p-12 lg:px-20">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link href="/" className="flex justify-center mb-5">
            <Image
              src="/images/logo.png"
              alt="BookStore Logo"
              width={300}
              height={300}
              className="h-20 w-auto"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/next.svg"; // Fallback to Next.js logo if our logo is missing
              }}
            />
          </Link>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Tạo tài khoản mới
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Đã có tài khoản?{" "}
            <Link
              href="/signin"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Đăng nhập
            </Link>
          </p>
        </div>

        {/* Progress indicator */}
        <div className="sm:mx-auto sm:w-full sm:max-w-md mt-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col items-center">
              <div
                className={`rounded-full h-10 w-10 flex items-center justify-center ${step >= 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}`}
              >
                <FiUser className="h-5 w-5" />
              </div>
              <span className="text-xs mt-1">Thông tin</span>
            </div>
            <div
              className={`h-1 flex-1 mx-2 ${step >= 2 ? "bg-blue-600" : "bg-gray-200"}`}
            ></div>
            <div className="flex flex-col items-center">
              <div
                className={`rounded-full h-10 w-10 flex items-center justify-center ${step >= 2 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}`}
              >
                <FiLock className="h-5 w-5" />
              </div>
              <span className="text-xs mt-1">Bảo mật</span>
            </div>
          </div>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="sm:mx-auto sm:w-full sm:max-w-md mt-4">
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FiAlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">
                    {errorMessage}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="sm:mx-auto sm:w-full sm:max-w-md mt-4">
          <div className="bg-white py-8 px-4 sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {step === 1 && (
                <>
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Họ và tên
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiUser className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Nhập họ và tên của bạn"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiMail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Nhập địa chỉ email của bạn"
                      />
                    </div>
                  </div>

                  {/* Phone Number (Optional) */}
                  <div>
                    <label
                      htmlFor="phoneNumber"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Số điện thoại{" "}
                      <span className="text-gray-500 text-xs">
                        (Không bắt buộc)
                      </span>
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiPhone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        autoComplete="tel"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Nhập số điện thoại của bạn"
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={nextStep}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 ease-in-out"
                    >
                      Tiếp tục
                    </button>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  {/* Password */}
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Mật khẩu
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiLock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Tạo mật khẩu mới"
                      />
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Xác nhận mật khẩu
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiLock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Nhập lại mật khẩu"
                      />
                    </div>
                  </div>

                  {/* Address (Optional) */}
                  <div>
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Địa chỉ{" "}
                      <span className="text-gray-500 text-xs">
                        (Không bắt buộc)
                      </span>
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiMapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="address"
                        name="address"
                        type="text"
                        autoComplete="street-address"
                        value={formData.address}
                        onChange={handleChange}
                        className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Nhập địa chỉ của bạn"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex-1 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 ease-in-out"
                    >
                      Quay lại
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 ease-in-out disabled:opacity-70"
                    >
                      {isLoading ? "Đang xử lý..." : "Tạo tài khoản"}
                    </button>
                  </div>
                </>
              )}
            </form>

            <div className="mt-6 text-center text-sm">
              <p>Khi đăng ký, bạn đồng ý với</p>
              <div className="mt-1 space-x-1">
                <Link
                  href="/terms-of-service"
                  className="text-blue-600 hover:text-blue-500"
                >
                  Điều khoản dịch vụ
                </Link>
                <span>và</span>
                <Link
                  href="/privacy-policy"
                  className="text-blue-600 hover:text-blue-500"
                >
                  Chính sách bảo mật
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden md:flex md:w-1/2 bg-blue-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-l from-blue-900 to-blue-700 opacity-90"></div>
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
            alt="Person reading a book in a library"
            fill
            style={{ objectFit: "cover", objectPosition: "center" }}
            priority
          />
          <div className="absolute inset-0 bg-blue-900/60 backdrop-blur-sm"></div>
        </div>
        <div className="relative z-10 flex flex-col justify-center items-start p-12 text-white">
          <h2 className="text-4xl font-bold mb-6">
            Tham gia cộng đồng đọc sách
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Hãy trở thành thành viên để nhận được những ưu đãi đặc biệt và cập
            nhật những đầu sách mới nhất.
          </p>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-md">
            <h3 className="text-xl font-semibold mb-4">Lợi ích khi đăng ký</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <FiCheckCircle className="h-5 w-5 text-blue-300" />
                </div>
                <p className="ml-3 text-blue-100">
                  Giảm giá 10% cho đơn hàng đầu tiên
                </p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <FiCheckCircle className="h-5 w-5 text-blue-300" />
                </div>
                <p className="ml-3 text-blue-100">
                  Thông báo về sách mới và khuyến mãi
                </p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <FiCheckCircle className="h-5 w-5 text-blue-300" />
                </div>
                <p className="ml-3 text-blue-100">
                  Theo dõi đơn hàng và lịch sử mua sắm
                </p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <FiCheckCircle className="h-5 w-5 text-blue-300" />
                </div>
                <p className="ml-3 text-blue-100">
                  Tích điểm thưởng với mỗi lần mua hàng
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
