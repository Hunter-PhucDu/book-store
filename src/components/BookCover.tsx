"use client";

import Image from "next/image";

interface BookCoverProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export default function BookCover({
  src,
  alt,
  className = "bg-gray-100",
  width = 200,
  height = 300,
}: BookCoverProps) {
  // If src starts with /images/, ensure we have a fallback
  const imageSrc = src.startsWith("/images/")
    ? src
    : "/images/book-placeholder.jpg";

  return (
    <div
      className={`relative ${className}`}
      style={{ width: width, height: height }}
    >
      <Image
        src={imageSrc}
        alt={alt}
        fill
        sizes="(max-width: 640px) 50vw, 25vw"
        style={{ objectFit: "cover" }}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = "/images/book-placeholder.jpg";
        }}
      />
    </div>
  );
}
