"use client";

import { useState, useEffect } from "react";
import { FiFilter, FiGrid, FiList, FiTag } from "react-icons/fi";
import BookCard from "@/components/BookCard";
import MainLayout from "@/components/layout/MainLayout";
import { useStore } from "@/store/index";
import { Book } from "@/types/book";

interface BookWithDiscount extends Book {
  discountPercentage: number;
  originalPrice: number;
}

export default function DealsPage() {
  const books = useStore((state) => state.books);
  const [dealsBooks, setDealsBooks] = useState<BookWithDiscount[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Giả lập thời gian tải dữ liệu
    const timer = setTimeout(() => {
      // Giả lập dữ liệu khuyến mãi - trong thực tế sẽ lấy từ API
      const discountedBooks = books
        .slice(0, 15)
        .map((book) => {
          const discountPercentage = Math.floor(Math.random() * 30) + 10; // Giảm giá từ 10-40%
          const originalPrice = Math.round(
            book.price / (1 - discountPercentage / 100),
          );

          return {
            ...book,
            discountPercentage,
            originalPrice,
          };
        })
        .sort((a, b) => b.discountPercentage - a.discountPercentage);

      setDealsBooks(discountedBooks);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [books]);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8 animate-fade-in">
          <FiTag className="text-red-500 h-8 w-8 mr-3" />
          <h1 className="text-3xl font-bold text-gray-800">
            Khuyến Mãi Đặc Biệt
          </h1>
        </div>

        {/* Deals Banner */}
        <div className="bg-gradient-to-r from-red-600 to-orange-500 rounded-lg p-6 mb-8 text-white animate-fade-in">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Ưu đãi giới hạn thời gian
              </h2>
              <p className="text-red-100 mb-4 md:mb-0">
                Mua sắm ngay hôm nay để nhận những ưu đãi tốt nhất
              </p>
            </div>
            <div className="bg-white text-red-600 px-6 py-3 rounded-md font-bold text-xl">
              Giảm đến 40%
            </div>
          </div>
        </div>

        {/* Filter and View Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center space-x-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center">
              <FiFilter className="mr-2" />
              Lọc
            </button>
            <select className="px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="discount_high">Giảm giá: Cao đến Thấp</option>
              <option value="price_low">Giá: Thấp đến Cao</option>
              <option value="price_high">Giá: Cao đến Thấp</option>
              <option value="bestselling">Bán chạy nhất</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-gray-600">Hiển thị:</span>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md ${
                viewMode === "grid"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              <FiGrid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md ${
                viewMode === "list"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              <FiList className="h-5 w-5" />
            </button>
          </div>
        </div>

        {isLoading ? (
          // Loading state
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-4 animate-pulse"
              >
                <div className="w-full h-64 bg-gray-200 rounded-md mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {dealsBooks.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">
                  Không tìm thấy sách đang khuyến mãi
                </p>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {dealsBooks.map((book) => (
                  <div
                    key={book.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="relative">
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-full h-64 object-cover"
                      />
                      <div className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 m-2 rounded">
                        -{book.discountPercentage}%
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-1 line-clamp-1">
                        {book.title}
                      </h3>
                      <p className="text-gray-600 mb-2 text-sm">
                        {book.author}
                      </p>
                      <div className="flex items-center mb-3">
                        <span className="text-red-600 font-bold mr-2">
                          {book.price.toLocaleString()} đ
                        </span>
                        <span className="text-gray-500 text-sm line-through">
                          {book.originalPrice.toLocaleString()} đ
                        </span>
                      </div>
                      <button className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                        Thêm vào giỏ
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {dealsBooks.map((book) => (
                  <div
                    key={book.id}
                    className="flex flex-col md:flex-row bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="md:w-1/4 h-48 md:h-auto relative">
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 m-2 rounded">
                        -{book.discountPercentage}%
                      </div>
                    </div>
                    <div className="p-6 md:w-3/4">
                      <h3 className="text-xl font-semibold mb-2">
                        {book.title}
                      </h3>
                      <p className="text-gray-600 mb-2">
                        Tác giả: {book.author}
                      </p>
                      <p className="text-gray-500 mb-4 line-clamp-2">
                        {book.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="text-red-600 font-bold mr-2">
                            {book.price.toLocaleString()} đ
                          </span>
                          <span className="text-gray-500 text-sm line-through">
                            {book.originalPrice.toLocaleString()} đ
                          </span>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                          Thêm vào giỏ
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Coupon Section */}
        <div className="mt-16 bg-gray-50 rounded-lg p-8 animate-fade-in">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Mã giảm giá đặc biệt
            </h2>
            <p className="text-gray-600">
              Sử dụng các mã giảm giá dưới đây để nhận thêm ưu đãi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                code: "BOOK10",
                discount: "10% cho đơn hàng từ 200.000đ",
                expires: "30/06/2024",
              },
              {
                code: "FREESHIP",
                discount: "Miễn phí vận chuyển",
                expires: "15/06/2024",
              },
              {
                code: "NEWUSER",
                discount: "15% cho khách hàng mới",
                expires: "Không giới hạn",
              },
            ].map((coupon, index) => (
              <div
                key={index}
                className="bg-white border border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center"
              >
                <div className="text-xl font-bold text-blue-600 mb-2">
                  {coupon.code}
                </div>
                <div className="text-gray-700 text-center mb-1">
                  {coupon.discount}
                </div>
                <div className="text-gray-500 text-sm">
                  Hết hạn: {coupon.expires}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
