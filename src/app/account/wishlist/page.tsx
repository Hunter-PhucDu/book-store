"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  FiHeart,
  FiArrowLeft,
  FiTrash2,
  FiShoppingCart,
  FiSearch,
  FiX,
  FiGrid,
  FiList,
} from "react-icons/fi";
import MainLayout from "@/components/layout/MainLayout";
import { initialBooks } from "@/store/bookData";

// Mock data for wishlist
// In a real application, this would be stored in the database and retrieved based on the user ID
const mockWishlist = [
  "1",
  "5",
  "12", // Book IDs from bookData
];

export default function WishlistPage() {
  const { status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [wishlist, setWishlist] = useState<string[]>(mockWishlist);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  const books = initialBooks;
  const wishlistBooks = books.filter((book) => wishlist.includes(book.id));

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin?callbackUrl=/account/wishlist");
    } else if (status === "authenticated") {
      setIsLoading(false);
    }
  }, [status, router]);

  const handleRemoveFromWishlist = (bookId: string) => {
    setWishlist(wishlist.filter((id) => id !== bookId));
  };

  const handleAddToCart = (bookId: string) => {
    // In a real app, this would add the book to the cart
    console.log(`Added book ${bookId} to cart`);
    // Could also remove from wishlist after adding to cart if desired
  };

  // Filter wishlist based on search query
  const filteredWishlist = wishlistBooks.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="spinner h-12 w-12 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">
              Đang tải danh sách yêu thích...
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen py-10">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center mb-2">
                <Link
                  href="/account"
                  className="text-blue-600 hover:text-blue-800 mr-3 flex items-center"
                >
                  <FiArrowLeft className="h-4 w-4 mr-1" />
                  Quay lại
                </Link>
                <h1 className="text-3xl font-bold text-gray-800">
                  Danh sách yêu thích
                </h1>
              </div>
              <p className="text-gray-600">
                Quản lý các sách bạn đã đánh dấu yêu thích
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 md:w-auto">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm trong danh sách yêu thích"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <FiX className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* View toggle */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  className={`px-4 py-2 flex items-center ${viewMode === "grid" ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`}
                  onClick={() => setViewMode("grid")}
                >
                  <FiGrid className="h-4 w-4 mr-1" />
                  Lưới
                </button>
                <button
                  className={`px-4 py-2 flex items-center ${viewMode === "list" ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`}
                  onClick={() => setViewMode("list")}
                >
                  <FiList className="h-4 w-4 mr-1" />
                  Danh sách
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          {filteredWishlist.length > 0 ? (
            <>
              {/* Stats summary */}
              <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
                <p className="text-gray-700">
                  Hiển thị {filteredWishlist.length} sách trong danh sách yêu
                  thích
                  {searchQuery && ` cho tìm kiếm "${searchQuery}"`}
                </p>
              </div>

              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredWishlist.map((book) => (
                    <div
                      key={book.id}
                      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden relative group"
                    >
                      {/* Wishlist and cart buttons */}
                      <div className="absolute top-2 right-2 flex flex-col gap-2 z-10">
                        <button
                          onClick={() => handleRemoveFromWishlist(book.id)}
                          className="p-2 bg-white rounded-full shadow-md text-rose-500 hover:bg-rose-500 hover:text-white transition-colors"
                          title="Xóa khỏi danh sách yêu thích"
                        >
                          <FiX className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleAddToCart(book.id)}
                          className="p-2 bg-white rounded-full shadow-md text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
                          title="Thêm vào giỏ hàng"
                        >
                          <FiShoppingCart className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Book cover */}
                      <Link href={`/store/books/${book.id}`}>
                        <div className="aspect-[2/3] relative overflow-hidden">
                          <Image
                            src={book.coverImage}
                            alt={book.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/images/book-placeholder.jpg";
                            }}
                          />
                        </div>
                      </Link>

                      {/* Book details */}
                      <div className="p-4">
                        <Link
                          href={`/store/books/${book.id}`}
                          className="hover:text-blue-600 transition-colors"
                        >
                          <h3 className="font-semibold text-gray-800 line-clamp-2 mb-1">
                            {book.title}
                          </h3>
                        </Link>
                        <p className="text-sm text-gray-600 mb-2">
                          {book.author}
                        </p>
                        <div className="flex justify-between items-center">
                          <p className="font-bold text-blue-700">
                            {book.price.toLocaleString("vi-VN")}₫
                          </p>
                          <p className="text-xs text-gray-500">
                            {book.publishYear}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Sách
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tác giả
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Năm xuất bản
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Giá
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredWishlist.map((book) => (
                        <tr
                          key={book.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-16 w-12 relative">
                                <Image
                                  src={book.coverImage}
                                  alt={book.title}
                                  fill
                                  style={{ objectFit: "cover" }}
                                  className="rounded"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = "/images/book-placeholder.jpg";
                                  }}
                                />
                              </div>
                              <div className="ml-4">
                                <Link
                                  href={`/store/books/${book.id}`}
                                  className="text-sm font-medium text-gray-900 hover:text-blue-600"
                                >
                                  {book.title}
                                </Link>
                                <p className="text-xs text-gray-500">
                                  ISBN: {book.isbn}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {book.author}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {book.publishYear}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="text-sm font-bold text-blue-700">
                              {book.price.toLocaleString("vi-VN")}₫
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleAddToCart(book.id)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                                title="Thêm vào giỏ hàng"
                              >
                                <FiShoppingCart className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() =>
                                  handleRemoveFromWishlist(book.id)
                                }
                                className="p-2 text-rose-500 hover:bg-rose-50 rounded-full"
                                title="Xóa khỏi danh sách yêu thích"
                              >
                                <FiTrash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-10 text-center">
              <div className="w-20 h-20 mx-auto bg-rose-100 rounded-full flex items-center justify-center mb-6">
                <FiHeart className="h-10 w-10 text-rose-500" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Danh sách yêu thích trống
              </h2>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {searchQuery
                  ? `Không tìm thấy kết quả nào cho "${searchQuery}". Hãy thử tìm kiếm với các từ khóa khác.`
                  : "Bạn chưa thêm sách nào vào danh sách yêu thích. Hãy khám phá cửa hàng và thêm những cuốn sách bạn quan tâm."}
              </p>
              <Link
                href="/store"
                className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Khám phá sách ngay
              </Link>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
