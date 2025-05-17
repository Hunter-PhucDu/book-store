"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  FiAlertCircle,
  FiArrowUp,
  FiArrowDown,
  FiSearch,
  FiPackage,
  FiBell,
  FiUpload,
  FiClock,
} from "react-icons/fi";
import { useStore } from "@/store/index";
import { UserRole } from "@/types/user";
import BookCover from "@/components/BookCover";
import StockUpdateModal from "@/components/inventory/StockUpdateModal";
import BatchUpdateModal from "@/components/inventory/BatchUpdateModal";
import StockAlertsModal from "@/components/inventory/StockAlertsModal";
import InventoryHistoryModal from "@/components/inventory/InventoryHistoryModal";
import { Book } from "@/types/book";

export default function InventoryManagementPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const books = useStore((state) => state.books);

  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<keyof Book>("title");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBook, setCurrentBook] = useState<Book | null>(null);
  const [stockFilter, setStockFilter] = useState<"all" | "low" | "out">("all");
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [isAlertsModalOpen, setIsAlertsModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin?callbackUrl=/inventory");
    } else if (status === "authenticated") {
      if (
        session?.user?.role !== UserRole.INVENTORY_MANAGER &&
        session?.user?.role !== UserRole.ADMIN
      ) {
        router.push("/");
      } else {
        setIsLoading(false);
      }
    }
  }, [status, session, router]);

  // Filter books based on search query and stock filter
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.isbn.toLowerCase().includes(searchQuery.toLowerCase());

    if (stockFilter === "low") {
      return matchesSearch && book.stock > 0 && book.stock <= 5;
    } else if (stockFilter === "out") {
      return matchesSearch && book.stock === 0;
    }

    return matchesSearch;
  });

  // Sort books
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (
      sortField === "price" ||
      sortField === "stock" ||
      sortField === "publishYear"
    ) {
      return sortDirection === "asc"
        ? a[sortField] - b[sortField]
        : b[sortField] - a[sortField];
    }

    return sortDirection === "asc"
      ? String(a[sortField]).localeCompare(String(b[sortField]))
      : String(b[sortField]).localeCompare(String(a[sortField]));
  });

  const handleSort = (field: keyof Book) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleUpdateStock = (book: Book) => {
    setCurrentBook(book);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner h-12 w-12 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu kho hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Page Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => router.push("/")}
                className="flex items-center mr-4 text-gray-600 hover:text-blue-600"
                aria-label="Quay lại"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Quay lại</span>
              </button>
              <h1 className="text-3xl font-bold text-gray-800">
                Quản lý kho hàng
              </h1>
              <p className="text-gray-600 mt-2">
                Quản lý tồn kho và cập nhật lượng sách
              </p>
            </div>
            <button
              onClick={() => router.push("/")}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-blue-600 border border-gray-300 rounded-lg hover:border-blue-600 transition-colors"
              aria-label="Về trang chủ"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              <span>Trang chủ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Tìm kiếm sách..."
              className="w-full px-4 py-3 pl-12 border rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <select
            value={stockFilter}
            onChange={(e) =>
              setStockFilter(e.target.value as "all" | "low" | "out")
            }
            className="px-4 py-3 border rounded-lg min-w-[150px]"
            aria-label="Lọc theo tình trạng tồn kho"
          >
            <option value="all">Tất cả kho</option>
            <option value="low">Sắp hết (≤5)</option>
            <option value="out">Hết hàng</option>
          </select>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 mt-4">
          <button
            onClick={() => router.push("/inventory/books")}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
            </svg>
            Quản lý sách
          </button>

          <button
            onClick={() => setIsBatchModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <FiUpload className="mr-2" />
            Cập nhật hàng loạt
          </button>

          <button
            onClick={() => setIsHistoryModalOpen(true)}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center"
          >
            <FiClock className="mr-2" />
            Xem lịch sử
          </button>

          <button
            onClick={() => setIsAlertsModalOpen(true)}
            className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 flex items-center"
          >
            <FiBell className="mr-2" />
            Cảnh báo kho
            {books.filter((book) => book.stock === 0 || book.stock <= 5)
              .length > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {
                  books.filter((book) => book.stock === 0 || book.stock <= 5)
                    .length
                }
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Inventory Stats */}
      <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="rounded-full bg-blue-100 p-3">
                <FiPackage className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Tổng số sách
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {books.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="rounded-full bg-yellow-100 p-3">
                <FiAlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Sách sắp hết
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    books.filter((book) => book.stock > 0 && book.stock <= 5)
                      .length
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="rounded-full bg-red-100 p-3">
                <FiAlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Hết hàng</p>
                <p className="text-2xl font-bold text-gray-900">
                  {books.filter((book) => book.stock === 0).length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Books Table */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("title")}
                  >
                    Sách
                    {sortField === "title" &&
                      (sortDirection === "asc" ? (
                        <FiArrowUp className="inline-block ml-1" />
                      ) : (
                        <FiArrowDown className="inline-block ml-1" />
                      ))}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("isbn")}
                  >
                    ISBN
                    {sortField === "isbn" &&
                      (sortDirection === "asc" ? (
                        <FiArrowUp className="inline-block ml-1" />
                      ) : (
                        <FiArrowDown className="inline-block ml-1" />
                      ))}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("stock")}
                  >
                    Tồn kho
                    {sortField === "stock" &&
                      (sortDirection === "asc" ? (
                        <FiArrowUp className="inline-block ml-1" />
                      ) : (
                        <FiArrowDown className="inline-block ml-1" />
                      ))}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedBooks.length > 0 ? (
                  sortedBooks.map((book) => (
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
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleUpdateStock(book)}
                          className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700"
                        >
                          Cập nhật kho
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      Không tìm thấy sách phù hợp với tìm kiếm của bạn.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Stock Update Modal */}
      {isModalOpen && currentBook && (
        <StockUpdateModal
          book={currentBook}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {/* Batch Update Modal */}
      {isBatchModalOpen && (
        <BatchUpdateModal
          books={books}
          onClose={() => setIsBatchModalOpen(false)}
        />
      )}

      {/* Stock Alerts Modal */}
      {isAlertsModalOpen && (
        <StockAlertsModal
          books={books}
          onClose={() => setIsAlertsModalOpen(false)}
        />
      )}

      {/* Inventory History Modal */}
      {isHistoryModalOpen && (
        <InventoryHistoryModal
          books={books}
          onClose={() => setIsHistoryModalOpen(false)}
        />
      )}
    </div>
  );
}
