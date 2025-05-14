import { Book } from "../types/book";

// Mock data for books
export const initialBooks: Book[] = [
  {
    id: "1",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    description:
      "A story of wealth, love, and tragedy in the Roaring Twenties.",
    price: 12.99,
    coverImage: "/images/book-placeholder.jpg",
    isbn: "978-3-16-148410-0",
    category: "Classics",
    publishYear: 1925,
    stock: 25,
  },
  {
    id: "2",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    description:
      "A powerful exploration of racial injustice in the American South.",
    price: 14.99,
    coverImage: "/images/book-placeholder.jpg",
    isbn: "978-3-16-148411-7",
    category: "Classics",
    publishYear: 1960,
    stock: 30,
  },
  {
    id: "3",
    title: "Dune",
    author: "Frank Herbert",
    description:
      "An epic science fiction novel set in a distant future amidst a feudal interstellar society.",
    price: 18.95,
    coverImage: "/images/book-placeholder.jpg",
    isbn: "978-3-16-148412-4",
    category: "Science Fiction",
    publishYear: 1965,
    stock: 15,
  },
  {
    id: "4",
    title: "Project Hail Mary",
    author: "Andy Weir",
    description:
      "A lone astronaut must save the earth from disaster in this gripping sci-fi thriller.",
    price: 22.5,
    coverImage: "/images/book-placeholder.jpg",
    isbn: "978-3-16-148413-1",
    category: "Science Fiction",
    publishYear: 2021,
    stock: 40,
  },
  {
    id: "5",
    title: "The Silent Patient",
    author: "Alex Michaelides",
    description:
      "A woman shoots her husband and then never speaks another word.",
    price: 16.99,
    coverImage: "/images/book-placeholder.jpg",
    isbn: "978-3-16-148414-8",
    category: "Thriller",
    publishYear: 2019,
    stock: 20,
  },
  {
    id: "6",
    title: "The Midnight Library",
    author: "Matt Haig",
    description:
      "Between life and death there is a library where every book represents a different life path.",
    price: 19.99,
    coverImage: "/images/book-placeholder.jpg",
    isbn: "978-3-16-148415-5",
    category: "Fantasy",
    publishYear: 2020,
    stock: 35,
  },
];

// Function to reset the store to its initial state (for page refresh)
export const getInitialBooks = (): Book[] => {
  return JSON.parse(JSON.stringify(initialBooks));
};
