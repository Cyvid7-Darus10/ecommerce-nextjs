import React, { useContext, useState } from "react";

import Link from "next/link";
import Image from "next/image";

// Utilities
import { Store } from "../utils/Store";
import { formatNumber } from "../utils/utils";

// Components
import Layout from "../components/Layout";

// Icons
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";

//nextjs
import { useRouter } from "next/router";

// Components
import Modal from "../components/Modal";

import dynamic from "next/dynamic";

// Styles
import { toast } from "react-toastify";

function CartScreen() {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  const [modalDetail, setModalDetail] = useState({
    message: "",
    status: "",
    show: false,
    action: () => {},
  });

  const cartQuantityActionHandler = (product, action) => {
    const existItem = cart.cartItems.find((x) => x.slug === product.slug);
    let quantity;

    switch (action) {
      case "add":
        quantity = existItem ? existItem.quantity + 1 : 1;
        break;
      case "remove":
        quantity = existItem ? existItem.quantity - 1 : 1;
        break;
      case "delete":
        quantity = 0;
        break;
      default:
        return false;
    }

    if (product.countInStock < quantity) {
      return toast.error("Sorry. Product is out of stock");
    }

    // If quantity is 0, show modal messag for confirmation
    if (quantity === 0) {
      setModalDetail({
        message: "Are you sure you want to remove this item from the cart?",
        status: "warning",
        show: true,
        action: () => {
          dispatch({
            type: "CART_UPDATE_ITEM",
            payload: { ...product, quantity: quantity },
          });
        },
      });
      return false;
    }

    dispatch({
      type: "CART_UPDATE_ITEM",
      payload: { ...product, quantity: quantity },
    });
  };

  return (
    <>
      <Layout title='Cart' smallHeader={true}>
        <div className='container'>
          <Link href='/products' className='flex items-center px-2 lg:px-0'>
            <ArrowBackIcon className='text-[#f44336] text-2xl mr-2' />
            <p className='text-[#f44336] text-xl'>Back to Products</p>
          </Link>
          <div className='flex py-2 lg:flex-row flex-col px-2 lg:px-0'>
            <div className='flex flex-col'>
              <div className='flex flex-col items-center justify-center'>
                {cart.cartItems.length === 0 && (
                  <div className='text-center'>Cart is empty</div>
                )}
                {cart.cartItems.length > 0 && (
                  <div className='flex flex-col'>
                    {cart.cartItems.map((item, key) => (
                      <div
                        key={key}
                        className=' p-4 border border-b-[#f44336] min-w-[300px] lg:min-w-[800px] lg:max-w-[1000px] w-full'
                      >
                        <div className='flex flex-row justify-between items-center'>
                          <div className='flex flex-row items-center'>
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={50}
                              height={50}
                            />
                            <div className='flex flex-col ml-4'>
                              <span>{item.name}</span>
                              <span className='text-[#f44336]'>
                                ₱{formatNumber(item.price)}
                              </span>
                            </div>
                          </div>
                          <div className='ml-4 flex flex-col items-end'>
                            <button
                              className='hover:transform hover:scale-110'
                              onClick={() => {
                                cartQuantityActionHandler(item, "delete");
                              }}
                            >
                              <DeleteIcon />
                            </button>
                            <div className='text-[#999999]  flex flex-row justify-between items-center border border-[#999999] rounded-md w-24 h-8 mt-2'>
                              <button
                                className='ml-2'
                                onClick={() => {
                                  cartQuantityActionHandler(item, "remove");
                                }}
                              >
                                <RemoveIcon />
                              </button>
                              {/* <span className='m-auto'>{item.quantity}</span> */}
                              <input
                                value={item.quantity}
                                onChange={(e) => {
                                  if (
                                    Number(e.target.value) < 0 ||
                                    isNaN(Number(e.target.value)) ||
                                    e.target.value === ""
                                  ) {
                                    return false;
                                  }
                                  dispatch({
                                    type: "CART_UPDATE_ITEM",
                                    payload: {
                                      ...item,
                                      quantity: Number(e.target.value),
                                    },
                                  });
                                }}
                                type='text'
                                className='text-center border-none focus:outline-none w-8 overflow-y-hidden'
                              />
                              <button
                                className='ml-2 text-[#f44336] hover:transform hover:scale-110'
                                onClick={() => {
                                  cartQuantityActionHandler(item, "add");
                                }}
                              >
                                <AddIcon />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className='flex flex-col px-5 lg:px-0 my-5 lg:my-0 rounded-sm lg:w-1/4 lg:ml-auto'>
              <span className='text-xl  p-2'>
                Subtotal ({cart.cartItems.reduce((a, c) => a + c.quantity, 0)}{" "}
                items) : ₱
                {formatNumber(
                  cart.cartItems.reduce((a, c) => a + c.price * c.quantity, 0)
                )}
              </span>

              <button
                onClick={() => router.push("login?redirect=/shipping")}
                className='text-xl p-2 rounded-md bg-[#f44336] text-center text-white hover:text-[#f44336] hover:bg-white border border-[#f44336] ease-in-out duration-300'
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </Layout>
      <Modal modalDetail={modalDetail} setModalDetail={setModalDetail} />
    </>
  );
}

export default dynamic(() => Promise.resolve(CartScreen), { ssr: false });
