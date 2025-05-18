/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  FiSearch,
  FiFilter,
  FiArrowUp,
  FiArrowDown,
  FiEdit,
  FiPackage,
  FiAlertCircle,
  FiArrowLeft,
  FiTrash2,
  FiPlus,
} from "react-icons/fi";
import { useStore } from "@/store/index";
import { UserRole } from "@/types/user";
import { Book } from "@/types/book";
import Image from "next/image";
import { getInitialBooks } from "@/store/bookData";

interface BookWithCategories extends Book {
  categories: string[];
}

interface Category {
  id: string;
  name: string;
}

interface BookFormData {
  title: string;
  author: string;
  description: string;
  price: number;
  coverImage: string;
  isbn: string;
  categories: string[];
  publishYear: number;
  stock: number;
}

const CategoryBadges = ({ categoryIds }: { categoryIds: string[] }) => {
  const categories = useStore((state: any) => state.categories) as Category[];

  return (
    <div className="flex flex-wrap gap-1">
      {categoryIds && categoryIds.length > 0 && categories ? (
        categoryIds.map((catId) => {
          const category = categories.find((c) => c.id === catId);
          return category ? (
            <span
              key={catId}
              className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-600 rounded-full"
            >
              {category.name}
            </span>
          ) : null;
        })
      ) : (
        <span className="text-xs text-gray-400">Chưa có danh mục</span>
      )}
    </div>
  );
};

export default function InventoryBooksPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [books, setBooks] = useState<BookWithCategories[]>([]);
  const categories = useStore((state: any) => state.categories) as Category[];
  const updateBook = useStore((state: any) => state.updateBook);

  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortField, setSortField] = useState<keyof BookWithCategories>("title");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [stockFilter, setStockFilter] = useState<"all" | "low" | "out">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedBook, setSelectedBook] = useState<BookWithCategories | null>(
    null,
  );
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [isEditBookModalOpen, setIsEditBookModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [bookFormData, setBookFormData] = useState<BookFormData>({
    title: "",
    author: "",
    description: "",
    price: 0,
    coverImage: "",
    isbn: "",
    categories: [],
    publishYear: new Date().getFullYear(),
    stock: 0,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin?callbackUrl=/inventory/books");
    } else if (status === "authenticated") {
      if (
        session?.user?.role !== UserRole.INVENTORY_MANAGER &&
        session?.user?.role !== UserRole.ADMIN &&
        session?.user?.role !== UserRole.EMPLOYEE
      ) {
        router.push("/");
      } else {
        setIsLoading(false);
      }
    }
  }, [status, session, router]);

  useEffect(() => {
    // Load dữ liệu từ bookData khi component mount
    const initialBooks = getInitialBooks();
    // Chuyển đổi từ Book sang BookWithCategories
    const booksWithCategories = initialBooks.map((book) => ({
      ...book,
      categories: [book.category], // Chuyển category thành mảng categories
    }));
    setBooks(booksWithCategories);
  }, []);

  // Lọc sách dựa trên tìm kiếm và các bộ lọc
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.isbn.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" ||
        (book.categories && book.categories.includes(selectedCategory));

      if (stockFilter === "low") {
        return (
          matchesSearch && matchesCategory && book.stock > 0 && book.stock <= 5
        );
      } else if (stockFilter === "out") {
        return matchesSearch && matchesCategory && book.stock === 0;
      }

      return matchesSearch && matchesCategory;
    });
  }, [books, searchQuery, selectedCategory, stockFilter]);

  // Sắp xếp sách
  const sortedBooks = useMemo(() => {
    return [...filteredBooks].sort((a, b) => {
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
  }, [filteredBooks, sortField, sortDirection]);

  const handleSort = (field: keyof BookWithCategories) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleBookClick = (book: BookWithCategories) => {
    setSelectedBook(book);
  };

  // Component để hiển thị bìa sách
  const BookCoverComponent = ({
    book,
    width,
    height,
  }: {
    book: BookWithCategories;
    width: number;
    height: number;
  }) => (
    <Image
      src={book.coverImage || "/images/book-placeholder.jpg"}
      alt={book.title}
      width={width}
      height={height}
      style={{ objectFit: "cover" }}
      className="bg-gray-100"
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.src = "/images/book-placeholder.jpg";
      }}
    />
  );

  // Reset form data when adding a new book
  const handleAddBookClick = () => {
    setBookFormData({
      title: "",
      author: "",
      description: "",
      price: 0,
      coverImage: "",
      isbn: "",
      categories: [],
      publishYear: new Date().getFullYear(),
      stock: 0,
    });
    setIsAddBookModalOpen(true);
  };

  // Populate form data when editing a book
  const handleEditBookClick = (book: BookWithCategories) => {
    setBookFormData({
      title: book.title,
      author: book.author,
      description: book.description,
      price: book.price,
      coverImage: book.coverImage,
      isbn: book.isbn,
      categories: book.categories || [],
      publishYear: book.publishYear,
      stock: book.stock,
    });
    setSelectedBook(book);
    setIsEditBookModalOpen(true);
  };

  // Handle form field changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    if (name === "price" || name === "stock" || name === "publishYear") {
      setBookFormData({
        ...bookFormData,
        [name]: Number(value),
      });
    } else {
      setBookFormData({
        ...bookFormData,
        [name]: value,
      });
    }
  };

  // Handle book submission (add new)
  const handleAddBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBook: BookWithCategories = {
      ...bookFormData,
      id: Math.random().toString(36).substr(2, 9), // Tạo ID ngẫu nhiên
      category: bookFormData.categories[0] || "",
      categories: bookFormData.categories,
    };
    setBooks((prevBooks) => [...prevBooks, newBook]);
    setIsAddBookModalOpen(false);
  };

  // Handle book update
  const handleEditBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedBook) {
      const updatedBook: BookWithCategories = {
        ...selectedBook,
        ...bookFormData,
        category: bookFormData.categories[0] || selectedBook.category,
        categories: bookFormData.categories,
      };
      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book.id === selectedBook.id ? updatedBook : book,
        ),
      );
      setIsEditBookModalOpen(false);
      setSelectedBook(null);
    }
  };

  // Handle book deletion
  const handleDeleteBook = () => {
    if (selectedBook) {
      setBooks((prevBooks) =>
        prevBooks.filter((book) => book.id !== selectedBook.id),
      );
      setIsDeleteConfirmOpen(false);
      setSelectedBook(null);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gray-900/25 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto transition-all duration-300 animate-[fadeIn_0.3s_ease-in-out">
        <div className="text-center">
          <div className="spinner h-12 w-12 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu sách...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Page Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center">
            <button
              onClick={() => {
                if (session?.user?.role === UserRole.EMPLOYEE) {
                  router.push("/employee");
                } else {
                  router.push("/inventory");
                }
              }}
              className="flex items-center mr-4 text-gray-600 hover:text-blue-600"
              aria-label="Quay lại"
            >
              <FiArrowLeft className="h-5 w-5 mr-1" />
              <span>Quay lại</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-800">Quản lý sách</h1>
          </div>
          <button
            onClick={handleAddBookClick}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <FiPlus className="mr-2" /> Thêm sách mới
          </button>
        </div>
      </div>
      {/* Thống kê sách */}
      <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
              <div className="rounded-full bg-green-100 p-3">
                <FiPackage className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Sách có sẵn</p>
                <p className="text-2xl font-bold text-gray-900">
                  {books.filter((book) => book.stock > 5).length}
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
                  Sắp hết hàng
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
      {/* Filters and Search */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Tìm kiếm sách theo tên, tác giả, ISBN..."
              className="w-full px-4 py-3 pl-12 border rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Tìm kiếm sách"
            />
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <div className="flex space-x-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border rounded-lg min-w-[180px]"
              aria-label="Lọc theo danh mục"
            >
              <option value="all">Tất cả danh mục</option>
              {categories &&
                categories.map((category: Category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
            </select>

            <select
              value={stockFilter}
              onChange={(e) =>
                setStockFilter(e.target.value as "all" | "low" | "out")
              }
              className="px-4 py-3 border rounded-lg min-w-[150px]"
              aria-label="Lọc theo tồn kho"
            >
              <option value="all">Tất cả số lượng</option>
              <option value="low">Sắp hết (≤5)</option>
              <option value="out">Hết hàng</option>
            </select>
          </div>
        </div>

        {/* Sorting options */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <span className="text-gray-600 flex items-center">
                <FiFilter className="mr-2" /> Sắp xếp theo:
              </span>
              <button
                onClick={() => handleSort("title")}
                className={`flex items-center ${sortField === "title" ? "font-medium text-blue-600" : "text-gray-600"}`}
              >
                Tên sách
                {sortField === "title" &&
                  (sortDirection === "asc" ? (
                    <FiArrowUp className="ml-1" />
                  ) : (
                    <FiArrowDown className="ml-1" />
                  ))}
              </button>
              <button
                onClick={() => handleSort("author")}
                className={`flex items-center ${sortField === "author" ? "font-medium text-blue-600" : "text-gray-600"}`}
              >
                Tác giả
                {sortField === "author" &&
                  (sortDirection === "asc" ? (
                    <FiArrowUp className="ml-1" />
                  ) : (
                    <FiArrowDown className="ml-1" />
                  ))}
              </button>
              <button
                onClick={() => handleSort("price")}
                className={`flex items-center ${sortField === "price" ? "font-medium text-blue-600" : "text-gray-600"}`}
              >
                Giá
                {sortField === "price" &&
                  (sortDirection === "asc" ? (
                    <FiArrowUp className="ml-1" />
                  ) : (
                    <FiArrowDown className="ml-1" />
                  ))}
              </button>
              <button
                onClick={() => handleSort("stock")}
                className={`flex items-center ${sortField === "stock" ? "font-medium text-blue-600" : "text-gray-600"}`}
              >
                Tồn kho
                {sortField === "stock" &&
                  (sortDirection === "asc" ? (
                    <FiArrowUp className="ml-1" />
                  ) : (
                    <FiArrowDown className="ml-1" />
                  ))}
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-gray-800">
              {filteredBooks.length} sách{" "}
              {searchQuery && `cho "${searchQuery}"`}
            </h2>
            <div className="flex space-x-3">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md ${viewMode === "grid" ? "bg-blue-50 text-blue-600" : "text-gray-400"}`}
                aria-label="Xem dạng lưới"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md ${viewMode === "list" ? "bg-blue-50 text-blue-600" : "text-gray-400"}`}
                aria-label="Xem dạng danh sách"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>

          {sortedBooks.length === 0 ? (
            <div className="text-center py-12">
              <FiPackage className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                Không tìm thấy sách nào
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Thử thay đổi bộ lọc tìm kiếm của bạn
              </p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {sortedBooks.map((book) => (
                <div
                  key={book.id}
                  onClick={() => handleBookClick(book)}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="relative pt-[140%]">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BookCoverComponent
                        book={book}
                        width={160}
                        height={240}
                      />
                    </div>

                    {/* Stock indicator */}
                    {book.stock === 0 ? (
                      <div className="absolute top-2 right-2 bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded-full flex items-center">
                        <FiAlertCircle className="mr-1" /> Hết hàng
                      </div>
                    ) : book.stock <= 5 ? (
                      <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded-full flex items-center">
                        <FiAlertCircle className="mr-1" /> Còn {book.stock}
                      </div>
                    ) : null}
                  </div>

                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 line-clamp-2">
                      {book.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{book.author}</p>
                    <div className="mt-2 mb-2">
                      <CategoryBadges categoryIds={book.categories || []} />
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-medium text-gray-900">
                        {book.price.toLocaleString("vi-VN")} đ
                      </span>
                      <span className="text-sm text-gray-600 flex items-center">
                        <FiPackage className="mr-1" /> {book.stock}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Sách
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Tác giả
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Danh mục
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Giá
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Tồn kho
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      ISBN
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedBooks.map((book) => (
                    <tr
                      key={book.id}
                      onClick={() => handleBookClick(book)}
                      className="hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 relative">
                            <BookCoverComponent
                              book={book}
                              width={40}
                              height={60}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {book.title}
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
                        <div>
                          <CategoryBadges categoryIds={book.categories || []} />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {book.price.toLocaleString("vi-VN")} đ
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {book.stock === 0 ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Hết hàng
                          </span>
                        ) : book.stock <= 5 ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            {book.stock} (Sắp hết)
                          </span>
                        ) : (
                          <span className="text-sm text-gray-900">
                            {book.stock}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {book.isbn}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {/* Book Detail Modal */}
      {selectedBook && (
        <div className="fixed inset-0 bg-gray-900/25 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto transition-all duration-300 animate-[fadeIn_0.3s_ease-in-out">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedBook.title}
                </h2>
                <button
                  onClick={() => setSelectedBook(null)}
                  className="text-gray-400 hover:text-gray-500"
                  aria-label="Đóng"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="relative pt-[140%] bg-gray-100 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookCoverComponent
                      book={selectedBook}
                      width={200}
                      height={300}
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Tác giả
                      </h3>
                      <p className="mt-1 text-lg">{selectedBook.author}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Danh mục
                      </h3>
                      <div className="mt-2">
                        <CategoryBadges
                          categoryIds={selectedBook.categories || []}
                        />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        ISBN
                      </h3>
                      <p className="mt-1">{selectedBook.isbn}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Năm xuất bản
                      </h3>
                      <p className="mt-1">{selectedBook.publishYear}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Giá</h3>
                      <p className="mt-1 text-2xl font-bold text-blue-600">
                        {selectedBook.price.toLocaleString("vi-VN")} đ
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Tình trạng tồn kho
                      </h3>
                      <div className="mt-1 flex items-center">
                        {selectedBook.stock === 0 ? (
                          <span className="bg-red-100 text-red-800 text-sm px-3 py-1 rounded-full inline-flex items-center">
                            <FiAlertCircle className="mr-1" /> Hết hàng
                          </span>
                        ) : selectedBook.stock <= 5 ? (
                          <span className="bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-full inline-flex items-center">
                            <FiAlertCircle className="mr-1" /> Còn{" "}
                            {selectedBook.stock} sản phẩm
                          </span>
                        ) : (
                          <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full inline-flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-1"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Còn hàng ({selectedBook.stock} sản phẩm)
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Mô tả
                      </h3>
                      <p className="mt-1 text-gray-600">
                        {selectedBook.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                      onClick={() => {
                        // Hiển thị form cập nhật số lượng kho
                        const newStock = prompt(
                          `Nhập số lượng mới cho sách "${selectedBook.title}":`,
                          String(selectedBook.stock),
                        );
                        if (newStock !== null) {
                          const stockValue = parseInt(newStock);
                          if (!isNaN(stockValue) && stockValue >= 0) {
                            updateBook({ ...selectedBook, stock: stockValue });
                            setSelectedBook({
                              ...selectedBook,
                              stock: stockValue,
                            });
                          } else {
                            alert("Vui lòng nhập số lượng hợp lệ");
                          }
                        }
                      }}
                    >
                      <FiEdit className="mr-2" /> Cập nhật số lượng
                    </button>

                    <button
                      className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 flex items-center"
                      onClick={() => handleEditBookClick(selectedBook)}
                    >
                      <FiEdit className="mr-2" /> Sửa thông tin
                    </button>

                    <button
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                      onClick={() => setIsDeleteConfirmOpen(true)}
                    >
                      <FiTrash2 className="mr-2" /> Xóa sách
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Add Book Modal */}{" "}
      {isAddBookModalOpen && (
        <div className="fixed inset-0 bg-gray-900/25 bg-opacity-10 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  Thêm sách mới
                </h2>
                <button
                  onClick={() => setIsAddBookModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                  aria-label="Đóng"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleAddBookSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên sách <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={bookFormData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      title="Nhập tên sách"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tác giả <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="author"
                      value={bookFormData.author}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      title="Nhập tên tác giả"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ISBN <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="isbn"
                      value={bookFormData.isbn}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      title="Nhập mã ISBN"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL Hình ảnh bìa
                    </label>
                    <input
                      type="text"
                      name="coverImage"
                      value={bookFormData.coverImage}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      title="Nhập URL hình ảnh bìa sách"
                      placeholder="https://example.com/book-cover.jpg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Năm xuất bản <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="publishYear"
                      value={bookFormData.publishYear}
                      onChange={handleInputChange}
                      required
                      min="1900"
                      max={new Date().getFullYear()}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      title="Nhập năm xuất bản"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giá (VNĐ) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={bookFormData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="1000"
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      title="Nhập giá sách"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số lượng trong kho <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={bookFormData.stock}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      title="Nhập số lượng trong kho"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Danh mục <span className="text-red-500">*</span>
                    </label>
                    <div className="border border-gray-300 rounded-md px-3 py-2 max-h-[200px] overflow-y-auto">
                      {categories &&
                        categories.map((category) => (
                          <div
                            key={category.id}
                            className="flex items-center mb-2"
                          >
                            <input
                              type="checkbox"
                              id={`category-${category.id}`}
                              checked={bookFormData.categories.includes(
                                category.id,
                              )}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setBookFormData({
                                    ...bookFormData,
                                    categories: [
                                      ...bookFormData.categories,
                                      category.id,
                                    ],
                                  });
                                } else {
                                  setBookFormData({
                                    ...bookFormData,
                                    categories: bookFormData.categories.filter(
                                      (id) => id !== category.id,
                                    ),
                                  });
                                }
                              }}
                              className="w-4 h-4 text-blue-600 rounded"
                              aria-label={`Chọn danh mục ${category.name}`}
                            />
                            <label
                              htmlFor={`category-${category.id}`}
                              className="ml-2 text-sm text-gray-700"
                            >
                              {category.name}
                            </label>
                          </div>
                        ))}
                    </div>
                    {bookFormData.categories.length === 0 && (
                      <p className="text-xs text-red-500 mt-1">
                        Vui lòng chọn ít nhất một danh mục
                      </p>
                    )}
                    <div className="mt-2 flex flex-wrap gap-1">
                      {bookFormData.categories.map((catId) => {
                        const cat = categories.find((c) => c.id === catId);
                        return (
                          cat && (
                            <span
                              key={catId}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600"
                            >
                              {cat.name}
                              <button
                                type="button"
                                onClick={() => {
                                  setBookFormData({
                                    ...bookFormData,
                                    categories: bookFormData.categories.filter(
                                      (id) => id !== catId,
                                    ),
                                  });
                                }}
                                className="ml-1 text-blue-400 hover:text-blue-600"
                              >
                                &times;
                              </button>
                            </span>
                          )
                        );
                      })}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mô tả
                    </label>
                    <textarea
                      name="description"
                      value={bookFormData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      title="Nhập mô tả sách"
                    ></textarea>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsAddBookModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-3"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Thêm sách
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* Edit Book Modal */}
      {isEditBookModalOpen && selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  Chỉnh sửa sách
                </h2>
                <button
                  onClick={() => setIsEditBookModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                  aria-label="Đóng"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleEditBookSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên sách <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={bookFormData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      title="Nhập tên sách"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tác giả <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="author"
                      value={bookFormData.author}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      title="Nhập tên tác giả"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ISBN <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="isbn"
                      value={bookFormData.isbn}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      title="Nhập mã ISBN"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL Hình ảnh bìa
                    </label>
                    <input
                      type="text"
                      name="coverImage"
                      value={bookFormData.coverImage}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      title="Nhập URL hình ảnh bìa sách"
                      placeholder="https://example.com/book-cover.jpg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Năm xuất bản <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="publishYear"
                      value={bookFormData.publishYear}
                      onChange={handleInputChange}
                      required
                      min="1900"
                      max={new Date().getFullYear()}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      title="Nhập năm xuất bản"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giá (VNĐ) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={bookFormData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="1000"
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      title="Nhập giá sách"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số lượng trong kho <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={bookFormData.stock}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      title="Nhập số lượng trong kho"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Danh mục <span className="text-red-500">*</span>
                    </label>
                    <div className="border border-gray-300 rounded-md px-3 py-2 max-h-[200px] overflow-y-auto">
                      {categories &&
                        categories.map((category) => (
                          <div
                            key={category.id}
                            className="flex items-center mb-2"
                          >
                            <input
                              type="checkbox"
                              id={`category-${category.id}`}
                              checked={bookFormData.categories.includes(
                                category.id,
                              )}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setBookFormData({
                                    ...bookFormData,
                                    categories: [
                                      ...bookFormData.categories,
                                      category.id,
                                    ],
                                  });
                                } else {
                                  setBookFormData({
                                    ...bookFormData,
                                    categories: bookFormData.categories.filter(
                                      (id) => id !== category.id,
                                    ),
                                  });
                                }
                              }}
                              className="w-4 h-4 text-blue-600 rounded"
                              aria-label={`Chọn danh mục ${category.name}`}
                            />
                            <label
                              htmlFor={`category-${category.id}`}
                              className="ml-2 text-sm text-gray-700"
                            >
                              {category.name}
                            </label>
                          </div>
                        ))}
                    </div>
                    {bookFormData.categories.length === 0 && (
                      <p className="text-xs text-red-500 mt-1">
                        Vui lòng chọn ít nhất một danh mục
                      </p>
                    )}
                    <div className="mt-2 flex flex-wrap gap-1">
                      {bookFormData.categories.map((catId) => {
                        const cat = categories.find((c) => c.id === catId);
                        return (
                          cat && (
                            <span
                              key={catId}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600"
                            >
                              {cat.name}
                              <button
                                type="button"
                                onClick={() => {
                                  setBookFormData({
                                    ...bookFormData,
                                    categories: bookFormData.categories.filter(
                                      (id) => id !== catId,
                                    ),
                                  });
                                }}
                                className="ml-1 text-blue-400 hover:text-blue-600"
                              >
                                &times;
                              </button>
                            </span>
                          )
                        );
                      })}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mô tả
                    </label>
                    <textarea
                      name="description"
                      value={bookFormData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      title="Nhập mô tả sách"
                    ></textarea>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsEditBookModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-3"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Lưu thay đổi
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Xác nhận xóa sách
            </h2>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa sách &quot;{selectedBook.title}&quot;?
              Hành động này không thể hoàn tác.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-3"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteBook}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Xóa sách
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
