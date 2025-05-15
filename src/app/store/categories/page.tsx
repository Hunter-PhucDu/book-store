"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FiBookOpen, FiChevronRight } from "react-icons/fi";
import MainLayout from "@/components/layout/MainLayout";
import { useStore } from "@/store/index";

interface CategoryCount {
  name: string;
  count: number;
  icon: string;
  color: string;
}

export default function Categories() {
  const books = useStore((state) => state.books);
  const [categories, setCategories] = useState<CategoryCount[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Các biểu tượng và màu sắc cho từng danh mục
  const categoryIcons: Record<string, { icon: string; color: string }> = {
    "Văn học kinh điển": { icon: "📚", color: "bg-blue-100 text-blue-800" },
    "Hiện thực huyền ảo": {
      icon: "✨",
      color: "bg-purple-100 text-purple-800",
    },
    "Văn học triết lý": { icon: "🧠", color: "bg-indigo-100 text-indigo-800" },
    "Hư cấu siêu nhiên": { icon: "👻", color: "bg-violet-100 text-violet-800" },
    "Tiểu thuyết tâm lý": { icon: "💭", color: "bg-pink-100 text-pink-800" },
    "Tiểu thuyết lãng mạn": { icon: "❤️", color: "bg-red-100 text-red-800" },
    "Tiểu thuyết hiện đại": { icon: "🏙️", color: "bg-gray-100 text-gray-800" },
    "Tiểu thuyết xã hội": { icon: "👥", color: "bg-green-100 text-green-800" },
    "Chính trị giả tưởng": { icon: "🏛️", color: "bg-amber-100 text-amber-800" },
    "Tiểu thuyết lịch sử": {
      icon: "🏺",
      color: "bg-yellow-100 text-yellow-800",
    },
    "Kỹ năng sống": { icon: "🌱", color: "bg-emerald-100 text-emerald-800" },
    "Văn học thiếu nhi": { icon: "🧸", color: "bg-orange-100 text-orange-800" },
    "Văn học hiện thực phê phán": {
      icon: "🔍",
      color: "bg-slate-100 text-slate-800",
    },
    "Khoa học viễn tưởng": { icon: "🚀", color: "bg-cyan-100 text-cyan-800" },
    "Thần thoại & Phiêu lưu": {
      icon: "🗺️",
      color: "bg-lime-100 text-lime-800",
    },
    "Cổ tích triết lý": { icon: "🧚", color: "bg-teal-100 text-teal-800" },
    "Phép thuật & Phiêu lưu": {
      icon: "🧙",
      color: "bg-fuchsia-100 text-fuchsia-800",
    },
    "Văn học chiến tranh": { icon: "🪖", color: "bg-stone-100 text-stone-800" },
    "Hậu tận thế": { icon: "🌋", color: "bg-rose-100 text-rose-800" },
    "Lịch sử & Xã hội": { icon: "📜", color: "bg-amber-100 text-amber-800" },
    "Châm biếm chiến tranh": { icon: "🎭", color: "bg-blue-100 text-blue-800" },
    "Lãng mạn": { icon: "💘", color: "bg-pink-100 text-pink-800" },
    "Tiểu thuyết Gothic": {
      icon: "🏰",
      color: "bg-purple-100 text-purple-800",
    },
    "Tản văn & Tình cảm": { icon: "💌", color: "bg-red-100 text-red-800" },
    "Truyện ngắn hiện thực": { icon: "📝", color: "bg-gray-100 text-gray-800" },
    "Văn học hiện thực": { icon: "🏘️", color: "bg-green-100 text-green-800" },
    "Văn học hiện đại": { icon: "🌆", color: "bg-indigo-100 text-indigo-800" },
    "Chủ nghĩa hiện thực": { icon: "🔎", color: "bg-blue-100 text-blue-800" },
    "Lịch sử cổ điển": { icon: "⏳", color: "bg-amber-100 text-amber-800" },
    "Tiểu thuyết hài hước": {
      icon: "😄",
      color: "bg-yellow-100 text-yellow-800",
    },
    "Văn học hiện thực xã hội": {
      icon: "👨‍👩‍👧‍👦",
      color: "bg-green-100 text-green-800",
    },
    "Kĩ năng sống": { icon: "🌱", color: "bg-emerald-100 text-emerald-800" },
  };

  // Mặc định cho các danh mục không có trong danh sách trên
  const defaultCategory = { icon: "📖", color: "bg-gray-100 text-gray-800" };

  useEffect(() => {
    // Đếm số lượng sách trong mỗi danh mục
    const categoryMap = new Map<string, number>();

    books.forEach((book) => {
      const currentCount = categoryMap.get(book.category) || 0;
      categoryMap.set(book.category, currentCount + 1);
    });

    // Chuyển đổi Map thành mảng và sắp xếp theo số lượng giảm dần
    const categoryArray: CategoryCount[] = Array.from(
      categoryMap.entries(),
    ).map(([name, count]) => {
      const categoryStyle = categoryIcons[name] || defaultCategory;
      return {
        name,
        count,
        icon: categoryStyle.icon,
        color: categoryStyle.color,
      };
    });

    categoryArray.sort((a, b) => b.count - a.count);

    // Giả lập thời gian tải
    setTimeout(() => {
      setCategories(categoryArray);
      setIsLoading(false);
    }, 500);
  }, [books]);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8 animate-fade-in">
          <FiBookOpen className="text-blue-600 h-8 w-8 mr-3" />
          <h1 className="text-3xl font-bold text-gray-800">Danh mục sách</h1>
        </div>

        {isLoading ? (
          // Loading state
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(12)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 animate-pulse"
              >
                <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/store/categories/${encodeURIComponent(
                  category.name.toLowerCase(),
                )}`}
                className={`${category.color} p-6 rounded-lg hover:shadow-lg transition-shadow flex flex-col items-center text-center group`}
              >
                <span className="text-4xl mb-3 transform group-hover:scale-110 transition-transform">
                  {category.icon}
                </span>
                <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
                <p className="text-sm opacity-80">{category.count} cuốn sách</p>
                <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center text-sm font-medium">
                  Xem tất cả <FiChevronRight className="ml-1" />
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Phần giới thiệu danh mục */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 animate-fade-in">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Khám phá thế giới sách đa dạng
          </h2>
          <p className="text-gray-600 mb-6">
            BookStore tự hào cung cấp đa dạng thể loại sách, từ văn học kinh
            điển đến khoa học viễn tưởng, từ sách thiếu nhi đến sách kỹ năng
            sống. Hãy khám phá danh mục yêu thích của bạn và tìm kiếm những cuốn
            sách phù hợp với sở thích cá nhân.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/store/new-releases"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Sách mới phát hành
            </Link>
            <Link
              href="/store/featured"
              className="px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
            >
              Sách nổi bật
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
