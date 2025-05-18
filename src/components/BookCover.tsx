"use client";

import { memo } from "react";
import Image, { ImageProps } from "next/image";

interface BookCoverProps extends Omit<ImageProps, "src"> {
  src: string;
  alt: string;
  className?: string;
}

const BookCover = memo(({ src, alt, className, ...props }: BookCoverProps) => {
  return (
    <div className={`relative w-full h-full ${className || ""}`}>
      <Image
        src={src}
        alt={alt || "Book cover"}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover"
        loading="lazy"
        priority={false}
        onError={(e) => {
          (e.target as HTMLImageElement).onerror = null;
          (e.target as HTMLImageElement).src = "/images/book-placeholder.jpg";
        }}
        {...props}
      />
    </div>
  );
});

BookCover.displayName = "BookCover";

export default BookCover;
