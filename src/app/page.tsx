import Link from "next/link";
import MainLayout from "@/components/layout/MainLayout";
import {
  FiBook,
  FiUsers,
  FiTag,
  FiTruck,
  FiBookmark,
  FiCheckCircle,
} from "react-icons/fi";
import { getInitialBooks } from "@/store/bookData";
import BookCard from "@/components/BookCard";
import BookCover from "@/components/BookCover";
import Image from "next/image";

export default function Home() {
  const allBooks = getInitialBooks();
  const featuredBooks = allBooks.slice(0, 6);
  const newReleases = [...allBooks]
    .sort((a, b) => b.publishYear - a.publishYear)
    .slice(0, 4);

  const getRandomSample = <T,>(arr: T[], n: number): T[] => {
    const result: T[] = [];
    const used = new Set<number>();
    while (result.length < n && used.size < arr.length) {
      const idx = Math.floor(Math.random() * arr.length);
      if (!used.has(idx)) {
        used.add(idx);
        result.push(arr[idx]);
      }
    }
    return result;
  };

  const bestSellers = getRandomSample(allBooks, 4);
  const popularBooks = getRandomSample(allBooks, 3);

  const categories = Array.from(
    new Set(allBooks.map((book) => book.category)),
  ).slice(0, 6);

  return (
    <MainLayout>
      <section className="relative bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-800 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 border-2 border-white rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 border-2 border-white rounded-full"></div>
          <div className="absolute top-1/3 right-1/4 w-32 h-32 border-2 border-white rounded-full"></div>
          <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 right-1/3 w-36 h-36 bg-blue-300 opacity-10 rounded-full blur-xl"></div>
        </div>

        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-20 md:py-32">
            <div className="z-10 text-center md:text-left">
              <div className="inline-flex items-center px-3 py-1 mb-6 bg-white/10 backdrop-blur-sm rounded-full">
                <span className="text-amber-300 mr-2">✨</span>
                <span className="text-white text-sm font-medium">
                  Thế giới sách chọn lọc
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white">
                Khám Phá <span className="text-amber-300">Câu Chuyện</span>{" "}
                <br className="hidden md:block" /> Tiếp Theo Của Bạn
              </h1>

              <p className="text-lg md:text-xl text-white/90 mb-8 max-w-xl mx-auto md:mx-0">
                Trải nghiệm hành trình đọc sách với bộ sưu tập chọn lọc từ khắp
                nơi trên thế giới. Mỗi trang sách là một chuyến phiêu lưu mới.
              </p>

              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <Link
                  href="/store"
                  className="bg-amber-400 hover:bg-amber-500 text-gray-900 px-8 py-4 rounded-lg font-semibold transition-all hover:shadow-lg inline-flex items-center"
                >
                  <FiBook className="mr-2" /> Khám phá ngay
                </Link>
                <Link
                  href="/signup"
                  className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/30 px-8 py-4 rounded-lg font-semibold transition-all"
                >
                  Đăng ký thành viên
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-12 grid grid-cols-3 gap-4">
                <div className="text-center backdrop-blur-sm bg-white/5 rounded-lg p-3">
                  <p className="text-2xl font-bold text-amber-300">5000+</p>
                  <p className="text-sm text-white/80">Đầu sách</p>
                </div>
                <div className="text-center backdrop-blur-sm bg-white/5 rounded-lg p-3">
                  <p className="text-2xl font-bold text-amber-300">150+</p>
                  <p className="text-sm text-white/80">Tác giả</p>
                </div>
                <div className="text-center backdrop-blur-sm bg-white/5 rounded-lg p-3">
                  <p className="text-2xl font-bold text-amber-300">24/7</p>
                  <p className="text-sm text-white/80">Hỗ trợ</p>
                </div>
              </div>
            </div>

            {/* Featured Books Carousel */}
            <div className="relative z-10">
              <div className="book-showcase-3d relative h-[450px] w-[320px] mx-auto">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 w-[240px] h-[350px] transition-all duration-500 hover:scale-110 hover:rotate-3 hover:translate-x-5 shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)]">
                  {featuredBooks[0] && (
                    <div className="book-wrapper relative w-full h-full shadow-2xl rounded-lg overflow-hidden">
                      <div className="absolute inset-0 shadow-inner z-10"></div>
                      <BookCover
                        src={featuredBooks[0].coverImage}
                        alt={featuredBooks[0].title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                        <h3 className="font-semibold line-clamp-1">
                          {featuredBooks[0].title}
                        </h3>
                        <p className="text-xs text-white/80">
                          {featuredBooks[0].author}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 translate-x-[-60px] translate-y-[-20px] z-20 w-[240px] h-[350px] transition-all duration-500 hover:scale-110 hover:rotate-[-5deg] hover:translate-x-[-80px]">
                  {featuredBooks[1] && (
                    <div className="book-wrapper relative w-full h-full shadow-2xl rounded-lg overflow-hidden rotate-[-8deg]">
                      <div className="absolute inset-0 shadow-inner z-10"></div>
                      <BookCover
                        src={featuredBooks[1].coverImage}
                        alt={featuredBooks[1].title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                        <h3 className="font-semibold line-clamp-1">
                          {featuredBooks[1].title}
                        </h3>
                        <p className="text-xs text-white/80">
                          {featuredBooks[1].author}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 translate-x-[40px] translate-y-[30px] z-10 w-[240px] h-[350px] transition-all duration-500 hover:scale-110 hover:rotate-6">
                  {featuredBooks[2] && (
                    <div className="book-wrapper relative w-full h-full shadow-2xl rounded-lg overflow-hidden rotate-6">
                      <div className="absolute inset-0 shadow-inner z-10"></div>
                      <BookCover
                        src={featuredBooks[2].coverImage}
                        alt={featuredBooks[2].title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                        <h3 className="font-semibold line-clamp-1">
                          {featuredBooks[2].title}
                        </h3>
                        <p className="text-xs text-white/80">
                          {featuredBooks[2].author}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-10 -left-10 w-20 h-20 bg-amber-400 rounded-full opacity-50 blur-xl"></div>
              <div className="absolute -bottom-5 -right-5 w-16 h-16 bg-blue-400 rounded-full opacity-40 blur-xl"></div>
              <div className="absolute top-1/4 right-1/4 w-12 h-12 bg-purple-500 rounded-full opacity-30 blur-lg"></div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 100"
            fill="#f9fafb"
          >
            <path d="M0,64L80,74.7C160,85,320,107,480,96C640,85,800,43,960,32C1120,21,1280,43,1360,53.3L1440,64L1440,100L1360,100C1280,100,1120,100,960,100C800,100,640,100,480,100C320,100,160,100,80,100L0,100Z"></path>
          </svg>
        </div>
      </section>

      {/* Categories Section - New */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Danh Mục Sách
            </h2>
            <Link
              href="/store"
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
            >
              Xem tất cả
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <Link
                href={`/store?category=${category.toLowerCase()}`}
                key={category}
                className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow text-center group"
              >
                <div
                  className={`w-12 h-12 mx-auto mb-3 flex items-center justify-center rounded-full 
                  ${
                    index % 6 === 0
                      ? "bg-blue-100 text-blue-600"
                      : index % 6 === 1
                        ? "bg-green-100 text-green-600"
                        : index % 6 === 2
                          ? "bg-amber-100 text-amber-600"
                          : index % 6 === 3
                            ? "bg-purple-100 text-purple-600"
                            : index % 6 === 4
                              ? "bg-red-100 text-red-600"
                              : "bg-indigo-100 text-indigo-600"
                  }`}
                >
                  <FiBookmark className="w-6 h-6" />
                </div>
                <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors capitalize">
                  {category}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {
                    allBooks.filter(
                      (book) =>
                        book.category.toLowerCase() === category.toLowerCase(),
                    ).length
                  }{" "}
                  sách
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Enhanced */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h5 className="text-blue-600 uppercase tracking-wider font-medium mb-3">
              Dịch vụ của chúng tôi
            </h5>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Tại Sao Chọn <span className="text-blue-600">BookStore</span>?
            </h2>
            <p className="text-gray-600 text-lg">
              Chúng tôi cung cấp trải nghiệm mua sắm sách tuyệt vời với nhiều ưu
              đãi và tiện ích hàng đầu cho độc giả
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow group border border-gray-100">
              <div className="bg-blue-100 text-blue-600 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <FiBook className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Bộ Sưu Tập Đa Dạng</h3>
              <p className="text-gray-600 mb-4">
                Khám phá hàng nghìn cuốn sách phong phú trên tất cả các thể loại
                từ tiểu thuyết đến khoa học và nhiều hơn nữa.
              </p>
              <Link
                href="/store"
                className="text-blue-600 font-medium inline-flex items-center group-hover:underline"
              >
                Duyệt danh mục
                <svg
                  className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </Link>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow group border border-gray-100">
              <div className="bg-green-100 text-green-600 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-600 group-hover:text-white transition-all duration-300">
                <FiTag className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Giá Cả Hợp Lý</h3>
              <p className="text-gray-600 mb-4">
                Chúng tôi cung cấp những cuốn sách chất lượng với mức giá cạnh
                tranh cùng nhiều khuyến mãi thường xuyên.
              </p>
              <Link
                href="/store/deals"
                className="text-green-600 font-medium inline-flex items-center group-hover:underline"
              >
                Xem ưu đãi
                <svg
                  className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </Link>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow group border border-gray-100">
              <div className="bg-purple-100 text-purple-600 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                <FiTruck className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Giao Hàng Nhanh</h3>
              <p className="text-gray-600 mb-4">
                Nhận sách của bạn nhanh chóng và an toàn với dịch vụ đóng gói
                cẩn thận và theo dõi đơn hàng chi tiết.
              </p>
              <Link
                href="/shipping"
                className="text-purple-600 font-medium inline-flex items-center group-hover:underline"
              >
                Chính sách vận chuyển
                <svg
                  className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </Link>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow group border border-gray-100">
              <div className="bg-amber-100 text-amber-600 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-600 group-hover:text-white transition-all duration-300">
                <FiUsers className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Hỗ Trợ Khách Hàng</h3>
              <p className="text-gray-600 mb-4">
                Đội ngũ thân thiện của chúng tôi luôn sẵn sàng hỗ trợ bạn với
                mọi câu hỏi về sách hoặc đơn hàng 24/7.
              </p>
              <Link
                href="/contact"
                className="text-amber-600 font-medium inline-flex items-center group-hover:underline"
              >
                Liên hệ hỗ trợ
                <svg
                  className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Books - New */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12">
            <div>
              <h5 className="text-blue-600 uppercase tracking-wider font-medium mb-2">
                Được đọc giả tin tưởng
              </h5>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                Sách Nổi Bật
              </h2>
            </div>
            <Link
              href="/store/popular"
              className="mt-4 md:mt-0 text-blue-600 hover:text-blue-800 font-medium flex items-center"
            >
              Khám phá thêm
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {popularBooks.map((book, idx) => (
              <div
                key={book.id}
                className="flex bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="w-1/3 relative">
                  <Image
                    src={book.coverImage}
                    alt={book.title}
                    fill
                    style={{ objectFit: "cover" }}
                    className="absolute inset-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
                </div>
                <div className="w-2/3 p-6 flex flex-col">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          idx === 0
                            ? "bg-amber-100 text-amber-800"
                            : idx === 1
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {idx === 0
                          ? "Best Seller"
                          : idx === 1
                            ? "Hot"
                            : "Đề xuất"}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">
                      {book.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-1">{book.author}</p>
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < 4 ? "text-yellow-500" : "text-gray-300"}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="text-xs text-gray-500 ml-1">4.0/5</span>
                    </div>
                    <p className="text-lg font-semibold text-blue-600">
                      {book.price.toLocaleString()} đ
                    </p>
                  </div>
                  <Link
                    href={`/store/books/${book.id}`}
                    className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-semibold flex items-center"
                  >
                    Xem chi tiết
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      ></path>
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Releases Section - Enhanced */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h5 className="text-blue-600 uppercase tracking-wider font-medium mb-2">
              Mới nhất
            </h5>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Sách Mới Phát Hành
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Khám phá những tựa sách mới nhất vừa được cập nhật trong bộ sưu
              tập của chúng tôi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {newReleases.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/store/new-releases"
              className="inline-flex items-center px-6 py-3 border border-blue-600 text-blue-600 bg-white hover:bg-blue-600 hover:text-white rounded-lg font-semibold transition-colors"
            >
              Xem Tất Cả Sách Mới
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Bestsellers Section - Enhanced */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h5 className="text-blue-600 uppercase tracking-wider font-medium mb-2">
                Bán chạy nhất
              </h5>
              <h2 className="text-3xl font-bold text-gray-800">
                Sách Bán Chạy
              </h2>
            </div>
            <Link
              href="/store/bestsellers"
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow transition-shadow"
            >
              Xem Tất Cả
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {bestSellers.map((book, idx) => (
              <div key={book.id} className="relative group">
                {idx < 2 && (
                  <div className="absolute -top-2 -right-2 z-10 bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold shadow-md">
                    #{idx + 1}
                  </div>
                )}
                <BookCard book={book} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - Enhanced */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h5 className="text-blue-600 uppercase tracking-wider font-medium mb-2">
              Phản hồi
            </h5>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Khách Hàng Nói Gì Về Chúng Tôi
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Chúng tôi luôn trân trọng mỗi phản hồi từ khách hàng để không
              ngừng cải thiện dịch vụ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow border border-gray-100 relative hover:shadow-lg transition-shadow">
              <div className="text-blue-500 absolute -top-4 right-8">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  className="opacity-20"
                >
                  <path d="M24.8 12C27.2 13.6 28.4 15.6 28.4 18C28.4 22 25.6 24 20 24H18V32H14V20C14 15.6 15.6 12.4 18.8 10.4C22 8.4 24.8 9.2 24.8 12ZM30.4 20C30.4 15.6 32 12.4 35.2 10.4C38.4 8.4 41.2 9.2 41.2 12C43.6 13.6 44.8 15.6 44.8 18C44.8 22 42 24 36.4 24H34.4V32H30.4V20Z"></path>
                </svg>
              </div>

              <div className="flex items-center mb-6">
                <div className="h-14 w-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  <span className="text-xl font-bold">M</span>
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-800">Minh H.</h3>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 text-yellow-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-xs text-gray-500 ml-1">
                      1 tháng trước
                    </span>
                  </div>
                </div>
              </div>

              <blockquote className="text-gray-600 italic">
                &quot;Tôi rất thích sự đa dạng về sách có sẵn tại BookStore.
                Giao diện trang web dễ sử dụng và việc giao hàng luôn luôn nhanh
                chóng. Sẽ tiếp tục ủng hộ!&quot;
              </blockquote>

              <div className="flex items-center mt-4 text-sm text-gray-500">
                <FiCheckCircle className="text-green-500 mr-1" />
                <span>Đã mua sắm 5+ lần</span>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow border border-gray-100 relative hover:shadow-lg transition-shadow">
              <div className="text-green-500 absolute -top-4 right-8">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  className="opacity-20"
                >
                  <path d="M24.8 12C27.2 13.6 28.4 15.6 28.4 18C28.4 22 25.6 24 20 24H18V32H14V20C14 15.6 15.6 12.4 18.8 10.4C22 8.4 24.8 9.2 24.8 12ZM30.4 20C30.4 15.6 32 12.4 35.2 10.4C38.4 8.4 41.2 9.2 41.2 12C43.6 13.6 44.8 15.6 44.8 18C44.8 22 42 24 36.4 24H34.4V32H30.4V20Z"></path>
                </svg>
              </div>

              <div className="flex items-center mb-6">
                <div className="h-14 w-14 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  <span className="text-xl font-bold">T</span>
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-800">Thu N.</h3>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 text-yellow-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-xs text-gray-500 ml-1">
                      2 tháng trước
                    </span>
                  </div>
                </div>
              </div>

              <blockquote className="text-gray-600 italic">
                &quot;BookStore đã trở thành nơi tôi tìm đến cho tất cả các nhu
                cầu đọc sách. Giá cả cạnh tranh, đóng gói cẩn thận và dịch vụ
                khách hàng rất tuyệt vời!&quot;
              </blockquote>

              <div className="flex items-center mt-4 text-sm text-gray-500">
                <FiCheckCircle className="text-green-500 mr-1" />
                <span>Đã mua sắm 12+ lần</span>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow border border-gray-100 relative hover:shadow-lg transition-shadow">
              <div className="text-purple-500 absolute -top-4 right-8">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  className="opacity-20"
                >
                  <path d="M24.8 12C27.2 13.6 28.4 15.6 28.4 18C28.4 22 25.6 24 20 24H18V32H14V20C14 15.6 15.6 12.4 18.8 10.4C22 8.4 24.8 9.2 24.8 12ZM30.4 20C30.4 15.6 32 12.4 35.2 10.4C38.4 8.4 41.2 9.2 41.2 12C43.6 13.6 44.8 15.6 44.8 18C44.8 22 42 24 36.4 24H34.4V32H30.4V20Z"></path>
                </svg>
              </div>

              <div className="flex items-center mb-6">
                <div className="h-14 w-14 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                  <span className="text-xl font-bold">P</span>
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-800">Phong T.</h3>
                  <div className="flex items-center">
                    {[...Array(4)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 text-yellow-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <svg
                      className="w-5 h-5 text-gray-300"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-xs text-gray-500 ml-1">
                      3 tuần trước
                    </span>
                  </div>
                </div>
              </div>

              <blockquote className="text-gray-600 italic">
                &quot;Tính năng đề xuất trên BookStore đã giúp tôi khám phá rất
                nhiều cuốn sách hay mà tôi không thể tìm thấy ở nơi khác. Chỉ
                cần cải thiện thêm giao diện mobile.&quot;
              </blockquote>

              <div className="flex items-center mt-4 text-sm text-gray-500">
                <FiCheckCircle className="text-green-500 mr-1" />
                <span>Đã mua sắm 3+ lần</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section - New */}
      <section className="py-16 bg-gradient-to-r from-blue-700 to-indigo-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Đăng ký nhận thông tin</h2>
            <p className="text-lg opacity-90 mb-8">
              Nhận thông báo về sách mới phát hành, ưu đãi đặc biệt và các sự
              kiện độc quyền
            </p>

            <div className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto">
              <input
                type="email"
                placeholder="Email của bạn"
                className="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-6 py-3 bg-amber-500 hover:bg-amber-600 rounded-lg font-semibold transition-colors">
                Đăng ký ngay
              </button>
            </div>

            <p className="text-sm opacity-80 mt-4">
              Chúng tôi tôn trọng quyền riêng tư của bạn. Bạn có thể hủy đăng ký
              bất cứ lúc nào.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action - Enhanced */}
      <section className="py-20 bg-gray-50 relative overflow-hidden">
        {/* Background design elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-40 h-40 bg-blue-100 rounded-full opacity-60 -translate-x-20 -translate-y-20"></div>
          <div className="absolute bottom-0 right-0 w-60 h-60 bg-amber-100 rounded-full opacity-60 translate-x-20 translate-y-20"></div>
          <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-green-100 rounded-full opacity-60"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6 text-gray-800">
              Sẵn Sàng Bắt Đầu Đọc Sách?
            </h2>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Tham gia cùng hàng nghìn độc giả và bắt đầu khám phá bộ sưu tập
              sách đa dạng của chúng tôi ngay hôm nay.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link
                href="/store"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg flex items-center"
              >
                <FiBook className="mr-2" /> Duyệt Sách
              </Link>
              <Link
                href="/signup"
                className="bg-white border-2 border-blue-600 text-blue-600 hover:text-white hover:bg-blue-600 px-8 py-4 rounded-lg font-semibold transition-colors"
              >
                Tạo Tài Khoản
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
