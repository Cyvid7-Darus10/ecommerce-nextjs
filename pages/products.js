import React, { useContext, useState } from "react";

import Layout from "../components/Layout";
import Pagination from "../components/Pagination";

import Image from "next/image";

import SearchIcon from "@mui/icons-material/Search";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";

// Utilities
import data from "../utils/data";
import { Store } from "../utils/Store";
import { formatNumber } from "../utils/utils";

import Link from "next/link";

export default function Home() {
  const { state, dispatch } = useContext(Store);
  const [items] = useState(data.products);
  const [loading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const addToCartHandler = (product) => {
    const existItem = state.cart.cartItems.find((x) => x.slug === product.slug);

    const quantity = existItem ? existItem.quantity + 1 : 1;
    dispatch({
      type: "CART_UPDATE_ITEM",
      payload: { ...product, quantity: quantity },
    });
  };

  return (
    <>
      <Layout title='Products' bgImage={"/images/product-bg-min.png"}>
        <div className='container px-0 mx-0 text-center'>
          <p className='text-[#f44336] italic text-center py-2'>
            Home → Products
          </p>
          <p className='text-3xl text-center font-semibold py-2'>Products</p>
          <div className='border border-black rounded-md flex items-center py-2 px-5 w-3/4 lg:w-1/2 mx-auto my-5'>
            <SearchIcon className='text-[#f44336] text-2xl mr-2' />
            <input
              type='text'
              placeholder='Search'
              className='py-2 px-5 w-full'
            />
          </div>
          <div className='flex px-5 py-2'>
            <select className='py-2 px-5 border border-gray-200 rounded-md'>
              <option value=''>Sort by</option>
              <option value=''>Price: Low to High</option>
              <option value=''>Price: High to Low</option>
            </select>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-12 px-5'>
            {!loading &&
              data?.products &&
              currentItems.map((product) => (
                <div
                  className='flex flex-col items-center py-10 px-5 border border-gray-200 rounded-md shadow-md'
                  key={product.id}
                >
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

                  <p className='text-xl font-bold text-left mt-auto'>
                    {product.name}
                  </p>
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
              ))}
          </div>
          {loading && (
            <div class='flex flex-row justify-center items-center text-center py-10'>
              <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900'></div>
            </div>
          )}
          <Pagination
            itemsPerPage={itemsPerPage}
            totalItems={items.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </div>
      </Layout>
    </>
  );
}
