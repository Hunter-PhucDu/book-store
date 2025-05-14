"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiHome,
  FiEdit,
  FiPackage,
  FiCreditCard,
  FiCalendar,
  FiMapPin,
  FiPlus,
  FiList,
  FiEye,
} from "react-icons/fi";
import { useStore } from "@/store/index";
import { User, UserRole } from "@/types/user";
import { Order, OrderStatus } from "@/types/order";
import MainLayout from "@/components/layout/MainLayout";
import ProfileUpdateModal from "@/components/profile/ProfileUpdateModal";
import AddressBookModal from "@/components/profile/AddressBookModal";
import PaymentMethodsModal from "@/components/profile/PaymentMethodsModal";
import OrderDetailModal from "@/components/profile/OrderDetailModal";

export default function UserProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const orders = useStore((state) => state.orders);
  const users = useStore((state) => state.users);
  const getOrdersByUserId = useStore((state) => state.getOrdersByUserId);

  const [isLoading, setIsLoading] = useState(true);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddressBookOpen, setIsAddressBookOpen] = useState(false);
  const [isPaymentMethodsOpen, setIsPaymentMethodsOpen] = useState(false);
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/profile");
    } else if (status === "authenticated") {
      // Find current user from store
      const user = users.find((u) => u.id === session.user?.id);
      setCurrentUser(user || null);

      if (user) {
        // Get user orders
        const userOrders = getOrdersByUserId(user.id);
        setUserOrders(userOrders);
      }

      setIsLoading(false);
    }
  }, [status, session, router, users, getOrdersByUserId]);

  const handleEditProfile = () => {
    setIsEditModalOpen(true);
  };

  const handleOpenAddressBook = () => {
    setIsAddressBookOpen(true);
  };

  const handleOpenPaymentMethods = () => {
    setIsPaymentMethodsOpen(true);
  };

  const handleViewOrderDetails = (orderId: string) => {
    setSelectedOrderId(orderId);
    setIsOrderDetailOpen(true);
  };

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

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="spinner h-12 w-12 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
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
            <div className="text-xl font-medium text-red-600 mb-2">
              User Not Found
            </div>
            <p className="text-gray-600">We couldn't find your user profile.</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="bg-blue-600 py-8 px-4 text-center">
                <div className="mb-4">
                  {currentUser.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="h-24 w-24 rounded-full mx-auto border-4 border-white"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center mx-auto">
                      <FiUser className="h-12 w-12 text-blue-600" />
                    </div>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-white">
                  {currentUser.name}
                </h2>
                <p className="text-blue-100">{currentUser.role}</p>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Contact Information
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-center">
                      <FiMail className="text-gray-500 mr-3" />
                      <span className="text-gray-700">{currentUser.email}</span>
                    </div>

                    {currentUser.phoneNumber && (
                      <div className="flex items-center">
                        <FiPhone className="text-gray-500 mr-3" />
                        <span className="text-gray-700">
                          {currentUser.phoneNumber}
                        </span>
                      </div>
                    )}

                    {currentUser.address && (
                      <div className="flex items-start">
                        <FiHome className="text-gray-500 mr-3 mt-1" />
                        <span className="text-gray-700">
                          {currentUser.address}
                        </span>
                      </div>
                    )}

                    <button
                      onClick={handleOpenAddressBook}
                      className="flex items-center text-blue-600 hover:text-blue-800 text-sm mt-2"
                    >
                      <FiMapPin className="mr-1" />
                      Manage Address Book
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Account Information
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-center">
                      <FiCalendar className="text-gray-500 mr-3" />
                      <span className="text-gray-700">
                        Joined{" "}
                        {new Date(currentUser.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {currentUser.role === UserRole.CUSTOMER && (
                      <div className="flex items-center">
                        <FiPackage className="text-gray-500 mr-3" />
                        <span className="text-gray-700">
                          {userOrders.length} Orders
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    onClick={handleEditProfile}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                  >
                    <FiEdit className="inline-block mr-2" />
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Orders */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">
                  Order History
                </h2>
              </div>

              <div className="overflow-hidden">
                {userOrders.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Order ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {userOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                              {order.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ${order.total.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                  ${getOrderStatusClass(order.status)}`}
                              >
                                {order.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <button
                                className="text-blue-600 hover:text-blue-800"
                                onClick={() => handleViewOrderDetails(order.id)}
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    <FiPackage className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p>You haven&apos;t placed any orders yet.</p>
                    <button
                      className="mt-4 text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
                      onClick={() => router.push("/store")}
                    >
                      Continue Shopping
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* You might also show payment methods, addresses, etc. here */}
            <div className="bg-white rounded-lg shadow overflow-hidden mt-8">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">
                  Payment Methods
                </h2>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center">
                    <FiCreditCard className="text-gray-500 mr-4 h-6 w-6" />
                    <div>
                      <div className="font-medium">•••• •••• •••• 4242</div>
                      <div className="text-sm text-gray-500">Expires 12/25</div>
                    </div>
                  </div>
                  <button
                    onClick={handleOpenPaymentMethods}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Manage
                  </button>
                </div>

                <button
                  onClick={handleOpenPaymentMethods}
                  className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center"
                >
                  <FiPlus className="mr-1" /> Add New Payment Method
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Edit Modal */}
      {isEditModalOpen && currentUser && (
        <ProfileUpdateModal
          user={currentUser}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}

      {/* Address Book Modal */}
      {isAddressBookOpen && currentUser && (
        <AddressBookModal
          user={currentUser}
          onClose={() => setIsAddressBookOpen(false)}
        />
      )}

      {/* Payment Methods Modal */}
      {isPaymentMethodsOpen && currentUser && (
        <PaymentMethodsModal
          user={currentUser}
          onClose={() => setIsPaymentMethodsOpen(false)}
        />
      )}

      {/* Order Detail Modal */}
      {isOrderDetailOpen && selectedOrderId && (
        <OrderDetailModal
          orderId={selectedOrderId}
          onClose={() => setIsOrderDetailOpen(false)}
        />
      )}
    </MainLayout>
  );
}
