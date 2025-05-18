//cart
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  FiShoppingCart,
  FiTrash2,
  FiMinus,
  FiPlus,
  FiArrowLeft,
  FiCheck,
  FiHome,
  FiCreditCard,
  FiCheckCircle,
} from "react-icons/fi";
import { useSession } from "next-auth/react";
import { Address } from "@/types/order";
import { initialBooks } from "@/store/bookData";
import { useStore } from "@/store/index";
import MainLayout from "@/components/layout/MainLayout";

export default function CartPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const cart = useStore((state) => state.cart);
  const updateCartItem = useStore((state) => state.updateCartItem);
  const removeFromCart = useStore((state) => state.removeFromCart);
  const clearCart = useStore((state) => state.clearCart);

  const books = initialBooks;

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [shippingInfo, setShippingInfo] = useState<Address>({
    fullName: session?.user?.name || "",
    addressLine1: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    phoneNumber: "",
  });

  const calculateCartTotal = () => {
    return cart.reduce((total, item) => {
      const book = books.find((b) => b.id === item.bookId);
      return total + (book?.price || 0) * item.quantity;
    }, 0);
  };

  const cartTotal = calculateCartTotal();

  const handleQuantityChange = (bookId: string, quantity: number) => {
    if (quantity < 1) {
      return;
    }

    const book = books.find((book) => book.id === bookId);
    if (book && quantity <= book.stock) {
      updateCartItem(bookId, quantity);
    }
  };

  const handleRemoveItem = (bookId: string) => {
    removeFromCart(bookId);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextStep = () => {
    setActiveStep((current) => Math.min(current + 1, 4));
  };

  const handlePrevStep = () => {
    setActiveStep((current) => Math.max(current - 1, 1));
  };

  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

  const handleCheckout = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (!session) {
      router.push("/signin?callbackUrl=/store/cart");
      return;
    }

    setActiveStep(4);

    setTimeout(() => {
      clearCart();
      setIsCheckingOut(false);
      setShowSuccessNotification(true);

      setTimeout(() => {
        setShowSuccessNotification(false);
      }, 5000);
    }, 3000);
  };

  if (cart.length === 0) {
    return (
      <MainLayout>
        <div className="bg-gray-50 min-h-[70vh] py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center bg-white p-8 rounded-2xl shadow-sm">
              <div className="flex justify-center">
                <div className="bg-blue-50 rounded-full p-5 mb-6 inline-block">
                  <FiShoppingCart className="h-16 w-16 text-blue-500" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                Giỏ hàng của bạn đang trống
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Hãy thêm sách vào giỏ hàng để bắt đầu quá trình đặt hàng của
                bạn.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/store"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  <FiArrowLeft className="mr-2" />
                  Duyệt Sách
                </Link>
                {session && (
                  <Link
                    href="/account"
                    className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    Đến trang tài khoản
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {isCheckingOut && (
            <div className="max-w-4xl mx-auto mb-8">
              <div className="flex items-center justify-between">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activeStep >= 1
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {activeStep > 1 ? <FiCheck className="h-5 w-5" /> : "1"}
                  </div>
                  <p className="text-sm mt-2 font-medium text-gray-700">
                    Giỏ hàng
                  </p>
                </div>

                <div
                  className={`flex-1 h-1 mx-2 ${activeStep >= 2 ? "bg-blue-600" : "bg-gray-200"}`}
                ></div>

                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activeStep >= 2
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {activeStep > 2 ? <FiCheck className="h-5 w-5" /> : "2"}
                  </div>
                  <p className="text-sm mt-2 font-medium text-gray-700">
                    Thông tin giao hàng
                  </p>
                </div>

                <div
                  className={`flex-1 h-1 mx-2 ${activeStep >= 3 ? "bg-blue-600" : "bg-gray-200"}`}
                ></div>

                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activeStep >= 3
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {activeStep > 3 ? <FiCheck className="h-5 w-5" /> : "3"}
                  </div>
                  <p className="text-sm mt-2 font-medium text-gray-700">
                    Thanh toán
                  </p>
                </div>

                <div
                  className={`flex-1 h-1 mx-2 ${activeStep >= 4 ? "bg-blue-600" : "bg-gray-200"}`}
                ></div>

                <div className="flex flex-col items-center">
                  {" "}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activeStep >= 4
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {activeStep > 4 ? <FiCheck className="h-5 w-5" /> : "4"}
                  </div>
                  <p className="text-sm mt-2 font-medium text-gray-700">
                    Xác nhận
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <h1 className="text-3xl font-bold text-gray-800">
                Giỏ Hàng Của Bạn
              </h1>
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                {cart.length} sản phẩm
              </span>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-2/3">
                <div className="bg-white shadow-md rounded-xl overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-4 text-left text-sm font-semibold text-gray-700"
                        >
                          Sản phẩm
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-4 text-center text-sm font-semibold text-gray-700"
                        >
                          Giá
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-4 text-center text-sm font-semibold text-gray-700"
                        >
                          Số lượng
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-4 text-right text-sm font-semibold text-gray-700"
                        >
                          Thành tiền
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Thao tác</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {cart.map((item) => {
                        const book = books.find((b) => b.id === item.bookId);
                        if (!book) return null;

                        return (
                          <tr
                            key={item.bookId}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-5">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-20 w-14 relative rounded overflow-hidden border border-gray-100 shadow-sm">
                                  <Image
                                    src={book.coverImage}
                                    alt={book.title}
                                    fill
                                    style={{ objectFit: "cover" }}
                                    className="hover:scale-110 transition-transform duration-500"
                                    onError={(e) => {
                                      const target =
                                        e.target as HTMLImageElement;
                                      target.src =
                                        "/images/book-placeholder.jpg";
                                    }}
                                  />
                                </div>
                                <div className="ml-4">
                                  <div className="text-base font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                                    <Link href={`/store/books/${book.id}`}>
                                      {book.title}
                                    </Link>
                                  </div>
                                  <div className="text-sm text-gray-600 mt-1">
                                    {book.author}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    ISBN: {book.isbn}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-5 text-center">
                              <div className="text-base font-semibold text-gray-900">
                                {book.price.toLocaleString("vi-VN")}₫
                              </div>
                              {book.stock <= 5 && (
                                <div className="text-xs mt-1 text-amber-600">
                                  {book.stock === 0
                                    ? "Hết hàng"
                                    : `Chỉ còn ${book.stock}`}
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex items-center justify-center">
                                <div className="inline-flex items-center border border-gray-200 rounded-lg">
                                  <button
                                    onClick={() =>
                                      handleQuantityChange(
                                        book.id,
                                        item.quantity - 1,
                                      )
                                    }
                                    className="p-2 hover:bg-gray-100 text-gray-600 hover:text-gray-800 transition-colors rounded-l-lg"
                                    disabled={item.quantity <= 1}
                                  >
                                    <FiMinus className="h-4 w-4" />
                                  </button>
                                  <span className="px-4 py-1 w-12 text-center font-medium border-x border-gray-200">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() =>
                                      handleQuantityChange(
                                        book.id,
                                        item.quantity + 1,
                                      )
                                    }
                                    className="p-2 hover:bg-gray-100 text-gray-600 hover:text-gray-800 transition-colors rounded-r-lg"
                                    disabled={item.quantity >= book.stock}
                                  >
                                    <FiPlus className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <div className="text-base font-medium text-gray-900">
                                {(book.price * item.quantity).toLocaleString(
                                  "vi-VN",
                                )}
                                ₫
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => handleRemoveItem(book.id)}
                                className="text-red-600 hover:text-red-800 transition-colors p-1 rounded-full hover:bg-red-50"
                              >
                                <FiTrash2 className="h-5 w-5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  <div className="px-6 py-4 bg-gray-50 flex flex-wrap justify-between items-center gap-4">
                    <button
                      onClick={clearCart}
                      className="text-sm text-red-600 hover:text-red-800 flex items-center hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
                    >
                      <FiTrash2 className="mr-1 h-4 w-4" />
                      Xóa Giỏ Hàng
                    </button>
                    <Link
                      href="/store"
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
                    >
                      <FiArrowLeft className="mr-1 h-4 w-4" />
                      Tiếp Tục Mua Sắm
                    </Link>
                  </div>
                </div>
              </div>

              <div className="lg:w-1/3">
                <div className="bg-white shadow-md rounded-lg p-6 sticky top-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <FiShoppingCart className="mr-2 h-5 w-5" />
                    Tổng Đơn Hàng
                  </h2>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tạm tính</span>
                      <span className="text-gray-900">
                        {cartTotal.toLocaleString("vi-VN")}₫
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Khuyến mãi (5%)</span>
                      <span className="text-green-600">
                        -{(cartTotal * 0.05).toLocaleString("vi-VN")}₫
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phí vận chuyển</span>
                      <span className="text-gray-900">
                        {cartTotal > 500000 ? (
                          <span className="text-green-600 font-medium">
                            Miễn phí
                          </span>
                        ) : (
                          "30.000₫"
                        )}
                      </span>
                    </div>

                    {cartTotal > 500000 && (
                      <div className="text-xs text-green-600 italic">
                        Bạn được miễn phí vận chuyển cho đơn hàng trên 500.000₫
                      </div>
                    )}

                    <div className="border-t border-gray-200 pt-3 mt-3">
                      <div className="flex justify-between">
                        <span className="text-lg font-semibold text-gray-900">
                          Tổng cộng
                        </span>
                        <span className="text-lg font-semibold text-gray-900">
                          {(
                            cartTotal -
                            cartTotal * 0.05 +
                            (cartTotal > 500000 ? 0 : 30000)
                          ).toLocaleString("vi-VN")}
                          ₫
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsCheckingOut(true)}
                    className="mt-6 w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    Tiến Hành Thanh Toán
                  </button>

                  <div className="mt-4 text-xs text-center text-gray-500 flex items-center justify-center gap-2">
                    <span className="block h-5 w-8 bg-gray-100 rounded"></span>
                    <span className="block h-5 w-8 bg-gray-100 rounded"></span>
                    <span className="block h-5 w-8 bg-gray-100 rounded"></span>
                    Thanh toán an toàn & bảo mật
                  </div>
                </div>
              </div>
            </div>
          </div>{" "}
          {isCheckingOut && (
            <div className="fixed inset-0 bg-gray-900/25 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto transition-all duration-300 animate-[fadeIn_0.3s_ease-in-out]">
              <div
                className="bg-white/95 backdrop-blur-sm rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all duration-300 ease-in-out animate-[scaleIn_0.3s_ease-in-out]"
                style={{
                  animation:
                    "0.3s ease-in-out 0s 1 normal none running scaleIn",
                }}
              >
                {" "}
                <div className="p-6 relative">
                  <button
                    onClick={() => setIsCheckingOut(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-all duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>{" "}
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    {activeStep === 1 && (
                      <>
                        <FiShoppingCart className="mr-2 h-5 w-5 text-blue-600" />
                        <span>Xem lại giỏ hàng</span>
                      </>
                    )}
                    {activeStep === 2 && (
                      <>
                        <FiHome className="mr-2 h-5 w-5 text-blue-600" />
                        <span>Thông tin giao hàng</span>
                      </>
                    )}
                    {activeStep === 3 && (
                      <>
                        <FiCreditCard className="mr-2 h-5 w-5 text-blue-600" />
                        <span>Phương thức thanh toán</span>
                      </>
                    )}
                    {activeStep === 4 && (
                      <>
                        <FiCheckCircle className="mr-2 h-5 w-5 text-green-600" />
                        <span>Xác nhận đơn hàng</span>
                      </>
                    )}
                  </h2>
                  {activeStep === 1 && (
                    <div>
                      <div className="mb-4">
                        {cart.map((item) => {
                          const book = books.find((b) => b.id === item.bookId);
                          if (!book) return null;

                          return (
                            <div
                              key={item.bookId}
                              className="flex justify-between items-center py-3 border-b border-gray-100"
                            >
                              <div className="flex items-center">
                                <div className="w-10 h-14 relative rounded overflow-hidden mr-3">
                                  <Image
                                    src={book.coverImage}
                                    alt={book.title}
                                    fill
                                    style={{ objectFit: "cover" }}
                                    className="border border-gray-100"
                                    onError={(e) => {
                                      const target =
                                        e.target as HTMLImageElement;
                                      target.src =
                                        "/images/book-placeholder.jpg";
                                    }}
                                  />
                                </div>
                                <div>
                                  <div className="font-medium text-sm">
                                    {book.title}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    SL: {item.quantity}
                                  </div>
                                </div>
                              </div>
                              <div className="font-medium">
                                {(book.price * item.quantity).toLocaleString(
                                  "vi-VN",
                                )}
                                ₫
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="border-t border-gray-200 pt-3 mb-6">
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-600">Tạm tính</span>
                          <span>{cartTotal.toLocaleString("vi-VN")}₫</span>
                        </div>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-600">Khuyến mãi</span>
                          <span className="text-green-600">
                            -{(cartTotal * 0.05).toLocaleString("vi-VN")}₫
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Vận chuyển</span>
                          <span>
                            {cartTotal > 500000 ? "Miễn phí" : "30.000₫"}
                          </span>
                        </div>
                        <div className="flex justify-between mt-3 pt-3 border-t border-gray-100">
                          <span className="font-semibold">Tổng cộng</span>
                          <span className="font-semibold">
                            {(
                              cartTotal -
                              cartTotal * 0.05 +
                              (cartTotal > 500000 ? 0 : 30000)
                            ).toLocaleString("vi-VN")}
                            ₫
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  {activeStep === 2 && (
                    <form>
                      <div className="grid grid-cols-1 gap-4 mb-6">
                        <div>
                          <label
                            htmlFor="fullName"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Họ Tên
                          </label>
                          <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            required
                            value={shippingInfo.fullName}
                            onChange={handleInputChange}
                            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="addressLine1"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Địa Chỉ
                          </label>
                          <input
                            type="text"
                            id="addressLine1"
                            name="addressLine1"
                            required
                            value={shippingInfo.addressLine1}
                            onChange={handleInputChange}
                            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Địa chỉ chi tiết"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label
                              htmlFor="city"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Thành Phố
                            </label>
                            <input
                              type="text"
                              id="city"
                              name="city"
                              required
                              value={shippingInfo.city}
                              onChange={handleInputChange}
                              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="state"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Tỉnh/Thành
                            </label>
                            <input
                              type="text"
                              id="state"
                              name="state"
                              required
                              value={shippingInfo.state}
                              onChange={handleInputChange}
                              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label
                              htmlFor="postalCode"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Mã Bưu Điện
                            </label>
                            <input
                              type="text"
                              id="postalCode"
                              name="postalCode"
                              required
                              value={shippingInfo.postalCode}
                              onChange={handleInputChange}
                              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="country"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Quốc Gia
                            </label>
                            <input
                              type="text"
                              id="country"
                              name="country"
                              required
                              value={shippingInfo.country}
                              onChange={handleInputChange}
                              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="phoneNumber"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Số Điện Thoại
                          </label>
                          <input
                            type="tel"
                            id="phoneNumber"
                            name="phoneNumber"
                            required
                            value={shippingInfo.phoneNumber}
                            onChange={handleInputChange}
                            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                      </div>
                    </form>
                  )}
                  {activeStep === 3 && (
                    <div>
                      {" "}
                      <div className="space-y-4 mb-6">
                        <div className="border border-gray-200 rounded-lg p-4 bg-white relative hover:shadow-md transition-shadow duration-200 cursor-pointer group">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="payment"
                              id="card"
                              defaultChecked
                              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            <label
                              htmlFor="card"
                              className="ml-3 block w-full cursor-pointer"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-900">
                                  Thẻ tín dụng
                                </span>
                                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                                  Mặc định
                                </span>
                              </div>
                              <div className="flex mt-2 items-center">
                                <span className="h-8 w-12 bg-gradient-to-r from-blue-50 to-blue-100 border border-gray-200 rounded mr-2 flex items-center justify-center text-xs font-medium">
                                  VISA
                                </span>
                                <span className="h-8 w-12 bg-gradient-to-r from-red-50 to-red-100 border border-gray-200 rounded mr-2 flex items-center justify-center text-xs font-medium">
                                  MC
                                </span>
                                <span className="h-8 w-12 bg-gradient-to-r from-green-50 to-green-100 border border-gray-200 rounded flex items-center justify-center text-xs font-medium">
                                  JCB
                                </span>
                              </div>
                            </label>
                          </div>
                          <div className="absolute inset-0 border-2 border-blue-500 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-200 pointer-events-none"></div>
                        </div>

                        <div className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow duration-200 cursor-pointer group">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="payment"
                              id="cod"
                              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            <label
                              htmlFor="cod"
                              className="ml-3 block w-full cursor-pointer"
                            >
                              <div className="flex items-center">
                                <span className="text-sm font-medium text-gray-900 flex items-center">
                                  <FiHome className="mr-2 h-4 w-4 text-gray-500" />
                                  Thanh toán khi nhận hàng (COD)
                                </span>
                              </div>
                              <span className="flex text-xs text-gray-500 mt-1">
                                Thanh toán bằng tiền mặt khi nhận hàng
                              </span>
                            </label>
                          </div>
                          <div className="absolute inset-0 border-2 border-blue-500 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-200 pointer-events-none"></div>
                        </div>

                        <div className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow duration-200 cursor-pointer group">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="payment"
                              id="banking"
                              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            <label
                              htmlFor="banking"
                              className="ml-3 block w-full cursor-pointer"
                            >
                              <div className="flex items-center">
                                <span className="text-sm font-medium text-gray-900 flex items-center">
                                  <FiCreditCard className="mr-2 h-4 w-4 text-gray-500" />
                                  Chuyển khoản ngân hàng
                                </span>
                              </div>
                              <span className="flex text-xs text-gray-500 mt-1">
                                Thông tin tài khoản sẽ được hiển thị sau khi đặt
                                hàng
                              </span>
                            </label>
                          </div>
                          <div className="absolute inset-0 border-2 border-blue-500 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-200 pointer-events-none"></div>
                        </div>

                        <div className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow duration-200 cursor-pointer group">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="payment"
                              id="wallet"
                              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            <label
                              htmlFor="wallet"
                              className="ml-3 block w-full cursor-pointer"
                            >
                              <div className="flex items-center">
                                <span className="text-sm font-medium text-gray-900">
                                  Ví điện tử
                                </span>
                              </div>
                              <div className="flex mt-2 items-center space-x-2">
                                <span className="px-2 py-1 bg-pink-50 text-pink-600 text-xs font-medium rounded border border-pink-100">
                                  MoMo
                                </span>
                                <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded border border-blue-100">
                                  ZaloPay
                                </span>
                                <span className="px-2 py-1 bg-green-50 text-green-600 text-xs font-medium rounded border border-green-100">
                                  VNPay
                                </span>
                              </div>
                            </label>
                          </div>
                          <div className="absolute inset-0 border-2 border-blue-500 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-200 pointer-events-none"></div>
                        </div>
                      </div>{" "}
                      <div className="border-t border-gray-200 pt-4">
                        <div className="bg-blue-50 border border-blue-100 text-blue-700 p-3 rounded-lg text-sm mb-4 flex items-start">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}
                  {activeStep === 4 && (
                    <div className="space-y-6">
                      <div className="bg-green-50 p-4 rounded-lg text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                          <FiCheck className="h-6 w-6 text-green-600" />
                        </div>{" "}
                        <h3 className="text-lg font-medium text-green-800">
                          Cảm ơn bạn đã đặt hàng!
                        </h3>
                        <p className="text-sm text-green-600 mt-1">
                          Chúng tôi đã gửi một email xác nhận đơn hàng đến{" "}
                          {session?.user?.email || "email của bạn"}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Thông tin đơn hàng</h4>
                        <div className="bg-gray-50 p-3 rounded-md text-sm">
                          <div className="flex justify-between mb-1">
                            <span className="text-gray-600">Mã đơn hàng:</span>
                            <span className="font-medium">
                              #ORD-
                              {Math.floor(Math.random() * 1000000)
                                .toString()
                                .padStart(6, "0")}
                            </span>
                          </div>
                          <div className="flex justify-between mb-1">
                            <span className="text-gray-600">Ngày đặt:</span>
                            <span>{new Date().toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Trạng thái:</span>
                            <span className="text-orange-600 font-medium">
                              Đang xử lý
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Địa chỉ giao hàng</h4>
                        <div className="bg-gray-50 p-3 rounded-md text-sm">
                          <p className="font-medium">{shippingInfo.fullName}</p>
                          <p>{shippingInfo.addressLine1}</p>
                          <p>
                            {shippingInfo.city}, {shippingInfo.state}{" "}
                            {shippingInfo.postalCode}
                          </p>
                          <p>{shippingInfo.country}</p>
                          <p className="mt-1">
                            SĐT: {shippingInfo.phoneNumber}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}{" "}
                  <div className="mt-8">
                    {activeStep < 4 ? (
                      <div className="flex justify-between gap-4">
                        <button
                          type="button"
                          onClick={
                            activeStep === 1
                              ? () => setIsCheckingOut(false)
                              : handlePrevStep
                          }
                          className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 flex items-center justify-center"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-1"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {activeStep === 1 ? "Quay lại giỏ hàng" : "Trở lại"}
                        </button>
                        <button
                          type="button"
                          onClick={
                            activeStep === 3 ? handleCheckout : handleNextStep
                          }
                          className="flex-1 py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 flex items-center justify-center"
                        >
                          {activeStep === 3 ? (
                            <>
                              <span>Xác nhận đặt hàng</span>
                              <FiCheck className="ml-2 h-5 w-5" />
                            </>
                          ) : (
                            <>
                              <span>Tiếp theo</span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 ml-1"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setIsCheckingOut(false);
                          router.push("/account/orders");
                        }}
                        className="w-full py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 flex items-center justify-center"
                      >
                        <span>Xem đơn hàng của bạn</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 ml-2"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}{" "}
        </div>
      </div>

      {showSuccessNotification && (
        <div className="fixed bottom-6 right-6 z-50 animate-[slideInBottom_0.3s_ease-in-out]">
          <div className="bg-green-600 text-white px-6 py-4 rounded-lg shadow-xl flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <div>
              <h3 className="font-medium text-lg">Đặt hàng thành công!</h3>
              <p className="text-sm text-green-100">
                Đơn hàng của bạn đã được xác nhận.
              </p>
            </div>
            <button
              onClick={() => setShowSuccessNotification(false)}
              className="ml-6 text-green-100 hover:text-white p-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
