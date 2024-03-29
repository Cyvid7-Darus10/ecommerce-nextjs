import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useReducer } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import AdminLayout from "../../../components/AdminLayout";
import { getError } from "../../../utils/error";
import { Input, Button, Textarea } from "@material-tailwind/react";

function reducer(state, action) {
    switch (action.type) {
        case "FETCH_REQUEST":
            return { ...state, loading: true, error: "" };
        case "FETCH_SUCCESS":
            return { ...state, loading: false, error: "" };
        case "FETCH_FAIL":
            return { ...state, loading: false, error: action.payload };

        case "UPDATE_REQUEST":
            return { ...state, loadingUpdate: true, errorUpdate: "" };
        case "UPDATE_SUCCESS":
            return { ...state, loadingUpdate: false, errorUpdate: "" };
        case "UPDATE_FAIL":
            return {
                ...state,
                loadingUpdate: false,
                errorUpdate: action.payload,
            };
        case "UPLOAD_REQUEST":
            return { ...state, loadingUpload: true, errorUpload: "" };
        case "UPLOAD_SUCCESS":
            return {
                ...state,
                loadingUpload: false,
                errorUpload: "",
            };
        case "UPLOAD_FAIL":
            return {
                ...state,
                loadingUpload: false,
                errorUpload: action.payload,
            };

        default:
            return state;
    }
}
export default function AdminProductEditScreen() {
    const { query } = useRouter();
    const productId = query.id;
    const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
        useReducer(reducer, {
            loading: true,
            error: "",
        });

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm();

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch({ type: "FETCH_REQUEST" });
                const { data } = await axios.get(
                    `/api/admin/products/${productId}`
                );
                dispatch({ type: "FETCH_SUCCESS" });
                setValue("name", data.name);
                setValue("slug", data.slug);
                setValue("price", data.price);
                setValue("image", data.image);
                setValue("category", data.category);
                setValue("brand", data.brand);
                setValue("countInStock", data.countInStock);
                setValue("description", data.description);
            } catch (err) {
                dispatch({ type: "FETCH_FAIL", payload: getError(err) });
            }
        };

        fetchData();
    }, [productId, setValue]);

    const router = useRouter();

    const uploadHandler = async (e, imageField = "image") => {
        const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`;
        try {
            dispatch({ type: "UPLOAD_REQUEST" });
            const {
                data: { signature, timestamp },
            } = await axios("/api/admin/cloudinary-sign");

            const file = e.target.files[0];
            const formData = new FormData();
            formData.append("file", file);
            formData.append("signature", signature);
            formData.append("timestamp", timestamp);
            formData.append(
                "api_key",
                process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY
            );
            const { data } = await axios.post(url, formData);
            dispatch({ type: "UPLOAD_SUCCESS" });
            setValue(imageField, data.secure_url);
            toast.success("File uploaded successfully");
        } catch (err) {
            dispatch({ type: "UPLOAD_FAIL", payload: getError(err) });
            toast.error(getError(err));
        }
    };

    const submitHandler = async ({
        name,
        slug,
        price,
        category,
        image,
        brand,
        countInStock,
        description,
    }) => {
        try {
            dispatch({ type: "UPDATE_REQUEST" });
            await axios.put(`/api/admin/products/${productId}`, {
                name,
                slug,
                price,
                category,
                image,
                brand,
                countInStock,
                description,
            });
            dispatch({ type: "UPDATE_SUCCESS" });
            toast.success("Product updated successfully");
            router.push("/admin/products");
        } catch (err) {
            dispatch({ type: "UPDATE_FAIL", payload: getError(err) });
            toast.error(getError(err));
        }
    };

    return (
        <AdminLayout title={`Edit Product ${productId}`} smallHeader={true}>
            <div className="p-4">
                <div className="md:col-span-3">
                    {loading ? (
                        <div>Loading...</div>
                    ) : error ? (
                        <div className="alert-error">{error}</div>
                    ) : (
                        <form
                            className="mx-auto max-w-screen-md"
                            onSubmit={handleSubmit(submitHandler)}>
                            <h1 className="mb-4 text-xl">{`Edit Product ${productId}`}</h1>
                            <div className="mb-4">
                                <Input
                                    type="text"
                                    className="w-full"
                                    id="name"
                                    autoFocus
                                    {...register("name", {
                                        required: "Please enter name",
                                    })}
                                    label="Name"
                                />
                                {errors.name && (
                                    <div className="text-red-500">
                                        {errors.name.message}
                                    </div>
                                )}
                            </div>
                            <div className="mb-4">
                                <Input
                                    type="text"
                                    className="w-full"
                                    id="slug"
                                    {...register("slug", {
                                        required: "Please enter slug",
                                    })}
                                    label="Slug"
                                />
                                {errors.slug && (
                                    <div className="text-red-500">
                                        {errors.slug.message}
                                    </div>
                                )}
                            </div>
                            <div className="mb-4">
                                <Input
                                    type="text"
                                    className="w-full"
                                    id="price"
                                    {...register("price", {
                                        required: "Please enter price",
                                    })}
                                    label="Price"
                                />
                                {errors.price && (
                                    <div className="text-red-500">
                                        {errors.price.message}
                                    </div>
                                )}
                            </div>
                            <div className="mb-4">
                                <Input
                                    type="text"
                                    className="w-full"
                                    id="image"
                                    {...register("image", {
                                        required: "Please enter image",
                                    })}
                                    label="Image"
                                />
                                {errors.image && (
                                    <div className="text-red-500">
                                        {errors.image.message}
                                    </div>
                                )}
                            </div>
                            <div className="mb-4">
                                <Input
                                    type="file"
                                    className="w-full"
                                    id="imageFile"
                                    onChange={uploadHandler}
                                    label="Image File"
                                />
                                {loadingUpload && <div>Uploading....</div>}
                            </div>
                            <div className="mb-4">
                                <Input
                                    type="text"
                                    className="w-full"
                                    id="category"
                                    {...register("category", {
                                        required: "Please enter category",
                                    })}
                                    label="Category"
                                />
                                {errors.category && (
                                    <div className="text-red-500">
                                        {errors.category.message}
                                    </div>
                                )}
                            </div>
                            <div className="mb-4">
                                <Input
                                    type="text"
                                    className="w-full"
                                    id="brand"
                                    {...register("brand", {
                                        required: "Please enter brand",
                                    })}
                                    label="Brand"
                                />
                                {errors.brand && (
                                    <div className="text-red-500">
                                        {errors.brand.message}
                                    </div>
                                )}
                            </div>
                            <div className="mb-4">
                                <Input
                                    type="text"
                                    className="w-full"
                                    id="countInStock"
                                    {...register("countInStock", {
                                        required: "Please enter countInStock",
                                    })}
                                    label="Count In Stock"
                                />
                                {errors.countInStock && (
                                    <div className="text-red-500">
                                        {errors.countInStock.message}
                                    </div>
                                )}
                            </div>
                            <div className="mb-4">
                                <Textarea
                                    type="text"
                                    className="w-full"
                                    id="description"
                                    {...register("description", {
                                        required: "Please enter description",
                                    })}
                                    label="Description"
                                    height={200}
                                />
                                {errors.description && (
                                    <div className="text-red-500">
                                        {errors.description.message}
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-between">
                                <div className="mb-4">
                                    <Link href={`/admin/products`}>Back</Link>
                                </div>
                                <Button disabled={loadingUpdate} type="submit">
                                    {loadingUpdate ? "Loading" : "Update"}
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}

AdminProductEditScreen.auth = { adminOnly: true };
