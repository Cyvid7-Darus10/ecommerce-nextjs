import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import { Input, Button } from "@material-tailwind/react";
import { set } from "mongoose";

export default function ResetPassword() {
    const router = useRouter();
    const { token } = router.query;

    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm();

    const submitHandler = async (formData) => {
        try {
            let apiEndpoint, apiPayload;

            if (token) {
                apiEndpoint = "/api/reset-password";
                apiPayload = { ...formData, token };
            } else {
                apiEndpoint = "/api/forgot-password";
                apiPayload = { email: formData.email };
            }

            const response = await fetch(apiEndpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(apiPayload),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Failed to process request.");
            }

            toast.success(
                token
                    ? "Password has been reset."
                    : "Password reset link sent to email."
            );

            setTimeout(() => {
                router.push("/login");
            }, 3000);
        } catch (err) {
            toast.error(err.message || "Failed to process request.");
        }
    };

    return (
        <Layout title="Reset Password" smallHeader={true}>
            <form
                className="mx-auto max-w-screen-md"
                onSubmit={handleSubmit(submitHandler)}>
                <div className="shadow-md p-5 py-10 my-10 lg:mb-80 rounded-md bg-transparent">
                    <h2 className="mb-4 text-lg font-bold">Reset Password</h2>

                    {!token ? (
                        <>
                            <p className="mb-4">
                                Enter your email address and we will send you a
                                link to reset your password.
                            </p>
                            <div className="mb-4">
                                <Input
                                    type="email"
                                    {...register("email", {
                                        required: "Please enter your email",
                                        pattern: {
                                            value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                                            message:
                                                "Please enter a valid email",
                                        },
                                    })}
                                    className="w-full border border-gray-300 rounded-md h-10 px-2"
                                    label="Email"
                                />
                                {errors.email && (
                                    <div className="text-red-500">
                                        {errors.email.message}
                                    </div>
                                )}
                            </div>
                            <div className="mb-4">
                                <Button
                                    color="red"
                                    type="submit"
                                    className="w-full">
                                    Send Reset Link
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <p className="mb-4">
                                Please enter your new password.
                            </p>
                            <div className="mb-4">
                                <Input
                                    type="password"
                                    {...register("newPassword", {
                                        required:
                                            "Please enter your new password",
                                        minLength: 6,
                                    })}
                                    className="w-full border border-gray-300 rounded-md h-10 px-2"
                                    label="New Password"
                                />
                                {errors.password && (
                                    <div className="text-red-500">
                                        {errors.password.message}
                                    </div>
                                )}
                            </div>
                            <div className="mb-4">
                                <Button
                                    color="red"
                                    type="submit"
                                    className="w-full">
                                    Reset Password
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </form>
        </Layout>
    );
}
