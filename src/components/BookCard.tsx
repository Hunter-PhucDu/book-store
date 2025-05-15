"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiShoppingCart, FiInfo, FiCheck } from "react-icons/fi";
import { Book } from "@/types/book";
import { useStore } from "@/store/index";
import BookCover from "@/components/BookCover";

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const { id, title, author, price, coverImage, stock } = book;
  const addToCart = useStore((state) => state.addToCart);
  const getBookById = useStore((state) => state.getBookById);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    // Kiểm tra sách có tồn tại không trước khi thêm vào giỏ hàng
    const bookExists = getBookById(id);
    if (!bookExists) {
      console.error(`Book with id ${id} not found`);
      return;
    }

    if (stock < quantity) {
      alert("Số lượng vượt quá tồn kho!");
      return;
    }

    addToCart(id, quantity);
    setIsAdded(true);

    // Reset trạng thái "Đã thêm" sau 2 giây
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
      <div className="relative h-60 w-full">
        <BookCover
          src={coverImage}
          alt={title}
          width={300}
          height={240}
          className="w-full h-full"
        />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg truncate" title={title}>
          {title}
        </h3>
        <p className="text-gray-600 text-sm mb-2">{author}</p>
        <div className="flex justify-between items-center mt-2">
          <span className="text-lg font-semibold">
            {price.toLocaleString("vi-VN")} đ
          </span>
          <span
            className={`text-sm ${stock > 0 ? "text-green-600" : "text-red-600"}`}
          >
            {stock > 0 ? `Còn ${stock}` : "Hết hàng"}
          </span>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex border rounded-md">
            <button
              className="px-2 py-1 border-r"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              aria-label="Giảm số lượng"
              disabled={stock === 0}
            >
              -
            </button>
            <span className="px-2 py-1">{quantity}</span>
            <button
              className="px-2 py-1 border-l"
              onClick={() => setQuantity(Math.min(stock, quantity + 1))}
              aria-label="Tăng số lượng"
              disabled={stock === 0 || quantity >= stock}
            >
              +
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            className={`px-3 py-1 rounded-md ${
              stock === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : isAdded
                  ? "bg-green-500 text-white"
                  : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
            disabled={stock === 0}
            aria-label={
              stock === 0
                ? "Hết hàng"
                : isAdded
                  ? "Đã thêm vào giỏ"
                  : "Thêm vào giỏ"
            }
          >
            {isAdded ? (
              <span className="flex items-center">
                <FiCheck className="mr-1" /> Đã thêm
              </span>
            ) : (
              <span className="flex items-center">
                <FiShoppingCart className="mr-1" />{" "}
                {stock === 0 ? "Hết hàng" : "Thêm vào giỏ"}
              </span>
            )}
          </button>
        </div>

        <div className="mt-4">
          <Link
            href={`/store/books/${id}`}
            className="text-blue-600 text-sm flex items-center hover:underline"
          >
            <FiInfo className="mr-1" /> Xem chi tiết
          </Link>
        </div>
      </div>
    </div>
  );
}
