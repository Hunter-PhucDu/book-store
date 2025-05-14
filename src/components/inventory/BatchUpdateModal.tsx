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
      // Skip header row if it exists and parse CSV content
      const lines = csvContent.trim().split("\n");
      const updatesArray: BookUpdate[] = [];

      // Start from index 0 or 1 depending on if there's a header
      const startIndex = lines[0].toLowerCase().includes("isbn") ? 1 : 0;

      for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const [isbn, quantityStr] = line.split(",").map((item) => item.trim());
        const quantity = parseInt(quantityStr);

        if (!isbn || isNaN(quantity)) {
          throw new Error(`Invalid data format in line ${i + 1}`);
        }

        // Check if book with ISBN exists in our inventory
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
      console.error("Error parsing CSV:", error);
      setError(
        `Error parsing CSV: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  };

  const handleSubmit = () => {
    if (!reason) {
      setError("Please provide a reason for the stock update");
      return;
    }

    setIsSubmitting(true);

    try {
      // Process all valid book updates
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

          // Update the book with new stock level
          updateBook({
            ...book,
            stock: newStock,
          });

          return book.title;
        });

      setSuccess(`Successfully updated ${updatedBooks.length} books.`);
      setStep("complete");
    } catch (error) {
      console.error("Error updating stock:", error);
      setError("An error occurred while updating the stock");
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            Batch Update Stock
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
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
                Use this form to update multiple books at once. Upload a CSV
                file or paste CSV content with book ISBN and quantity.
              </p>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Operation
                </label>
                <select
                  value={operation}
                  onChange={(e) =>
                    setOperation(e.target.value as UpdateOperation)
                  }
                  className="w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="add">Add to current stock</option>
                  <option value="subtract">Subtract from current stock</option>
                  <option value="set">Set stock to exact value</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CSV Content (Format: ISBN,Quantity)
                </label>
                <textarea
                  value={csvContent}
                  onChange={(e) => setCsvContent(e.target.value)}
                  placeholder="Enter CSV content or paste from Excel..."
                  className="w-full h-60 border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Example: 978-3-16-148410-0,5
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for Update
                </label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g., New shipment received, Inventory correction"
                  className="w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={parseCSV}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                >
                  <FiUpload className="mr-2" />
                  Preview Updates
                </button>
              </div>
            </div>
          )}

          {step === "preview" && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Update Preview
                </h3>

                <div className="mb-4">
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="font-medium">
                      Operation:{" "}
                      <span className="font-normal">
                        {operation === "add"
                          ? "Add to current stock"
                          : operation === "subtract"
                            ? "Subtract from current stock"
                            : "Set stock to exact value"}
                      </span>
                    </p>
                    <p className="font-medium">
                      Reason: <span className="font-normal">{reason}</span>
                    </p>
                    <p className="font-medium">
                      Books to update:{" "}
                      <span className="font-normal">
                        {updates.filter((u) => u.found).length} of{" "}
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
                          Title
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Current
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Change
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          New
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
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
                                <span className="text-red-500">Not found</span>
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
                                  Error
                                </span>
                              ) : (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  Ready
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
                        Some books were not found
                      </h3>
                      <p className="mt-2 text-sm text-yellow-700">
                        {updates.filter((u) => !u.found).length} books with the
                        provided ISBNs were not found in your inventory. Only
                        found books will be updated.
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
                  Back
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
                  {isSubmitting ? "Processing..." : "Update Stock"}
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
                Stock Updated Successfully
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                {updates.filter((u) => u.found).length} books have been updated
                successfully.
              </p>
              <div className="mt-6">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
