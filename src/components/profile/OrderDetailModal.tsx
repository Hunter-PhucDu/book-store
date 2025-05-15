"use client";

import { useState } from "react";
import {
  FiX,
  FiPackage,
  FiCalendar,
  FiMapPin,
  FiCreditCard,
  FiDownload,
  FiPrinter,
} from "react-icons/fi";
import { Order, OrderStatus } from "@/types/order";
import { useStore } from "@/store/index";
import Image from "next/image";

interface OrderDetailModalProps {
  order: Order;
  onClose: () => void;
}

export default function OrderDetailModal({
  order,
  onClose,
}: OrderDetailModalProps) {
  const getBookById = useStore((state) => state.getBookById);
  const [isDownloading, setIsDownloading] = useState(false);

  const getOrderStatusClass = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.DELIVERED:
        return "bg-green-100 text-green-800";
      case OrderStatus.SHIPPED:
        return "bg-blue-100 text-blue-800";
      case OrderStatus.PROCESSING:
        return "bg-yellow-100 text-yellow-800";
      case OrderStatus.CANCELLED:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleDownloadInvoice = () => {
    setIsDownloading(true);

    // Simulate download delay
    setTimeout(() => {
      setIsDownloading(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Order #{order.id}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="flex items-center">
                <FiCalendar className="text-gray-400 mr-2" />
                <span className="text-gray-600">
                  Placed on {new Date(order.orderDate).toLocaleDateString()}
                </span>
              </div>
            </div>
            <span
              className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getOrderStatusClass(
                order.status,
              )}`}
            >
              {order.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Shipping Address
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-start">
                  <FiMapPin className="text-gray-400 mr-3 mt-1" />
                  <div>
                    <p className="text-gray-900">
                      {order.shippingAddress.fullName}
                    </p>
                    <p className="text-gray-600">
                      {order.shippingAddress.addressLine1}
                    </p>
                    <p className="text-gray-600">
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.state}{" "}
                      {order.shippingAddress.postalCode}
                    </p>
                    <p className="text-gray-600">
                      {order.shippingAddress.country}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Payment Information
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-start">
                  <FiCreditCard className="text-gray-400 mr-3 mt-1" />
                  <div>
                    <p className="text-gray-900">{order.payment.method}</p>
                    {order.payment.transactionId && (
                      <p className="text-gray-600">
                        Transaction ID: {order.payment.transactionId}
                      </p>
                    )}
                    <p className="text-gray-600 mt-2">
                      <span className="font-medium">Total:</span> $
                      {order.total.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Order Items
            </h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Item
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Quantity
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.items.map((item) => {
                    const book = getBookById(item.bookId);
                    return (
                      <tr key={item.bookId}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              {book && (
                                <Image
                                  className="h-10 w-10 rounded-sm object-cover"
                                  src={book.coverImage}
                                  alt={book.title}
                                  width={40}
                                  height={40}
                                />
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {book ? book.title : "Unknown Book"}
                              </div>
                              <div className="text-sm text-gray-500">
                                {book ? book.author : "Unknown Author"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                          ${item.unitPrice.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          ${item.totalPrice.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <th
                      colSpan={3}
                      scope="row"
                      className="px-6 py-3 text-left text-sm font-medium text-gray-500"
                    >
                      Subtotal
                    </th>
                    <td className="px-6 py-3 text-right text-sm text-gray-900">
                      ${order.subtotal.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <th
                      colSpan={3}
                      scope="row"
                      className="px-6 py-3 text-left text-sm font-medium text-gray-500"
                    >
                      Shipping
                    </th>
                    <td className="px-6 py-3 text-right text-sm text-gray-900">
                      ${order.shippingCost.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <th
                      colSpan={3}
                      scope="row"
                      className="px-6 py-3 text-left text-sm font-medium text-gray-500"
                    >
                      Tax
                    </th>
                    <td className="px-6 py-3 text-right text-sm text-gray-900">
                      ${order.tax.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <th
                      colSpan={3}
                      scope="row"
                      className="px-6 py-3 text-left text-sm font-semibold text-gray-900"
                    >
                      Total
                    </th>
                    <td className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                      ${order.total.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {order.status === OrderStatus.SHIPPED && (
            <div className="mb-6 bg-blue-50 p-4 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FiPackage className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Shipping Information
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      Your order has been shipped via {order.shippingMethod}.
                    </p>
                    {order.trackingNumber && (
                      <p className="mt-1">
                        Tracking Number:{" "}
                        <span className="font-medium">
                          {order.trackingNumber}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {order.status === OrderStatus.DELIVERED && (
            <div className="mb-6 bg-green-50 p-4 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FiPackage className="h-5 w-5 text-green-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    Delivery Information
                  </h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>
                      Your order was delivered on{" "}
                      {new Date(order.updatedAt).toLocaleDateString()}.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {order.notes && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Order Notes
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">{order.notes}</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t">
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <button
                onClick={handleDownloadInvoice}
                disabled={isDownloading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isDownloading ? (
                  "Downloading..."
                ) : (
                  <>
                    <FiDownload className="-ml-1 mr-2 h-5 w-5" />
                    Download Invoice
                  </>
                )}
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <FiPrinter className="-ml-1 mr-2 h-5 w-5" />
                Print
              </button>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
