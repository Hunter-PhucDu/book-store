"use client";

import Image from "next/image";
import { useState } from "react";

interface BookImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  hoverEffect?: boolean;
}

export default function BookImage({
  src,
  alt,
  className = "",
  width = 300,
  height = 450,
  hoverEffect = false,
}: BookImageProps) {
  const imageSrc = src.startsWith("/images/")
    ? src
    : "/images/book-placeholder.jpg";

  const [isHovering, setIsHovering] = useState(false);

  return (
    <div
      className={`relative ${className} overflow-hidden`}
      style={{ width, height }}
      onMouseEnter={() => hoverEffect && setIsHovering(true)}
      onMouseLeave={() => hoverEffect && setIsHovering(false)}
    >
      <Image
        src={imageSrc}
        alt={alt}
        fill
        objectFit="cover"
        style={{
          transform: hoverEffect && isHovering ? "scale(1.08)" : "none",
          transition: "transform 0.4s cubic-bezier(0.25, 0.45, 0.45, 0.95)",
        }}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = "/images/book-placeholder.jpg";
        }}
      />
    </div>
  );
}
