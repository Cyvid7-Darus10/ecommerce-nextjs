import React from "react";
import Link from "next/link";
import { formatNumber } from "../utils/utils";
import Image from "next/image";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";

export default function ProductCard({ product, addToCartHandler }) {
  return (
    <div className='flex flex-col items-center py-10 px-5 border border-gray-200 rounded-md shadow-md'>
      <Link href={`/product/${product.slug}`}>
        <div className='w-100 h-100 hover:transform hover:scale-110 transition duration-500 ease-in-out'>
          <Image
            src={product.image}
            alt={product.name}
            width={250}
            height={250}
          />
        </div>
      </Link>

      <p className='text-xl font-bold text-left mt-auto'>{product.name}</p>
      <p className='py-5 text-[#f44336] mt-auto'>
        ₱ {formatNumber(product.price)}
      </p>
      <button
        className='bg-[#f44336] text-white px-5 py-2 rounded-md mt-auto'
        onClick={() => addToCartHandler(product)}
      >
        <AddShoppingCartIcon className='text-white text-2xl' />
      </button>
    </div>
  );
}
