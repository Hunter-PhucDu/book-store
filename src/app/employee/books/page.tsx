"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  FiSearch,
  FiX,
  FiChevronDown,
  FiChevronUp,
  FiEye,
  FiAlertCircle,
  FiArrowLeft,
} from "react-icons/fi";
import { UserRole } from "@/types/user";
import { Book } from "@/types/book";
import Image from "next/image";
import { getInitialBooks } from "@/store/bookData";

export default function EmployeeBooksManagement() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortField, setSortField] = useState<keyof Book>("title");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [viewBookId, setViewBookId] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin?callbackUrl=/employee/books");
    } else if (status === "authenticated") {
      if (session?.user?.role !== UserRole.EMPLOYEE) {
        router.push("/");
      } else {
        const initialBooks = getInitialBooks();
        setBooks(initialBooks);
        setIsLoading(false);
      }
    }
  }, [status, session, router]);

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(books.map((book) => book.category))];
    return ["all", ...uniqueCategories.sort((a, b) => a.localeCompare(b))];
  }, [books]);

  const filteredBooks = useMemo(() => {
    let results = [...books];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          book.description.toLowerCase().includes(query) ||
          book.isbn.toLowerCase().includes(query),
      );
    }

    if (selectedCategory !== "all") {
      results = results.filter((book) => book.category === selectedCategory);
    }

    if (lowStockOnly) {
      results = results.filter((book) => book.stock <= 10);
    }

    results.sort((a, b) => {
      if (
        sortField === "price" ||
        sortField === "stock" ||
        sortField === "publishYear"
      ) {
        return sortDirection === "asc"
          ? Number(a[sortField]) - Number(b[sortField])
          : Number(b[sortField]) - Number(a[sortField]);
      }
      const fieldA = String(a[sortField]).toLowerCase();
      const fieldB = String(b[sortField]).toLowerCase();
      return sortDirection === "asc"
        ? fieldA.localeCompare(fieldB)
        : fieldB.localeCompare(fieldA);
    });

    return results;
  }, [
    books,
    searchQuery,
    selectedCategory,
    lowStockOnly,
    sortField,
    sortDirection,
  ]);

  const selectedBook = useMemo(() => {
    return books.find((book) => book.id === viewBookId);
  }, [books, viewBookId]);

  const handleSort = (field: keyof Book) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner h-12 w-12 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center">
            <button
              onClick={() => router.push("/employee")}
              className="mr-4 flex items-center text-gray-600 hover:text-blue-600"
              aria-label="Quay lại Dashboard"
            >
              <FiArrowLeft className="h-5 w-5 mr-1" />
              <span>Quay lại</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-800">Quản lý sách</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-grow relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, tác giả, ISBN..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Tìm kiếm sách"
              />
            </div>

            <div className="sm:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                aria-label="Lọc theo danh mục"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "all" ? "Tất cả danh mục" : category}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={lowStockOnly}
                  onChange={() => setLowStockOnly(!lowStockOnly)}
                  aria-label="Hiển thị sách có số lượng thấp"
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ms-3 text-sm font-medium text-gray-900">
                  Số lượng thấp
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("title")}
                  >
                    <div className="flex items-center">
                      <span>Tên sách</span>
                      {sortField === "title" && (
                        <span className="ml-1">
                          {sortDirection === "asc" ? (
                            <FiChevronUp />
                          ) : (
                            <FiChevronDown />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("author")}
                  >
                    <div className="flex items-center">
                      <span>Tác giả</span>
                      {sortField === "author" && (
                        <span className="ml-1">
                          {sortDirection === "asc" ? (
                            <FiChevronUp />
                          ) : (
                            <FiChevronDown />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("category")}
                  >
                    <div className="flex items-center">
                      <span>Danh mục</span>
                      {sortField === "category" && (
                        <span className="ml-1">
                          {sortDirection === "asc" ? (
                            <FiChevronUp />
                          ) : (
                            <FiChevronDown />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("price")}
                  >
                    <div className="flex items-center">
                      <span>Giá</span>
                      {sortField === "price" && (
                        <span className="ml-1">
                          {sortDirection === "asc" ? (
                            <FiChevronUp />
                          ) : (
                            <FiChevronDown />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("stock")}
                  >
                    <div className="flex items-center">
                      <span>Số lượng</span>
                      {sortField === "stock" && (
                        <span className="ml-1">
                          {sortDirection === "asc" ? (
                            <FiChevronUp />
                          ) : (
                            <FiChevronDown />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBooks.length > 0 ? (
                  filteredBooks.map((book) => (
                    <tr key={book.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 relative">
                            <Image
                              src={
                                book.coverImage ||
                                "/images/book-placeholder.png"
                              }
                              alt={book.title}
                              className="h-10 w-10 object-cover rounded"
                              width={40}
                              height={40}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "/images/book-placeholder.png";
                              }}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {book.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              ISBN: {book.isbn}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {book.author}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {book.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {book.price.toLocaleString("vi-VN")} đ
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className={`text-sm font-medium ${
                            book.stock <= 5
                              ? "text-red-600"
                              : book.stock <= 10
                                ? "text-yellow-600"
                                : "text-green-600"
                          }`}
                        >
                          {book.stock}
                          {book.stock <= 5 && (
                            <FiAlertCircle className="inline ml-1 text-red-600" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => setViewBookId(book.id)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                          aria-label="Xem chi tiết"
                        >
                          <FiEye className="inline mr-1" />
                          Xem
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      Không có sách nào phù hợp với tiêu chí tìm kiếm
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {selectedBook && (
          <div className="fixed inset-0 bg-gray-900/25 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto transition-all duration-300 animate-[fadeIn_0.3s_ease-in-out">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Chi tiết sách
                  </h2>
                  <button
                    onClick={() => setViewBookId(null)}
                    className="text-gray-500 hover:text-gray-700"
                    aria-label="Đóng"
                  >
                    <FiX className="h-6 w-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1 flex justify-center">
                    <div className="relative h-60 w-48">
                      <Image
                        src={
                          selectedBook.coverImage ||
                          "/images/book-placeholder.png"
                        }
                        alt={selectedBook.title}
                        className="object-cover rounded shadow-md"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/images/book-placeholder.png";
                        }}
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {selectedBook.title}
                    </h3>
                    <p className="text-gray-600 mb-2">
                      <span className="font-semibold">Tác giả:</span>{" "}
                      {selectedBook.author}
                    </p>
                    <p className="text-gray-600 mb-2">
                      <span className="font-semibold">Danh mục:</span>{" "}
                      {selectedBook.category}
                    </p>
                    <p className="text-gray-600 mb-2">
                      <span className="font-semibold">ISBN:</span>{" "}
                      {selectedBook.isbn}
                    </p>
                    <p className="text-gray-600 mb-2">
                      <span className="font-semibold">Năm xuất bản:</span>{" "}
                      {selectedBook.publishYear}
                    </p>
                    <p className="text-gray-600 mb-2">
                      <span className="font-semibold">Giá:</span>{" "}
                      {selectedBook.price.toLocaleString("vi-VN")} đ
                    </p>
                    <p
                      className={`mb-4 ${
                        selectedBook.stock <= 5
                          ? "text-red-600"
                          : selectedBook.stock <= 10
                            ? "text-yellow-600"
                            : "text-green-600"
                      }`}
                    >
                      <span className="font-semibold">Số lượng trong kho:</span>{" "}
                      {selectedBook.stock}
                      {selectedBook.stock <= 10 && (
                        <span className="ml-2 text-sm text-red-600 font-semibold">
                          {selectedBook.stock <= 5
                            ? "Sắp hết hàng!"
                            : "Sắp hết!"}
                        </span>
                      )}
                    </p>
                    <div>
                      <h4 className="text-lg font-semibold mb-2">Mô tả:</h4>
                      <p className="text-gray-700 whitespace-pre-line">
                        {selectedBook.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setViewBookId(null)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
