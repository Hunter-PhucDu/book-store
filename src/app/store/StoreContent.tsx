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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [sortBy, setSortBy] = useState<string>("title-asc");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Memoize filtered books
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory
        ? book.category === selectedCategory
        : true;
      const matchesPrice =
        book.price >= priceRange[0] && book.price <= priceRange[1];

      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [books, searchQuery, selectedCategory, priceRange]);

  // Memoize sorted books
  const sortedBooks = useMemo(() => {
    return [...filteredBooks].sort((a, b) => {
      if (sortBy === "title-asc") return a.title.localeCompare(b.title);
      if (sortBy === "title-desc") return b.title.localeCompare(a.title);
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return 0;
    });
  }, [filteredBooks, sortBy]);

  // Handle price range change
  const handlePriceChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    bound: "min" | "max",
  ) => {
    const value = parseFloat(e.target.value);
    setPriceRange((prev) =>
      bound === "min" ? [value, prev[1]] : [prev[0], value],
    );
  };

  // Toggle mobile filter visibility
  const toggleFilter = () => {
    setIsFilterOpen((prev) => !prev);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div className="flex gap-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
          </select>

          <button
            onClick={toggleFilter}
            className="md:hidden px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <FiFilter />
          </button>
        </div>
      </div>

      {/* Mobile Filter Panel */}
      {isFilterOpen && (
        <div className="md:hidden mb-8 p-4 border rounded-lg">
          <h3 className="font-semibold mb-4">Price Range</h3>
          <div className="flex gap-4">
            <div>
              <label className="block text-sm text-gray-600">Min</label>
              <input
                type="number"
                value={priceRange[0]}
                onChange={(e) => handlePriceChange(e, "min")}
                className="w-full px-2 py-1 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Max</label>
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) => handlePriceChange(e, "max")}
                className="w-full px-2 py-1 border rounded"
              />
            </div>
          </div>
        </div>
      )}

      {/* Desktop Filter Panel */}
      <div className="hidden md:block mb-8">
        <h3 className="font-semibold mb-4">Price Range</h3>
        <div className="flex gap-4">
          <div>
            <label className="block text-sm text-gray-600">Min</label>
            <input
              type="number"
              value={priceRange[0]}
              onChange={(e) => handlePriceChange(e, "min")}
              className="w-full px-2 py-1 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Max</label>
            <input
              type="number"
              value={priceRange[1]}
              onChange={(e) => handlePriceChange(e, "max")}
              className="w-full px-2 py-1 border rounded"
            />
          </div>
        </div>
      </div>

      {/* Book Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>

      {/* No Results Message */}
      {sortedBooks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">
            No books found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
}
