"use client";

import { useState } from "react";
import { FiX, FiDownload, FiUpload, FiInfo } from "react-icons/fi";
import { useStore } from "@/store/index";
import { Book } from "@/types/book";

interface BatchUpdateModalProps {
  onClose: () => void;
}

export default function BatchUpdateModal({ onClose }: BatchUpdateModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const updateBookStock = useStore((state) => state.updateBookStock);
  const books = useStore((state) => state.books);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Vui lòng chọn file CSV để tải lên");
      return;
    }

    setIsUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const content = await readFileContent(file);
      const result = parseCSV(content);

      if (result.success) {
        // Cập nhật số lượng sách
        let updatedCount = 0;
        result.data.forEach((item) => {
          if (item.id && item.stock !== undefined) {
            updateBookStock(item.id, item.stock);
            updatedCount++;
          }
        });

        setSuccess(`Đã cập nhật thành công ${updatedCount} sản phẩm`);
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setError(result.error || "Lỗi khi xử lý file CSV");
      }
    } catch (err) {
      setError(
        "Lỗi khi đọc file: " +
          (err instanceof Error ? err.message : String(err)),
      );
    } finally {
      setIsUploading(false);
    }
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          resolve(event.target.result as string);
        } else {
          reject(new Error("Không thể đọc file"));
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  };

  const parseCSV = (
    content: string,
  ): { success: boolean; data: Partial<Book>[]; error?: string } => {
    try {
      const lines = content.split("\n");
      if (lines.length < 2) {
        return { success: false, data: [], error: "File không có dữ liệu" };
      }

      const headers = lines[0].split(",").map((h) => h.trim());
      const idIndex = headers.indexOf("ID");
      const stockIndex = headers.indexOf("Stock");

      if (idIndex === -1 || stockIndex === -1) {
        return {
          success: false,
          data: [],
          error: "File CSV phải có cột ID và Stock",
        };
      }

      const data: Partial<Book>[] = [];
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;

        const values = lines[i].split(",").map((v) => v.trim());
        const id = values[idIndex];
        const stockStr = values[stockIndex];

        if (!id) continue;

        const stock = parseInt(stockStr);
        if (isNaN(stock)) {
          return {
            success: false,
            data: [],
            error: `Giá trị Stock không hợp lệ ở dòng ${i + 1}`,
          };
        }

        data.push({ id, stock });
      }

      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        data: [],
        error:
          "Lỗi khi phân tích file CSV: " +
          (error instanceof Error ? error.message : String(error)),
      };
    }
  };

  const downloadTemplate = () => {
    // Tạo nội dung cho template CSV
    const headers = ["ID", "Title", "Author", "Current Stock", "Stock"];

    // Thêm một số sách từ kho dữ liệu làm ví dụ
    const exampleBooks = books.slice(0, 5).map((book) => [
      book.id,
      book.title,
      book.author,
      book.stock,
      book.stock, // Giá trị stock mới (ban đầu giống giá trị hiện tại)
    ]);

    const csvContent = [
      headers.join(","),
      ...exampleBooks.map((row) => row.join(",")),
    ].join("\n");

    // Tạo và tải xuống file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "inventory_update_template.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="modal-backdrop">
      <div className="bg-white rounded-lg w-full max-w-lg animate-fade-in animate-slide-up">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            Cập nhật số lượng hàng loạt
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiInfo className="h-5 w-5 text-blue-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  Tải lên file CSV có cột ID và Stock để cập nhật số lượng sách
                  hàng loạt. Bạn có thể tải xuống mẫu để điền thông tin.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={downloadTemplate}
            className="mb-6 w-full flex items-center justify-center px-4 py-2 border border-blue-500 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
          >
            <FiDownload className="mr-2" />
            Tải xuống mẫu CSV
          </button>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chọn file CSV
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-500 transition-colors">
                <div className="space-y-1 text-center">
                  <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                    >
                      <span>Tải lên file CSV</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        accept=".csv"
                        className="sr-only"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="pl-1">hoặc kéo thả vào đây</p>
                  </div>
                  <p className="text-xs text-gray-500">CSV tối đa 10MB</p>
                </div>
              </div>
              {file && (
                <p className="mt-2 text-sm text-gray-600">
                  File đã chọn: {file.name}
                </p>
              )}
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 text-green-700 text-sm">
                {success}
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={!file || isUploading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-400 relative overflow-hidden group"
              >
                <span className="relative z-10">
                  {isUploading ? "Đang xử lý..." : "Cập nhật"}
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
