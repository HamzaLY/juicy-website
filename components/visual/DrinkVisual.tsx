import Image from "next/image";
import type { Product } from "@/content/products";
import { Glass } from "./Glass";

/** The drink's photo when one exists, otherwise its illustrated glass. */
export function DrinkVisual({
  product,
  sizes = "(max-width: 768px) 90vw, 33vw",
  priority = false,
  className = "",
  glassClassName = "h-[78%] w-auto",
}: {
  product: Product;
  sizes?: string;
  priority?: boolean;
  className?: string;
  glassClassName?: string;
}) {
  if (product.image) {
    return (
      <Image
        src={product.image}
        alt={product.imageAlt ?? `${product.name}: ${product.tagline}`}
        fill
        sizes={sizes}
        priority={priority}
        className={`object-cover object-[50%_38%] ${className}`}
      />
    );
  }
  return (
    <div className={`absolute inset-0 flex items-end justify-center pb-[6%] ${className}`}>
      <Glass color={product.color} deep={product.deep} garnish={product.color} className={glassClassName} title={`Illustration of ${product.name}`} />
    </div>
  );
}
