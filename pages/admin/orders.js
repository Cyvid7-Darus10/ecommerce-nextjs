import axios from "axios";
import Link from "next/link";
import React, { useEffect, useReducer } from "react";
import AdminLayout from "../../components/AdminLayout";
import { getError } from "../../utils/error";
import { formatNumber } from "../../utils/utils";

function reducer(state, action) {
    switch (action.type) {
        case "FETCH_REQUEST":
            return { ...state, loading: true, error: "" };
        case "FETCH_SUCCESS":
            return {
                ...state,
                loading: false,
                orders: action.payload,
                error: "",
            };
        case "FETCH_FAIL":
            return { ...state, loading: false, error: action.payload };
        default:
            state;
    }
}

export default function AdminOrderScreen() {
    const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
        loading: true,
        orders: [],
        error: "",
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch({ type: "FETCH_REQUEST" });
                const { data } = await axios.get(`/api/admin/orders`);
                dispatch({ type: "FETCH_SUCCESS", payload: data });
            } catch (err) {
                dispatch({ type: "FETCH_FAIL", payload: getError(err) });
            }
        };
        fetchData();
    }, []);

    return (
        <AdminLayout title="Admin Dashboard">
            <div className="p-4">
                <h1 className="text-2xl mb-4 font-semibold">Admin Orders</h1>

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
                                    <th className="p-5 text-left">USER</th>
                                    <th className="p-5 text-left">DATE</th>
                                    <th className="p-5 text-left">TOTAL</th>
                                    <th className="p-5 text-left">PAID</th>
                                    <th className="p-5 text-left">DELIVERED</th>
                                    <th className="p-5 text-left">ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order._id} className="border-b">
                                        <td className="p-5">
                                            {order._id.substring(20, 24)}
                                        </td>
                                        <td className="p-5">
                                            {order.user
                                                ? `${order.user.firstName} ${order.user.lastName}`
                                                : "DELETED USER"}
                                        </td>
                                        <td className="p-5">
                                            {order.createdAt.substring(0, 10)}
                                        </td>
                                        <td className="p-5">
                                            ₱{formatNumber(order.totalPrice)}
                                        </td>
                                        <td className="p-5">
                                            {order.isPaid
                                                ? `${order.paidAt.substring(
                                                      0,
                                                      10
                                                  )}`
                                                : "not paid"}
                                        </td>
                                        <td className="p-5">
                                            {order.isDelivered
                                                ? `${order.deliveredAt.substring(
                                                      0,
                                                      10
                                                  )}`
                                                : "not delivered"}
                                        </td>
                                        <td className="p-5">
                                            <Link
                                                href={`/order/${order._id}`}
                                                passHref
                                                className="text-blue-500">
                                                Details
                                            </Link>
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

AdminOrderScreen.auth = { adminOnly: true };
