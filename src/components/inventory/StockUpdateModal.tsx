"use client";

import { useState } from "react";
import { FiX, FiPlus, FiMinus } from "react-icons/fi";
import { useStore } from "@/store/index";
import { Book } from "@/types/book";
import BookCover from "@/components/BookCover";

interface StockUpdateModalProps {
  book: Book;
  onClose: () => void;
}

export default function StockUpdateModal({
  book,
  onClose,
}: StockUpdateModalProps) {
  const updateBook = useStore((state) => state.updateBook);

  const [stockChange, setStockChange] = useState<number>(0);
  const [reason, setReason] = useState<string>("");
  const [operation, setOperation] = useState<"add" | "subtract">("add");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");

  const handleChangeStockAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setStockChange(isNaN(value) ? 0 : Math.max(0, value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (stockChange <= 0) {
      setError("Stock change amount must be greater than 0");
      return;
    }

    if (!reason) {
      setError("Please provide a reason for the stock update");
      return;
    }

    setIsSubmitting(true);

    try {
      // Calculate new stock level
      const newStockLevel =
        operation === "add"
          ? book.stock + stockChange
          : Math.max(0, book.stock - stockChange);

      // Update the book
      updateBook({
        ...book,
        stock: newStockLevel,
      });

      onClose();
    } catch (error) {
      console.error("Error updating stock:", error);
      setError("An error occurred while updating the stock");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Update Stock</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Book info */}
          <div className="flex items-center mb-6">
            <div className="flex-shrink-0 h-16 w-16">
              <BookCover
                src={book.coverImage}
                alt={book.title}
                className="h-16 w-16 rounded-sm"
              />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">
                {book.title}
              </h3>
              <p className="text-sm text-gray-500">{book.author}</p>
              <div className="mt-1">
                <span className="text-sm text-gray-700">Current Stock: </span>
                <span
                  className={`font-medium ${
                    book.stock > 10
                      ? "text-green-600"
                      : book.stock > 0
                        ? "text-yellow-600"
                        : "text-red-600"
                  }`}
                >
                  {book.stock}
                </span>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Operation selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Operation
              </label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="operation"
                    value="add"
                    checked={operation === "add"}
                    onChange={() => setOperation("add")}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2">
                    <FiPlus className="inline mr-1 text-green-500" />
                    Add Stock
                  </span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="operation"
                    value="subtract"
                    checked={operation === "subtract"}
                    onChange={() => setOperation("subtract")}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2">
                    <FiMinus className="inline mr-1 text-red-500" />
                    Remove Stock
                  </span>
                </label>
              </div>
            </div>

            {/* Stock change amount */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity to {operation === "add" ? "Add" : "Remove"}
              </label>
              <input
                type="number"
                min="1"
                step="1"
                value={stockChange}
                onChange={handleChangeStockAmount}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            {/* New stock preview */}
            <div className="mb-4 p-3 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-600">
                New Stock Level:
                <span className="ml-1 font-bold">
                  {operation === "add"
                    ? book.stock + stockChange
                    : Math.max(0, book.stock - stockChange)}
                </span>
              </p>
            </div>

            {/* Reason */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              >
                <option value="">Select a reason...</option>
                {operation === "add" ? (
                  <>
                    <option value="new-shipment">New Shipment</option>
                    <option value="inventory-correction">
                      Inventory Correction
                    </option>
                    <option value="returned-items">Returned Items</option>
                    <option value="other">Other</option>
                  </>
                ) : (
                  <>
                    <option value="damaged">Damaged Books</option>
                    <option value="quality-issues">Quality Issues</option>
                    <option value="inventory-correction">
                      Inventory Correction
                    </option>
                    <option value="other">Other</option>
                  </>
                )}
              </select>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || stockChange <= 0 || !reason}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
              >
                {isSubmitting ? "Updating..." : "Update Stock"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
