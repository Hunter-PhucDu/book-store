"use client";

import Image from "next/image";
import { Book } from "@/types/book";
import Link from "next/link";

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow hover:shadow-lg overflow-hidden flex flex-col transition-transform hover:scale-[1.03]">
      <div className="flex items-center justify-center aspect-[2/3] w-full bg-gray-50 relative">
        <Image
          src={book.coverImage}
          alt={`Cover of ${book.title}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
          style={{ objectFit: "cover" }}
          className="rounded-t-xl object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/images/book-placeholder.jpg";
          }}
        />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-base font-semibold line-clamp-2 mb-1 min-h-[2.5em]">
          {book.title}
        </h3>
        <p className="text-xs text-gray-500 mb-1">Tác giả: {book.author}</p>
        <p className="font-medium text-green-600 mb-2 text-sm">
          {book.price.toLocaleString("vi-VN")} đ
        </p>
        <p className="text-xs text-gray-500 mb-2">
          {book.stock > 0 ? `Còn ${book.stock} sản phẩm` : "Hết hàng"}
        </p>
        <div className="mt-auto">
          <Link
            href={`/store/books/${book.id}`}
            className="block w-full text-center py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
          >
            Xem chi tiết
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
