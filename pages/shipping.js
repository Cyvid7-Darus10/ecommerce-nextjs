import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import CheckoutWizard from "../components/CheckoutWizard";
import Layout from "../components/Layout";
import { Store } from "../utils/Store";
import { useRouter } from "next/router";
import {
  Card,
  CardBody,
  CardFooter,
  Button,
  Input,
} from "@material-tailwind/react";
export default function ShippingScreen() {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm();

  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { shippingAddress } = cart;
  const router = useRouter();

  useEffect(() => {
    setValue("fullName", shippingAddress.fullName);
    setValue("address", shippingAddress.address);
    setValue("city", shippingAddress.city);
    setValue("postalCode", shippingAddress.postalCode);
    setValue("country", shippingAddress.country);
  }, [setValue, shippingAddress]);

  const submitHandler = ({ fullName, address, city, postalCode, country }) => {
    dispatch({
      type: "SAVE_SHIPPING_ADDRESS",
      payload: { fullName, address, city, postalCode, country },
    });
    Cookies.set(
      "cart",
      JSON.stringify({
        ...cart,
        shippingAddress: {
          fullName,
          address,
          city,
          postalCode,
          country,
        },
      })
    );

    router.push("/payment");
  };

  return (
    <Layout title='Shipping Address' smallHeader={true}>
      <div className='flex flex-col items-center justify-center w-full h-full p-4'>
        <CheckoutWizard activeStep={1} />
        <form
          className='mx-auto w-full max-w-xl h-screen'
          onSubmit={handleSubmit(submitHandler)}
        >
          <Card>
            <CardBody className='flex flex-col gap-4'>
              <div className='mb-4'>
                <Input
                  id='fullName'
                  autoFocus
                  {...register("fullName", {
                    required: "Please enter full name",
                  })}
                  className='w-full border border-gray-300 rounded-md h-10 px-2'
                  label='Full Name'
                />
                {errors.fullName && (
                  <div className='text-red-500'>{errors.fullName.message}</div>
                )}
              </div>
              <div className='mb-4'>
                <Input
                  id='address'
                  {...register("address", {
                    required: "Please enter address",
                    minLength: {
                      value: 3,
                      message: "Address is more than 2 chars",
                    },
                  })}
                  className='w-full border border-gray-300 rounded-md h-10 px-2'
                  label='Address'
                />
                {errors.address && (
                  <div className='text-red-500'>{errors.address.message}</div>
                )}
              </div>
              <div className='mb-4'>
                <Input
                  id='city'
                  {...register("city", {
                    required: "Please enter city",
                  })}
                  className='w-full border border-gray-300 rounded-md h-10 px-2'
                  label='City'
                />
                {errors.city && (
                  <div className='text-red-500 '>{errors.city.message}</div>
                )}
              </div>
              <div className='mb-4'>
                <Input
                  id='postalCode'
                  {...register("postalCode", {
                    required: "Please enter postal code",
                  })}
                  className='w-full border border-gray-300 rounded-md h-10 px-2'
                  label='Postal Code'
                />
                {errors.postalCode && (
                  <div className='text-red-500 '>
                    {errors.postalCode.message}
                  </div>
                )}
              </div>
              <div className='mb-4'>
                <Input
                  id='country'
                  {...register("country", {
                    required: "Please enter country",
                  })}
                  className='w-full border border-gray-300 rounded-md h-10 px-2'
                  label='Country'
                />
                {errors.country && (
                  <div className='text-red-500 '>{errors.country.message}</div>
                )}
              </div>
            </CardBody>
            <CardFooter className='pt-0'>
              <div className='mb-4 flex justify-between'>
                <Button color='red' type='submit' className='w-full'>
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

ShippingScreen.auth = true;
