"use client";

import { useState } from "react";
import { FiX, FiAlertTriangle, FiBell, FiSettings } from "react-icons/fi";
import { Book } from "@/types/book";

interface StockAlertsModalProps {
  books: Book[];
  onClose: () => void;
}

export default function StockAlertsModal({
  books,
  onClose,
}: StockAlertsModalProps) {
  const [threshold, setThreshold] = useState<number>(5);
  const [emailNotifications, setEmailNotifications] = useState<boolean>(true);
  const [dashboardNotifications, setDashboardNotifications] =
    useState<boolean>(true);
  const [autoReorder, setAutoReorder] = useState<boolean>(false);

  // Get low stock books based on threshold
  const lowStockBooks = books.filter(
    (book) => book.stock > 0 && book.stock <= threshold,
  );
  const outOfStockBooks = books.filter((book) => book.stock === 0);

  const handleSaveSettings = () => {
    // In a real application, we would save these settings to user preferences or a database
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            Stock Alert Settings
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Alert Settings
              </h3>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Low Stock Threshold
                </label>
                <div className="flex items-center">
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={threshold}
                    onChange={(e) => setThreshold(parseInt(e.target.value))}
                    className="w-full mr-4"
                  />
                  <span className="w-8 text-center font-medium">
                    {threshold}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Books with stock below this number will trigger alerts
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    id="email-notifications"
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={() => setEmailNotifications(!emailNotifications)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="email-notifications"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Email notifications
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="dashboard-notifications"
                    type="checkbox"
                    checked={dashboardNotifications}
                    onChange={() =>
                      setDashboardNotifications(!dashboardNotifications)
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="dashboard-notifications"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Dashboard notifications
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="auto-reorder"
                    type="checkbox"
                    checked={autoReorder}
                    onChange={() => setAutoReorder(!autoReorder)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="auto-reorder"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Auto-reorder when stock is low
                  </label>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Current Alerts
                </h3>
                <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                  {lowStockBooks.length + outOfStockBooks.length} alerts
                </span>
              </div>

              <div className="border rounded-md overflow-hidden">
                <div className="max-h-60 overflow-y-auto">
                  {outOfStockBooks.length > 0 && (
                    <div className="bg-red-50 p-3">
                      <div className="flex items-center">
                        <FiAlertTriangle className="text-red-600 mr-2" />
                        <h4 className="text-sm font-medium text-red-800">
                          Out of Stock ({outOfStockBooks.length})
                        </h4>
                      </div>
                      <ul className="mt-2 text-sm">
                        {outOfStockBooks.slice(0, 3).map((book) => (
                          <li key={book.id} className="py-1">
                            {book.title}{" "}
                            <span className="text-red-600 font-medium">
                              ({book.stock} in stock)
                            </span>
                          </li>
                        ))}
                        {outOfStockBooks.length > 3 && (
                          <li className="py-1 text-gray-500">
                            +{outOfStockBooks.length - 3} more books
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  {lowStockBooks.length > 0 && (
                    <div className="bg-yellow-50 p-3">
                      <div className="flex items-center">
                        <FiAlertTriangle className="text-yellow-600 mr-2" />
                        <h4 className="text-sm font-medium text-yellow-800">
                          Low Stock ({lowStockBooks.length})
                        </h4>
                      </div>
                      <ul className="mt-2 text-sm">
                        {lowStockBooks.slice(0, 3).map((book) => (
                          <li key={book.id} className="py-1">
                            {book.title}{" "}
                            <span className="text-yellow-600 font-medium">
                              ({book.stock} in stock)
                            </span>
                          </li>
                        ))}
                        {lowStockBooks.length > 3 && (
                          <li className="py-1 text-gray-500">
                            +{lowStockBooks.length - 3} more books
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  {lowStockBooks.length === 0 &&
                    outOfStockBooks.length === 0 && (
                      <div className="bg-green-50 p-3">
                        <div className="flex items-center">
                          <FiAlertTriangle className="text-green-600 mr-2" />
                          <h4 className="text-sm font-medium text-green-800">
                            No alerts
                          </h4>
                        </div>
                        <p className="mt-2 text-sm text-green-600">
                          All books have sufficient stock levels.
                        </p>
                      </div>
                    )}
                </div>
              </div>

              {(lowStockBooks.length > 0 || outOfStockBooks.length > 0) && (
                <div className="mt-4 flex justify-end">
                  <button className="text-blue-600 hover:text-blue-500 text-sm font-medium flex items-center">
                    <FiBell className="mr-1" /> Generate reorder report
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveSettings}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            >
              <FiSettings className="mr-2" />
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
