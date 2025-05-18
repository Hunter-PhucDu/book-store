"use client";

import { useState, useEffect, useCallback, memo } from "react";
import { FiX, FiUpload } from "react-icons/fi";
import { Book } from "@/types/book";
import Image from "next/image";

interface BookFormModalProps {
  book: Book | null;
  onClose: () => void;
  onSubmit: (book: Omit<Book, "id"> | Book) => void;
}

const BookFormModal = memo(
  ({ book, onClose, onSubmit }: BookFormModalProps) => {
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
    const [isUploading, setIsUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string>("");

    useEffect(() => {
      if (book) {
        setFormData(book);
        setImagePreview(book.coverImage);
      }
    }, [book]);

    const handleChange = useCallback(
      (
        e: React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
      ) => {
        const { name, value } = e.target;

        if (name === "price" || name === "stock" || name === "publishYear") {
          setFormData((prev) => ({
            ...prev,
            [name]:
              name === "publishYear" ? parseInt(value) : parseFloat(value),
          }));
        } else if (name === "coverImage") {
          setFormData((prev) => ({
            ...prev,
            [name]: value,
          }));
          setImagePreview(value);
        } else {
          setFormData((prev) => ({
            ...prev,
            [name]: value,
          }));
        }
      },
      [],
    );

    const handleImageUpload = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        if (!file.type.startsWith("image/")) {
          setErrors((prev) => ({
            ...prev,
            coverImage: "Vui lòng chọn file ảnh hợp lệ",
          }));
          return;
        }

        setIsUploading(true);

        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;

          if (file.size > 1024 * 1024) {
            console.warn("Ảnh lớn hơn 1MB có thể gây chậm tải trang.");
          }

          setFormData((prev) => ({
            ...prev,
            coverImage: result,
          }));

          setImagePreview(result);

          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.coverImage;
            return newErrors;
          });

          setIsUploading(false);
        };

        reader.onerror = () => {
          setErrors((prev) => ({
            ...prev,
            coverImage: "Lỗi khi đọc file ảnh",
          }));
          setIsUploading(false);
        };

        reader.readAsDataURL(file);
      },
      [],
    );

    const validateForm = useCallback(() => {
      const newErrors: Record<string, string> = {};

      if (!formData.title.trim()) newErrors.title = "Vui lòng nhập tên sách";
      if (!formData.author.trim())
        newErrors.author = "Vui lòng nhập tên tác giả";
      if (!formData.description.trim())
        newErrors.description = "Vui lòng nhập mô tả sách";
      if (!formData.isbn.trim()) newErrors.isbn = "Vui lòng nhập mã ISBN";
      if (!formData.category.trim())
        newErrors.category = "Vui lòng chọn thể loại";
      if (!formData.coverImage.trim())
        newErrors.coverImage =
          "Vui lòng nhập đường dẫn ảnh bìa hoặc upload ảnh";
      if (formData.price <= 0) newErrors.price = "Giá sách phải lớn hơn 0";
      if (formData.stock < 0) newErrors.stock = "Số lượng không thể âm";

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }, [formData]);

    const handleSubmit = useCallback(
      async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
          onSubmit(formData);
          onClose();
        } catch (error) {
          console.error("Lỗi khi lưu sách:", error);
        } finally {
          setIsSubmitting(false);
        }
      },
      [formData, validateForm, onSubmit, onClose],
    );

    return (
      <div className="fixed inset-0 bg-gray-900/25 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-lg">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-xl font-bold text-gray-800">
              {book ? "Chỉnh sửa sách" : "Thêm sách mới"}
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
                  Tên sách
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
                  Tác giả
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
                  Mô tả
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
                  Mã ISBN
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
                  Thể loại
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
                  Giá (VNĐ)
                </label>
                <input
                  type="number"
                  name="price"
                  step="1000"
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
                  Số lượng
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
                  Năm xuất bản
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
                  Ảnh bìa sách
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center mb-3">
                      <label
                        htmlFor="coverImageFile"
                        className="cursor-pointer flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 w-full"
                      >
                        <FiUpload className="mr-2" />
                        {isUploading
                          ? "Đang tải lên..."
                          : "Upload ảnh từ máy tính"}
                      </label>
                      <input
                        id="coverImageFile"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={isUploading}
                      />
                    </div>

                    <div className="mt-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hoặc nhập đường dẫn ảnh
                      </label>
                      <input
                        type="text"
                        name="coverImage"
                        value={formData.coverImage}
                        onChange={handleChange}
                        className={`w-full p-2 border rounded-lg ${errors.coverImage ? "border-red-500" : "border-gray-300"}`}
                      />
                      {errors.coverImage && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.coverImage}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    {imagePreview ? (
                      <div className="mt-0">
                        <p className="text-sm text-gray-500 mb-2">Xem trước:</p>
                        <div className="relative h-48 w-32 mx-auto border border-gray-200 rounded-md shadow-sm overflow-hidden">
                          <Image
                            src={imagePreview}
                            alt="Ảnh bìa xem trước"
                            className="object-cover"
                            fill
                            sizes="(max-width: 768px) 100vw, 120px"
                            priority={false}
                            loading="lazy"
                            onError={(e) => {
                              (e.target as HTMLImageElement).onerror = null;
                              (e.target as HTMLImageElement).src =
                                "/images/book-placeholder.jpg";
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-48 border border-gray-200 border-dashed rounded-md bg-gray-50">
                        <p className="text-sm text-gray-400">Chưa có ảnh bìa</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isUploading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
              >
                {isSubmitting
                  ? "Đang lưu..."
                  : book
                    ? "Cập nhật sách"
                    : "Thêm sách"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  },
);

BookFormModal.displayName = "BookFormModal";

export default BookFormModal;
