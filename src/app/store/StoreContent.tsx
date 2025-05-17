"use client";

import { useState, useMemo } from "react";
import { FiSearch, FiFilter } from "react-icons/fi";
import { Book } from "@/types/book";
import BookCard from "@/components/BookCard";

interface StoreContentProps {
  books: Book[];
  categories: string[];
}

export default function StoreContent({ books, categories }: StoreContentProps) {
  const minPrice = books.length ? Math.min(...books.map((b) => b.price)) : 0;
  const maxPrice = books.length
    ? Math.max(...books.map((b) => b.price))
    : 1000000;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [priceRange, setPriceRange] = useState<[number, number]>([
    minPrice,
    maxPrice,
  ]);
  const [sortBy, setSortBy] = useState<string>("title-asc");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory
        ? book.category.trim().toLowerCase() === selectedCategory
        : true;
      const matchesPrice =
        book.price >= priceRange[0] && book.price <= priceRange[1];

      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [books, searchQuery, selectedCategory, priceRange]);

  const sortedBooks = useMemo(() => {
    return [...filteredBooks].sort((a, b) => {
      if (sortBy === "title-asc") return a.title.localeCompare(b.title);
      if (sortBy === "title-desc") return b.title.localeCompare(a.title);
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return 0;
    });
  }, [filteredBooks, sortBy]);

  const handlePriceChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    bound: "min" | "max",
  ) => {
    const value = parseFloat(e.target.value);
    setPriceRange((prev) =>
      bound === "min" ? [value, prev[1]] : [prev[0], value],
    );
  };

  const toggleFilter = () => {
    setIsFilterOpen((prev) => !prev);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm sách..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-3 pl-12 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md bg-white"
            />
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md bg-white text-gray-700"
          >
            <option value="">Tất Cả Thể Loại</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md bg-white text-gray-700"
          >
            <option value="title-asc">Tên (A-Z)</option>
            <option value="title-desc">Tên (Z-A)</option>
            <option value="price-asc">Giá (Thấp đến Cao)</option>
            <option value="price-desc">Giá (Cao đến Thấp)</option>
          </select>

          <button
            onClick={toggleFilter}
            className="md:hidden px-4 py-3 bg-blue-600 text-white rounded-lg focus:outline-none hover:bg-blue-700 transition-colors shadow-md flex items-center gap-2"
          >
            <FiFilter /> Lọc
          </button>
        </div>
      </div>

      {isFilterOpen && (
        <div className="md:hidden mb-8 bg-white shadow-md rounded-lg p-5 animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800 flex items-center">
              <span className="bg-blue-100 text-blue-600 p-1.5 rounded-full mr-2">
                <FiFilter className="h-4 w-4" />
              </span>
              Khoảng Giá
            </h3>
            <button
              onClick={toggleFilter}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close filter panel"
            >
              ✕
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1.5">
                Tối thiểu (VND)
              </label>
              <input
                type="number"
                value={priceRange[0]}
                onChange={(e) => handlePriceChange(e, "min")}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1.5">
                Tối đa (VND)
              </label>
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) => handlePriceChange(e, "max")}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      <div className="hidden md:block mb-8 bg-white shadow-md rounded-lg p-6">
        <h3 className="font-semibold mb-4 text-gray-800 flex items-center">
          <span className="bg-blue-100 text-blue-600 p-2 rounded-full mr-2">
            <FiFilter className="h-4 w-4" />
          </span>
          Khoảng Giá
        </h3>
        <div className="flex gap-6">
          <div className="flex-1">
            <label className="block text-sm text-gray-600 mb-2">
              Tối thiểu (VND)
            </label>
            <input
              type="number"
              value={priceRange[0]}
              onChange={(e) => handlePriceChange(e, "min")}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm text-gray-600 mb-2">
              Tối đa (VND)
            </label>
            <input
              type="number"
              value={priceRange[1]}
              onChange={(e) => handlePriceChange(e, "max")}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <p className="text-gray-600">
          {sortedBooks.length > 0
            ? `Hiển thị ${sortedBooks.length} kết quả`
            : "Không có kết quả phù hợp"}
        </p>

        {filteredBooks.length > 0 && filteredBooks.length < books.length && (
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("");
              setPriceRange([minPrice, maxPrice]);
            }}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Xóa bộ lọc
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedBooks.map((book) => (
          <div
            key={book.id}
            className="transform transition-all duration-300 hover:-translate-y-1"
          >
            <BookCard book={book} />
          </div>
        ))}
      </div>

      {sortedBooks.length === 0 && (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <div className="bg-white p-6 max-w-md mx-auto rounded-lg shadow-sm">
            <div className="text-blue-500 mb-4">
              <svg
                className="h-12 w-12 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 14h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Không tìm thấy kết quả
            </h3>
            <p className="text-gray-600 mb-4">
              Không tìm thấy sách phù hợp với tiêu chí tìm kiếm của bạn. Vui
              lòng thử lại với các tiêu chí khác.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("");
                setPriceRange([minPrice, maxPrice]);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
