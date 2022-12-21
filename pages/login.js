import Link from "next/link";
import React, { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import Layout from "../components/Layout";
import { getError } from "../utils/error";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { Input, Button } from "@material-tailwind/react";

export default function LoginScreen() {
  const { status, data: session } = useSession();
  const router = useRouter();
  const { redirect } = router.query;

  useEffect(() => {
    if (session?.user) {
      router.push(redirect || "/");
    }
  }, [router, session, redirect, status]);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const submitHandler = async ({ email, password }) => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Login success");
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return (
    <Layout title='Login' smallHeader={true}>
      <form
        className='mx-auto max-w-screen-md'
        onSubmit={handleSubmit(submitHandler)}
      >
        <div className='shadow-md p-5 py-10 my-10 lg:mb-80 rounded-md bg-transparent'>
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
              label='Email'
            />
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
            />
            {errors.password && (
              <div className='text-red-500 '>{errors.password.message}</div>
            )}
          </div>
          <div className='mb-4 '>
            <Button color='red' type='submit' className='w-full'>
              Login
            </Button>
          </div>
          <div className='mb-4 '>
            Don&apos;t have an account? &nbsp;
            <Link
              href={`/register?redirect=${redirect || "/"}`}
              className='text-blue-500'
            >
              Register
            </Link>
          </div>
        </div>
      </form>
    </Layout>
  );
}
