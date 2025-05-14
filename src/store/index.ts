import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Book } from "@/types/book";
import { User } from "@/types/user";
import { Order, CartItem } from "@/types/order";
import { getInitialBooks } from "./bookData";
import { getInitialUsers } from "./userData";
import { getInitialOrders } from "./orderData";

// Interface defining the store's state
interface StoreState {
  // Books state
  books: Book[];
  addBook: (book: Omit<Book, "id">) => void;
  updateBook: (book: Book) => void;
  deleteBook: (id: string) => void;
  getBookById: (id: string) => Book | undefined;

  // Users state
  users: User[];
  addUser: (user: Omit<User, "id" | "createdAt" | "updatedAt">) => void;
  updateUser: (user: User) => void;
  deleteUser: (id: string) => void;
  getUserById: (id: string) => User | undefined;
  // Authentication state
  currentUser: User | null;
  login: (email: string) => Promise<User | null>;
  logout: () => void;
  isAuthenticated: boolean;

  // Orders state
  orders: Order[];
  addOrder: (order: Omit<Order, "id" | "createdAt" | "updatedAt">) => string;
  updateOrder: (order: Order) => void;
  deleteOrder: (id: string) => void;
  getOrderById: (id: string) => Order | undefined;
  getOrdersByUserId: (userId: string) => Order[];

  // Cart state
  cart: CartItem[];
  addToCart: (bookId: string, quantity: number) => void;
  updateCartItem: (bookId: string, quantity: number) => void;
  removeFromCart: (bookId: string) => void;
  clearCart: () => void;
  cartTotal: number;
}

// Create the store with Zustand
export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Books implementation
      books: getInitialBooks(),
      addBook: (bookData) =>
        set((state) => {
          const newId = (
            Math.max(...state.books.map((book) => parseInt(book.id)), 0) + 1
          ).toString();
          const newBook = { ...bookData, id: newId };
          return { books: [...state.books, newBook] };
        }),
      updateBook: (updatedBook) =>
        set((state) => ({
          books: state.books.map((book) =>
            book.id === updatedBook.id ? updatedBook : book,
          ),
        })),
      deleteBook: (id) =>
        set((state) => ({
          books: state.books.filter((book) => book.id !== id),
        })),
      getBookById: (id) => get().books.find((book) => book.id === id),

      // Users implementation
      users: getInitialUsers(),
      addUser: (userData) =>
        set((state) => {
          const newId = (
            Math.max(...state.users.map((user) => parseInt(user.id)), 0) + 1
          ).toString();
          const newUser = {
            ...userData,
            id: newId,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          return { users: [...state.users, newUser] };
        }),
      updateUser: (updatedUser) =>
        set((state) => ({
          users: state.users.map((user) =>
            user.id === updatedUser.id
              ? { ...updatedUser, updatedAt: new Date() }
              : user,
          ),
        })),
      deleteUser: (id) =>
        set((state) => ({
          users: state.users.filter((user) => user.id !== id),
        })),
      getUserById: (id) => get().users.find((user) => user.id === id),

      // Auth implementation
      currentUser: null,
      isAuthenticated: false,
      login: async (email) => {
        // For our mock system, we'll just check if the email matches any user
        // In a real system, you would verify the password as well
        const user = get().users.find(
          (u) => u.email.toLowerCase() === email.toLowerCase(),
        );
        if (user) {
          set({ currentUser: user, isAuthenticated: true });
          return user;
        }
        return null;
      },
      logout: () => set({ currentUser: null, isAuthenticated: false }),

      // Orders implementation
      orders: getInitialOrders(),
      addOrder: (orderData) => {
        const newId = `order${get().orders.length + 1}`;
        const newOrder = {
          ...orderData,
          id: newId,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({ orders: [...state.orders, newOrder] }));
        return newId;
      },
      updateOrder: (updatedOrder) =>
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === updatedOrder.id
              ? {
                  ...updatedOrder,
                  updatedAt: new Date(),
                }
              : order,
          ),
        })),
      deleteOrder: (id) =>
        set((state) => ({
          orders: state.orders.filter((order) => order.id !== id),
        })),
      getOrderById: (id) => get().orders.find((order) => order.id === id),
      getOrdersByUserId: (userId) =>
        get().orders.filter((order) => order.userId === userId),

      // Cart implementation
      cart: [],
      addToCart: (bookId, quantity) =>
        set((state) => {
          const existingItem = state.cart.find(
            (item) => item.bookId === bookId,
          );
          if (existingItem) {
            return {
              cart: state.cart.map((item) =>
                item.bookId === bookId
                  ? { ...item, quantity: item.quantity + quantity }
                  : item,
              ),
            };
          } else {
            const book = get().books.find((b) => b.id === bookId);
            if (book) {
              return { cart: [...state.cart, { bookId, book, quantity }] };
            }
            return state;
          }
        }),
      updateCartItem: (bookId, quantity) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.bookId === bookId ? { ...item, quantity } : item,
          ),
        })),
      removeFromCart: (bookId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.bookId !== bookId),
        })),
      clearCart: () => set({ cart: [] }),
      get cartTotal() {
        return get().cart.reduce((total, item) => {
          const book = get().books.find((b) => b.id === item.bookId);
          return total + (book?.price || 0) * item.quantity;
        }, 0);
      },
    }),
    {
      name: "book-store-storage",
      partialize: (state) => ({
        cart: state.cart,
        books: state.books,
        users: state.users,
        orders: state.orders,
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
