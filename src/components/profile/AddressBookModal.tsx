"use client";

import { useState } from "react";
import {
  FiX,
  FiMapPin,
  FiHome,
  FiPlus,
  FiCheck,
  FiAlertTriangle,
} from "react-icons/fi";
import { User } from "@/types/user";
import { useStore } from "@/store/index";

interface AddressBookModalProps {
  user: User;
  onClose: () => void;
}

interface Address {
  id: string;
  type: "shipping" | "billing";
  name: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

// Mock data - in a real app this would come from the user profile
const mockAddresses: Address[] = [
  {
    id: "1",
    type: "shipping",
    name: "Home Address",
    street: "123 Main Street",
    city: "Anytown",
    state: "CA",
    postalCode: "12345",
    country: "United States",
    isDefault: true,
  },
  {
    id: "2",
    type: "billing",
    name: "Work Address",
    street: "456 Business Ave, Suite 100",
    city: "Commerce City",
    state: "NY",
    postalCode: "54321",
    country: "United States",
    isDefault: true,
  },
];

export default function AddressBookModal({
  user,
  onClose,
}: AddressBookModalProps) {
  const updateUser = useStore((state) => state.updateUser);
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses);
  const [currentAddress, setCurrentAddress] = useState<Address | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const handleEditAddress = (address: Address) => {
    setCurrentAddress({ ...address });
    setIsEditing(true);
  };

  const handleAddNewAddress = () => {
    const newAddress: Address = {
      id: `new-${Date.now()}`,
      type: "shipping",
      name: "",
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "United States",
      isDefault:
        addresses.filter((addr) => addr.type === "shipping").length === 0,
    };

    setCurrentAddress(newAddress);
    setIsEditing(true);
  };

  const handleSetAsDefault = (id: string, type: "shipping" | "billing") => {
    const updatedAddresses = addresses.map((address) => ({
      ...address,
      isDefault: address.type === type ? address.id === id : address.isDefault,
    }));

    setAddresses(updatedAddresses);
    setSuccess(`Default ${type} address updated successfully.`);

    // In a real app, save this to the user profile
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleDeleteAddress = (id: string) => {
    const updatedAddresses = addresses.filter((address) => address.id !== id);
    setAddresses(updatedAddresses);

    // Check if we need to set a new default address
    const shippingAddresses = updatedAddresses.filter(
      (addr) => addr.type === "shipping",
    );
    const billingAddresses = updatedAddresses.filter(
      (addr) => addr.type === "billing",
    );

    if (
      shippingAddresses.length > 0 &&
      !shippingAddresses.some((addr) => addr.isDefault)
    ) {
      shippingAddresses[0].isDefault = true;
    }

    if (
      billingAddresses.length > 0 &&
      !billingAddresses.some((addr) => addr.isDefault)
    ) {
      billingAddresses[0].isDefault = true;
    }

    setSuccess("Address deleted successfully.");

    // In a real app, save this to the user profile
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentAddress) return;

    // Validate the form
    if (
      !currentAddress.name ||
      !currentAddress.street ||
      !currentAddress.city ||
      !currentAddress.state ||
      !currentAddress.postalCode
    ) {
      setError("Please fill out all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Check if this is a new address or an existing one being edited
      if (addresses.some((addr) => addr.id === currentAddress.id)) {
        // Update existing address
        const updatedAddresses = addresses.map((addr) =>
          addr.id === currentAddress.id ? currentAddress : addr,
        );
        setAddresses(updatedAddresses);
      } else {
        // Add new address
        setAddresses([...addresses, currentAddress]);
      }

      setSuccess("Address saved successfully.");
      setIsEditing(false);
      setCurrentAddress(null);

      // In a real app, save this to the user profile
    } catch (error) {
      setError("An error occurred while saving the address.");
      console.error("Error saving address:", error);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setCurrentAddress(null);
    setError("");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Address Book</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
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

          {!isEditing ? (
            <>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Shipping Addresses
                  </h3>
                  <button
                    onClick={handleAddNewAddress}
                    className="text-sm text-blue-600 hover:text-blue-500 flex items-center"
                  >
                    <FiPlus className="mr-1" /> Add New Address
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses
                    .filter((address) => address.type === "shipping")
                    .map((address) => (
                      <div
                        key={address.id}
                        className={`border rounded-lg p-4 ${address.isDefault ? "border-blue-300 bg-blue-50" : ""}`}
                      >
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-gray-900">
                            {address.name}
                          </h4>
                          {address.isDefault && (
                            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                              Default
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 mt-2">
                          <p>{address.street}</p>
                          <p>
                            {address.city}, {address.state} {address.postalCode}
                          </p>
                          <p>{address.country}</p>
                        </div>
                        <div className="mt-3 flex space-x-2">
                          <button
                            onClick={() => handleEditAddress(address)}
                            className="text-sm text-blue-600 hover:text-blue-500"
                          >
                            Edit
                          </button>
                          {!address.isDefault && (
                            <button
                              onClick={() =>
                                handleSetAsDefault(address.id, address.type)
                              }
                              className="text-sm text-blue-600 hover:text-blue-500"
                            >
                              Set as Default
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteAddress(address.id)}
                            className="text-sm text-red-600 hover:text-red-500"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}

                  {addresses.filter((address) => address.type === "shipping")
                    .length === 0 && (
                    <div className="col-span-2 text-center p-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                      <FiMapPin className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 mb-4">
                        You haven&apos;t added any shipping addresses yet.
                      </p>
                      <button
                        onClick={handleAddNewAddress}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Add Shipping Address
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Billing Addresses
                  </h3>
                  <button
                    onClick={handleAddNewAddress}
                    className="text-sm text-blue-600 hover:text-blue-500 flex items-center"
                  >
                    <FiPlus className="mr-1" /> Add New Address
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses
                    .filter((address) => address.type === "billing")
                    .map((address) => (
                      <div
                        key={address.id}
                        className={`border rounded-lg p-4 ${address.isDefault ? "border-blue-300 bg-blue-50" : ""}`}
                      >
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-gray-900">
                            {address.name}
                          </h4>
                          {address.isDefault && (
                            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                              Default
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 mt-2">
                          <p>{address.street}</p>
                          <p>
                            {address.city}, {address.state} {address.postalCode}
                          </p>
                          <p>{address.country}</p>
                        </div>
                        <div className="mt-3 flex space-x-2">
                          <button
                            onClick={() => handleEditAddress(address)}
                            className="text-sm text-blue-600 hover:text-blue-500"
                          >
                            Edit
                          </button>
                          {!address.isDefault && (
                            <button
                              onClick={() =>
                                handleSetAsDefault(address.id, address.type)
                              }
                              className="text-sm text-blue-600 hover:text-blue-500"
                            >
                              Set as Default
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteAddress(address.id)}
                            className="text-sm text-red-600 hover:text-red-500"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}

                  {addresses.filter((address) => address.type === "billing")
                    .length === 0 && (
                    <div className="col-span-2 text-center p-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                      <FiMapPin className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 mb-4">
                        You haven&apos;t added any billing addresses yet.
                      </p>
                      <button
                        onClick={handleAddNewAddress}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Add Billing Address
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {currentAddress?.id.startsWith("new")
                  ? "Add New Address"
                  : "Edit Address"}
              </h3>

              <form onSubmit={handleSaveAddress} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address Type
                  </label>
                  <select
                    value={currentAddress?.type}
                    onChange={(e) =>
                      setCurrentAddress({
                        ...currentAddress!,
                        type: e.target.value as "shipping" | "billing",
                      })
                    }
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="shipping">Shipping Address</option>
                    <option value="billing">Billing Address</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address Name
                  </label>
                  <input
                    type="text"
                    value={currentAddress?.name}
                    onChange={(e) =>
                      setCurrentAddress({
                        ...currentAddress!,
                        name: e.target.value,
                      })
                    }
                    placeholder="e.g., Home, Work, etc."
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={currentAddress?.street}
                    onChange={(e) =>
                      setCurrentAddress({
                        ...currentAddress!,
                        street: e.target.value,
                      })
                    }
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={currentAddress?.city}
                      onChange={(e) =>
                        setCurrentAddress({
                          ...currentAddress!,
                          city: e.target.value,
                        })
                      }
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State/Province
                    </label>
                    <input
                      type="text"
                      value={currentAddress?.state}
                      onChange={(e) =>
                        setCurrentAddress({
                          ...currentAddress!,
                          state: e.target.value,
                        })
                      }
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      value={currentAddress?.postalCode}
                      onChange={(e) =>
                        setCurrentAddress({
                          ...currentAddress!,
                          postalCode: e.target.value,
                        })
                      }
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      value={currentAddress?.country}
                      onChange={(e) =>
                        setCurrentAddress({
                          ...currentAddress!,
                          country: e.target.value,
                        })
                      }
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex items-center mt-4">
                  <input
                    id="set-as-default"
                    type="checkbox"
                    checked={currentAddress?.isDefault}
                    onChange={(e) =>
                      setCurrentAddress({
                        ...currentAddress!,
                        isDefault: e.target.checked,
                      })
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="set-as-default"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Set as default{" "}
                    {currentAddress?.type === "shipping"
                      ? "shipping"
                      : "billing"}{" "}
                    address
                  </label>
                </div>

                <div className="flex justify-end pt-4 space-x-3">
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
                    {isSubmitting ? "Saving..." : "Save Address"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {!isEditing && (
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
