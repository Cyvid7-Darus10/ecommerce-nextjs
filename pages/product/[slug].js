import React, { useContext, useState, useEffect } from "react";

import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";

// Utilities
import data from "../../utils/data";
import { Store } from "../../utils/Store";
import { formatNumber } from "../../utils/utils";

// Components
import Layout from "../../components/Layout";
import { toast } from "react-toastify";

// Icons
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// Database
import Product from "../../models/Product";
import db from "../../utils/db";

export default function ProductScreen({ product }) {
  const { state, dispatch } = useContext(Store);
  const { query } = useRouter();
  const { slug } = query;
  const [randomProducts, setRandomProducts] = useState([]);

  useEffect(() => {
    const randommizedProducts = data.products.sort(() => Math.random() - 0.5);
    const randomFourProducts = randommizedProducts.slice(0, 4);
    setRandomProducts(randomFourProducts);
  }, []);

  if (!product) {
    return <div>Product Not Found</div>;
  }

  const addToCartHandler = () => {
    const existItem = state.cart.cartItems.find((x) => x.slug === slug);

    const quantity = existItem ? existItem.quantity + 1 : 1;

    if (product.countInStock < quantity) {
      toast.error("Sorry. Product is out of stock.");
      return;
    }

    dispatch({
      type: "CART_UPDATE_ITEM",
      payload: { ...product, quantity: quantity },
    });
  };

  return (
    <>
      <Layout title='Product' smallHeader={true}>
        <div className='container px-0 mx-0 '>
          <div className='flex items-center py-2 px-5'>
            <Link href='/products'>
              <div className='flex items-center'>
                <ArrowBackIcon className='text-[#f44336] text-2xl mr-2' />
                <p className='text-[#f44336] text-xl'>Back to Products</p>
              </div>
            </Link>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 py-12 px-5'>
            <div className='flex flex-col items-center'>
              <div className='w-100 h-100'>
                <Image
                  src={product.image}
                  alt={product.name}
                  width={500}
                  height={500}
                  className='w-100 h-100'
                />
              </div>
            </div>
            <div className='flex flex-col items-center'>
              <div className='w-100 h-100'>
                <h1 className='text-3xl font-semibold'>{product.name}</h1>
                <p className='text-2xl font-semibold py-2'>
                  Price: ₱{formatNumber(product.price)}
                </p>
                <p className='text-xl font-semibold py-2'>Description:</p>
                <p className='text-lg py-2'>{product.description}</p>
              </div>

              <button
                className='bg-[#f44336] text-white px-5 py-2 rounded-md mt-auto'
                onClick={addToCartHandler}
              >
                <AddShoppingCartIcon className='text-white text-2xl' />
                Add to Cart
              </button>
            </div>
          </div>

          <p className='text-xl font-semibold px-5 py-5'>Similar Items</p>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-12 px-5'>
            {randomProducts.map((product) => (
              <div
                className='flex flex-col items-center py-10 px-5 border border-gray-200 rounded-md shadow-md'
                key={product.id}
              >
                <Link href={`/product/${product.slug}`}>
                  <div className='w-100 h-100 hover:transform hover:scale-110 transition duration-500 ease-in-out'>
                    <Image
                      src={product.image}
                      alt='CCTV'
                      className=''
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
              </div>
            ))}
          </div>
        </div>
      </Layout>
    </>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;

  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();
  return {
    props: {
      product: product ? db.convertDocToObj(product) : null,
    },
  };
}
