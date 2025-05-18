"use client";

import { useState } from "react";
import { FiX, FiUpload, FiAlertTriangle, FiCheck } from "react-icons/fi";
import { useStore } from "@/store/index";
import { Book } from "@/types/book";

interface BatchUpdateModalProps {
  books: Book[];
  onClose: () => void;
}

type UpdateOperation = "add" | "set" | "subtract";
type BookUpdate = {
  isbn: string;
  quantity: number;
  found?: boolean;
};

export default function BatchUpdateModal({
  books,
  onClose,
}: BatchUpdateModalProps) {
  const updateBook = useStore((state) => state.updateBook);
  const [csvContent, setCsvContent] = useState<string>("");
  const [operation, setOperation] = useState<UpdateOperation>("add");
  const [reason, setReason] = useState<string>("");
  const [updates, setUpdates] = useState<BookUpdate[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [step, setStep] = useState<"input" | "preview" | "complete">("input");

  const parseCSV = () => {
    try {
      const lines = csvContent.trim().split("\n");
      const updatesArray: BookUpdate[] = [];

      const startIndex = lines[0].toLowerCase().includes("isbn") ? 1 : 0;

      for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const [isbn, quantityStr] = line.split(",").map((item) => item.trim());
        const quantity = parseInt(quantityStr);

        if (!isbn || isNaN(quantity)) {
          throw new Error(`Dữ liệu không hợp lệ ở dòng ${i + 1}`);
        }

        const bookExists = books.some((book) => book.isbn === isbn);

        updatesArray.push({
          isbn,
          quantity,
          found: bookExists,
        });
      }

      setUpdates(updatesArray);
      setStep("preview");
    } catch (error) {
      console.error("Lỗi khi đọc CSV:", error);
      setError(
        `Lỗi khi đọc CSV: ${error instanceof Error ? error.message : "Lỗi không xác định"}`,
      );
    }
  };

  const handleSubmit = () => {
    if (!reason) {
      setError("Vui lòng nhập lý do cập nhật số lượng");
      return;
    }

    setIsSubmitting(true);

    try {
      const updatedBooks = updates
        .filter((update) => update.found)
        .map((update) => {
          const book = books.find((b) => b.isbn === update.isbn)!;
          let newStock = book.stock;

          if (operation === "add") {
            newStock = book.stock + update.quantity;
          } else if (operation === "subtract") {
            newStock = Math.max(0, book.stock - update.quantity);
          } else if (operation === "set") {
            newStock = Math.max(0, update.quantity);
          }

          updateBook({
            ...book,
            stock: newStock,
          });

          return book.title;
        });

      setSuccess(`Đã cập nhật thành công ${updatedBooks.length} sách.`);
      setStep("complete");
    } catch (error) {
      console.error("Lỗi khi cập nhật số lượng:", error);
      setError("Đã xảy ra lỗi khi cập nhật số lượng");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setCsvContent("");
    setUpdates([]);
    setStep("input");
    setError("");
    setSuccess("");
  };

  return (
    <div className="fixed inset-0 bg-gray-900/25 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto transition-all duration-300 animate-[fadeIn_0.3s_ease-in-out">
      <div className="bg-white rounded-lg w-full max-w-3xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            Cập nhật số lượng hàng loạt
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
            aria-label="Đóng"
            title="Đóng"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 bg-red-50 text-red-700 p-4 rounded-md flex items-start">
              <FiAlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 bg-green-50 text-green-700 p-4 rounded-md flex items-start">
              <FiCheck className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {step === "input" && (
            <div>
              <p className="mb-4 text-gray-600">
                Sử dụng biểu mẫu này để cập nhật số lượng nhiều sách cùng lúc.
                Tải lên tệp CSV hoặc dán nội dung CSV với mã ISBN và số lượng
                sách.
              </p>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thao tác
                </label>
                <select
                  value={operation}
                  onChange={(e) =>
                    setOperation(e.target.value as UpdateOperation)
                  }
                  className="w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  title="Chọn thao tác"
                >
                  <option value="add">Thêm vào số lượng hiện tại</option>
                  <option value="subtract">Trừ từ số lượng hiện tại</option>
                  <option value="set">Đặt số lượng chính xác</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nội dung CSV (Định dạng: ISBN, Số lượng)
                </label>
                <textarea
                  value={csvContent}
                  onChange={(e) => setCsvContent(e.target.value)}
                  placeholder="Nhập nội dung CSV hoặc dán từ Excel..."
                  className="w-full h-60 border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                  title="Nội dung CSV"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Ví dụ: 978-3-16-148410-0,5
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lý do cập nhật
                </label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="VD: Nhập hàng mới, Điều chỉnh tồn kho"
                  className="w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  title="Lý do cập nhật"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={parseCSV}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                >
                  <FiUpload className="mr-2" />
                  Xem trước thay đổi
                </button>
              </div>
            </div>
          )}

          {step === "preview" && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Xem trước thay đổi
                </h3>

                <div className="mb-4">
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="font-medium">
                      Thao tác:{" "}
                      <span className="font-normal">
                        {operation === "add"
                          ? "Thêm vào số lượng hiện tại"
                          : operation === "subtract"
                            ? "Trừ từ số lượng hiện tại"
                            : "Đặt số lượng chính xác"}
                      </span>
                    </p>
                    <p className="font-medium">
                      Lý do: <span className="font-normal">{reason}</span>
                    </p>
                    <p className="font-medium">
                      Số sách cập nhật:{" "}
                      <span className="font-normal">
                        {updates.filter((u) => u.found).length} trên{" "}
                        {updates.length}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="border rounded-md overflow-hidden mb-6">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ISBN
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tên sách
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Hiện tại
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Thay đổi
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Mới
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Trạng thái
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {updates.map((update, index) => {
                        const book = books.find((b) => b.isbn === update.isbn);
                        const currentStock = book?.stock || 0;

                        let newStock = currentStock;
                        if (operation === "add") {
                          newStock = currentStock + update.quantity;
                        } else if (operation === "subtract") {
                          newStock = Math.max(
                            0,
                            currentStock - update.quantity,
                          );
                        } else if (operation === "set") {
                          newStock = Math.max(0, update.quantity);
                        }

                        return (
                          <tr
                            key={index}
                            className={!update.found ? "bg-red-50" : ""}
                          >
                            <td className="px-4 py-3 text-sm">{update.isbn}</td>
                            <td className="px-4 py-3 text-sm">
                              {book ? (
                                book.title
                              ) : (
                                <span className="text-red-500">
                                  Không tìm thấy
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm text-right">
                              {book ? currentStock : "N/A"}
                            </td>
                            <td className="px-4 py-3 text-sm text-right">
                              {operation === "add" && "+"}
                              {operation === "subtract" && "-"}
                              {update.quantity}
                            </td>
                            <td className="px-4 py-3 text-sm text-right font-medium">
                              {book ? newStock : "N/A"}
                            </td>
                            <td className="px-4 py-3 text-sm text-center">
                              {!update.found ? (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                  Lỗi
                                </span>
                              ) : (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  Sẵn sàng
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {updates.some((u) => !u.found) && (
                <div className="mb-6 bg-yellow-50 p-4 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <FiAlertTriangle className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        Một số sách không tìm thấy
                      </h3>
                      <p className="mt-2 text-sm text-yellow-700">
                        {updates.filter((u) => !u.found).length} sách với mã
                        ISBN đã cung cấp không tìm thấy trong kho. Chỉ những
                        sách tìm thấy mới được cập nhật.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-4">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Quay lại
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={
                    isSubmitting || updates.filter((u) => u.found).length === 0
                  }
                  className={`px-4 py-2 rounded-md text-white flex items-center ${
                    isSubmitting || updates.filter((u) => u.found).length === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isSubmitting ? "Đang xử lý..." : "Cập nhật số lượng"}
                </button>
              </div>
            </div>
          )}

          {step === "complete" && (
            <div className="text-center py-8">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <FiCheck className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mt-3 text-lg font-medium text-gray-900">
                Cập nhật số lượng thành công
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Đã cập nhật thành công {updates.filter((u) => u.found).length}{" "}
                sách.
              </p>
              <div className="mt-6">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Đóng
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
