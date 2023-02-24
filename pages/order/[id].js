import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useReducer } from "react";
import Layout from "../../components/Layout";
import { getError } from "../../utils/error";
import { Card, CardHeader, CardBody, Button } from "@material-tailwind/react";
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
    case "DELIVER_REQUEST":
      return { ...state, loadingDeliver: true };
    case "DELIVER_SUCCESS":
      return { ...state, loadingDeliver: false, successDeliver: true };
    case "DELIVER_FAIL":
      return { ...state, loadingDeliver: false };
    case "DELIVER_RESET":
      return {
        ...state,
        loadingDeliver: false,
        successDeliver: false,
      };
    default:
      state;
  }
}

export default function OrderScreen() {
  const { data: session } = useSession();
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const { query } = useRouter();
  const orderId = query.id;

  const [
    {
      loading,
      error,
      order,
      successPay,
      loadingPay,
      loadingDeliver,
      successDeliver,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    order: {},
    error: "",
  });

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/orders/${orderId}`);
        console.log(data);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    if (
      !order._id ||
      successPay ||
      successDeliver ||
      (order._id && order._id !== orderId)
    ) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: "PAY_RESET" });
      }
      if (successDeliver) {
        dispatch({ type: "DELIVER_RESET" });
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
  }, [order, orderId, paypalDispatch, successDeliver, successPay]);

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

  async function deliverOrderHandler() {
    try {
      dispatch({ type: "DELIVER_REQUEST" });
      const { data } = await axios.put(
        `/api/admin/orders/${order._id}/deliver`,
        {}
      );
      dispatch({ type: "DELIVER_SUCCESS", payload: data });
      toast.success("Order is delivered");
    } catch (err) {
      dispatch({ type: "DELIVER_FAIL", payload: getError(err) });
      toast.error(getError(err));
    }
  }

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

  const nextPay = () => {
    // transfer to new tab
    window.open("https://app.nextpay.world/#/pl/5Iy5aQK0k", "_blank");
  };

  const printReceipt = () => {
    const printContent = document.getElementById("receipt");
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContent.innerHTML;

    const style = `
      @media print {
        @page {
          size: landscape;
        }
      }
    `;
    const styleEl = document.createElement("style");
    styleEl.textContent = style;
    document.head.appendChild(styleEl);

    window.print();
    document.body.innerHTML = originalContents;
  };

  function FormattedDate(props) {
    const date = new Date(props.date);
    const formattedDate = `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()}`;
    // Format the date as dd/mm/yyyy

    return <span>{formattedDate}</span>;
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
                      {orderItems?.map((item) => (
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
                    {!isPaid && (
                      <li>
                        <Button onClick={nextPay} className='w-full'>
                          Next Pay (Gcash, Paymaya, etc.)
                        </Button>
                      </li>
                    )}
                    {session.user.isAdmin &&
                      order.isPaid &&
                      !order.isDelivered && (
                        <li>
                          {loadingDeliver && <div>Loading...</div>}
                          <Button
                            className='primary-button w-full'
                            onClick={deliverOrderHandler}
                          >
                            Deliver Order
                          </Button>
                        </li>
                      )}
                    {order.isPaid && order.isDelivered && (
                      <li>
                        {loadingDeliver && <div>Loading...</div>}
                        <Button
                          className='primary-button w-full'
                          onClick={printReceipt}
                        >
                          Print Receipt
                        </Button>
                      </li>
                    )}
                  </ul>
                </CardBody>
              </Card>
            </div>
          </div>
        )}
      </div>
      <div id='receipt' className='hidden'>
        <div className='flex flex-row items-center justify-between w-full h-full'>
          <div>
            <table className='table border-2'>
              <tr className='border-2'>
                <td className='border-2 text-center' colSpan={2}>
                  In Settlement of The Following
                </td>
              </tr>
              <tr className='border-2'>
                <td className='border-2 text-center'>Particulars</td>
                <td className='border-2 text-center'>Amount</td>
              </tr>
              {orderItems?.map((item, key) => (
                <tr key={key} className='border-2'>
                  <td className='border-2 w-3/4'>{item.name}</td>
                  <td>₱{formatNumber(item.quantity * item.price)}</td>
                </tr>
              ))}
            </table>
          </div>
          <div className='flex flex-col w-full h-full items-start ml-10'>
            <h1 className='text-2xl'>
              <strong>CABSFOR SECURITY SYSTEMS SERVICES</strong>
            </h1>
            <p>A Ricardo Bagac, Bataan</p>
            <p>
              <strong>LEMUILLE T. CABANTAV -</strong> Prop.
            </p>
            <p>
              NON VAT Reg. TIN: <strong>481-999-558-000</strong>
            </p>
            <div className='flex items-center'>
              <div className='text-lg underline'>
                <strong>OFFICIAL RECEIPT</strong>
              </div>
              <div className='ml-40 italic'>
                Date: <FormattedDate date={new Date(paidAt)} />
              </div>
            </div>
            <div className='flex items-center text-sm'>
              <div className='italic'>Received From:</div>
              <div className='ml-2 italic underline'>cabsfour.vercel.app</div>
              <div className='italic ml-2'>With TIN:</div>
              <div className='ml-2 italic underline'>481-999-558-000</div>
            </div>
            <div className='flex items-center text-sm'>
              <div className='italic'>and address at</div>
              <div className='ml-2 italic underline'>
                {shippingAddress?.address}, {shippingAddress?.city},{" "}
                {shippingAddress?.postalCode}{" "}
              </div>
            </div>
            <div className='flex items-center text-sm'>
              <div className='italic'>the sum of</div>
              <div className='ml-2 italic underline'>
                {formatNumber(totalPrice)}
              </div>
              <div className='italic'> pesos</div>
            </div>
          </div>
        </div>
        <div className='flex flex-row justify-between w-full h-full text-xs mt-20'>
          <div>
            <p>10 BKLTS (2x) 000001-000500</p>
            <p>BIR Authority to Print No. 4AU0002130036</p>
            <p>Date Issued: 02-19-19 valid until: 02-18-24</p>
            <p>KUYANG {"'"} S PRINTING PRESS Pb. Balanga, Bataan</p>
            <p>Tel No. 791-1693 ** TIN: 159-331-346-000</p>
          </div>
          <div className='text-sm'>
            By <span className='underline'>cabsfour.vercel.app</span>
          </div>
        </div>
      </div>
    </Layout>
  );
}

OrderScreen.auth = true;
