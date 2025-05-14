"use client";

import Image from "next/image";
import { Book } from "@/types/book";
import Link from "next/link";

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02]">
      <div className="relative h-64 w-full">
        <Image
          src={book.coverImage}
          alt={`Cover of ${book.title}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
          style={{ objectFit: "cover" }}
          className="bg-gray-100"
          // Fallback for missing images
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/images/book-placeholder.jpg";
          }}
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold line-clamp-1">{book.title}</h3>
        <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
        <p className="font-medium text-green-600 mb-3">
          ${book.price.toFixed(2)}
        </p>
        <p className="text-xs text-gray-500 mb-2">
          {book.stock > 0 ? `${book.stock} in stock` : "Out of stock"}
        </p>
        <Link
          href={`/store/books/${book.id}`}
          className="block w-full text-center py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default BookCard;
