import React, { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import Layout from "../components/Layout";
import { getError } from "../utils/error";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import axios from "axios";
import { Input, Button } from "@material-tailwind/react";

export default function LoginScreen() {
  const { data: session } = useSession();

  const router = useRouter();
  const { redirect } = router.query;

  useEffect(() => {
    if (session?.user) {
      router.push(redirect || "/");
    }
  }, [router, session, redirect]);

  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors },
  } = useForm();

  const submitHandler = async ({
    userName,
    firstName,
    lastName,
    email,
    password,
  }) => {
    try {
      await axios.post("/api/auth/signup", {
        userName,
        firstName,
        lastName,
        email,
        password,
      });

      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (result.error) {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };
  return (
    <Layout title='Create Account' smallHeader={true}>
      <form
        className='mx-auto max-w-screen-md'
        onSubmit={handleSubmit(submitHandler)}
      >
        <div className='shadow-md w-full  p-5 py-10 my-10 lg:mb-80 rounded-md bg-transparent'>
          <h1 className='mb-4 text-2xl text-center w-96'>Create Account</h1>
          <div className='mb-4'>
            <Input
              type='text'
              className='w-full border border-gray-300 rounded-md h-10 px-2'
              id='userName'
              autoFocus
              {...register("userName", {
                required: "Please enter user name",
              })}
              label='User Name'
            />
            {errors.userName && (
              <div className='text-red-500'>{errors.userName.message}</div>
            )}
          </div>

          <div className='mb-4'>
            <Input
              type='text'
              className='w-full border border-gray-300 rounded-md h-10 px-2'
              id='firstName'
              autoFocus
              {...register("firstName", {
                required: "Please enter first name",
              })}
              label='First Name'
            />
            {errors.firstName && (
              <div className='text-red-500'>{errors.firstName.message}</div>
            )}
          </div>

          <div className='mb-4'>
            <Input
              type='text'
              className='w-full border border-gray-300 rounded-md h-10 px-2'
              id='lastName'
              autoFocus
              {...register("lastName", {
                required: "Please enter last name",
              })}
              label='Last Name'
            />
            {errors.lastName && (
              <div className='text-red-500'>{errors.lastName.message}</div>
            )}
          </div>

          <div className='mb-4'>
            <Input
              type='email'
              {...register("email", {
                required: "Please enter email",
                pattern: {
                  value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                  message: "Please enter valid email",
                },
              })}
              className='w-full border border-gray-300 rounded-md h-10 px-2'
              id='email'
              label='Email'
            ></Input>
            {errors.email && (
              <div className='text-red-500'>{errors.email.message}</div>
            )}
          </div>
          <div className='mb-4'>
            <Input
              type='password'
              {...register("password", {
                required: "Please enter password",
                minLength: {
                  value: 6,
                  message: "password is more than 5 chars",
                },
              })}
              className='w-full border border-gray-300 rounded-md h-10 px-2'
              id='password'
              label='Password'
              autoFocus
            ></Input>
            {errors.password && (
              <div className='text-red-500 '>{errors.password.message}</div>
            )}
          </div>
          <div className='mb-4'>
            <Input
              className='w-full border border-gray-300 rounded-md h-10 px-2'
              type='password'
              id='confirmPassword'
              {...register("confirmPassword", {
                required: "Please enter confirm password",
                validate: (value) => value === getValues("password"),
                minLength: {
                  value: 6,
                  message: "confirm password is more than 5 chars",
                },
              })}
              label='Confirm Password'
            />
            {errors.confirmPassword && (
              <div className='text-red-500 '>
                {errors.confirmPassword.message}
              </div>
            )}
            {errors.confirmPassword &&
              errors.confirmPassword.type === "validate" && (
                <div className='text-red-500 '>Password do not match</div>
              )}
          </div>

          <div className='mb-4 '>
            <Button
              color='red'
              className='w-full border border-gray-300 rounded-md h-10 px-2'
              type='submit'
            >
              Register
            </Button>
          </div>
        </div>
      </form>
    </Layout>
  );
}
