"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Book } from "../types/book";
import { getInitialBooks } from "./bookData";

interface BookStoreContextType {
  books: Book[];
  addBook: (book: Omit<Book, "id">) => void;
  updateBook: (book: Book) => void;
  deleteBook: (id: string) => void;
  getBookById: (id: string) => Book | undefined;
}

const BookStoreContext = createContext<BookStoreContextType | undefined>(
  undefined,
);

export const useBookStore = () => {
  const context = useContext(BookStoreContext);
  if (context === undefined) {
    throw new Error("useBookStore must be used within a BookStoreProvider");
  }
  return context;
};

interface BookStoreProviderProps {
  children: ReactNode;
}

export const BookStoreProvider: React.FC<BookStoreProviderProps> = ({
  children,
}) => {
  const [books, setBooks] = useState<Book[]>(getInitialBooks());

  const addBook = (bookData: Omit<Book, "id">) => {
    const newId = (
      Math.max(...books.map((book) => parseInt(book.id)), 0) + 1
    ).toString();
    const newBook = { ...bookData, id: newId };
    setBooks((prevBooks) => [...prevBooks, newBook]);
  };

  const updateBook = (updatedBook: Book) => {
    setBooks((prevBooks) =>
      prevBooks.map((book) =>
        book.id === updatedBook.id ? updatedBook : book,
      ),
    );
  };

  const deleteBook = (id: string) => {
    setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
  };

  const getBookById = (id: string) => {
    return books.find((book) => book.id === id);
  };

  const value = {
    books,
    addBook,
    updateBook,
    deleteBook,
    getBookById,
  };

  return (
    <BookStoreContext.Provider value={value}>
      {children}
    </BookStoreContext.Provider>
  );
};
