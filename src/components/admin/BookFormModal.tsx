"use client";

import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { useStore } from "@/store/index";
import { Book } from "@/types/book";
import Image from "next/image";

interface BookFormModalProps {
  book: Book | null;
  onClose: () => void;
}

export default function BookFormModal({ book, onClose }: BookFormModalProps) {
  const addBook = useStore((state) => state.addBook);
  const updateBook = useStore((state) => state.updateBook);

  const [formData, setFormData] = useState<Omit<Book, "id"> | Book>({
    title: "",
    author: "",
    description: "",
    price: 0,
    coverImage: "",
    isbn: "",
    category: "",
    publishYear: new Date().getFullYear(),
    stock: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (book) {
      setFormData(book);
    }
  }, [book]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    if (name === "price" || name === "stock" || name === "publishYear") {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "publishYear" ? parseInt(value) : parseFloat(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.author.trim()) newErrors.author = "Author is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.isbn.trim()) newErrors.isbn = "ISBN is required";
    if (!formData.category.trim()) newErrors.category = "Category is required";
    if (!formData.coverImage.trim())
      newErrors.coverImage = "Cover image URL is required";
    if (formData.price <= 0) newErrors.price = "Price must be greater than 0";
    if (formData.stock < 0) newErrors.stock = "Stock cannot be negative";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      if (book) {
        // Update existing book
        updateBook(formData as Book);
      } else {
        // Add new book
        addBook(formData);
      }
      onClose();
    } catch (error) {
      console.error("Error saving book:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            {book ? "Edit Book" : "Add New Book"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full p-2 border rounded-lg ${errors.title ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Author
              </label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className={`w-full p-2 border rounded-lg ${errors.author ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.author && (
                <p className="mt-1 text-sm text-red-500">{errors.author}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={`w-full p-2 border rounded-lg ${errors.description ? "border-red-500" : "border-gray-300"}`}
              ></textarea>
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.description}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ISBN
              </label>
              <input
                type="text"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                className={`w-full p-2 border rounded-lg ${errors.isbn ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.isbn && (
                <p className="mt-1 text-sm text-red-500">{errors.isbn}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full p-2 border rounded-lg ${errors.category ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.category && (
                <p className="mt-1 text-sm text-red-500">{errors.category}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price ($)
              </label>
              <input
                type="number"
                name="price"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                className={`w-full p-2 border rounded-lg ${errors.price ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-500">{errors.price}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock
              </label>
              <input
                type="number"
                name="stock"
                min="0"
                value={formData.stock}
                onChange={handleChange}
                className={`w-full p-2 border rounded-lg ${errors.stock ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.stock && (
                <p className="mt-1 text-sm text-red-500">{errors.stock}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Publish Year
              </label>
              <input
                type="number"
                name="publishYear"
                min="1900"
                max={new Date().getFullYear()}
                value={formData.publishYear}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cover Image URL
              </label>
              <input
                type="text"
                name="coverImage"
                value={formData.coverImage}
                onChange={handleChange}
                className={`w-full p-2 border rounded-lg ${errors.coverImage ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.coverImage && (
                <p className="mt-1 text-sm text-red-500">{errors.coverImage}</p>
              )}

              {formData.coverImage && (
                <div className="mt-3">
                  <p className="text-sm text-gray-500 mb-2">Preview:</p>
                  <Image
                    src={formData.coverImage}
                    alt="Cover preview"
                    className="h-40 object-cover rounded-lg border border-gray-300"
                    width={160}
                    height={240}
                    onError={(e) => {
                      (e.target as HTMLImageElement).onerror = null;
                      (e.target as HTMLImageElement).src =
                        "/images/book-placeholder.jpg";
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
            >
              {isSubmitting ? "Saving..." : book ? "Update Book" : "Add Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
