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
  // If src starts with /images/, ensure we have a fallback
  const imageSrc = src.startsWith("/images/")
    ? src
    : "/images/book-placeholder.jpg";

  return (
    <Image
      src={imageSrc}
      alt={alt}
      fill
      sizes="(max-width: 640px) 50vw, 25vw"
      style={{ objectFit: "cover" }}
      className={className}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.src = "/images/book-placeholder.jpg";
      }}
    />
  );
}
