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
    <div id='receipt'>
      <div className='flex flex-col items-center justify-center w-full h-full'>
        <div className='flex flex-col w-full h-full items-center'>
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

          <hr className='w-full border-2 border-black my-2 border-dashed' />

          <div className='italic text-center'> {paidAt} </div>
          <div className='italic text-center'> Sale ID: {order._id} </div>
        </div>
      </div>
      <hr className='w-full border-2 border-black my-2 border-dashed' />

      <div className='flex flex-col justify-start items-start'>
        <div className='text-left w-1/2'>
          Invoice To: {shippingAddress?.fullName}
        </div>
        <div className='flex items-start'>
          {shippingAddress?.address}, {shippingAddress?.city},{" "}
          {shippingAddress?.postalCode}, {shippingAddress?.country}{" "}
        </div>
        <div className='flex items-start'>{shippingAddress?.contactNumber}</div>
      </div>

      <hr className='w-full border-2 border-black my-2 border-dashed' />

      <div className='flex justify-center items-center w-screen'>
        <table className='table w-full'>
          <tbody>
            <tr className='border-b-2'>
              <td className='text-center'>Item Name</td>
              <td className='text-center'>Price</td>
              <td className='text-center'>Qty.</td>
              <td className='text-center'>Total</td>
            </tr>
            {orderItems?.map((item, key) => (
              <tr key={key} className='border-b-2 border-t-2'>
                <td className='w-1/2'>{item.name}</td>
                <td className='w-1/4 text-center'>
                  ₱{formatNumber(item.quantity * item.price)}
                </td>
                <td className='w-1/4 text-center'>{item.quantity}</td>
                <td>₱{formatNumber(item.quantity * item.price)}</td>
              </tr>
            ))}
            <tr>
              <td></td>
              <td></td>
              <td className='w-3/4 text-center'>Subtotal</td>
              <td className='w-1/4'>₱{formatNumber(itemsPrice)}</td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td className='w-3/4  text-center'>Shipping</td>
              <td className='w-1/4  text-center'>
                ₱{formatNumber(shippingPrice)}
              </td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td className='w-3/4  text-center'>Tax</td>
              <td className='w-1/4'>₱{formatNumber(taxPrice)}</td>
            </tr>
            <tr>
              <td>Payment Type</td>
              <td className='text-center'> {order.paymentMethod} </td>
              <td className='w-3/4  text-center'>Total</td>
              <td className='w-1/4'>₱{formatNumber(totalPrice)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className='flex flex-col justify-center items-center text-xs mt-20'>
        <div className='w-1/2 text-center'>
          <p>WARRANTY AGREEMENT</p>
          <br />
          <p>
            {`
        Cabsfour warranty it's products contained in their
        original packaging against material and workmanship defects when the
        products are used normally for their intended purposes for a period of
        ONE (1) YEAR from the date of purchase by the original
        end-user("Warranty Period"). A. Seven day outright Replacement. We allow
        all merchandise in new condition, with original packaging and original
        receipt, to be returned or exchange within seven (7) days of purchase.
        To return or exchange items, you must bring the items in its original
        packaging (No packaging No return), proof of purchase Sales Receipt)
        exclusions and limitations apply*`}
          </p>
          <br />
          <p>
            {`B. Standard warranty-after seven days,
        merchandise is no longer eligible for outright Replacement, but can
        still be sent in for warranty claims so long as within the standard
        warranty period. For warranty claim,bring the following Cabsfour Store:
        (1) item with cabsfour warranty sticker, (2) Proof of purchase - sales
        receipt cabsfour reserves the right to determine whether the merchandise
        is defective and to replace merchandise if necessary, depending on stock
        availability, it may take up to 30 days to fulfill a warranty claim. If
        the item is end of life, in store credits will be given to a customer
        instead, which can be used to purchase items of equivalent value,
        customers may opt to add cash to this store credit to purchase items of
        higher value. Cabsfour reserves the right to decline any return or
        exchange when deemed necessary.`}
          </p>
        </div>
      </div>
    </div>
  );
}

OrderScreen.auth = true;
