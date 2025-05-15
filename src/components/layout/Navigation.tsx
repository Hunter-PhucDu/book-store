"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { UserRole } from "@/types/user";
import {
  FiBook,
  FiShoppingCart,
  FiUser,
  FiLogIn,
  FiLogOut,
  FiMenu,
  FiX,
  FiPackage,
  FiUsers,
  FiBarChart2,
  FiSettings,
} from "react-icons/fi";
import { useStore } from "@/store/index";

export default function Navigation() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cart = useStore((state) => state.cart);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <FiBook className="h-8 w-8 text-blue-600" />
            <span className="font-bold text-xl text-gray-800">BookStore</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/store"
              className="text-gray-600 hover:text-blue-600 transition-colors relative after:absolute after:bottom-0 after:left-0 after:bg-blue-600 after:h-0.5 after:w-0 hover:after:w-full after:transition-all after:duration-300"
            >
              Browse Books
            </Link>
            <Link
              href="/store/categories"
              className="text-gray-600 hover:text-blue-600 transition-colors relative after:absolute after:bottom-0 after:left-0 after:bg-blue-600 after:h-0.5 after:w-0 hover:after:w-full after:transition-all after:duration-300"
            >
              Categories
            </Link>
            <Link
              href="/store/new-releases"
              className="text-gray-600 hover:text-blue-600 transition-colors relative after:absolute after:bottom-0 after:left-0 after:bg-blue-600 after:h-0.5 after:w-0 hover:after:w-full after:transition-all after:duration-300"
            >
              New Releases
            </Link>
            <Link
              href="/store/deals"
              className="text-gray-600 hover:text-blue-600 transition-colors relative after:absolute after:bottom-0 after:left-0 after:bg-blue-600 after:h-0.5 after:w-0 hover:after:w-full after:transition-all after:duration-300"
            >
              Deals
            </Link>
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Cart */}
            <Link
              href="/store/cart"
              className="text-gray-600 hover:text-blue-600 transition-colors relative"
            >
              <FiShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {session ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 group-hover:text-blue-600 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {session.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    ) : (
                      <FiUser className="h-5 w-5 text-gray-600 group-hover:text-blue-600" />
                    )}
                  </div>
                  <span className="text-gray-700 group-hover:text-blue-600 transition-colors">
                    {session.user?.name?.split(" ")[0]}
                  </span>
                </button>

                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top scale-95 group-hover:scale-100 border border-gray-100">
                  {/* Profile */}
                  <Link
                    href="/account"
                    className="block px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600 rounded-t-lg transition-colors"
                  >
                    My Account
                  </Link>

                  {/* Orders */}
                  <Link
                    href="/account/orders"
                    className="block px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    My Orders
                  </Link>
                  {/* Admin Dashboard - Only visible to admins */}
                  {session.user?.role === UserRole.ADMIN && (
                    <Link
                      href="/admin"
                      className="block px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      Admin Dashboard
                    </Link>
                  )}

                  {/* Employee Dashboard - Only visible to employees */}
                  {session.user?.role === UserRole.EMPLOYEE && (
                    <Link
                      href="/employee"
                      className="block px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      Employee Dashboard
                    </Link>
                  )}

                  {/* Inventory Manager Dashboard - Only visible to inventory managers */}
                  {session.user?.role === UserRole.INVENTORY_MANAGER && (
                    <Link
                      href="/inventory"
                      className="block px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      Inventory Dashboard
                    </Link>
                  )}

                  {/* Sign Out */}
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600 rounded-b-lg transition-colors"
                  >
                    <div className="flex items-center">
                      <FiLogOut className="mr-2" />
                      Sign Out
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/signin"
                className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors"
              >
                <FiLogIn className="h-5 w-5" />
                <span>Sign In</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-600 hover:text-blue-600 transition-colors"
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <FiX className="h-6 w-6" />
            ) : (
              <FiMenu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/store"
                className="text-gray-600 hover:text-blue-600 transition-colors"
                onClick={closeMenu}
              >
                Browse Books
              </Link>
              <Link
                href="/store/categories"
                className="text-gray-600 hover:text-blue-600 transition-colors"
                onClick={closeMenu}
              >
                Categories
              </Link>
              <Link
                href="/store/new-releases"
                className="text-gray-600 hover:text-blue-600 transition-colors"
                onClick={closeMenu}
              >
                New Releases
              </Link>
              <Link
                href="/store/deals"
                className="text-gray-600 hover:text-blue-600 transition-colors"
                onClick={closeMenu}
              >
                Deals
              </Link>

              {/* Cart - Mobile */}
              <Link
                href="/store/cart"
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                onClick={closeMenu}
              >
                <FiShoppingCart className="h-5 w-5" />
                <span>Cart ({cartItemCount})</span>
              </Link>

              {/* User Actions - Mobile */}
              {session ? (
                <>
                  <Link
                    href="/account"
                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                    onClick={closeMenu}
                  >
                    <FiUser className="h-5 w-5" />
                    <span>My Account</span>
                  </Link>

                  <Link
                    href="/account/orders"
                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                    onClick={closeMenu}
                  >
                    <FiPackage className="h-5 w-5" />
                    <span>My Orders</span>
                  </Link>

                  {/* Admin Dashboard - Only visible to admins */}
                  {session.user.role === UserRole.ADMIN && (
                    <Link
                      href="/admin"
                      className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                      onClick={closeMenu}
                    >
                      <FiBarChart2 className="h-5 w-5" />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}

                  {/* Employee Dashboard - Only visible to employees */}
                  {session.user.role === UserRole.EMPLOYEE && (
                    <Link
                      href="/employee"
                      className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                      onClick={closeMenu}
                    >
                      <FiUsers className="h-5 w-5" />
                      <span>Employee Dashboard</span>
                    </Link>
                  )}

                  {/* Inventory Manager Dashboard - Only visible to inventory managers */}
                  {session.user.role === UserRole.INVENTORY_MANAGER && (
                    <Link
                      href="/inventory"
                      className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                      onClick={closeMenu}
                    >
                      <FiSettings className="h-5 w-5" />
                      <span>Inventory Dashboard</span>
                    </Link>
                  )}

                  {/* Sign Out */}
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors w-full text-left"
                  >
                    <FiLogOut className="h-5 w-5" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <Link
                  href="/signin"
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                  onClick={closeMenu}
                >
                  <FiLogIn className="h-5 w-5" />
                  <span>Sign In</span>
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
