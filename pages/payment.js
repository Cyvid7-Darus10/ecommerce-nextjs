import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import CheckoutWizard from "../components/CheckoutWizard";
import Layout from "../components/Layout";
import { Store } from "../utils/Store";
import {
  Card,
  CardBody,
  CardFooter,
  Radio,
  Button,
} from "@material-tailwind/react";

export default function PaymentScreen() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { shippingAddress, paymentMethod } = cart;

  const router = useRouter();

  const submitHandler = (e) => {
    e.preventDefault();
    if (!selectedPaymentMethod) {
      return toast.error("Payment method is required");
    }
    dispatch({ type: "SAVE_PAYMENT_METHOD", payload: selectedPaymentMethod });
    Cookies.set(
      "cart",
      JSON.stringify({
        ...cart,
        paymentMethod: selectedPaymentMethod,
      })
    );

    router.push("/placeorder");
  };

  useEffect(() => {
    if (!shippingAddress.address) {
      router.push("/shipping");
    }
    setSelectedPaymentMethod(paymentMethod || "");
    return () => {};
  }, [paymentMethod, router, shippingAddress.address]);

  return (
    <Layout title='Payment Method' smallHeader={true}>
      <div className='flex flex-col items-center justify-center w-full h-full p-4'>
        <CheckoutWizard activeStep={2} />
        <form
          className='mx-auto w-full max-w-xl h-screen'
          onSubmit={submitHandler}
        >
          <Card>
            <CardBody className='flex flex-col gap-4'>
              {[
                "PayPal",
                "Next Pay (Bank, Gcash, PayMaya, etc.)",
                "Cash On Delivery",
              ].map((payment) => (
                <div key={payment} className='mb-4'>
                  <Radio
                    name='paymentMethod'
                    id={payment}
                    type='radio'
                    label={payment}
                    value={payment}
                    color='red'
                    checked={selectedPaymentMethod === payment}
                    onChange={() => setSelectedPaymentMethod(payment)}
                  />
                </div>
              ))}
            </CardBody>
            <CardFooter className='pt-0'>
              <div className='mb-4 flex justify-between'>
                <Button onClick={() => router.push("/shipping")} color='gray'>
                  Back
                </Button>
                <Button className='primary-button' color='red' type='submit'>
                  Next
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </div>
    </Layout>
  );
}

PaymentScreen.auth = true;
