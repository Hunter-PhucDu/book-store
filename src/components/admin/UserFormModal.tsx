/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useMemo } from "react";
import { FiX } from "react-icons/fi";
import { useStore } from "@/store/index";
import { User, UserRole } from "@/types/user";

interface UserFormModalProps {
  user: User | null;
  onClose: () => void;
}

export default function UserFormModal({ user, onClose }: UserFormModalProps) {
  const addUser = useStore((state) => state.addUser);
  const updateUser = useStore((state) => state.updateUser);

  // Default form values
  const defaultFormData = useMemo(
    () => ({
      name: "",
      email: "",
      role: UserRole.CUSTOMER,
      password: "",
      confirmPassword: "",
      avatar: "",
      // Employee/Inventory Manager specific fields
      department: "",
      hireDate: new Date().toISOString().split("T")[0], // Format: YYYY-MM-DD
      salary: 0,
      warehouseId: "",
      // Admin specific fields
      permissions: [] as string[],
      // Customer specific fields
      address: "",
      phoneNumber: "",
    }),
    [],
  );

  const [formData, setFormData] = useState<typeof defaultFormData>({
    ...defaultFormData,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with user data if editing
  useEffect(() => {
    if (user) {
      const commonFields = {
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || "",
        password: "",
        confirmPassword: "",
      };

      // Role-specific fields
      if (user.role === UserRole.EMPLOYEE) {
        const employeeUser = user as any;
        setFormData({
          ...commonFields,
          department: employeeUser.department || "",
          hireDate: employeeUser.hireDate
            ? new Date(employeeUser.hireDate).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
          salary: employeeUser.salary || 0,
          warehouseId: "",
          permissions: [],
          address: "",
          phoneNumber: "",
        });
      } else if (user.role === UserRole.INVENTORY_MANAGER) {
        const inventoryUser = user as any;
        setFormData({
          ...commonFields,
          department: inventoryUser.department || "",
          hireDate: inventoryUser.hireDate
            ? new Date(inventoryUser.hireDate).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
          warehouseId: inventoryUser.warehouseId || "",
          salary: 0,
          permissions: [],
          address: "",
          phoneNumber: "",
        });
      } else if (user.role === UserRole.ADMIN) {
        const adminUser = user as any;
        setFormData({
          ...commonFields,
          permissions: adminUser.permissions || [],
          department: "",
          hireDate: new Date().toISOString().split("T")[0],
          salary: 0,
          warehouseId: "",
          address: "",
          phoneNumber: "",
        });
      } else {
        // UserRole.CUSTOMER
        const customerUser = user as any;
        setFormData({
          ...commonFields,
          address: customerUser.address || "",
          phoneNumber: customerUser.phoneNumber || "",
          department: "",
          hireDate: new Date().toISOString().split("T")[0],
          salary: 0,
          warehouseId: "",
          permissions: [],
        });
      }
    } else {
      setFormData({ ...defaultFormData });
    }
  }, [user, defaultFormData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;

    if (type === "number") {
      setFormData((prev) => ({ ...prev, [name]: parseFloat(value) }));
    } else if (name === "role") {
      setFormData((prev) => ({ ...prev, [name]: value as UserRole }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Common validations
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!user) {
      // Only validate password for new users
      if (!formData.password) newErrors.password = "Password is required";
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    } else if (
      formData.password &&
      formData.password !== formData.confirmPassword
    ) {
      // If changing password for existing user
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Role-specific validations
    if (formData.role === UserRole.EMPLOYEE) {
      if (!formData.department.trim())
        newErrors.department = "Department is required";
      if (!formData.hireDate) newErrors.hireDate = "Hire date is required";
      if (formData.salary <= 0)
        newErrors.salary = "Salary must be greater than 0";
    }

    if (formData.role === UserRole.INVENTORY_MANAGER) {
      if (!formData.department.trim())
        newErrors.department = "Department is required";
      if (!formData.warehouseId.trim())
        newErrors.warehouseId = "Warehouse ID is required";
      if (!formData.hireDate) newErrors.hireDate = "Hire date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Prepare user data based on role
      const userData: Record<string, unknown> = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        ...(formData.avatar ? { avatar: formData.avatar } : {}),
      };

      // Add password only if provided (or new user)
      if (!user || (user && formData.password)) {
        userData.password = formData.password;
      }

      // Add role-specific fields
      if (formData.role === UserRole.EMPLOYEE) {
        userData.department = formData.department;
        userData.hireDate = new Date(formData.hireDate);
        userData.salary = formData.salary;
      } else if (formData.role === UserRole.INVENTORY_MANAGER) {
        userData.department = formData.department;
        userData.hireDate = new Date(formData.hireDate);
        userData.warehouseId = formData.warehouseId;
      } else if (formData.role === UserRole.ADMIN) {
        userData.permissions = formData.permissions;
        userData.lastLogin = new Date();
      } else if (formData.role === UserRole.CUSTOMER) {
        userData.address = formData.address;
        userData.phoneNumber = formData.phoneNumber;
        userData.orderHistory =
          user && "orderHistory" in user ? user.orderHistory : [];
      }

      if (user) {
        // Update existing user
        updateUser({
          ...user,
          ...userData,
        });
      } else {
        // Add new user
        addUser(userData);
      }

      onClose();
    } catch (error) {
      console.error("Error saving user:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            {user ? "Edit User" : "Add New User"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full p-2 border rounded-lg ${errors.name ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-2 border rounded-lg ${errors.email ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value={UserRole.CUSTOMER}>Customer</option>
                <option value={UserRole.EMPLOYEE}>Employee</option>
                <option value={UserRole.INVENTORY_MANAGER}>
                  Inventory Manager
                </option>
                <option value={UserRole.ADMIN}>Administrator</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Avatar URL (optional)
              </label>
              <input
                type="text"
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {user
                  ? "New Password (leave blank to keep current)"
                  : "Password"}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full p-2 border rounded-lg ${errors.password ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full p-2 border rounded-lg ${errors.confirmPassword ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Role-specific fields */}
            {(formData.role === UserRole.EMPLOYEE ||
              formData.role === UserRole.INVENTORY_MANAGER) && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-lg ${errors.department ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.department && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.department}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hire Date
                  </label>
                  <input
                    type="date"
                    name="hireDate"
                    value={formData.hireDate}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-lg ${errors.hireDate ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.hireDate && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.hireDate}
                    </p>
                  )}
                </div>
              </>
            )}

            {formData.role === UserRole.EMPLOYEE && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Salary
                </label>
                <input
                  type="number"
                  name="salary"
                  min="0"
                  step="0.01"
                  value={formData.salary}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-lg ${errors.salary ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.salary && (
                  <p className="mt-1 text-sm text-red-500">{errors.salary}</p>
                )}
              </div>
            )}

            {formData.role === UserRole.INVENTORY_MANAGER && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Warehouse ID
                </label>
                <input
                  type="text"
                  name="warehouseId"
                  value={formData.warehouseId}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-lg ${errors.warehouseId ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.warehouseId && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.warehouseId}
                  </p>
                )}
              </div>
            )}

            {formData.role === UserRole.CUSTOMER && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </>
            )}
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
            >
              {isSubmitting ? "Saving..." : user ? "Update User" : "Add User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
