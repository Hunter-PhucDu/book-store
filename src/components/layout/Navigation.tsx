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
          <Link href="/" className="flex items-center space-x-2">
            <FiBook className="h-8 w-8 text-blue-600" />
            <span className="font-bold text-xl text-gray-800">
              Cửa hàng sách Tây Bắc
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/store"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Cửa hàng
            </Link>
            <Link
              href="/store"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Danh mục
            </Link>
            <Link
              href="/store"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Sách mới
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-6">
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
                <button className="flex items-center space-x-2">
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
                      <FiUser className="h-5 w-5 text-gray-600" />
                    )}
                  </div>
                  <span className="text-gray-700">
                    {session.user?.name?.split(" ")[0]}
                  </span>
                </button>

                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  {/* Profile */}
                  <Link
                    href="/account"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Tài khoản
                  </Link>

                  {/* Orders */}
                  <Link
                    href="/account/orders"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Đơn hàng
                  </Link>
                  {session.user?.role === UserRole.ADMIN && (
                    <Link
                      href="/admin"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Quản trị viên
                    </Link>
                  )}

                  {session.user?.role === UserRole.EMPLOYEE && (
                    <Link
                      href="/employee"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Nhân viên Dashboard
                    </Link>
                  )}

                  {session.user?.role === UserRole.INVENTORY_MANAGER && (
                    <Link
                      href="/inventory"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Quản lý kho Dashboard
                    </Link>
                  )}

                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/signin"
                className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors"
              >
                <FiLogIn className="h-5 w-5" />
                <span>Đăng nhập</span>
              </Link>
            )}
          </div>

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

        {isMenuOpen && (
          <div className="md:hidden mt-4 border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/store"
                className="text-gray-600 hover:text-blue-600 transition-colors"
                onClick={closeMenu}
              >
                Tất cả sách
              </Link>
              <Link
                href="/store/categories"
                className="text-gray-600 hover:text-blue-600 transition-colors"
                onClick={closeMenu}
              >
                Danh mục
              </Link>
              <Link
                href="/store/new-releases"
                className="text-gray-600 hover:text-blue-600 transition-colors"
                onClick={closeMenu}
              >
                Sách mới
              </Link>
              <Link
                href="/store/deals"
                className="text-gray-600 hover:text-blue-600 transition-colors"
                onClick={closeMenu}
              >
                Giảm giá
              </Link>

              <Link
                href="/store/cart"
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                onClick={closeMenu}
              >
                <FiShoppingCart className="h-5 w-5" />
                <span>Giỏ hàng ({cartItemCount})</span>
              </Link>

              {session ? (
                <>
                  <Link
                    href="/account"
                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                    onClick={closeMenu}
                  >
                    <FiUser className="h-5 w-5" />
                    <span>Tài khoản</span>
                  </Link>

                  <Link
                    href="/account/orders"
                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                    onClick={closeMenu}
                  >
                    <FiPackage className="h-5 w-5" />
                    <span>Đơn hàng</span>
                  </Link>

                  {session.user.role === UserRole.ADMIN && (
                    <Link
                      href="/admin"
                      className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                      onClick={closeMenu}
                    >
                      <FiBarChart2 className="h-5 w-5" />
                      <span>Quản trị viên</span>
                    </Link>
                  )}

                  {session.user.role === UserRole.EMPLOYEE && (
                    <Link
                      href="/employee"
                      className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                      onClick={closeMenu}
                    >
                      <FiUsers className="h-5 w-5" />
                      <span>Nhân viên</span>
                    </Link>
                  )}

                  {session.user.role === UserRole.INVENTORY_MANAGER && (
                    <Link
                      href="/inventory"
                      className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                      onClick={closeMenu}
                    >
                      <FiSettings className="h-5 w-5" />
                      <span>Quản lý kho</span>
                    </Link>
                  )}

                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <FiLogOut className="h-5 w-5" />
                    <span>Đăng xuất</span>
                  </button>
                </>
              ) : (
                <Link
                  href="/signin"
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                  onClick={closeMenu}
                >
                  <FiLogIn className="h-5 w-5" />
                  <span>Đăng nhập</span>
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
