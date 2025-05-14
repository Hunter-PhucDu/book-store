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
} from "react-icons/fi";
import { useSession } from "next-auth/react";
import MainLayout from "@/components/layout/MainLayout";
import {
  Address,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  CartItem,
} from "@/types/order";
import { initialBooks } from "@/store/bookData";
import { Book } from "@/types/book";

// Mock cart data
const mockCartItems: CartItem[] = [
  { bookId: "1", quantity: 2 },
  { bookId: "3", quantity: 1 },
];

export default function CartPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const books = initialBooks;

  // Local state for cart
  const [cart, setCart] = useState<CartItem[]>(mockCartItems);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [shippingInfo, setShippingInfo] = useState<Address>({
    fullName: session?.user?.name || "",
    addressLine1: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    phoneNumber: "",
  });

  // Calculate cart total
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
      setCart(
        cart.map((item) =>
          item.bookId === bookId ? { ...item, quantity } : item,
        ),
      );
    }
  };

  const handleRemoveItem = (bookId: string) => {
    setCart(cart.filter((item) => item.bookId !== bookId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckout = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (!session) {
      router.push("/signin?callbackUrl=/store/cart");
      return;
    }

    // Calculate totals
    const subtotal = cartTotal;
    const tax = cartTotal * 0.08;
    const shipping = cartTotal > 50 ? 0 : 4.99;
    const total = subtotal + tax + shipping;

    // In a real app, we would save the order to the database
    // For now, just clear the cart and close the checkout modal
    clearCart();
    setIsCheckingOut(false);

    // You could add a success message here
  };

  // Empty cart state
  if (cart.length === 0) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex justify-center">
              <FiShoppingCart className="h-16 w-16 text-gray-400" />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-gray-900">
              Your cart is empty
            </h1>
            <p className="mt-2 text-gray-500">
              Looks like you haven&apos;t added any books to your cart yet.
            </p>
            <div className="mt-6">
              <Link
                href="/store"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                <FiArrowLeft className="mr-2" />
                Browse Books
              </Link>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Cart</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Product
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Quantity
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Total
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cart.map((item) => {
                    const book = books.find((b) => b.id === item.bookId);
                    if (!book) return null;

                    return (
                      <tr key={item.bookId}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-16 w-12 relative">
                              <Image
                                src={book.coverImage}
                                alt={book.title}
                                fill
                                style={{ objectFit: "cover" }}
                                className="rounded"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = "/images/book-placeholder.jpg";
                                }}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {book.title}
                              </div>
                              <div className="text-sm text-gray-500">
                                {book.author}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            ${book.price.toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <button
                              onClick={() =>
                                handleQuantityChange(book.id, item.quantity - 1)
                              }
                              className="p-1 rounded-full hover:bg-gray-100"
                              disabled={item.quantity <= 1}
                            >
                              <FiMinus className="h-4 w-4" />
                            </button>
                            <span className="mx-2 w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityChange(book.id, item.quantity + 1)
                              }
                              className="p-1 rounded-full hover:bg-gray-100"
                              disabled={item.quantity >= book.stock}
                            >
                              <FiPlus className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            ${(book.price * item.quantity).toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleRemoveItem(book.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <FiTrash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Cart Actions */}
              <div className="px-6 py-4 bg-gray-50 flex justify-between items-center">
                <button
                  onClick={clearCart}
                  className="text-sm text-red-600 hover:text-red-800 flex items-center"
                >
                  <FiTrash2 className="mr-1 h-4 w-4" />
                  Clear Cart
                </button>
                <Link
                  href="/store"
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <FiArrowLeft className="mr-1 h-4 w-4" />
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Order Summary
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (8%)</span>
                  <span className="text-gray-900">
                    ${(cartTotal * 0.08).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">
                    {cartTotal > 50 ? "Free" : "$4.99"}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="font-semibold text-gray-900">
                      $
                      {(
                        cartTotal +
                        cartTotal * 0.08 +
                        (cartTotal > 50 ? 0 : 4.99)
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsCheckingOut(true)}
                className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>

        {/* Checkout Modal */}
        {isCheckingOut && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Complete Your Order
                </h2>

                <form onSubmit={handleCheckout}>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="fullName"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Full Name
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
                        Address
                      </label>
                      <input
                        type="text"
                        id="addressLine1"
                        name="addressLine1"
                        required
                        value={shippingInfo.addressLine1}
                        onChange={handleInputChange}
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Street address"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="city"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          City
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
                          State
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
                          Postal Code
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
                          Country
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
                        Phone Number
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

                    <div>
                      <h3 className="text-md font-medium text-gray-800 mb-2">
                        Payment Method
                      </h3>
                      <div className="border border-gray-200 rounded-md p-3 bg-gray-50">
                        <p className="text-sm text-gray-600">
                          For demo purposes, no actual payment will be
                          processed. All orders will be marked as paid
                          automatically.
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-900">
                          Order Total
                        </span>
                        <span className="font-semibold text-gray-900">
                          $
                          {(
                            cartTotal +
                            cartTotal * 0.08 +
                            (cartTotal > 50 ? 0 : 4.99)
                          ).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setIsCheckingOut(false)}
                      className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Place Order
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
