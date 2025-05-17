"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  FiSearch,
  FiUserPlus,
  FiEdit,
  FiTrash2,
  FiX,
  FiCheck,
  FiBriefcase,
} from "react-icons/fi";
import { useStore } from "@/store/index";
import { User, UserRole, Employee } from "@/types/user";
import UserFormModal from "@/components/admin/UserFormModal";
import Image from "next/image";

export default function EmployeeManagementPage() {
  const { data: session, status } = useSession();
  const router = useRouter(); // Lấy users và deleteUser từ store
  const users = useStore((state) => state.users);
  const deleteUser = useStore((state) => state.deleteUser);

  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(
    null,
  );
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState(""); // Lấy danh sách nhân viên từ users - với dependency array tốt hơn để đảm bảo cập nhật khi users thay đổi
  const staffMembers = useMemo(() => {
    console.log("Recalculating staff members from users:", users);
    return users.filter(
      (user) =>
        user.role === UserRole.EMPLOYEE ||
        user.role === UserRole.INVENTORY_MANAGER ||
        user.role === UserRole.ADMIN,
    );
  }, [users]);

  const departments = Array.from(
    new Set(
      staffMembers
        .map((staff) => {
          const employee = staff as Employee;
          return employee.department;
        })
        .filter(Boolean),
    ),
  );
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin?callbackUrl=/admin/employees");
    } else if (status === "authenticated") {
      if (session?.user?.role !== UserRole.ADMIN) {
        router.push("/");
      } else {
        setIsLoading(false);
      }
    }
  }, [status, session, router]);
  useEffect(() => {
    const unsubscribe = useStore.subscribe((state) => state.users);

    return () => unsubscribe();
  }, []);

  const filteredStaff = staffMembers.filter((staff) => {
    if (departmentFilter !== "all") {
      const employee = staff as Employee;
      if (employee.department !== departmentFilter) return false;
    }

    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        staff.name.toLowerCase().includes(searchLower) ||
        staff.email.toLowerCase().includes(searchLower) ||
        (staff as Employee).department?.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  const handleAddEmployee = () => {
    setSelectedUser(null);
    setIsUserFormOpen(true);
  };

  const handleEditEmployee = (user: User) => {
    setSelectedUser(user);
    setIsUserFormOpen(true);
  };
  const handleDeleteEmployee = (id: string) => {
    deleteUser(id);
    setShowConfirmDelete(null);

    setNotificationMessage("Đã xóa nhân viên thành công!");

    setShowSuccessNotification(true);

    setTimeout(() => {
      setShowSuccessNotification(false);
    }, 3000);
  };

  const formatRole = (role: string) => {
    return role
      .replace("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const calculateEmploymentDuration = (hireDate: Date) => {
    const start = new Date(hireDate);
    const now = new Date();

    let years = now.getFullYear() - start.getFullYear();
    let months = now.getMonth() - start.getMonth();

    if (months < 0) {
      years--;
      months += 12;
    }

    if (years === 0) {
      return `${months} tháng`;
    } else if (months === 0) {
      return `${years} năm`;
    } else {
      return `${years} năm, ${months} tháng`;
    }
  };

  // Hàm xử lý khi đóng modal
  const handleUserFormClose = (success?: boolean) => {
    // Chỉ hiển thị thông báo thành công nếu tham số success là true
    if (success) {
      const action = selectedUser ? "update" : "add";
      setNotificationMessage(
        action === "add"
          ? "Đã thêm nhân viên mới thành công!"
          : "Đã cập nhật thông tin nhân viên thành công!",
      );

      const currentUsers = useStore.getState().users;
      console.log("Current users after modal close:", currentUsers.length);

      setShowSuccessNotification(true);

      setTimeout(() => {
        setShowSuccessNotification(false);
      }, 3000);
    }

    // Đóng modal trong mọi trường hợp
    setIsUserFormOpen(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner h-12 w-12 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu nhân viên...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row md:justify-between md:items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <button
              onClick={() => router.push("/admin")}
              className="flex items-center mr-4 text-gray-600 hover:text-blue-600"
              aria-label="Quay lại"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Quay lại</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-800">
              Quản lý nhân viên
            </h1>
          </div>
          <button
            onClick={handleAddEmployee}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
          >
            <FiUserPlus className="mr-2" /> Thêm nhân viên
          </button>
        </div>
      </div>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email hoặc phòng ban..."
              className="w-full px-4 py-3 pl-12 border rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <div className="flex items-center">
            <FiBriefcase className="mr-2 text-gray-500" />
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-4 py-3 border rounded-lg min-w-[180px]"
              aria-label="Lọc theo phòng ban"
            >
              <option value="all">Tất cả phòng ban</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      {/* Employee Stats */}
      <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="font-medium text-sm text-gray-500">
              Tổng nhân viên
            </div>
            <div className="text-xl font-bold mt-1">{staffMembers.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="font-medium text-sm text-blue-500">Nhân viên</div>
            <div className="text-xl font-bold mt-1">
              {users.filter((user) => user.role === UserRole.EMPLOYEE).length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="font-medium text-sm text-green-500">
              Quản lý kho
            </div>
            <div className="text-xl font-bold mt-1">
              {
                users.filter((user) => user.role === UserRole.INVENTORY_MANAGER)
                  .length
              }
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="font-medium text-sm text-purple-500">Phòng ban</div>
            <div className="text-xl font-bold mt-1">{departments.length}</div>
          </div>
        </div>
      </div>
      {/* Employees Table */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nhân viên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phòng ban
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chức vụ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày tuyển
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thâm niên
                  </th>
                  {/* Only show salary to admin */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lương
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStaff.length > 0 ? (
                  filteredStaff.map((staff) => {
                    const employee = staff as Employee;

                    return (
                      <tr key={staff.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {staff.avatar ? (
                                <Image
                                  src={staff.avatar}
                                  alt={staff.name}
                                  className="h-10 w-10 rounded-full object-cover"
                                  width={40}
                                  height={40}
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                  {staff.name.charAt(0).toUpperCase()}
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {staff.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {staff.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.department}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              staff.role === UserRole.INVENTORY_MANAGER
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {formatRole(staff.role)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(employee.hireDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {calculateEmploymentDuration(employee.hireDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.salary
                            ? employee.salary.toLocaleString("vi-VN") + " đ"
                            : "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {showConfirmDelete === staff.id ? (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleDeleteEmployee(staff.id)}
                                className="text-red-600 hover:text-red-900"
                                title="Xác nhận xóa"
                              >
                                <FiCheck />
                              </button>
                              <button
                                onClick={() => setShowConfirmDelete(null)}
                                className="text-gray-600 hover:text-gray-900"
                                title="Hủy"
                              >
                                <FiX />
                              </button>
                            </div>
                          ) : (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditEmployee(staff)}
                                className="text-indigo-600 hover:text-indigo-900"
                                title="Sửa"
                              >
                                <FiEdit />
                              </button>
                              <button
                                onClick={() => setShowConfirmDelete(staff.id)}
                                className="text-red-600 hover:text-red-900"
                                title="Xóa"
                              >
                                <FiTrash2 />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      Không tìm thấy nhân viên nào phù hợp với tiêu chí tìm kiếm
                      của bạn.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>{" "}
      {/* Employee Form Modal */}{" "}
      {isUserFormOpen && (
        <UserFormModal user={selectedUser} onClose={handleUserFormClose} />
      )}
      {showSuccessNotification && (
        <div className="fixed bottom-6 right-6 z-50 animate-[slideInBottom_0.3s_ease-in-out]">
          <div className="bg-green-600 text-white px-6 py-4 rounded-lg shadow-xl flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-3"
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
              <h3 className="font-medium text-lg">Thao tác thành công!</h3>
              <p className="text-sm text-green-100">
                {notificationMessage || "Dữ liệu nhân viên đã được cập nhật."}
              </p>
            </div>
            <button
              onClick={() => setShowSuccessNotification(false)}
              className="ml-6 text-green-100 hover:text-white p-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
