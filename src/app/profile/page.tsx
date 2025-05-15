/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useStore } from "@/store/index";
import { FiEdit, FiMapPin, FiCreditCard, FiPackage } from "react-icons/fi";
import { redirect } from "next/navigation";
import Image from "next/image";
import AddressBookModal from "@/components/profile/AddressBookModal";
import PaymentMethodsModal from "@/components/profile/PaymentMethodsModal";
import OrderDetailModal from "@/components/profile/OrderDetailModal";
import ProfileUpdateModal from "@/components/profile/ProfileUpdateModal";
import { Order } from "@/types/order";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const { users, orders, addresses, paymentMethods } = useStore((state) => ({
    users: state.users,
    orders: state.orders,
    addresses: state.addresses,
    paymentMethods: state.paymentMethods,
  }));

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showOrderDetailModal, setShowOrderDetailModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Redirect if not authenticated
  if (status === "unauthenticated") {
    redirect("/signin");
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const currentUser = users.find((user) => user.email === session?.user?.email);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">User not found</h1>
          <p className="text-gray-600">Please sign in again</p>
        </div>
      </div>
    );
  }

  const userOrders = orders
    .filter((order) => order.userId === currentUser.id)
    .sort(
      (a, b) =>
        new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime(),
    );

  const userAddresses = addresses.filter(
    (address) => address.userId === currentUser.id,
  );

  const userPaymentMethods = paymentMethods.filter(
    (payment) => payment.userId === currentUser.id,
  );

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetailModal(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Profile</h1>
          <button
            onClick={() => setShowProfileModal(true)}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800"
          >
            <FiEdit className="mr-1" /> Edit
          </button>
        </div>

        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/4 flex justify-center mb-6 md:mb-0">
            {currentUser.avatar ? (
              <div className="relative w-32 h-32 rounded-full overflow-hidden">
                <Image
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-3xl text-gray-500">
                  {currentUser.name.charAt(0)}
                </span>
              </div>
            )}
          </div>

          <div className="md:w-3/4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{currentUser.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{currentUser.email}</p>
              </div>
              {(currentUser as any).phoneNumber && (
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">
                    {(currentUser as any).phoneNumber}
                  </p>
                </div>
              )}
              {(currentUser as any).address && (
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium">{(currentUser as any).address}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <FiMapPin className="text-blue-500 mr-2" />
              <h2 className="text-lg font-semibold">Shipping Addresses</h2>
            </div>
            <button
              onClick={() => setShowAddressModal(true)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Manage
            </button>
          </div>

          {userAddresses.length > 0 ? (
            <div className="space-y-4">
              {userAddresses.slice(0, 2).map((address) => (
                <div
                  key={address.id}
                  className="border rounded-lg p-3 hover:bg-gray-50"
                >
                  <p className="font-medium">{address.fullName}</p>
                  <p className="text-sm text-gray-600">
                    {address.addressLine1}
                  </p>
                  <p className="text-sm text-gray-600">
                    {address.city}, {address.state} {address.postalCode}
                  </p>
                  {address.isDefault && (
                    <span className="inline-block mt-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Default
                    </span>
                  )}
                </div>
              ))}
              {userAddresses.length > 2 && (
                <p className="text-sm text-gray-500">
                  + {userAddresses.length - 2} more addresses
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No addresses added yet</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <FiCreditCard className="text-blue-500 mr-2" />
              <h2 className="text-lg font-semibold">Payment Methods</h2>
            </div>
            <button
              onClick={() => setShowPaymentModal(true)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Manage
            </button>
          </div>

          {userPaymentMethods.length > 0 ? (
            <div className="space-y-4">
              {userPaymentMethods.slice(0, 2).map((payment) => (
                <div
                  key={payment.id}
                  className="border rounded-lg p-3 hover:bg-gray-50"
                >
                  <p className="font-medium">
                    {payment.cardType} •••• {payment.last4}
                  </p>
                  <p className="text-sm text-gray-600">
                    Expires {payment.expiryMonth}/{payment.expiryYear}
                  </p>
                  {payment.isDefault && (
                    <span className="inline-block mt-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Default
                    </span>
                  )}
                </div>
              ))}
              {userPaymentMethods.length > 2 && (
                <p className="text-sm text-gray-500">
                  + {userPaymentMethods.length - 2} more payment methods
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">
              No payment methods added yet
            </p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <FiPackage className="text-blue-500 mr-2" />
          <h2 className="text-lg font-semibold">Order History</h2>
        </div>

        {userOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order #
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {userOrders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => handleOrderClick(order)}
                    className="cursor-pointer hover:bg-gray-50"
                  >
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      #{order.id.substring(0, 8)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`inline-flex px-2 py-1 text-xs rounded-full ${
                          order.status === "DELIVERED"
                            ? "bg-green-100 text-green-800"
                            : order.status === "SHIPPED"
                              ? "bg-blue-100 text-blue-800"
                              : order.status === "PROCESSING"
                                ? "bg-yellow-100 text-yellow-800"
                                : order.status === "CANCELLED"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.items.length} item(s)
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No orders yet</p>
        )}
      </div>

      {showAddressModal && (
        <AddressBookModal onClose={() => setShowAddressModal(false)} />
      )}

      {showPaymentModal && (
        <PaymentMethodsModal
          userId={currentUser?.id || ""}
          onClose={() => setShowPaymentModal(false)}
        />
      )}

      {showOrderDetailModal && selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => {
            setShowOrderDetailModal(false);
            setSelectedOrder(null);
          }}
        />
      )}

      {showProfileModal && (
        <ProfileUpdateModal
          user={currentUser}
          onClose={() => setShowProfileModal(false)}
        />
      )}
    </div>
  );
}
