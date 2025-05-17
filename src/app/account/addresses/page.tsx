"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiCheck,
  FiArrowLeft,
  FiMapPin,
} from "react-icons/fi";
import MainLayout from "@/components/layout/MainLayout";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// Types
interface Address {
  id: string;
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
  isDefault: boolean;
}

// Mock data
const mockAddresses: Address[] = [
  {
    id: "addr1",
    fullName: "Nguyễn Văn A",
    addressLine1: "123 Đường Lê Lợi",
    addressLine2: "Phường Bến Nghé",
    city: "Quận 1",
    state: "Hồ Chí Minh",
    postalCode: "700000",
    country: "Việt Nam",
    phoneNumber: "0901234567",
    isDefault: true,
  },
  {
    id: "addr2",
    fullName: "Nguyễn Văn A",
    addressLine1: "456 Đường Nguyễn Huệ",
    city: "Quận 5",
    state: "Hồ Chí Minh",
    postalCode: "700000",
    country: "Việt Nam",
    phoneNumber: "0907654321",
    isDefault: false,
  },
];

export default function AddressesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null,
  );

  // Form state
  const emptyAddress: Omit<Address, "id" | "isDefault"> = {
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Việt Nam",
    phoneNumber: "",
  };

  const [formData, setFormData] = useState(emptyAddress);

  // Loading state
  const [isLoading, setIsLoading] = useState(status === "loading");

  // Effects
  useState(() => {
    if (status === "unauthenticated") {
      router.push("/signin?callbackUrl=/account/addresses");
    } else if (status === "authenticated") {
      setIsLoading(false);
    }
  });

  // Handlers
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddNew = () => {
    setFormData({
      ...emptyAddress,
      fullName: session?.user?.name || "",
    });
    setIsAddingNew(true);
  };
  const handleEdit = (address: Address) => {
    const { id, ...rest } = address;
    setFormData(rest);
    setIsEditing(id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditing) {
      // Update existing address
      setAddresses((prevAddresses) =>
        prevAddresses.map((addr) =>
          addr.id === isEditing ? { ...addr, ...formData } : addr,
        ),
      );
      setIsEditing(null);
    } else {
      // Add new address
      const newAddress: Address = {
        id: `addr${Date.now()}`,
        ...formData,
        isDefault: addresses.length === 0, // Make default if it's the first address
      };
      setAddresses((prev) => [...prev, newAddress]);
      setIsAddingNew(false);
    }

    // Reset form
    setFormData(emptyAddress);
  };

  const handleCancel = () => {
    setIsAddingNew(false);
    setIsEditing(null);
    setFormData(emptyAddress);
  };

  const handleDelete = (id: string) => {
    setAddresses((prev) => {
      const filtered = prev.filter((addr) => addr.id !== id);

      // If we deleted the default address, set a new one
      if (
        prev.find((addr) => addr.id === id)?.isDefault &&
        filtered.length > 0
      ) {
        filtered[0].isDefault = true;
      }

      return filtered;
    });
    setShowDeleteConfirm(null);
  };

  const handleSetDefault = (id: string) => {
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      })),
    );
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="spinner h-12 w-12 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải địa chỉ của bạn...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Empty state
  if (addresses.length === 0 && !isAddingNew) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-8">
            <Link
              href="/account"
              className="flex items-center text-gray-600 hover:text-blue-600 mr-4"
            >
              <FiArrowLeft className="mr-1" />
              <span>Quay lại</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">
              Địa chỉ của tôi
            </h1>
          </div>

          <div className="bg-white shadow-md rounded-xl p-10 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center">
                <FiMapPin className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-2">
              Bạn chưa lưu địa chỉ nào
            </h2>
            <p className="text-gray-600 mb-6">
              Thêm địa chỉ giao hàng để có thể đặt hàng nhanh hơn
            </p>
            <button
              onClick={handleAddNew}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiPlus className="mr-2" />
              Thêm địa chỉ mới
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
          <div className="flex items-center">
            <Link
              href="/account"
              className="flex items-center text-gray-600 hover:text-blue-600 mr-4"
            >
              <FiArrowLeft className="mr-1" />
              <span>Quay lại</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">
              Địa chỉ của tôi
            </h1>
          </div>

          {!isAddingNew && !isEditing && (
            <button
              onClick={handleAddNew}
              className="flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiPlus className="mr-2" /> Thêm địa chỉ mới
            </button>
          )}
        </div>

        {isAddingNew || isEditing ? (
          <div className="bg-white shadow-md rounded-lg p-6 mb-8 animate-fade-in">
            <h2 className="text-xl font-semibold mb-4">
              {isEditing ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="col-span-1 md:col-span-2">
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Họ tên người nhận <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="py-2 px-3 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label
                    htmlFor="phoneNumber"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    required
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="py-2 px-3 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label
                    htmlFor="addressLine1"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Địa chỉ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="addressLine1"
                    name="addressLine1"
                    required
                    value={formData.addressLine1}
                    onChange={handleInputChange}
                    className="py-2 px-3 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label
                    htmlFor="addressLine2"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Địa chỉ bổ sung (nếu có)
                  </label>
                  <input
                    type="text"
                    id="addressLine2"
                    name="addressLine2"
                    value={formData.addressLine2 || ""}
                    onChange={handleInputChange}
                    className="py-2 px-3 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Quận/Huyện <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    className="py-2 px-3 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Tỉnh/Thành phố <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleInputChange}
                    className="py-2 px-3 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="postalCode"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Mã bưu điện <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    required
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="py-2 px-3 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Quốc gia <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    required
                    value={formData.country}
                    onChange={handleInputChange}
                    className="py-2 px-3 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  {isEditing ? "Cập nhật" : "Lưu địa chỉ"}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="grid grid-cols-1 divide-y divide-gray-200">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-wrap justify-between items-start mb-2">
                    <div className="flex items-center mb-2 sm:mb-0">
                      <h3 className="font-semibold text-lg">
                        {address.fullName}
                      </h3>
                      {address.isDefault && (
                        <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded">
                          Mặc định
                        </span>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(address)}
                        className="text-gray-600 hover:text-blue-600 p-1 rounded-full hover:bg-blue-50"
                      >
                        <FiEdit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(address.id)}
                        className="text-gray-600 hover:text-red-600 p-1 rounded-full hover:bg-red-50"
                      >
                        <FiTrash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-800">
                    {address.addressLine1}
                    {address.addressLine2 && `, ${address.addressLine2}`}
                  </p>
                  <p className="text-gray-800">
                    {address.city}, {address.state} {address.postalCode}
                  </p>
                  <p className="text-gray-800">{address.country}</p>
                  <p className="text-gray-600 mt-1">
                    SĐT: {address.phoneNumber}
                  </p>

                  {!address.isDefault && (
                    <button
                      onClick={() => handleSetDefault(address.id)}
                      className="mt-4 inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                    >
                      <FiCheck className="mr-1 h-4 w-4" />
                      Đặt làm địa chỉ mặc định
                    </button>
                  )}

                  {/* Delete confirmation modal */}
                  {showDeleteConfirm === address.id && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-3">
                          Xác nhận xóa địa chỉ
                        </h3>
                        <p className="text-gray-600 mb-6">
                          Bạn có chắc chắn muốn xóa địa chỉ này? Hành động này
                          không thể hoàn tác.
                        </p>
                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={() => setShowDeleteConfirm(null)}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Hủy
                          </button>
                          <button
                            onClick={() => handleDelete(address.id)}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            Xóa
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
