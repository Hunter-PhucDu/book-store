"use client";

import { useState, useEffect } from "react";
import { FiFilter, FiGrid, FiList, FiCalendar } from "react-icons/fi";
import BookCard from "@/components/BookCard";
import MainLayout from "@/components/layout/MainLayout";
import { useStore } from "@/store/index";
import { Book } from "@/types/book";

export default function NewReleases() {
  const books = useStore((state) => state.books);
  const [newReleases, setNewReleases] = useState<Book[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Giả lập thời gian tải dữ liệu
    const timer = setTimeout(() => {
      // Trong thực tế, sẽ lọc theo ngày phát hành
      // Tạm thời lấy 10 cuốn sách từ vị trí khác nhau
      setNewReleases(books.slice(5, 15));
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [books]);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8 animate-fade-in">
          <FiCalendar className="text-blue-600 h-8 w-8 mr-3" />
          <h1 className="text-3xl font-bold text-gray-800">
            Sách Mới Phát Hành
          </h1>
        </div>

        {/* Filter and View Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center space-x-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center">
              <FiFilter className="mr-2" />
              Lọc
            </button>
            <select className="px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="newest">Mới nhất</option>
              <option value="bestselling">Bán chạy nhất</option>
              <option value="price_low">Giá: Thấp đến Cao</option>
              <option value="price_high">Giá: Cao đến Thấp</option>
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

        {/* New Releases Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg p-6 mb-8 text-white animate-fade-in">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Khám phá sách mới nhất
              </h2>
              <p className="text-blue-100 mb-4 md:mb-0">
                Những đầu sách mới nhất, hấp dẫn nhất đã có mặt tại BookStore
              </p>
            </div>
            <button className="px-6 py-3 bg-white text-blue-600 rounded-md hover:bg-blue-50 transition-colors font-medium">
              Đăng ký thông báo
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
            {newReleases.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">
                  Không tìm thấy sách mới phát hành
                </p>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {newReleases.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {newReleases.map((book) => (
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
                      <div className="absolute top-0 left-0 bg-green-500 text-white text-xs px-2 py-1">
                        MỚI
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
                        <span className="text-blue-600 font-bold">
                          {book.price.toLocaleString()} đ
                        </span>
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
      </div>
    </MainLayout>
  );
}
