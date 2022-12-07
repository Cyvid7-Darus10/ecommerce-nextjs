import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";
import Layout from "../components/Layout";

export default function LoginScreen() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const submitHandler = ({ email, password }) => {
    console.log(email, password);
  };

  return (
    <Layout title='Login' smallHeader={true}>
      <form
        className='mx-auto max-w-screen-md'
        onSubmit={handleSubmit(submitHandler)}
      >
        <div className='shadow-md p-5 py-10 my-10 lg:mb-80 rounded-md bg-transparent'>
          <div className='mb-4'>
            <label htmlFor='email'>Email</label>
            <input
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
              autoFocus
            ></input>
            {errors.email && (
              <div className='text-red-500'>{errors.email.message}</div>
            )}
          </div>
          <div className='mb-4'>
            <label htmlFor='password'>Password</label>
            <input
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
              autoFocus
            ></input>
            {errors.password && (
              <div className='text-red-500 '>{errors.password.message}</div>
            )}
          </div>
          <div className='mb-4 '>
            <button className='bg-[#f44336] text-white px-5 py-2 rounded-md'>
              Login
            </button>
          </div>
          <div className='mb-4 '>
            Don&apos;t have an account? &nbsp;
            <Link href='register'>Register</Link>
          </div>
        </div>
      </form>
    </Layout>
  );
}
