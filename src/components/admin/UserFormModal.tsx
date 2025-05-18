/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslininterface UserFormModalProps {
  user: User | null;
  onClose: () => void;
  onSuccess?: (action: 'add' | 'update', userData: User) => void;
}able @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useMemo } from "react";
import { FiX } from "react-icons/fi";
import { useStore } from "@/store/index";
import { User, UserRole } from "@/types/user";

interface UserFormModalProps {
  user: User | null;
  onClose: (success?: boolean) => void;
}

export default function UserFormModal({ user, onClose }: UserFormModalProps) {
  const addUser = useStore((state) => state.addUser);
  const updateUser = useStore((state) => state.updateUser);

  const defaultFormData = useMemo(
    () => ({
      name: "",
      email: "",
      role: UserRole.EMPLOYEE,
      password: "",
      avatar: "/images/avatars/employee.jpg",
      department: "",
      hireDate: new Date().toISOString().split("T")[0],
      salary: 0,
      permissions: [] as string[],
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

  useEffect(() => {
    if (user) {
      const commonFields = {
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || "/images/avatars/employee.jpg",
        password: "",
      };

      if (
        user.role === UserRole.EMPLOYEE ||
        user.role === UserRole.INVENTORY_MANAGER
      ) {
        const staffUser = user as any;
        setFormData({
          ...commonFields,
          department: staffUser.department || "",
          hireDate: staffUser.hireDate
            ? new Date(staffUser.hireDate).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
          salary: staffUser.salary || 0,
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
          address: "",
          phoneNumber: "",
        });
      } else {
        const customerUser = user as any;
        setFormData({
          ...commonFields,
          address: customerUser.address || "",
          phoneNumber: customerUser.phoneNumber || "",
          department: "",
          hireDate: new Date().toISOString().split("T")[0],
          salary: 0,
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
      let roleValue: UserRole;

      switch (value) {
        case "EMPLOYEE":
          roleValue = UserRole.EMPLOYEE;
          break;
        case "INVENTORY_MANAGER":
          roleValue = UserRole.INVENTORY_MANAGER;
          break;
        case "ADMIN":
          roleValue = UserRole.ADMIN;
          break;
        case "CUSTOMER":
          roleValue = UserRole.CUSTOMER;
          break;
        default:
          roleValue = UserRole.EMPLOYEE;
          break;
      }

      console.log("Role selected:", value, "Mapped to:", roleValue);
      setFormData((prev) => ({ ...prev, [name]: roleValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Common validations
    if (!formData.name.trim()) newErrors.name = "Vui lòng nhập họ tên";
    if (!formData.email.trim()) newErrors.email = "Vui lòng nhập email";
    if (!user) {
      // Only validate password for new users
      if (!formData.password) newErrors.password = "Vui lòng nhập mật khẩu";
    }

    // Role-specific validations
    if (
      formData.role === UserRole.EMPLOYEE ||
      formData.role === UserRole.INVENTORY_MANAGER
    ) {
      if (!formData.department.trim())
        newErrors.department = "Vui lòng nhập phòng ban";
      if (!formData.hireDate) newErrors.hireDate = "Vui lòng chọn ngày vào làm";
      if (formData.salary <= 0) newErrors.salary = "Lương phải lớn hơn 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // State to manage success message
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Create a handleClose function that only closes the modal without showing success message
  const handleClose = () => {
    // When manually closing, don't show success message
    setShowSuccessMessage(false);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Define role explicitly to avoid any type issues
      const selectedRole = formData.role;
      console.log("Selected role before preparing data:", selectedRole);

      // Prepare user data with explicit role assignment
      const userData: Record<string, unknown> = {
        name: formData.name,
        email: formData.email,
        role: selectedRole, // Explicitly set from formData
        avatar: formData.avatar, // Use default avatar
      };

      // Add password only if provided (or new user)
      if (!user || (user && formData.password)) {
        userData.password = formData.password;
      }

      // Add role-specific fields based on the selected role
      if (
        selectedRole === UserRole.EMPLOYEE ||
        selectedRole === UserRole.INVENTORY_MANAGER
      ) {
        userData.department = formData.department;
        userData.hireDate = new Date(formData.hireDate);
        userData.salary = formData.salary;
        console.log(
          `Adding ${selectedRole} specific fields with salary: ${formData.salary}`,
        );
      } else if (selectedRole === UserRole.ADMIN) {
        userData.permissions = formData.permissions;
        userData.lastLogin = new Date();
        console.log("Adding ADMIN specific fields");
      } else if (selectedRole === UserRole.CUSTOMER) {
        userData.address = formData.address;
        userData.phoneNumber = formData.phoneNumber;
        userData.orderHistory =
          user && "orderHistory" in user ? user.orderHistory : [];
        console.log("Adding CUSTOMER specific fields");
      }

      // Final check of the role before saving
      console.log("Final userData.role before save:", userData.role);

      if (user) {
        // Update existing user
        const updatedUser = {
          ...user,
          ...userData,
          role: selectedRole, // Ensure role is explicitly set
        };
        console.log("Updating user with role:", updatedUser.role);
        updateUser(updatedUser);
      } else {
        // Add new user
        console.log("Adding new user with role:", userData.role);
        addUser(userData as any);
      }

      // Show success message only when form is successfully submitted
      setShowSuccessMessage(true);

      // Ensure store has been updated before closing modal
      setTimeout(() => {
        // Force a refresh of the store subscribers
        const currentUsers = useStore.getState().users;
        console.log("User count before modal close:", currentUsers.length);

        // Close the modal với tham số success=true
        onClose(true);
      }, 500);
    } catch (error) {
      console.error("Error saving user:", error);
      // Nếu có lỗi, đóng modal mà không truyền tham số success
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/25 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto transition-all duration-300 animate-[fadeIn_0.3s_ease-in-out]">
      {showSuccessMessage && (
        <div className="absolute top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-xl z-50 animate-[slideInBottom_0.3s_ease-in-out] flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2"
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
            <p className="font-medium">
              {user
                ? "Cập nhật nhân viên thành công!"
                : "Thêm nhân viên mới thành công!"}
            </p>
            <p className="text-sm text-green-100">Đang chuyển hướng...</p>
          </div>
        </div>
      )}

      <div className="bg-white/95 backdrop-blur-sm rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all duration-300 ease-in-out animate-[scaleIn_0.3s_ease-in-out]">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            {user ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
                <span>Chỉnh sửa nhân viên</span>
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
                <span>Thêm nhân viên mới</span>
              </>
            )}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-500 hover:bg-gray-100 p-2 rounded-full transition-all duration-200"
            aria-label="Đóng"
            title="Đóng"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Họ và tên
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nhập họ và tên"
                title="Họ và tên"
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
                placeholder="Nhập địa chỉ email"
                title="Email"
                className={`w-full p-2 border rounded-lg ${errors.email ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vai trò
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                title="Vai trò"
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value={UserRole.EMPLOYEE}>Nhân viên</option>
                <option value={UserRole.INVENTORY_MANAGER}>Quản lý kho</option>
                <option value={UserRole.ADMIN}>Quản trị viên</option>
              </select>
            </div>

            {/* Avatar is set to default and not configurable in the form */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {user ? "Mật khẩu mới (để trống nếu không đổi)" : "Mật khẩu"}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu"
                title="Mật khẩu"
                className={`w-full p-2 border rounded-lg ${errors.password ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Role-specific fields */}
            {(formData.role === UserRole.EMPLOYEE ||
              formData.role === UserRole.INVENTORY_MANAGER) && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phòng ban
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="Nhập tên phòng ban"
                    title="Phòng ban"
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
                    Ngày vào làm
                  </label>
                  <input
                    type="date"
                    name="hireDate"
                    value={formData.hireDate}
                    onChange={handleChange}
                    title="Ngày vào làm"
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

            {(formData.role === UserRole.EMPLOYEE ||
              formData.role === UserRole.INVENTORY_MANAGER) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lương (VNĐ)
                </label>
                <input
                  type="number"
                  name="salary"
                  min="0"
                  step="100000"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="Nhập mức lương"
                  title="Lương"
                  className={`w-full p-2 border rounded-lg ${errors.salary ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.salary && (
                  <p className="mt-1 text-sm text-red-500">{errors.salary}</p>
                )}
              </div>
            )}

            {formData.role === UserRole.CUSTOMER && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Địa chỉ
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Nhập địa chỉ"
                    title="Địa chỉ"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Nhập số điện thoại"
                    title="Số điện thoại"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </>
            )}
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 font-medium flex items-center transition-all duration-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 font-medium flex items-center shadow-md hover:shadow-lg transition-all duration-200"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Đang lưu...
                </>
              ) : user ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                  Cập nhật
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Thêm mới
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
