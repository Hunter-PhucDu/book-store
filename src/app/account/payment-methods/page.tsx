"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FiCreditCard,
  FiPlus,
  FiTrash2,
  FiEdit2,
  FiArrowLeft,
  FiLock,
  FiCheck,
  FiAlertTriangle,
  FiX,
} from "react-icons/fi";
import MainLayout from "@/components/layout/MainLayout";

const mockPaymentMethods = [
  {
    id: "pm_1",
    type: "credit_card",
    brand: "visa",
    last4: "4242",
    expMonth: 8,
    expYear: 2026,
    isDefault: true,
  },
  {
    id: "pm_2",
    type: "credit_card",
    brand: "mastercard",
    last4: "5555",
    expMonth: 12,
    expYear: 2025,
    isDefault: false,
  },
];

type PaymentMethod = {
  id: string;
  type: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
};

export default function PaymentMethodsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [paymentMethods, setPaymentMethods] =
    useState<PaymentMethod[]>(mockPaymentMethods);
  const [showNewCardForm, setShowNewCardForm] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<
    string | null
  >(null);

  // Form state
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin?callbackUrl=/account/payment-methods");
    } else if (status === "authenticated") {
      setIsLoading(false);
    }
  }, [status, router]);

  const handleSetDefault = (id: string) => {
    setPaymentMethods((methods) =>
      methods.map((method) => ({
        ...method,
        isDefault: method.id === id,
      })),
    );
  };

  const handleDeletePaymentMethod = (id: string) => {
    setPaymentMethods((methods) =>
      methods.filter((method) => method.id !== id),
    );
    setShowDeleteConfirmation(null);
  };

  const handleAddNewCard = (e: React.FormEvent) => {
    e.preventDefault();

    if (!cardNumber || !cardName || !expiryMonth || !expiryYear || !cvv) {
      setFormError("Vui lòng điền đầy đủ thông tin thẻ");
      return;
    }

    const newPaymentMethod = {
      id: `pm_${Date.now()}`,
      type: "credit_card",
      brand: cardNumber.startsWith("4") ? "visa" : "mastercard",
      last4: cardNumber.slice(-4),
      expMonth: parseInt(expiryMonth),
      expYear: parseInt(expiryYear),
      isDefault: paymentMethods.length === 0,
    };

    setPaymentMethods([...paymentMethods, newPaymentMethod]);
    setShowNewCardForm(false);

    setCardNumber("");
    setCardName("");
    setExpiryMonth("");
    setExpiryYear("");
    setCvv("");
    setFormError("");
  };

  const getCardLogo = (brand: string) => {
    switch (brand) {
      case "visa":
        return (
          <div className="w-10 h-6 bg-blue-800 text-white rounded flex items-center justify-center">
            <span className="text-xs font-bold">VISA</span>
          </div>
        );
      case "mastercard":
        return (
          <div className="w-10 h-6 bg-red-600 text-white rounded flex items-center justify-center">
            <span className="text-xs font-bold">MC</span>
          </div>
        );
      default:
        return (
          <div className="w-10 h-6 bg-gray-600 text-white rounded flex items-center justify-center">
            <span className="text-xs font-bold">CARD</span>
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="spinner h-12 w-12 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">
              Đang tải phương thức thanh toán...
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen py-10">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center mb-6">
            <Link
              href="/account"
              className="text-blue-600 hover:text-blue-800 mr-3 flex items-center"
            >
              <FiArrowLeft className="h-4 w-4 mr-1" />
              Quay lại
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">
              Phương thức thanh toán
            </h1>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="font-semibold text-gray-800 flex items-center">
                <FiCreditCard className="mr-2 text-blue-600" />
                Thẻ đã lưu
              </h2>
            </div>

            <div className="p-6">
              {paymentMethods.length > 0 ? (
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className="border border-gray-200 rounded-lg p-4 transition-colors hover:bg-gray-50"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          {getCardLogo(method.brand)}
                          <div className="ml-4">
                            <p className="font-medium text-gray-800">
                              **** **** **** {method.last4}
                              {method.isDefault && (
                                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Mặc định
                                </span>
                              )}
                            </p>
                            <p className="text-sm text-gray-500">
                              Hết hạn:{" "}
                              {method.expMonth.toString().padStart(2, "0")}/
                              {method.expYear}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          {!method.isDefault && (
                            <button
                              onClick={() => handleSetDefault(method.id)}
                              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                              title="Đặt làm mặc định"
                            >
                              <FiCheck className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
                            title="Chỉnh sửa"
                          >
                            <FiEdit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirmation(method.id)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                            title="Xóa"
                          >
                            <FiTrash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {showDeleteConfirmation === method.id && (
                        <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-100">
                          <p className="text-sm text-red-800 mb-3 flex items-center">
                            <FiAlertTriangle className="mr-2" />
                            Bạn có chắc chắn muốn xóa phương thức thanh toán
                            này?
                          </p>
                          <div className="flex justify-end space-x-3">
                            <button
                              onClick={() => setShowDeleteConfirmation(null)}
                              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                            >
                              Hủy
                            </button>
                            <button
                              onClick={() =>
                                handleDeletePaymentMethod(method.id)
                              }
                              className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                            >
                              Xóa
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <FiCreditCard className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    Chưa có phương thức thanh toán
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Thêm thẻ để thanh toán nhanh chóng hơn trong các đơn hàng
                    tiếp theo.
                  </p>
                </div>
              )}

              {!showNewCardForm && (
                <div className="mt-6">
                  <button
                    onClick={() => setShowNewCardForm(true)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <FiPlus className="mr-2 h-4 w-4" />
                    Thêm thẻ mới
                  </button>
                </div>
              )}

              {showNewCardForm && (
                <div className="mt-6 border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Thêm thẻ mới
                    </h3>
                    <button
                      onClick={() => setShowNewCardForm(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <FiX className="h-5 w-5" />
                    </button>
                  </div>

                  {formError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-800">{formError}</p>
                    </div>
                  )}

                  <form onSubmit={handleAddNewCard}>
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <label
                          htmlFor="cardName"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Tên trên thẻ
                        </label>
                        <input
                          type="text"
                          id="cardName"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="NGUYEN VAN A"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="cardNumber"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Số thẻ
                        </label>
                        <input
                          type="text"
                          id="cardNumber"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="1234 5678 9012 3456"
                          value={cardNumber}
                          onChange={(e) =>
                            setCardNumber(
                              e.target.value.replace(/\D/g, "").slice(0, 16),
                            )
                          }
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label
                            htmlFor="expMonth"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Tháng hết hạn
                          </label>
                          <select
                            id="expMonth"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            value={expiryMonth}
                            onChange={(e) => setExpiryMonth(e.target.value)}
                          >
                            <option value="">MM</option>
                            {Array.from({ length: 12 }).map((_, i) => (
                              <option key={i} value={i + 1}>
                                {String(i + 1).padStart(2, "0")}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label
                            htmlFor="expYear"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Năm hết hạn
                          </label>
                          <select
                            id="expYear"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            value={expiryYear}
                            onChange={(e) => setExpiryYear(e.target.value)}
                          >
                            <option value="">YYYY</option>
                            {Array.from({ length: 10 }).map((_, i) => {
                              const year = new Date().getFullYear() + i;
                              return (
                                <option key={i} value={year}>
                                  {year}
                                </option>
                              );
                            })}
                          </select>
                        </div>

                        <div>
                          <label
                            htmlFor="cvv"
                            className="block text-sm font-medium text-gray-700"
                          >
                            CVV
                          </label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <input
                              type="text"
                              id="cvv"
                              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              placeholder="123"
                              value={cvv}
                              onChange={(e) =>
                                setCvv(
                                  e.target.value.replace(/\D/g, "").slice(0, 3),
                                )
                              }
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                              <FiLock className="h-4 w-4 text-gray-400" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center">
                      <input
                        id="setDefault"
                        name="setDefault"
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="setDefault"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        Đặt làm phương thức thanh toán mặc định
                      </label>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <button
                        type="button"
                        className="mr-3 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        onClick={() => setShowNewCardForm(false)}
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Lưu thẻ
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4 flex items-start">
            <FiLock className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">Bảo mật thông tin thanh toán</p>
              <p>
                Tất cả các thông tin thẻ của bạn được mã hóa và lưu trữ an toàn
                theo tiêu chuẩn bảo mật PCI DSS. Chúng tôi không lưu trữ toàn bộ
                số thẻ.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
