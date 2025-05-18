"use client";

import { useState } from "react";
import {
  FiX,
  FiCreditCard,
  FiPlus,
  FiCheck,
  FiAlertTriangle,
  FiTrash2,
} from "react-icons/fi";

interface PaymentMethodsModalProps {
  onClose: () => void;
}

interface PaymentMethod {
  id: string;
  type: "credit" | "paypal" | "bank";
  cardNumber?: string;
  cardName?: string;
  expiryDate?: string;
  isDefault: boolean;
  icon: string;
  paypalEmail?: string;
  lastFour: string;
}

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: "1",
    type: "credit",
    cardNumber: "************4242",
    cardName: "John Doe",
    expiryDate: "12/25",
    isDefault: true,
    icon: "visa",
    lastFour: "4242",
  },
  {
    id: "2",
    type: "paypal",
    paypalEmail: "john.doe@example.com",
    isDefault: false,
    icon: "paypal",
    lastFour: "",
  },
];

export default function PaymentMethodsModal({
  onClose,
}: PaymentMethodsModalProps) {
  const [paymentMethods, setPaymentMethods] =
    useState<PaymentMethod[]>(mockPaymentMethods);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [currentPaymentMethod, setCurrentPaymentMethod] =
    useState<Partial<PaymentMethod> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const handleAddNewPaymentMethod = () => {
    setCurrentPaymentMethod({
      type: "credit",
      isDefault: paymentMethods.length === 0,
      icon: "card",
    });
    setIsAddingNew(true);
  };

  const handleSetAsDefault = (id: string) => {
    setPaymentMethods(
      paymentMethods.map((method) => ({
        ...method,
        isDefault: method.id === id,
      })),
    );

    setSuccess("Default payment method updated successfully.");
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleDeletePaymentMethod = (id: string) => {
    const updatedMethods = paymentMethods.filter((method) => method.id !== id);

    // If we deleted the default and there are other methods, set a new default
    if (
      paymentMethods.find((m) => m.id === id)?.isDefault &&
      updatedMethods.length > 0
    ) {
      updatedMethods[0].isDefault = true;
    }

    setPaymentMethods(updatedMethods);
    setSuccess("Payment method deleted successfully.");
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPaymentMethod) return;

    if (currentPaymentMethod.type === "credit") {
      // Validate credit card form
      if (
        !currentPaymentMethod.cardNumber ||
        !currentPaymentMethod.cardName ||
        !currentPaymentMethod.expiryDate
      ) {
        setError("Please fill out all required fields.");
        return;
      }

      // Simple credit card validation
      const cardNumberClean = (
        currentPaymentMethod.cardNumber as string
      ).replace(/\D/g, "");
      if (cardNumberClean.length < 13 || cardNumberClean.length > 19) {
        setError("Please enter a valid card number.");
        return;
      }
    } else if (currentPaymentMethod.type === "paypal") {
      // Validate PayPal form
      if (!currentPaymentMethod.paypalEmail) {
        setError("Please enter your PayPal email address.");
        return;
      }

      // Simple email validation
      if (!/\S+@\S+\.\S+/.test(currentPaymentMethod.paypalEmail)) {
        setError("Please enter a valid email address.");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // Process the form - in a real app this would call an API
      setTimeout(() => {
        // Create a new payment method object
        const newMethod: PaymentMethod = {
          id: `new-${Date.now()}`,
          type: currentPaymentMethod.type as "credit" | "paypal" | "bank",
          isDefault: Boolean(currentPaymentMethod.isDefault),
          icon: currentPaymentMethod.type === "credit" ? "visa" : "paypal",
          lastFour:
            currentPaymentMethod.type === "credit"
              ? (currentPaymentMethod.cardNumber as string).slice(-4)
              : "",
        };

        if (currentPaymentMethod.type === "credit") {
          newMethod.cardNumber = currentPaymentMethod.cardNumber;
          newMethod.cardName = currentPaymentMethod.cardName;
          newMethod.expiryDate = currentPaymentMethod.expiryDate;
        } else if (currentPaymentMethod.type === "paypal") {
          newMethod.paypalEmail = currentPaymentMethod.paypalEmail;
        }

        let updatedMethods = [...paymentMethods];
        if (newMethod.isDefault) {
          updatedMethods = updatedMethods.map((method) => ({
            ...method,
            isDefault: false,
          }));
        } else if (updatedMethods.length === 0) {
          newMethod.isDefault = true;
        }

        updatedMethods.push(newMethod);
        setPaymentMethods(updatedMethods);

        setCurrentPaymentMethod(null);
        setIsAddingNew(false);
        setSuccess("Payment method added successfully.");
        setTimeout(() => setSuccess(""), 3000);
      }, 1000);
    } catch (error) {
      setError("An error occurred while saving the payment method.");
      console.error("Error saving payment method:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsAddingNew(false);
    setCurrentPaymentMethod(null);
    setError("");
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "");

    const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;

    return formatted;
  };

  const PaymentIcon = ({ type }: { type: string }) => {
    switch (type) {
      case "visa":
        return (
          <div className="w-10 h-6 bg-blue-800 text-white rounded flex items-center justify-center">
            <span className="font-bold italic text-xs">VISA</span>
          </div>
        );
      case "paypal":
        return (
          <div className="w-10 h-6 bg-blue-600 text-white rounded flex items-center justify-center">
            <span className="font-bold text-xs">PayPal</span>
          </div>
        );
      default:
        return <FiCreditCard className="w-6 h-6 text-gray-400" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Payment Methods</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 bg-red-50 text-red-700 p-4 rounded-md flex items-start">
              <FiAlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 bg-green-50 text-green-700 p-4 rounded-md flex items-start">
              <FiCheck className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {!isAddingNew ? (
            <>
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`border rounded-lg p-4 flex items-center justify-between ${method.isDefault ? "border-blue-300 bg-blue-50" : ""}`}
                  >
                    <div className="flex items-center">
                      <PaymentIcon type={method.icon} />
                      <div className="ml-4">
                        {method.type === "credit" ? (
                          <>
                            <div className="font-medium">
                              •••• •••• •••• {method.lastFour}
                            </div>
                            <div className="text-sm text-gray-500">
                              Expires {method.expiryDate}
                            </div>
                          </>
                        ) : method.type === "paypal" ? (
                          <>
                            <div className="font-medium">PayPal</div>
                            <div className="text-sm text-gray-500">
                              {method.paypalEmail}
                            </div>
                          </>
                        ) : (
                          <div className="font-medium">Bank Account</div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      {method.isDefault ? (
                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                          Default
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSetAsDefault(method.id)}
                          className="text-sm text-blue-600 hover:text-blue-500"
                        >
                          Set as Default
                        </button>
                      )}
                      <button
                        onClick={() => handleDeletePaymentMethod(method.id)}
                        className="text-sm text-red-600 hover:text-red-500"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                ))}

                {paymentMethods.length === 0 && (
                  <div className="text-center p-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <FiCreditCard className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 mb-4">
                      You haven&apos;t added any payment methods yet.
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <button
                  onClick={handleAddNewPaymentMethod}
                  className="inline-flex items-center text-blue-600 hover:text-blue-500"
                >
                  <FiPlus className="mr-1" /> Add New Payment Method
                </button>
              </div>
            </>
          ) : (
            <>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Add New Payment Method
              </h3>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Type
                </label>
                <div className="flex space-x-4">
                  <button
                    onClick={() =>
                      setCurrentPaymentMethod({
                        ...currentPaymentMethod,
                        type: "credit",
                      })
                    }
                    className={`flex-1 p-4 border rounded-lg flex flex-col items-center ${
                      currentPaymentMethod?.type === "credit"
                        ? "border-blue-500 bg-blue-50"
                        : ""
                    }`}
                  >
                    <FiCreditCard
                      className={`h-6 w-6 ${currentPaymentMethod?.type === "credit" ? "text-blue-500" : "text-gray-400"}`}
                    />
                    <span
                      className={`mt-2 ${currentPaymentMethod?.type === "credit" ? "text-blue-700" : "text-gray-700"}`}
                    >
                      Credit Card
                    </span>
                  </button>

                  <button
                    onClick={() =>
                      setCurrentPaymentMethod({
                        ...currentPaymentMethod,
                        type: "paypal",
                      })
                    }
                    className={`flex-1 p-4 border rounded-lg flex flex-col items-center ${
                      currentPaymentMethod?.type === "paypal"
                        ? "border-blue-500 bg-blue-50"
                        : ""
                    }`}
                  >
                    <div
                      className={`w-6 h-6 flex items-center justify-center ${currentPaymentMethod?.type === "paypal" ? "text-blue-500" : "text-gray-400"}`}
                    >
                      <span className="font-bold text-xs">PP</span>
                    </div>
                    <span
                      className={`mt-2 ${currentPaymentMethod?.type === "paypal" ? "text-blue-700" : "text-gray-700"}`}
                    >
                      PayPal
                    </span>
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="mt-6">
                {currentPaymentMethod?.type === "credit" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={currentPaymentMethod.cardNumber || ""}
                        onChange={(e) =>
                          setCurrentPaymentMethod({
                            ...currentPaymentMethod,
                            cardNumber: formatCardNumber(e.target.value),
                          })
                        }
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name on Card
                      </label>
                      <input
                        type="text"
                        value={currentPaymentMethod.cardName || ""}
                        onChange={(e) =>
                          setCurrentPaymentMethod({
                            ...currentPaymentMethod,
                            cardName: e.target.value,
                          })
                        }
                        placeholder="John Doe"
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expiration Date
                      </label>
                      <input
                        type="text"
                        value={currentPaymentMethod.expiryDate || ""}
                        onChange={(e) =>
                          setCurrentPaymentMethod({
                            ...currentPaymentMethod,
                            expiryDate: e.target.value,
                          })
                        }
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}

                {currentPaymentMethod?.type === "paypal" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      PayPal Email Address
                    </label>
                    <input
                      type="email"
                      value={currentPaymentMethod.paypalEmail || ""}
                      onChange={(e) =>
                        setCurrentPaymentMethod({
                          ...currentPaymentMethod,
                          paypalEmail: e.target.value,
                        })
                      }
                      placeholder="email@example.com"
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}

                <div className="flex items-center mt-4">
                  <input
                    id="set-as-default"
                    type="checkbox"
                    checked={Boolean(currentPaymentMethod?.isDefault)}
                    onChange={(e) =>
                      currentPaymentMethod &&
                      setCurrentPaymentMethod({
                        ...currentPaymentMethod,
                        isDefault: e.target.checked,
                      })
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="set-as-default"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Set as default payment method
                  </label>
                </div>

                <div className="flex justify-end pt-6 space-x-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${
                      isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSubmitting ? "Adding..." : "Add Payment Method"}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>

        {!isAddingNew && (
          <div className="px-6 py-4 border-t flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
