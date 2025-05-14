"use client";

import { useState } from "react";
import {
  FiX,
  FiDownload,
  FiCalendar,
  FiArrowUp,
  FiArrowDown,
} from "react-icons/fi";
import { Book } from "@/types/book";

interface InventoryHistoryModalProps {
  books: Book[];
  onClose: () => void;
}

// Mock inventory history data - in a real app, this would come from a database
interface InventoryChange {
  id: string;
  bookId: string;
  bookTitle: string;
  previousStock: number;
  newStock: number;
  change: number;
  reason: string;
  timestamp: Date;
  updatedBy: string;
}

// Generate mock inventory history data
const generateMockHistory = (books: Book[]): InventoryChange[] => {
  const history: InventoryChange[] = [];
  const reasons = [
    "New shipment",
    "Inventory correction",
    "Customer return",
    "Damaged items",
    "Sales adjustment",
  ];
  const users = ["John Doe", "Jane Smith", "Admin User"];

  // Generate random changes for each book (1-3 changes per book)
  books.slice(0, 10).forEach((book) => {
    const changesCount = Math.floor(Math.random() * 3) + 1;

    for (let i = 0; i < changesCount; i++) {
      const change = Math.floor(Math.random() * 10) - 5; // Random change between -5 and +5
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30)); // Random date within last 30 days

      history.push({
        id: `change-${history.length + 1}`,
        bookId: book.id,
        bookTitle: book.title,
        previousStock: book.stock - change,
        newStock: book.stock,
        change,
        reason: reasons[Math.floor(Math.random() * reasons.length)],
        timestamp: date,
        updatedBy: users[Math.floor(Math.random() * users.length)],
      });
    }
  });

  // Sort by timestamp (newest first)
  return history.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

export default function InventoryHistoryModal({
  books,
  onClose,
}: InventoryHistoryModalProps) {
  const inventoryHistory = generateMockHistory(books);

  const [dateFilter, setDateFilter] = useState<
    "all" | "7days" | "30days" | "90days"
  >("30days");
  const [sortField, setSortField] =
    useState<keyof InventoryChange>("timestamp");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [bookFilter, setBookFilter] = useState<string>("all");

  // Apply filters
  const filteredHistory = inventoryHistory.filter((item) => {
    if (dateFilter === "7days") {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      if (item.timestamp < sevenDaysAgo) return false;
    } else if (dateFilter === "30days") {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      if (item.timestamp < thirtyDaysAgo) return false;
    } else if (dateFilter === "90days") {
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
      if (item.timestamp < ninetyDaysAgo) return false;
    }

    if (bookFilter !== "all" && item.bookId !== bookFilter) {
      return false;
    }

    return true;
  });

  // Apply sorting
  const sortedHistory = [...filteredHistory].sort((a, b) => {
    const fieldA = a[sortField];
    const fieldB = b[sortField];

    if (typeof fieldA === "number" && typeof fieldB === "number") {
      return sortDirection === "asc" ? fieldA - fieldB : fieldB - fieldA;
    }

    if (fieldA instanceof Date && fieldB instanceof Date) {
      return sortDirection === "asc"
        ? fieldA.getTime() - fieldB.getTime()
        : fieldB.getTime() - fieldA.getTime();
    }

    const strA = String(fieldA);
    const strB = String(fieldB);
    return sortDirection === "asc"
      ? strA.localeCompare(strB)
      : strB.localeCompare(strA);
  });

  const handleSort = (field: keyof InventoryChange) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const exportToCsv = () => {
    // Create CSV content
    let csvContent =
      "Book Title,Previous Stock,New Stock,Change,Reason,Date,Updated By\n";

    sortedHistory.forEach((item) => {
      const row = [
        `"${item.bookTitle}"`,
        item.previousStock,
        item.newStock,
        item.change,
        `"${item.reason}"`,
        item.timestamp.toLocaleDateString(),
        `"${item.updatedBy}"`,
      ];
      csvContent += row.join(",") + "\n";
    });

    // Create a blob and download link
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute(
      "download",
      `inventory_history_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            Inventory Change History
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 overflow-hidden flex-grow flex flex-col">
          <div className="flex flex-wrap gap-4 mb-6 items-center">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time Period
              </label>
              <div className="inline-flex shadow-sm rounded-md">
                <button
                  className={`px-4 py-2 text-sm ${
                    dateFilter === "7days"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  } border border-gray-300 rounded-l-md`}
                  onClick={() => setDateFilter("7days")}
                >
                  7 Days
                </button>
                <button
                  className={`px-4 py-2 text-sm ${
                    dateFilter === "30days"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  } border-t border-b border-gray-300`}
                  onClick={() => setDateFilter("30days")}
                >
                  30 Days
                </button>
                <button
                  className={`px-4 py-2 text-sm ${
                    dateFilter === "90days"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  } border-t border-b border-gray-300`}
                  onClick={() => setDateFilter("90days")}
                >
                  90 Days
                </button>
                <button
                  className={`px-4 py-2 text-sm ${
                    dateFilter === "all"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  } border border-gray-300 rounded-r-md`}
                  onClick={() => setDateFilter("all")}
                >
                  All Time
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="book-filter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Book
              </label>
              <select
                id="book-filter"
                value={bookFilter}
                onChange={(e) => setBookFilter(e.target.value)}
                className="block w-64 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="all">All Books</option>
                {books.map((book) => (
                  <option key={book.id} value={book.id}>
                    {book.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="ml-auto">
              <button
                onClick={exportToCsv}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FiDownload className="-ml-1 mr-2 h-5 w-5" />
                Export to CSV
              </button>
            </div>
          </div>

          <div className="flex-grow overflow-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("bookTitle")}
                  >
                    Book
                    {sortField === "bookTitle" &&
                      (sortDirection === "asc" ? (
                        <FiArrowUp className="inline-block ml-1" />
                      ) : (
                        <FiArrowDown className="inline-block ml-1" />
                      ))}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("change")}
                  >
                    Stock Change
                    {sortField === "change" &&
                      (sortDirection === "asc" ? (
                        <FiArrowUp className="inline-block ml-1" />
                      ) : (
                        <FiArrowDown className="inline-block ml-1" />
                      ))}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Stock Level
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("reason")}
                  >
                    Reason
                    {sortField === "reason" &&
                      (sortDirection === "asc" ? (
                        <FiArrowUp className="inline-block ml-1" />
                      ) : (
                        <FiArrowDown className="inline-block ml-1" />
                      ))}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("timestamp")}
                  >
                    Date
                    {sortField === "timestamp" &&
                      (sortDirection === "asc" ? (
                        <FiArrowUp className="inline-block ml-1" />
                      ) : (
                        <FiArrowDown className="inline-block ml-1" />
                      ))}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Updated By
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedHistory.length > 0 ? (
                  sortedHistory.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.bookTitle}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.change > 0
                              ? "bg-green-100 text-green-800"
                              : item.change < 0
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {item.change > 0 ? "+" : ""}
                          {item.change}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.previousStock} → {item.newStock}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.reason}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <FiCalendar className="mr-1.5 h-4 w-4 text-gray-400" />
                          {item.timestamp.toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.updatedBy}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No inventory changes found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="px-6 py-4 border-t">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Showing {sortedHistory.length} inventory changes
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
