"use client";

import { useState } from "react";
import { FiX, FiDownload, FiPrinter } from "react-icons/fi";
import { Book } from "@/types/book";
import { useStore } from "@/store/index";
import BookCover from "@/components/BookCover";

interface BookFormModalProps {
  book: Book | null;
  onClose: () => void;
}

export default function BookFormModal({ book, onClose }: BookFormModalProps) {
  const addBook = useStore((state) => state.addBook);
  const updateBook = useStore((state) => state.updateBook);

  const [formData, setFormData] = useState<Partial<Book>>(
    book
      ? { ...book }
      : {
          title: "",
          author: "",
          description: "",
          price: 0,
          coverImage: "/images/books/book-placeholder.jpg",
          isbn: "",
          category: "",
          publishYear: new Date().getFullYear(),
          stock: 0,
        },
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    let parsedValue: any = value;

    // Parse numeric values
    if (name === "price" || name === "stock" || name === "publishYear") {
      parsedValue = value === "" ? 0 : Number(value);
    }

    setFormData({
      ...formData,
      [name]: parsedValue,
    });

    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors.title = "Tiêu đề là bắt buộc";
    }

    if (!formData.author?.trim()) {
      newErrors.author = "Tác giả là bắt buộc";
    }

    if (!formData.isbn?.trim()) {
      newErrors.isbn = "ISBN là bắt buộc";
    }

    if (!formData.category?.trim()) {
      newErrors.category = "Thể loại là bắt buộc";
    }

    if (formData.price === undefined || formData.price < 0) {
      newErrors.price = "Giá phải lớn hơn hoặc bằng 0";
    }

    if (formData.stock === undefined || formData.stock < 0) {
      newErrors.stock = "Số lượng tồn kho phải lớn hơn hoặc bằng 0";
    }

    if (
      formData.publishYear === undefined ||
      formData.publishYear < 1000 ||
      formData.publishYear > new Date().getFullYear() + 1
    ) {
      newErrors.publishYear = "Năm xuất bản không hợp lệ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (book) {
        // Update existing book
        updateBook(book.id, formData as Book);
      } else {
        // Add new book
        addBook({
          ...formData,
          id: `book-${Date.now()}`,
        } as Book);
      }
      onClose();
    } catch (error) {
      console.error("Error saving book:", error);
      setIsSubmitting(false);
    }
  };

  // Xuất thông tin sách ra Excel
  const exportToExcel = () => {
    if (!book) return;

    // Tạo dữ liệu CSV
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
    const data = [
      book.id,
      `"${book.title.replace(/"/g, '""')}"`, // Escape quotes
      `"${book.author.replace(/"/g, '""')}"`,
      book.isbn,
      `"${book.category.replace(/"/g, '""')}"`,
      book.price,
      book.stock,
      book.publishYear,
    ];

    const csvContent = `${headers.join(",")}\n${data.join(",")}`;

    // Tạo blob và download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `book-${book.id}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // In thông tin sách
  const printBookDetails = () => {
    if (!book) return;

    const printContent = `
      <html>
        <head>
          <title>Book Details</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; margin-bottom: 10px; }
            .book-details { margin-top: 20px; }
            .book-detail { margin-bottom: 10px; }
            .label { font-weight: bold; }
            .description { margin-top: 20px; white-space: pre-wrap; }
          </style>
        </head>
        <body>
          <h1>${book.title}</h1>
          <div class="book-details">
            <div class="book-detail">
              <span class="label">Author:</span> ${book.author}
            </div>
            <div class="book-detail">
              <span class="label">ISBN:</span> ${book.isbn}
            </div>
            <div class="book-detail">
              <span class="label">Category:</span> ${book.category}
            </div>
            <div class="book-detail">
              <span class="label">Price:</span> ${book.price.toLocaleString("vi-VN")} đ
            </div>
            <div class="book-detail">
              <span class="label">Stock:</span> ${book.stock}
            </div>
            <div class="book-detail">
              <span class="label">Publish Year:</span> ${book.publishYear}
            </div>
            <div class="description">
              <span class="label">Description:</span><br>
              ${book.description}
            </div>
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

  return (
    <div className="modal-backdrop">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-fade-in animate-slide-up">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            {book ? "Edit Book" : "Add New Book"}
          </h2>
          <div className="flex items-center space-x-2">
            {book && (
              <>
                <button
                  onClick={exportToExcel}
                  className="text-blue-600 hover:text-blue-800 p-2 transition-colors"
                  title="Export to Excel"
                >
                  <FiDownload className="h-5 w-5" />
                </button>
                <button
                  onClick={printBookDetails}
                  className="text-green-600 hover:text-green-800 p-2 transition-colors"
                  title="Print Book Details"
                >
                  <FiPrinter className="h-5 w-5" />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Book Cover */}
            <div className="md:col-span-2 flex flex-col md:flex-row items-center gap-4">
              <div className="w-40 h-60 relative">
                <BookCover
                  src={
                    formData.coverImage || "/images/books/book-placeholder.jpg"
                  }
                  alt={formData.title || "Book cover"}
                  className="rounded-md"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cover Image URL
                </label>
                <input
                  type="text"
                  name="coverImage"
                  value={formData.coverImage || ""}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            </div>

            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title || ""}
                onChange={handleChange}
                className={`w-full p-2 border rounded-lg ${errors.title ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500">{errors.title}</p>
              )}
            </div>

            {/* Author */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Author
              </label>
              <input
                type="text"
                name="author"
                value={formData.author || ""}
                onChange={handleChange}
                className={`w-full p-2 border rounded-lg ${errors.author ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.author && (
                <p className="mt-1 text-sm text-red-500">{errors.author}</p>
              )}
            </div>

            {/* ISBN */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ISBN
              </label>
              <input
                type="text"
                name="isbn"
                value={formData.isbn || ""}
                onChange={handleChange}
                className={`w-full p-2 border rounded-lg ${errors.isbn ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.isbn && (
                <p className="mt-1 text-sm text-red-500">{errors.isbn}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={formData.category || ""}
                onChange={handleChange}
                className={`w-full p-2 border rounded-lg ${errors.category ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.category && (
                <p className="mt-1 text-sm text-red-500">{errors.category}</p>
              )}
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <input
                type="number"
                name="price"
                value={formData.price || ""}
                onChange={handleChange}
                className={`w-full p-2 border rounded-lg ${errors.price ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-500">{errors.price}</p>
              )}
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock || ""}
                onChange={handleChange}
                className={`w-full p-2 border rounded-lg ${errors.stock ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.stock && (
                <p className="mt-1 text-sm text-red-500">{errors.stock}</p>
              )}
            </div>

            {/* Publish Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Publish Year
              </label>
              <input
                type="number"
                name="publishYear"
                value={formData.publishYear || ""}
                onChange={handleChange}
                className={`w-full p-2 border rounded-lg ${errors.publishYear ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.publishYear && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.publishYear}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                rows={5}
                className="w-full p-2 border border-gray-300 rounded-lg"
              ></textarea>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm text-sm font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-400"
            >
              {isSubmitting ? "Saving..." : book ? "Update Book" : "Add Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
