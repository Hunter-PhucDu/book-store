"use client";

import Image from "next/image";
import { Book } from "@/types/book";
import Link from "next/link";

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl overflow-hidden flex flex-col transition-all duration-300 h-full border border-gray-100">
      <div className="relative">
        {/* Category badge */}
        <div className="absolute top-2 left-2 z-10">
          <span className="bg-blue-600/90 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
            {book.category}
          </span>
        </div>

        {/* Stock indicator */}
        {book.stock <= 5 && (
          <div className="absolute top-2 right-2 z-10">
            <span
              className={`text-xs px-2 py-1 rounded-full backdrop-blur-sm ${
                book.stock === 0
                  ? "bg-red-600/90 text-white"
                  : "bg-amber-500/90 text-white"
              }`}
            >
              {book.stock === 0 ? "Hết hàng" : "Sắp hết hàng"}
            </span>
          </div>
        )}

        {/* Book cover */}
        <div className="aspect-[2/3] w-full bg-gradient-to-b from-gray-100 to-gray-200 relative overflow-hidden">
          <Image
            src={book.coverImage}
            alt={`Cover of ${book.title}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            style={{ objectFit: "cover" }}
            className="rounded-t-xl object-cover hover:scale-110 transition-transform duration-700"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/images/book-placeholder.jpg";
            }}
          />
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-semibold line-clamp-2 mb-2 text-gray-800 min-h-[3rem]">
          {book.title}
        </h3>

        <p className="text-sm text-gray-600 mb-3 flex items-center">
          Tác giả: {book.author}
        </p>

        <div className="flex justify-between items-center mb-4">
          <p className="font-bold text-blue-700 text-lg">
            {book.price.toLocaleString("vi-VN")}đ
          </p>

          <p className="text-xs text-gray-500">{book.publishYear}</p>
        </div>

        <div className="mt-auto pt-2">
          <Link
            href={`/store/books/${book.id}`}
            className="block w-full text-center py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 text-sm font-semibold hover:shadow-lg"
          >
            Xem chi tiết
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
