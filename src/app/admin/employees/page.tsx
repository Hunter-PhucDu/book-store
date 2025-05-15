"use client";

import { useState, useEffect } from "react";
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
  const router = useRouter();

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

  // Get all employee and inventory manager users
  const staffMembers = users.filter(
    (user) =>
      user.role === UserRole.EMPLOYEE ||
      user.role === UserRole.INVENTORY_MANAGER,
  );

  // Get unique departments
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

  // Filter employees
  const filteredStaff = staffMembers.filter((staff) => {
    // Filter by department
    if (departmentFilter !== "all") {
      const employee = staff as Employee;
      if (employee.department !== departmentFilter) return false;
    }

    // Filter by search query
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
  };

  // Format role title for display
  const formatRole = (role: string) => {
    return role
      .replace("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Calculate employment duration
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
      return `${months} month${months !== 1 ? "s" : ""}`;
    } else if (months === 0) {
      return `${years} year${years !== 1 ? "s" : ""}`;
    } else {
      return `${years} year${years !== 1 ? "s" : ""}, ${months} month${months !== 1 ? "s" : ""}`;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner h-12 w-12 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading employee data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Page Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Employee Management
          </h1>
          <button
            onClick={handleAddEmployee}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
          >
            <FiUserPlus className="mr-2" /> Add Employee
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search by name, email, or department..."
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
            >
              <option value="all">All Departments</option>
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
            <div className="font-medium text-sm text-gray-500">Total Staff</div>
            <div className="text-xl font-bold mt-1">{staffMembers.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="font-medium text-sm text-blue-500">Employees</div>
            <div className="text-xl font-bold mt-1">
              {users.filter((user) => user.role === UserRole.EMPLOYEE).length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="font-medium text-sm text-green-500">
              Inventory Managers
            </div>
            <div className="text-xl font-bold mt-1">
              {
                users.filter((user) => user.role === UserRole.INVENTORY_MANAGER)
                  .length
              }
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="font-medium text-sm text-purple-500">
              Departments
            </div>
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
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hire Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tenure
                  </th>
                  {/* Only show salary to admin */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Salary
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
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
                          $
                          {employee.salary
                            ? employee.salary.toLocaleString()
                            : "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {showConfirmDelete === staff.id ? (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleDeleteEmployee(staff.id)}
                                className="text-red-600 hover:text-red-900"
                                title="Confirm Delete"
                              >
                                <FiCheck />
                              </button>
                              <button
                                onClick={() => setShowConfirmDelete(null)}
                                className="text-gray-600 hover:text-gray-900"
                                title="Cancel"
                              >
                                <FiX />
                              </button>
                            </div>
                          ) : (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditEmployee(staff)}
                                className="text-indigo-600 hover:text-indigo-900"
                                title="Edit"
                              >
                                <FiEdit />
                              </button>
                              <button
                                onClick={() => setShowConfirmDelete(staff.id)}
                                className="text-red-600 hover:text-red-900"
                                title="Delete"
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
                      No employees found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Employee Form Modal */}
      {isUserFormOpen && (
        <UserFormModal
          user={selectedUser}
          onClose={() => setIsUserFormOpen(false)}
        />
      )}
    </div>
  );
}
