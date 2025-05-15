"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FiChevronRight,
  FiSearch,
  FiStar,
  FiTrendingUp,
  FiClock,
} from "react-icons/fi";
import BookCard from "@/components/BookCard";
import BookCover from "@/components/BookCover";
import { useStore } from "@/store/index";
import MainLayout from "@/components/layout/MainLayout";

export default function Home() {
  const books = useStore((state) => state.books);
  const [featuredBooks, setFeaturedBooks] = useState(books.slice(0, 6));
  const [newReleases, setNewReleases] = useState(books.slice(6, 12));
  const [popularBooks, setPopularBooks] = useState(books.slice(12, 18));
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(books);

  // Hiệu ứng cuộn vào
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fade-in", "animate-slide-up");
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );

    document.querySelectorAll(".animate-on-scroll").forEach((element) => {
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  // Xử lý tìm kiếm
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);

    // Tìm kiếm sách dựa trên tiêu đề, tác giả hoặc thể loại
    const results = books.filter(
      (book) =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.category.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    setSearchResults(results);
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-700 to-indigo-800 text-white">
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div
            className="absolute inset-0 bg-repeat"
            style={{ backgroundImage: "url('/images/book-pattern.png')" }}
          ></div>
        </div>
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">
              Khám phá thế giới qua từng trang sách
            </h1>
            <p
              className="text-lg md:text-xl mb-8 text-blue-100 animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              Hàng ngàn đầu sách đa dạng thể loại, từ sách mới nhất đến những
              tác phẩm kinh điển
            </p>

            {/* Search Bar */}
            <form
              onSubmit={handleSearch}
              className="relative max-w-2xl mx-auto animate-fade-in"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="flex items-center bg-white rounded-full overflow-hidden shadow-lg transition-all focus-within:ring-2 focus-within:ring-blue-400">
                <input
                  type="text"
                  placeholder="Tìm kiếm sách theo tên, tác giả hoặc thể loại..."
                  className="w-full px-6 py-4 text-gray-800 focus:outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 transition-colors"
                >
                  <FiSearch className="h-5 w-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Search Results */}
        {isSearching && (
          <div className="mb-12 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Kết quả tìm kiếm: {searchResults.length} sách
              </h2>
              <button
                onClick={() => setIsSearching(false)}
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                Quay lại
              </button>
            </div>

            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {searchResults.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-600 mb-4">
                  Không tìm thấy sách phù hợp với từ khóa "{searchQuery}"
                </p>
                <p className="text-sm text-gray-500">
                  Hãy thử tìm kiếm với từ khóa khác
                </p>
              </div>
            )}
          </div>
        )}

        {!isSearching && (
          <>
            {/* Featured Books */}
            <section className="mb-16 animate-on-scroll opacity-0">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <FiStar className="mr-2 text-yellow-500" /> Sách nổi bật
                </h2>
                <Link
                  href="/store/featured"
                  className="text-blue-600 hover:text-blue-800 flex items-center transition-colors"
                >
                  Xem tất cả <FiChevronRight className="ml-1" />
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {featuredBooks.map((book) => (
                  <div
                    key={book.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden h-48 transform transition-transform hover:scale-105"
                  >
                    <BookCover
                      src={book.coverImage}
                      alt={book.title}
                      width={150}
                      height={200}
                      className="w-full h-full"
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* New Releases */}
            <section className="mb-16 animate-on-scroll opacity-0">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <FiClock className="mr-2 text-green-500" /> Sách mới phát hành
                </h2>
                <Link
                  href="/store/new-releases"
                  className="text-blue-600 hover:text-blue-800 flex items-center transition-colors"
                >
                  Xem tất cả <FiChevronRight className="ml-1" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {newReleases.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            </section>

            {/* Popular Books */}
            <section className="mb-16 animate-on-scroll opacity-0">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <FiTrendingUp className="mr-2 text-red-500" /> Sách phổ biến
                </h2>
                <Link
                  href="/store/popular"
                  className="text-blue-600 hover:text-blue-800 flex items-center transition-colors"
                >
                  Xem tất cả <FiChevronRight className="ml-1" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {popularBooks.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            </section>

            {/* Categories */}
            <section className="animate-on-scroll opacity-0">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Thể loại sách
                </h2>
                <Link
                  href="/store/categories"
                  className="text-blue-600 hover:text-blue-800 flex items-center transition-colors"
                >
                  Xem tất cả <FiChevronRight className="ml-1" />
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  {
                    name: "Văn học",
                    icon: "📚",
                    color: "bg-blue-100 text-blue-800",
                  },
                  {
                    name: "Kinh tế",
                    icon: "💼",
                    color: "bg-green-100 text-green-800",
                  },
                  {
                    name: "Khoa học",
                    icon: "🔬",
                    color: "bg-purple-100 text-purple-800",
                  },
                  {
                    name: "Thiếu nhi",
                    icon: "🧸",
                    color: "bg-yellow-100 text-yellow-800",
                  },
                  {
                    name: "Lịch sử",
                    icon: "🏛️",
                    color: "bg-red-100 text-red-800",
                  },
                  {
                    name: "Tâm lý",
                    icon: "🧠",
                    color: "bg-indigo-100 text-indigo-800",
                  },
                  {
                    name: "Kỹ năng sống",
                    icon: "🌱",
                    color: "bg-teal-100 text-teal-800",
                  },
                  {
                    name: "Ngoại ngữ",
                    icon: "🌍",
                    color: "bg-orange-100 text-orange-800",
                  },
                ].map((category, index) => (
                  <Link
                    key={index}
                    href={`/store/categories/${category.name.toLowerCase()}`}
                    className={`${category.color} p-6 rounded-lg flex items-center justify-center flex-col text-center transform transition-transform hover:scale-105`}
                  >
                    <span className="text-4xl mb-2">{category.icon}</span>
                    <span className="font-medium">{category.name}</span>
                  </Link>
                ))}
              </div>
            </section>
          </>
        )}
      </div>

      {/* Newsletter Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16 mt-12 animate-on-scroll opacity-0">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Đăng ký nhận thông tin</h2>
            <p className="mb-8 text-blue-100">
              Nhận thông báo về sách mới, khuyến mãi và sự kiện đặc biệt
            </p>
            <form className="flex flex-col sm:flex-row gap-2 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Email của bạn"
                className="flex-1 px-4 py-3 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-white text-blue-600 rounded-md hover:bg-blue-50 transition-colors font-medium"
              >
                Đăng ký
              </button>
            </form>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
