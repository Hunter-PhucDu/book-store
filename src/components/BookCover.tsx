"use client";

import Image from "next/image";

interface BookCoverProps {
  src: string;
  alt: string;
  className?: string;
}

export default function BookCover({
  src,
  alt,
  className = "bg-gray-100",
}: BookCoverProps) {
  const imageSrc = src.startsWith("/images/")
    ? src
    : "/images/book-placeholder.jpg";

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={100}
      height={150}
      style={{ objectFit: "cover" }}
      className={className}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.src = "/images/book-placeholder.jpg";
      }}
    />
  );
}
