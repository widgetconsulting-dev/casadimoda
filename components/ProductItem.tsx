"use client";

import Link from "next/link";
import Image from "next/image";
import { useStore } from "@/utils/context/Store";

interface Product {
  name: string;
  slug: string;
  image: string;
  price: number;
  countInStock: number;
  category: string;
  subCategory?: string;
  deliveryTime?: string;
  weight?: string;
}

interface ProductItemProps {
  product: Product;
}

export default function ProductItem({ product }: ProductItemProps) {
  const { state, dispatch } = useStore();

  const addToCartHandler = () => {
    const existItem = state.cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;

    if (product.countInStock < quantity) {
      alert("Sorry. Product is out of stock");
      return;
    }

    dispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, quantity },
    });
  };

  return (
    <div className="group border border-gray-100 rounded-xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col bg-white">
      <Link href={`/product/${product.slug}`} className="flex-grow">
        <div className="relative aspect-[3/4] w-full bg-secondary">
          <Image
            src={product.image || "/images/placeholder.jpg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized={true}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              const fallbacks: Record<string, string> = {
                Jackets: "1551006917-0624bb7c3cfd",
                Accessories: "1523275335684-37898b6baf30",
                Shoes: "1549298916-b41d501d3772",
                Pants: "1541099649105-f69ad21f3246",
                Home: "1513519245088-0e12902e5a38",
                Electronics: "1498050108023-c5249f4df085",
                Shirts: "1523381235312-3c1a403824ae",
              };
              const photoId = fallbacks[product.category as string] || "1515886657613-9f3515b0c78f";
              target.src = `https://images.unsplash.com/photo-${photoId}?q=80&w=1020&auto=format&fit=crop`;
            }}
          />
          {/* subtle gold overlay on hover */}
          <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/5 transition-colors duration-500" />
        </div>
        <div className="p-5">
          <p className="text-accent font-bold uppercase text-[10px] tracking-widest mb-1.5">
            {product.subCategory}
          </p>
          <p className="text-primary font-semibold text-lg leading-tight group-hover:text-accent transition-colors duration-300">
            {product.name}
          </p>
          <p className="text-[11px] text-text-dark/50 mt-2 flex items-center gap-1.5 italic">
            <span className="text-[14px]">✧</span> Delivery:{" "}
            {product.deliveryTime}
          </p>
        </div>
      </Link>
      <div className="p-5 pt-0 mt-auto flex flex-wrap items-center justify-between gap-3">
        <span
          suppressHydrationWarning
          className="text-xl font-black text-primary whitespace-nowrap"
        >
          ${product.price.toLocaleString('en-US')}
        </span>
        <button
          onClick={addToCartHandler}
          className="flex-grow bg-primary hover:bg-accent text-white hover:text-primary px-4 py-2.5 rounded-full transition-all duration-300 text-[10px] font-bold uppercase tracking-wider shadow-md hover:shadow-accent/40 active:scale-95 cursor-pointer whitespace-nowrap min-w-fit"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}
