"use client";

import { useState, useMemo } from "react";
import { useParams, notFound } from "next/navigation";
import {
  FiShoppingCart,
  FiHeart,
  FiShare2,
  FiMinus,
  FiPlus,
  FiCheckCircle,
} from "react-icons/fi";
import MainLayout from "@/components/layout/MainLayout";
import BookCard from "@/components/BookCard";
import BookImage from "@/components/BookImage";
import { Book } from "@/types/book";
import { initialBooks } from "@/store/bookData";

const mockAddToCart = (bookId: string, quantity: number) => {
  console.log(`Added book ${bookId} with quantity ${quantity} to cart`);
};

export default function BookDetailsPage() {
  const params = useParams();
  const bookId = params.bookId as string;

  const [quantity, setQuantity] = useState(1);
  const [showAddedToCart, setShowAddedToCart] = useState(false);

  const books = initialBooks;

  const book = useMemo(
    () => books.find((b: Book) => b.id === bookId),
    [bookId, books],
  );

  const relatedBooks = useMemo(() => {
    if (!book) return [];

    const similarBooks = books.filter(
      (b: Book) =>
        b.id !== bookId &&
        (b.category === book.category || b.author === book.author),
    );

    if (similarBooks.length >= 3) {
      return similarBooks.slice(0, 3);
    }

    const otherBooks = books.filter(
      (b: Book) =>
        b.id !== bookId &&
        b.category !== book.category &&
        b.author !== book.author,
    );

    const shuffledOtherBooks = [...otherBooks].sort(() => Math.random() - 0.5);

    const combined = [...similarBooks, ...shuffledOtherBooks];
    return combined.slice(0, 3);
  }, [bookId, book, books]);

  if (!book) {
    return notFound();
  }

  const handleAddToCart = () => {
    mockAddToCart(book.id, quantity);
    setShowAddedToCart(true);
    setTimeout(() => setShowAddedToCart(false), 3000);
  };

  const handleQuantityChange = (value: number) => {
    if (value < 1 || value > book.stock) return;
    setQuantity(value);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Book Image */}
          <div className="flex justify-center md:justify-start">
            <div className="rounded-lg shadow-sm hover:shadow-2xl transition-shadow duration-500 ease-out">
              <BookImage
                src={book.coverImage}
                alt={book.title}
                className="rounded-lg"
                width={320}
                height={480}
                hoverEffect={true}
              />
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
            <p className="text-xl text-gray-600 mb-4">bởi {book.author}</p>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-2xl font-bold text-blue-600">
                {book.price.toLocaleString("vi-VN")}₫
              </span>
              {book.stock > 0 ? (
                <span className="text-green-600">
                  Còn Hàng ({book.stock} sản phẩm)
                </span>
              ) : (
                <span className="text-red-600">Hết Hàng</span>
              )}
            </div>

            <p className="text-gray-700 mb-6">{book.description}</p>

            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                className="p-2 border rounded-lg hover:bg-gray-100"
                disabled={quantity <= 1}
              >
                <FiMinus />
              </button>
              <span className="w-12 text-center">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                className="p-2 border rounded-lg hover:bg-gray-100"
                disabled={quantity >= book.stock}
              >
                <FiPlus />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleAddToCart}
                disabled={book.stock === 0}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <FiShoppingCart className="inline-block mr-2" />
                Thêm Vào Giỏ Hàng
              </button>

              <button className="p-3 border rounded-lg hover:bg-gray-100">
                <FiHeart />
              </button>

              <button className="p-3 border rounded-lg hover:bg-gray-100">
                <FiShare2 />
              </button>
            </div>

            {showAddedToCart && (
              <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center">
                <FiCheckCircle className="mr-2" />
                Đã thêm vào giỏ hàng thành công!
              </div>
            )}
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6 border-l-4 border-blue-600 pl-4">
            Bạn Cũng Có Thể Thích
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {relatedBooks.map((book: Book, index: number) => (
              <div
                key={book.id}
                className="transform transition-all duration-300 hover:scale-105"
                style={{
                  animationDelay: `${index * 150}ms`,
                  animation: "fadeInUp 0.6s ease-out forwards",
                }}
              >
                <BookCard book={book} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
