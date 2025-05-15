"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Book } from "../types/book";
import { CartItem } from "../types/order";
import { getInitialBooks } from "./bookData";

interface BookStoreContextType {
  books: Book[];
  cart: CartItem[];
  addToCart: (bookId: string, quantity: number) => void;
  removeFromCart: (bookId: string) => void;
  updateCartQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  getBookById: (id: string) => Book | undefined;
  getCartItemsWithDetails: () => (CartItem & { book: Book | undefined })[];
}

const BookStoreContext = createContext<BookStoreContextType | undefined>(
  undefined,
);

export function BookStoreProvider({ children }: { children: ReactNode }) {
  const [books, setBooks] = useState<Book[]>(getInitialBooks());
  const [cart, setCart] = useState<CartItem[]>([]);

  const getBookById = (id: string): Book | undefined => {
    return books.find((book) => book.id === id);
  };

  const addToCart = (bookId: string, quantity: number) => {
    const book = getBookById(bookId);
    if (!book) return;

    // Kiểm tra tồn kho
    if (book.stock < quantity) {
      alert("Số lượng vượt quá tồn kho!");
      return;
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.bookId === bookId);

      if (existingItem) {
        // Kiểm tra tổng số lượng sau khi thêm
        const newQuantity = existingItem.quantity + quantity;
        if (book.stock < newQuantity) {
          alert("Tổng số lượng vượt quá tồn kho!");
          return prevCart;
        }

        return prevCart.map((item) =>
          item.bookId === bookId
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      } else {
        return [...prevCart, { bookId, quantity }];
      }
    });
  };

  const removeFromCart = (bookId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.bookId !== bookId));
  };

  const updateCartQuantity = (bookId: string, quantity: number) => {
    const book = getBookById(bookId);
    if (!book) return;

    // Kiểm tra tồn kho
    if (book.stock < quantity) {
      alert("Số lượng vượt quá tồn kho!");
      return;
    }

    if (quantity <= 0) {
      removeFromCart(bookId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.bookId === bookId ? { ...item, quantity } : item,
      ),
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = (): number => {
    return cart.reduce((total, item) => {
      const book = books.find((book) => book.id === item.bookId);
      return total + (book?.price || 0) * item.quantity;
    }, 0);
  };

  const getCartItemCount = (): number => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartItemsWithDetails = () => {
    return cart.map((item) => {
      const book = books.find((b) => b.id === item.bookId);
      return {
        ...item,
        book,
      };
    });
  };

  return (
    <BookStoreContext.Provider
      value={{
        books,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        getCartTotal,
        getCartItemCount,
        getBookById,
        getCartItemsWithDetails,
      }}
    >
      {children}
    </BookStoreContext.Provider>
  );
}

export function useBookStore() {
  const context = useContext(BookStoreContext);
  if (context === undefined) {
    throw new Error("useBookStore must be used within a BookStoreProvider");
  }
  return context;
}
