"use client";

import { useState, useEffect } from "react";
import { FiFilter, FiGrid, FiList } from "react-icons/fi";
import BookCard from "@/components/BookCard";
import MainLayout from "@/components/layout/MainLayout";
import { useStore } from "@/store/index";
import { Book } from "@/types/book";

export default function FeaturedBooks() {
  const books = useStore((state) => state.books);
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Giả lập thời gian tải dữ liệu
    const timer = setTimeout(() => {
      // Lấy 8 cuốn sách đầu tiên làm sách nổi bật (trong thực tế sẽ có logic khác)
      setFeaturedBooks(books.slice(0, 8));
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [books]);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 animate-fade-in">
          Sách Nổi Bật
        </h1>

        {/* Filter and View Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center space-x-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center">
              <FiFilter className="mr-2" />
              Lọc
            </button>
            <select className="px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="popularity">Phổ biến nhất</option>
              <option value="newest">Mới nhất</option>
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
            {featuredBooks.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Không tìm thấy sách nổi bật</p>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {featuredBooks.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {featuredBooks.map((book) => (
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
