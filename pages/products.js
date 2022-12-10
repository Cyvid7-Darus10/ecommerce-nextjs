import { useContext, useState } from "react";
import { toast } from "react-toastify";

import Layout from "../components/Layout";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";

import SearchIcon from "@mui/icons-material/Search";

// Utilities
import { Store } from "../utils/Store";

import Product from "../models/Product";

import db from "../utils/db";

export default function Home({ products }) {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  const [loading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const addToCartHandler = async (product) => {
    const existItem = cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;

    if (product.countInStock < quantity) {
      return toast.error("Sorry. Product is out of stock");
    }
    dispatch({ type: "CART_UPDATE_ITEM", payload: { ...product, quantity } });

    toast.success("Product added to the cart", { autoClose: 500 });
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
              products &&
              currentItems.map((product, index) => (
                <ProductCard
                  key={index}
                  product={product}
                  addToCartHandler={addToCartHandler}
                />
              ))}
          </div>
          {loading && (
            <div class='flex flex-row justify-center items-center text-center py-10'>
              <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900'></div>
            </div>
          )}
          <Pagination
            itemsPerPage={itemsPerPage}
            totalItems={products.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </div>
      </Layout>
    </>
  );
}

export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find().lean();
  await db.disconnect();
  return {
    props: {
      products: products.map(db.convertDocToObj),
    },
  };
}
