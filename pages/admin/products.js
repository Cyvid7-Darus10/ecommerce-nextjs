import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useReducer } from "react";
import { toast } from "react-toastify";
import AdminLayout from "../../components/AdminLayout";
import { getError } from "../../utils/error";
import { Button } from "@material-tailwind/react";
import { formatNumber } from "../../utils/utils";

function reducer(state, action) {
    switch (action.type) {
        case "FETCH_REQUEST":
            return { ...state, loading: true, error: "" };
        case "FETCH_SUCCESS":
            return {
                ...state,
                loading: false,
                products: action.payload,
                error: "",
            };
        case "FETCH_FAIL":
            return { ...state, loading: false, error: action.payload };
        case "CREATE_REQUEST":
            return { ...state, loadingCreate: true };
        case "CREATE_SUCCESS":
            return { ...state, loadingCreate: false };
        case "CREATE_FAIL":
            return { ...state, loadingCreate: false };
        case "DELETE_REQUEST":
            return { ...state, loadingDelete: true };
        case "DELETE_SUCCESS":
            return { ...state, loadingDelete: false, successDelete: true };
        case "DELETE_FAIL":
            return { ...state, loadingDelete: false };
        case "DELETE_RESET":
            return { ...state, loadingDelete: false, successDelete: false };

        default:
            state;
    }
}
export default function AdminProdcutsScreen() {
    const router = useRouter();

    const [
        {
            loading,
            error,
            products,
            loadingCreate,
            successDelete,
            loadingDelete,
        },
        dispatch,
    ] = useReducer(reducer, {
        loading: true,
        products: [],
        error: "",
    });

    const createHandler = async () => {
        if (!window.confirm("Are you sure?")) {
            return;
        }
        try {
            dispatch({ type: "CREATE_REQUEST" });
            const { data } = await axios.post(`/api/admin/products`);
            dispatch({ type: "CREATE_SUCCESS" });
            toast.success("Product created successfully");
            router.push(`/admin/product/${data.product._id}`);
        } catch (err) {
            dispatch({ type: "CREATE_FAIL" });
            toast.error(getError(err));
        }
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch({ type: "FETCH_REQUEST" });
                const { data } = await axios.get(`/api/admin/products`);
                dispatch({ type: "FETCH_SUCCESS", payload: data });
            } catch (err) {
                dispatch({ type: "FETCH_FAIL", payload: getError(err) });
            }
        };

        if (successDelete) {
            dispatch({ type: "DELETE_RESET" });
        } else {
            fetchData();
        }
    }, [successDelete]);

    const deleteHandler = async (productId) => {
        if (!window.confirm("Are you sure?")) {
            return;
        }
        try {
            dispatch({ type: "DELETE_REQUEST" });
            await axios.delete(`/api/admin/products/${productId}`);
            dispatch({ type: "DELETE_SUCCESS" });
            toast.success("Product deleted successfully");
        } catch (err) {
            dispatch({ type: "DELETE_FAIL" });
            toast.error(getError(err));
        }
    };
    return (
        <AdminLayout title="Admin Products">
            <div className="overflow-x-auto md:col-span-3">
                <div className="flex justify-between">
                    <h1 className="text-2xl mb-4 font-semibold">Products</h1>
                    {loadingDelete && <div>Deleting item...</div>}
                    <Button
                        disabled={loadingCreate}
                        onClick={createHandler}
                        className="primary-button">
                        {loadingCreate ? "Loading" : "Create"}
                    </Button>
                </div>
                {loading ? (
                    <div>Loading...</div>
                ) : error ? (
                    <div className="alert-error">{error}</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="border-b">
                                <tr>
                                    <th className="px-5 text-left">ID</th>
                                    <th className="p-5 text-left">NAME</th>
                                    <th className="p-5 text-left">PRICE</th>
                                    <th className="p-5 text-left">CATEGORY</th>
                                    <th className="p-5 text-left">COUNT</th>
                                    <th className="p-5 text-left">RATING</th>
                                    <th className="p-5 text-left">ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product._id} className="border-b">
                                        <td className="p-5">
                                            {product._id.substring(20, 24)}
                                        </td>
                                        <td className="p-5">{product.name}</td>
                                        <td className="p-5">
                                            ₱{formatNumber(product.price)}
                                        </td>
                                        <td className="p-5">
                                            {product.category}
                                        </td>
                                        <td className="p-5">
                                            {product.countInStock}
                                        </td>
                                        <td className="p-5">
                                            {product.rating}
                                        </td>
                                        <td className="p-5 text-center flex flex-col">
                                            <Link
                                                href={`/admin/product/${product._id}`}
                                                className="text-blue-500 hover:text-blue-700 pb-5">
                                                Edit
                                            </Link>

                                            <Button
                                                onClick={() =>
                                                    deleteHandler(product._id)
                                                }
                                                color="red">
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

AdminProdcutsScreen.auth = { adminOnly: true };
