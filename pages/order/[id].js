import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useReducer } from "react";
import Layout from "../../components/Layout";
import { getError } from "../../utils/error";
import { Card, CardHeader, CardBody } from "@material-tailwind/react";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { toast } from "react-toastify";
import { formatNumber } from "../../utils/utils";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, order: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "PAY_REQUEST":
      return { ...state, loadingPay: true };
    case "PAY_SUCCESS":
      return { ...state, loadingPay: false, successPay: true };
    case "PAY_FAIL":
      return { ...state, loadingPay: false, errorPay: action.payload };
    case "PAY_RESET":
      return { ...state, loadingPay: false, successPay: false, errorPay: "" };
    default:
      state;
  }
}

export default function OrderScreen() {
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const { query } = useRouter();
  const orderId = query.id;

  const [{ loading, error, order, successPay, loadingPay }, dispatch] =
    useReducer(reducer, {
      loading: true,
      order: {},
      error: "",
    });

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/orders/${orderId}`);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    if (!order._id || successPay || (order._id && order._id !== orderId)) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: "PAY_RESET" });
      }
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get("/api/keys/paypal");
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": clientId,
            currency: "PHP",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      loadPaypalScript();
    }
  }, [order, orderId, paypalDispatch, successPay]);

  const {
    shippingAddress,
    paymentMethod,
    orderItems,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
  } = order;

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: totalPrice },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        dispatch({ type: "PAY_REQUEST" });
        const { data } = await axios.put(
          `/api/orders/${order._id}/pay`,
          details
        );
        dispatch({ type: "PAY_SUCCESS", payload: data });
        toast.success("Order is paid successgully");
      } catch (err) {
        dispatch({ type: "PAY_FAIL", payload: getError(err) });
        toast.error(getError(err));
      }
    });
  }
  function onError(err) {
    toast.error(getError(err));
  }

  return (
    <Layout title='Order' smallHeader={true}>
      <div className='p-4 m-5 w-full'>
        <p className='text-xl text-center'>Order ID: {orderId}</p>
        {loading ? (
          <div className='text-center'>
            <span>Loading...</span>
          </div>
        ) : error ? (
          <div className='text-center'>
            <span className='text-red-500'>{error}</span>
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
                  {isDelivered ? (
                    <div className='text-green-500'>
                      Delivered at {deliveredAt}
                    </div>
                  ) : (
                    <div className='text-red-500'>Not delivered</div>
                  )}
                </CardBody>
              </Card>
              <Card className='shadow-none'>
                <CardHeader floated={false} className='text-lg rounded-sm p-3'>
                  Payment Method
                </CardHeader>
                <CardBody>
                  <div>{paymentMethod}</div>
                  {isPaid ? (
                    <div className='text-green-500'>Paid at {paidAt}</div>
                  ) : (
                    <div className='text-red-500'>Not paid</div>
                  )}
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
                      {orderItems.map((item) => (
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
                          <td className='p-5 text-right'>
                            ₱{formatNumber(item.price)}
                          </td>
                          <td className='p-5 text-right'>
                            ₱{formatNumber(item.quantity * item.price)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
                    {!isPaid && (
                      <li>
                        {isPending ? (
                          <div>Loading...</div>
                        ) : (
                          <div className='w-full'>
                            <PayPalButtons
                              createOrder={createOrder}
                              onApprove={onApprove}
                              onError={onError}
                            ></PayPalButtons>
                          </div>
                        )}
                        {loadingPay && <div>Loading...</div>}
                      </li>
                    )}
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

OrderScreen.auth = true;
