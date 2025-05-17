"use client";

import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import StoreContent from "./StoreContent";
import { initialBooks } from "@/store/bookData";
import { Book } from "@/types/book";
import { FiBookOpen } from "react-icons/fi";

export default function StorePage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      const booksData = initialBooks;

      // Normalize categories: trim and lowercase
      const uniqueCategories = Array.from(
        new Set(booksData.map((book) => book.category.trim().toLowerCase())),
      );

      setBooks(booksData);
      setCategories(uniqueCategories);
      setIsLoading(false);
    };

    const timer = setTimeout(() => {
      loadData();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <MainLayout>
      <div className="relative bg-gradient-to-r from-blue-800 to-indigo-900 py-12 overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-10 -right-10 w-40 h-40 border-2 border-white rounded-full"></div>
          <div className="absolute bottom-5 left-10 w-24 h-24 border-2 border-white rounded-full"></div>
          <div className="absolute top-1/3 left-1/4 w-12 h-12 bg-white opacity-20 rounded-full blur-md"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center justify-center md:justify-start mb-2">
            <span className="bg-white/20 text-white text-sm font-medium px-3 py-1 rounded-full backdrop-blur-sm">
              <FiBookOpen className="inline-block mr-1" /> Khám phá sách
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center md:text-left mb-2">
            Cửa Hàng Sách
          </h1>
          <p className="text-lg text-white/80 text-center md:text-left max-w-2xl">
            Khám phá bộ sưu tập sách đa dạng với hàng trăm đầu sách thuộc mọi
            thể loại. Từ tiểu thuyết đến sách phi hư cấu, từ sách mới xuất bản
            đến các tác phẩm kinh điển.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 font-medium">
            Đang tải danh sách sách...
          </p>
        </div>
      ) : (
        <StoreContent books={books} categories={categories} />
      )}
    </MainLayout>
  );
}
