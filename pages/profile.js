import React, { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { getError } from "../utils/error";
import axios from "axios";
import Layout from "../components/Layout";
import { Input, Button } from "@material-tailwind/react";

export default function ProfileScreen() {
  const { data: session } = useSession();

  const {
    handleSubmit,
    register,
    getValues,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setValue("userName", session?.user?.userName);
    setValue("firstName", session?.user?.firstName);
    setValue("lastName", session?.user?.lastName);
    setValue("email", session?.user?.email);
  }, [session.user, setValue]);

  const submitHandler = async ({
    userName,
    firstName,
    lastName,
    email,
    password,
  }) => {
    try {
      await axios.put("/api/auth/update", {
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
      toast.success("Profile updated successfully");
      if (result.error) {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return (
    <Layout title='Profile' smallHeader={true}>
      <form
        className='mx-auto max-w-screen-md'
        onSubmit={handleSubmit(submitHandler)}
      >
        <div className='shadow-md w-full  p-5 py-10 my-10 lg:mb-80 rounded-md bg-transparent'>
          <h1 className='mb-4 text-2xl text-center w-96'>
            Update User Account
          </h1>
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
              Update Profile
            </Button>
          </div>
        </div>
      </form>
    </Layout>
  );
}

ProfileScreen.auth = true;
