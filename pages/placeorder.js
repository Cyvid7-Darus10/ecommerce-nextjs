import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import CheckoutWizard from "../components/CheckoutWizard";
import Layout from "../components/Layout";
import { getError } from "../utils/error";
import { Store } from "../utils/Store";
import { Card, CardHeader, CardBody, Button } from "@material-tailwind/react";
import { formatNumber } from "../utils/utils";

export default function PlaceOrderScreen() {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { cartItems, shippingAddress, paymentMethod } = cart;

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;

  const itemsPrice = round2(
    cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  ); // 123.4567 => 123.46

  const shippingPrice = itemsPrice > 200 ? 0 : 15;
  const taxPrice = round2(itemsPrice * 0.15);
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  const router = useRouter();
  useEffect(() => {
    if (!paymentMethod) {
      router.push("/payment");
    }

    return () => {};
  }, [paymentMethod, router]);

  const [loading, setLoading] = useState(false);

  const placeOrderHandler = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post("/api/orders", {
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      });
      setLoading(false);
      dispatch({ type: "CART_CLEAR_ITEMS" });
      Cookies.set(
        "cart",
        JSON.stringify({
          ...cart,
          cartItems: [],
        })
      );
      router.push(`/order/${data._id}`);
    } catch (err) {
      setLoading(false);
      toast.error(getError(err));
    }
  };

  return (
    <Layout title='Place Order' smallHeader={true}>
      <div className='p-4 m-5 w-full'>
        <CheckoutWizard activeStep={3} />
        {cartItems.length === 0 ? (
          <div className='text-center'>
            <span>Cart is empty. </span>
            <Link href='/products' className='text-blue-500'>
              Go shopping
            </Link>
          </div>
        ) : (
          <div className='grid md:grid-cols-4 md:gap-5'>
            <div className='overflow-x-auto md:col-span-3'>
              <Card className='shadow-none'>
                <CardHeader floated={false} className='text-lg rounded-sm p-3'>
                  Shipping Address
                </CardHeader>
                <CardBody>
                  <div>
                    {shippingAddress.fullName}, {shippingAddress.address},{" "}
                    {shippingAddress.city}, {shippingAddress.postalCode},{" "}
                    {shippingAddress.country}
                  </div>
                  <div>
                    <Link href='/shipping' className='text-blue-500'>
                      Edit
                    </Link>
                  </div>
                </CardBody>
              </Card>
              <Card className='shadow-none'>
                <CardHeader floated={false} className='text-lg rounded-sm p-3'>
                  Payment Method
                </CardHeader>
                <CardBody>
                  <div>{paymentMethod}</div>
                  <div>
                    <Link href='/payment' className='text-blue-500'>
                      Edit
                    </Link>
                  </div>
                </CardBody>
              </Card>
              <Card className='shadow-none'>
                <CardHeader floated={false} className='text-lg rounded-sm p-3'>
                  Order Items
                </CardHeader>
                <CardBody>
                  <table className='min-w-full mb-1'>
                    <thead className='border-b'>
                      <tr>
                        <th className='px-5 text-left'>Item</th>
                        <th className='p-5 text-right'>Quantity</th>
                        <th className='p-5 text-right'>Price</th>
                        <th className='p-5 text-right'>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map((item) => (
                        <tr key={item._id} className='border-b'>
                          <td>
                            <Link
                              href={`/product/${item.slug}`}
                              className='flex items-center'
                            >
                              <Image
                                src={item.image}
                                alt={item.name}
                                width={50}
                                height={50}
                              ></Image>
                              &nbsp;
                              {item.name}
                            </Link>
                          </td>
                          <td className=' p-5 text-right'>{item.quantity}</td>
                          <td className='p-5 text-right'>₱{item.price}</td>
                          <td className='p-5 text-right'>
                            ₱{item.quantity * item.price}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div>
                    <Link href='/cart' className='text-blue-500'>
                      Edit
                    </Link>
                  </div>
                </CardBody>
              </Card>
            </div>
            <div>
              <Card className='shadow-none'>
                <CardHeader floated={false} className='text-lg rounded-sm p-3'>
                  Order Summary
                </CardHeader>
                <CardBody>
                  <ul>
                    <li>
                      <div className='mb-2 flex justify-between'>
                        <div>Items</div>
                        <div>₱{formatNumber(itemsPrice)}</div>
                      </div>
                    </li>
                    <li>
                      <div className='mb-2 flex justify-between'>
                        <div>Tax</div>
                        <div>₱{formatNumber(taxPrice)}</div>
                      </div>
                    </li>
                    <li>
                      <div className='mb-2 flex justify-between'>
                        <div>Shipping</div>
                        <div>₱{formatNumber(shippingPrice)}</div>
                      </div>
                    </li>
                    <li>
                      <div className='mb-2 flex justify-between'>
                        <div>Total</div>
                        <div>₱{formatNumber(totalPrice)}</div>
                      </div>
                    </li>
                    <li>
                      <Button
                        color='red'
                        disabled={loading}
                        onClick={placeOrderHandler}
                        className='primary-button w-full'
                      >
                        {loading ? "Loading..." : "Place Order"}
                      </Button>
                    </li>
                  </ul>
                </CardBody>
              </Card>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

PlaceOrderScreen.auth = true;
