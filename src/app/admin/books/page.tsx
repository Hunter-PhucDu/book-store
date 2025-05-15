"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  FiPlus,
  FiEdit,
  FiTrash,
  FiSearch,
  FiDownload,
  FiPrinter,
} from "react-icons/fi";
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
      router.push("/signin?callbackUrl=/admin/books");
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

  // Hàm xuất danh sách sách ra Excel
  const exportAllBooksToExcel = () => {
    // Tạo header cho file CSV
    const headers = [
      "ID",
      "Title",
      "Author",
      "ISBN",
      "Category",
      "Price",
      "Stock",
      "Publish Year",
    ];

    // Tạo nội dung CSV
    const csvContent = [
      headers.join(","),
      ...filteredBooks.map((book) =>
        [
          book.id,
          `"${book.title.replace(/"/g, '""')}"`, // Escape quotes
          `"${book.author.replace(/"/g, '""')}"`,
          book.isbn,
          `"${book.category.replace(/"/g, '""')}"`,
          book.price,
          book.stock,
          book.publishYear,
        ].join(","),
      ),
    ].join("\n");

    // Tạo blob và download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `books-list-${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Hàm in danh sách sách
  const printBooksList = () => {
    const printContent = `
      <html>
        <head>
          <title>Books List</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; text-align: center; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background-color: #f2f2f2; font-weight: bold; }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .stock-high { color: green; }
            .stock-medium { color: orange; }
            .stock-low { color: red; }
            .print-date { text-align: right; font-size: 12px; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="print-date">Printed on: ${new Date().toLocaleString()}</div>
          <h1>Books Inventory List</h1>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Author</th>
                <th>ISBN</th>
                <th>Category</th>
                <th class="text-right">Price</th>
                <th class="text-center">Stock</th>
              </tr>
            </thead>
            <tbody>
              ${filteredBooks
                .map(
                  (book) => `
                <tr>
                  <td>${book.id}</td>
                  <td>${book.title}</td>
                  <td>${book.author}</td>
                  <td>${book.isbn}</td>
                  <td>${book.category}</td>
                  <td class="text-right">$${book.price.toFixed(2)}</td>
                  <td class="text-center ${
                    book.stock > 10
                      ? "stock-high"
                      : book.stock > 0
                        ? "stock-medium"
                        : "stock-low"
                  }">${book.stock}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
          <div style="margin-top: 30px;">
            <p><strong>Total Books:</strong> ${filteredBooks.length}</p>
            <p><strong>Total Stock:</strong> ${filteredBooks.reduce((sum, book) => sum + book.stock, 0)}</p>
            <p><strong>Total Value:</strong> $${filteredBooks.reduce((sum, book) => sum + book.price * book.stock, 0).toFixed(2)}</p>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
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
          <div className="flex space-x-2">
            <button
              onClick={exportAllBooksToExcel}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
              title="Export to Excel"
            >
              <FiDownload className="mr-2" /> Export
            </button>
            <button
              onClick={printBooksList}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center"
              title="Print Book List"
            >
              <FiPrinter className="mr-2" /> Print
            </button>
            <button
              onClick={handleAddNewBook}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
            >
              <FiPlus className="mr-2" /> Add New Book
            </button>
          </div>
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
                                Are you sure you want to delete &quot;
                                {book.title}&quot;? This action cannot be
                                undone.
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
