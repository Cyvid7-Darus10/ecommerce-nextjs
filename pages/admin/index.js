import Link from "next/link";
import React, { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { getError } from "../../utils/error";
import { Input, Button } from "@material-tailwind/react";
import Image from "next/image";
import { signOut } from "next-auth/react";

export default function AdminLogin() {
    const { status, data: session } = useSession();
    const router = useRouter();
    const { redirect } = router.query;

    useEffect(() => {
        if (session?.user) {
            if (!session.user.isAdmin) {
                signOut({ callbackUrl: "/admin" });
                toast.error("Access denied. Admins only.");
                router.push("/");
                return;
            }

            router.push(redirect || "/admin/dashboard");
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
                router.push("/admin/dashboard");
            }
        } catch (err) {
            toast.error(getError(err));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                className="bg-white p-10 shadow-lg rounded-md"
                onSubmit={handleSubmit(submitHandler)}>
                <div className="mb-6 flex justify-center flex-col items-center">
                    <Image
                        src="/images/cabsfour_logo_home.png"
                        className="object-contain"
                        alt="logo"
                        width={100}
                        height={100}
                    />
                    <p>Admin Dashboard</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <Input
                            type="email"
                            {...register("email", {
                                required: "Please enter email",
                                pattern: {
                                    value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                                    message: "Please enter valid email",
                                },
                            })}
                            className="w-full"
                            label="Email"
                        />
                        {errors.email && (
                            <div className="text-red-500 mt-1">
                                {errors.email.message}
                            </div>
                        )}
                    </div>

                    <div>
                        <Input
                            type="password"
                            {...register("password", {
                                /*...validation rules*/
                            })}
                            className="w-full"
                            id="password"
                            label="Password"
                        />
                        {errors.password && (
                            <div className="text-red-500 mt-1">
                                {errors.password.message}
                            </div>
                        )}
                    </div>

                    <div>
                        <Button color="red" type="submit" className="w-full">
                            Login
                        </Button>
                    </div>

                    <div className="mt-4 flex items-center justify-center">
                        <Link href="/forgot-password">Forgot Password?</Link>
                    </div>
                </div>
            </form>
        </div>
    );
}
