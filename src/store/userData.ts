import {
  User,
  UserRole,
  Customer,
  Employee,
  InventoryManager,
  Admin,
} from "../types/user";

// Mock user data
export const initialUsers: User[] = [
  {
    id: "1",
    email: "customer@example.com",
    name: "John Customer",
    role: UserRole.CUSTOMER,
    avatar: "/images/avatars/customer.jpg",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    email: "employee@example.com",
    name: "Jane Employee",
    role: UserRole.EMPLOYEE,
    avatar: "/images/avatars/employee.jpg",
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-02-10"),
  },
  {
    id: "3",
    email: "inventory@example.com",
    name: "Alex Inventory",
    role: UserRole.INVENTORY_MANAGER,
    avatar: "/images/avatars/inventory.jpg",
    createdAt: new Date("2024-03-05"),
    updatedAt: new Date("2024-03-05"),
  },
  {
    id: "4",
    email: "admin@example.com",
    name: "Sam Admin",
    role: UserRole.ADMIN,
    avatar: "/images/avatars/admin.png",
    createdAt: new Date("2023-12-01"),
    updatedAt: new Date("2023-12-01"),
  },
];

// More specific user data by role
export const initialCustomers: Customer[] = [
  {
    id: "1",
    email: "customer@example.com",
    name: "John Customer",
    role: UserRole.CUSTOMER,
    avatar: "/images/avatars/customer.jpg",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    address: "123 Main St, Anytown, CA 12345",
    phoneNumber: "555-123-4567",
    orderHistory: ["order1", "order2"],
  },
  {
    id: "5",
    email: "customer2@example.com",
    name: "Sarah Customer",
    role: UserRole.CUSTOMER,
    avatar: "/images/avatars/customer2.jpg",
    createdAt: new Date("2024-02-20"),
    updatedAt: new Date("2024-02-20"),
    address: "456 Oak Ave, Othertown, NY 67890",
    phoneNumber: "555-987-6543",
    orderHistory: ["order3"],
  },
];

export const initialEmployees: Employee[] = [
  {
    id: "2",
    email: "employee@example.com",
    name: "Jane Employee",
    role: UserRole.EMPLOYEE,
    avatar: "/images/avatars/employee.jpg",
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-02-10"),
    department: "Sales",
    hireDate: new Date("2023-05-15"),
    salary: 45000,
  },
  {
    id: "6",
    email: "employee2@example.com",
    name: "Mike Employee",
    role: UserRole.EMPLOYEE,
    avatar: "/images/avatars/employee2.jpg",
    createdAt: new Date("2024-02-15"),
    updatedAt: new Date("2024-02-15"),
    department: "Customer Support",
    hireDate: new Date("2023-07-01"),
    salary: 42000,
  },
];

export const initialInventoryManagers: InventoryManager[] = [
  {
    id: "3",
    email: "inventory@example.com",
    name: "Alex Inventory",
    role: UserRole.INVENTORY_MANAGER,
    avatar: "/images/avatars/inventory.jpg",
    createdAt: new Date("2024-03-05"),
    updatedAt: new Date("2024-03-05"),
    department: "Warehouse",
    hireDate: new Date("2022-11-10"),
    warehouseId: "wh1",
  },
];

export const initialAdmins: Admin[] = [
  {
    id: "4",
    email: "admin@example.com",
    name: "Sam Admin",
    role: UserRole.ADMIN,
    avatar: "/images/avatars/admin.jpg",
    createdAt: new Date("2023-12-01"),
    updatedAt: new Date("2023-12-01"),
    permissions: [
      "manage_users",
      "manage_inventory",
      "manage_orders",
      "view_reports",
    ],
    lastLogin: new Date("2024-04-30"),
  },
];

// Function to get all users combined
export const getInitialUsers = (): User[] => {
  return JSON.parse(JSON.stringify(initialUsers));
};

// Functions to get role-specific users
export const getInitialCustomers = (): Customer[] => {
  return JSON.parse(JSON.stringify(initialCustomers));
};

export const getInitialEmployees = (): Employee[] => {
  return JSON.parse(JSON.stringify(initialEmployees));
};

export const getInitialInventoryManagers = (): InventoryManager[] => {
  return JSON.parse(JSON.stringify(initialInventoryManagers));
};

export const getInitialAdmins = (): Admin[] => {
  return JSON.parse(JSON.stringify(initialAdmins));
};
