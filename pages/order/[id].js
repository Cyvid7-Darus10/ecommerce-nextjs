import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState, useReducer } from "react";
import Layout from "../../components/Layout";
import { getError } from "../../utils/error";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { toast } from "react-toastify";
import { formatNumber } from "../../utils/utils";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

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
  const [open, setOpen] = useState(false);
  const [refundReason, setRefundReason] = useState("Damaged - default");
  const [itemId, setItemId] = useState("");
  const [openStatus, setOpenStatus] = useState(false);
  const [status, setStatus] = useState({
    status: "",
    reason: "",
    resolution: "",
  });
  const [resolveView, setResolveView] = useState(false);
  const [resolveMessage, setResolveMessage] = useState("");
  const [openDeliveryView, setOpenDeliveryView] = useState(false);
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

  const refundHandler = (item_id) => {
    setItemId(item_id);
    setOpen(true);
  };

  const handleRefundRequest = async () => {
    const { data } = await axios.post(`/api/orders/${order._id}/refund`, {
      item_id: itemId,
      reason: refundReason,
    });
    if (data.success) {
      toast.success(data.message);
    } else {
      toast.error(data.message);
    }
    setOpen(false);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const refundView = (item) => {
    setOpenStatus(true);
    console.log(item);
    setStatus({
      status: item.refundStatus,
      reason: item.refundReason,
      resolution: item.refundResolution,
    });
  };

  const resolveRefund = (item_id) => {
    setResolveView(true);
    setItemId(item_id);
  };

  const handleRefundResolution = async () => {
    const { data } = await axios.post(
      `/api/orders/${order._id}/resolve-refund`,
      {
        item_id: itemId,
        resolve_message: resolveMessage,
      }
    );
    if (data.success) {
      toast.success(data.message);
    } else {
      toast.error(data.message);
    }
    setResolveView(false);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const updateDeliveryLocation = async () => {
    const { data } = await axios.post(
      `/api/orders/${order._id}/update-delivery-location`,
      {
        delivery_location: resolveMessage,
      }
    );
    if (data.success) {
      toast.success(data.message);
    } else {
      toast.error(data.message);
    }
    setOpenDeliveryView(false);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

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
                    <>
                      <div className='text-red-500'>Not delivered</div>
                      <div className='text-green-500'>
                        Current Location: {order.currentLocation}
                      </div>
                    </>
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
                        <th className='p-5 text-right'>Refund/Return</th>
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
                          <td className='p-5 text-right'>
                            {(item.refund || item?.refundResolution) && (
                              <button
                                className='bg-green-500 text-white px-2 py-1 rounded-sm'
                                onClick={() => refundView(item)}
                              >
                                View Status
                              </button>
                            )}

                            {!item.refund &&
                              order.isDelivered &&
                              !item?.refundResolution && (
                                <button
                                  className='bg-red-500 text-white px-2 py-1 rounded-sm'
                                  onClick={() => refundHandler(item._id)}
                                >
                                  Refund
                                </button>
                              )}

                            {session.user.isAdmin && item.refund && (
                              <button
                                className='bg-blue-500 text-white px-2 py-1 rounded-sm mt-5'
                                onClick={() => resolveRefund(item._id)}
                              >
                                Resolve
                              </button>
                            )}
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
                    {!order.isDelivered && (
                      <li>
                        {loadingDeliver && <div>Loading...</div>}
                        <Button
                          className='primary-green w-full mt-10'
                          onClick={() => setOpenDeliveryView(true)}
                        >
                          Update Delivery Status
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
      <Dialog open={openStatus} handler={() => setOpenStatus(false)}>
        <DialogHeader>Refund Status</DialogHeader>
        <DialogBody divider>
          <div className='flex flex-col'>
            <p>Refund Status: {status.status}</p>
            <p>Refund Reason: {status.reason}</p>
            <p>Refund Resolution: {status.resolution}</p>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant='text'
            color='red'
            onClick={() => setOpenStatus(false)}
            className='mr-1'
          >
            <span>Cancel</span>
          </Button>
          <Button
            variant='gradient'
            color='green'
            onClick={handleRefundRequest}
          >
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog open={open} handler={() => setOpen(false)}>
        <DialogHeader>Submit Claim</DialogHeader>
        <DialogBody divider>
          <select
            className='w-full border-2 rounded-sm p-2'
            onChange={(e) => setRefundReason(e.target.value)}
          >
            <option value=''>Select Reason</option>
            <option value='Damaged'>Damaged</option>
            <option value='Defective'>Defective</option>
            <option value='Wrong Item'>Wrong Item</option>
            <option value='Missing Item'>Missing Item</option>
          </select>
        </DialogBody>
        <DialogFooter>
          <Button
            variant='text'
            color='red'
            onClick={() => setOpen(false)}
            className='mr-1'
          >
            <span>Cancel</span>
          </Button>
          <Button
            variant='gradient'
            color='green'
            onClick={handleRefundRequest}
          >
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog open={resolveView} handler={() => setResolveView(false)}>
        <DialogHeader>Resolve Message</DialogHeader>
        <DialogBody divider>
          <input
            type='text'
            className='w-full border-2 rounded-sm p-2'
            onChange={(e) => setResolveMessage(e.target.value)}
          />
        </DialogBody>
        <DialogFooter>
          <Button
            variant='text'
            color='red'
            onClick={() => setResolveView(false)}
            className='mr-1'
          >
            <span>Cancel</span>
          </Button>
          <Button
            variant='gradient'
            color='green'
            onClick={handleRefundResolution}
          >
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog
        open={openDeliveryView}
        handler={() => setOpenDeliveryView(false)}
      >
        <DialogHeader>Update Delivery Location</DialogHeader>
        <DialogBody divider>
          <select
            className='w-full border-2 rounded-sm p-2'
            onChange={(e) => setResolveMessage(e.target.value)}
          >
            <option value=''>Select Reason</option>
            <option value='Unpaid orders are considered incomplete and will not be processed'>
              Unpaid orders are considered incomplete and will not be processed
            </option>
            <option value='Order placed'>Order placed</option>
            <option value='Seller is preparing for ship your parcel.'>
              Seller is preparing for ship your parcel.
            </option>
            <option value='Your parcel is out of delivery'>
              Your parcel is out of delivery
            </option>
            <option value='Parcel has been delivered.'>
              Parcel has been delivered.
            </option>
          </select>
        </DialogBody>
        <DialogFooter>
          <Button
            variant='text'
            color='red'
            onClick={() => setResolveView(false)}
            className='mr-1'
          >
            <span>Cancel</span>
          </Button>
          <Button
            variant='gradient'
            color='green'
            onClick={updateDeliveryLocation}
          >
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>

      <div id='receipt' className='hidden'>
        <div className='block'>
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
            <div className='flex items-start'>
              {shippingAddress?.contactNumber}
            </div>
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
        </div>
        {/* push to the buttom */}
        <div className='block text-center text-[10px] absolute bottom-0'>
          <div className='text-center'>
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
    </Layout>
  );
}

OrderScreen.auth = true;
