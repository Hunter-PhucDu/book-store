// User roles in the system
export enum UserRole {
  CUSTOMER = "CUSTOMER",
  EMPLOYEE = "EMPLOYEE",
  INVENTORY_MANAGER = "INVENTORY_MANAGER",
  ADMIN = "ADMIN",
}

// Base user interface
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Customer specific properties
export interface Customer extends User {
  role: UserRole.CUSTOMER;
  address?: string;
  phoneNumber?: string;
  orderHistory: string[]; // Order IDs
}

// Employee specific properties
export interface Employee extends User {
  role: UserRole.EMPLOYEE;
  department: string;
  hireDate: Date;
  salary: number;
}

// Inventory manager specific properties
export interface InventoryManager extends User {
  role: UserRole.INVENTORY_MANAGER;
  department: string;
  hireDate: Date;
  warehouseId: string;
}

// Admin specific properties
export interface Admin extends User {
  role: UserRole.ADMIN;
  permissions: string[];
  lastLogin: Date;
}
