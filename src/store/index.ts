import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Book } from "@/types/book";
import { User } from "@/types/user";
import { Order, CartItem } from "@/types/order";
import { getInitialBooks } from "./bookData";
import { getInitialUsers } from "./userData";
import { getInitialOrders } from "./orderData";

// Define the address type
interface Address {
  id: string;
  userId: string;
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

// Define the payment method type
interface PaymentMethod {
  id: string;
  userId: string;
  cardType: string;
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault: boolean;
}

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
  calculateCartTotal: () => number;
  getCartItemCount: () => number;
  getCartItemsWithDetails: () => (CartItem & { book: Book | undefined })[];

  // Address state
  addresses: Address[];
  addAddress: (address: Address) => void;
  updateAddress: (address: Address) => void;
  deleteAddress: (addressId: string) => void;

  // Payment method state
  paymentMethods: PaymentMethod[];
  addPaymentMethod: (paymentMethod: PaymentMethod) => void;
  updatePaymentMethod: (paymentMethod: PaymentMethod) => void;
  deletePaymentMethod: (paymentMethodId: string) => void;
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
      addToCart: (bookId, quantity) => {
        const book = get().getBookById(bookId);
        if (!book) {
          console.error("Book not found");
          return;
        }

        // Kiểm tra số lượng tồn kho
        if (book.stock < quantity) {
          console.error("Not enough stock");
          return;
        }

        set((state) => {
          const existingItem = state.cart.find(
            (item) => item.bookId === bookId,
          );
          if (existingItem) {
            // Kiểm tra nếu số lượng mới vượt quá tồn kho
            const newQuantity = existingItem.quantity + quantity;
            if (book.stock < newQuantity) {
              console.error("Not enough stock for total quantity");
              return state;
            }

            return {
              cart: state.cart.map((item) =>
                item.bookId === bookId
                  ? { ...item, quantity: newQuantity }
                  : item,
              ),
            };
          } else {
            return { cart: [...state.cart, { bookId, quantity }] };
          }
        });
      },
      updateCartItem: (bookId, quantity) => {
        const book = get().getBookById(bookId);
        if (!book) {
          console.error("Book not found");
          return;
        }

        // Kiểm tra số lượng tồn kho
        if (book.stock < quantity) {
          console.error("Not enough stock");
          return;
        }

        set((state) => ({
          cart: state.cart.map((item) =>
            item.bookId === bookId ? { ...item, quantity } : item,
          ),
        }));
      },
      removeFromCart: (bookId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.bookId !== bookId),
        })),
      clearCart: () => set({ cart: [] }),
      calculateCartTotal: () => {
        const { cart, books } = get();
        return cart.reduce((total, item) => {
          const book = books.find((b) => b.id === item.bookId);
          return total + (book?.price || 0) * item.quantity;
        }, 0);
      },
      getCartItemCount: () => {
        return get().cart.reduce((total, item) => total + item.quantity, 0);
      },
      getCartItemsWithDetails: () => {
        const { cart, books } = get();
        return cart.map((item) => {
          const book = books.find((b) => b.id === item.bookId);
          return {
            ...item,
            book,
          };
        });
      },

      // Address implementation
      addresses: [
        {
          id: "addr1",
          userId: "user1",
          fullName: "John Doe",
          addressLine1: "123 Main St",
          city: "Anytown",
          state: "CA",
          postalCode: "12345",
          country: "USA",
          isDefault: true,
        },
        {
          id: "addr2",
          userId: "user1",
          fullName: "John Doe",
          addressLine1: "456 Work Ave",
          addressLine2: "Suite 500",
          city: "Business City",
          state: "NY",
          postalCode: "67890",
          country: "USA",
          isDefault: false,
        },
      ],
      addAddress: (address) =>
        set((state) => ({ addresses: [...state.addresses, address] })),
      updateAddress: (address) =>
        set((state) => ({
          addresses: state.addresses.map((a) =>
            a.id === address.id ? address : a,
          ),
        })),
      deleteAddress: (addressId) =>
        set((state) => ({
          addresses: state.addresses.filter((a) => a.id !== addressId),
        })),

      // Payment method implementation
      paymentMethods: [
        {
          id: "pm1",
          userId: "user1",
          cardType: "Visa",
          last4: "4242",
          expiryMonth: "12",
          expiryYear: "2025",
          isDefault: true,
        },
        {
          id: "pm2",
          userId: "user1",
          cardType: "Mastercard",
          last4: "5678",
          expiryMonth: "06",
          expiryYear: "2024",
          isDefault: false,
        },
      ],
      addPaymentMethod: (paymentMethod) =>
        set((state) => ({
          paymentMethods: [...state.paymentMethods, paymentMethod],
        })),
      updatePaymentMethod: (paymentMethod) =>
        set((state) => ({
          paymentMethods: state.paymentMethods.map((p) =>
            p.id === paymentMethod.id ? paymentMethod : p,
          ),
        })),
      deletePaymentMethod: (paymentMethodId) =>
        set((state) => ({
          paymentMethods: state.paymentMethods.filter(
            (p) => p.id !== paymentMethodId,
          ),
        })),
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
