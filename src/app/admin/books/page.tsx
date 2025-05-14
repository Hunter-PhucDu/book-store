"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FiPlus, FiEdit, FiTrash, FiSearch } from "react-icons/fi";
import { useStore } from "@/store/index";
import { Book } from "@/types/book";
import { UserRole } from "@/types/user";
import BookCover from "@/components/BookCover";
import BookFormModal from "@/components/admin/BookFormModal";

export default function AdminBooksPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const books = useStore((state) => state.books);
  const deleteBook = useStore((state) => state.deleteBook);

  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBook, setCurrentBook] = useState<Book | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/admin/books");
    } else if (status === "authenticated") {
      if (session?.user?.role !== UserRole.ADMIN) {
        router.push("/");
      } else {
        setIsLoading(false);
      }
    }
  }, [status, session, router]);

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.isbn.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleAddNewBook = () => {
    setCurrentBook(null);
    setIsModalOpen(true);
  };

  const handleEditBook = (book: Book) => {
    setCurrentBook(book);
    setIsModalOpen(true);
  };

  const handleDeleteBook = async (id: string) => {
    deleteBook(id);
    setShowDeleteConfirm(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner h-12 w-12 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading books...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Page Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Book Management</h1>
          <button
            onClick={handleAddNewBook}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <FiPlus className="inline-block mr-1" /> Add New Book
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="container mx-auto px-4 py-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search books by title, author or ISBN..."
            className="w-full px-4 py-3 pl-12 border rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Books Table */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Book
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ISBN
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBooks.length > 0 ? (
                  filteredBooks.map((book) => (
                    <tr key={book.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <BookCover
                              src={book.coverImage}
                              alt={book.title}
                              className="h-10 w-10 rounded-sm"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {book.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {book.author}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {book.isbn}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {book.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${book.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${
                              book.stock > 10
                                ? "bg-green-100 text-green-800"
                                : book.stock > 0
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                        >
                          {book.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEditBook(book)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          <FiEdit className="inline-block" />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(book.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FiTrash className="inline-block" />
                        </button>

                        {showDeleteConfirm === book.id && (
                          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white p-6 rounded-lg max-w-sm mx-auto">
                              <h3 className="text-lg font-bold mb-4">
                                Confirm Delete
                              </h3>
                              <p>
                                Are you sure you want to delete "{book.title}"?
                                This action cannot be undone.
                              </p>
                              <div className="mt-6 flex justify-end space-x-3">
                                <button
                                  onClick={() => setShowDeleteConfirm(null)}
                                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleDeleteBook(book.id)}
                                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No books found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Book Form Modal */}
      {isModalOpen && (
        <BookFormModal
          book={currentBook}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
