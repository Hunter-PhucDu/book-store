"use client";

import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import StoreContent from "./StoreContent";
import { initialBooks } from "@/store/bookData";
import { Book } from "@/types/book";

export default function StorePage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const loadData = () => {
      // Get books from mock data
      const booksData = initialBooks;

      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(booksData.map((book) => book.category)),
      );

      setBooks(booksData);
      setCategories(uniqueCategories);
      setIsLoading(false);
    };

    // Simulate a slight delay for loading
    const timer = setTimeout(() => {
      loadData();
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <MainLayout>
      <div className="bg-blue-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Book Store</h1>
          <p className="text-gray-600">
            Browse our collection of books across all genres
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="container mx-auto px-4 py-12 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <StoreContent books={books} categories={categories} />
      )}
    </MainLayout>
  );
}
