import axios from "axios";
import Link from "next/link";
import { Bar } from "react-chartjs-2";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import React, { useEffect, useReducer } from "react";
import AdminLayout from "../../components/AdminLayout";
import { getError } from "../../utils/error";
import { formatNumber } from "../../utils/utils";

import { Card } from "@material-tailwind/react";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: "top",
        },
    },
};

function reducer(state, action) {
    switch (action.type) {
        case "FETCH_REQUEST":
            return { ...state, loading: true, error: "" };
        case "FETCH_SUCCESS":
            return {
                ...state,
                loading: false,
                summary: action.payload,
                error: "",
            };
        case "FETCH_FAIL":
            return { ...state, loading: false, error: action.payload };
        default:
            state;
    }
}

function AdminDashboardScreen() {
    const [{ loading, error, summary }, dispatch] = useReducer(reducer, {
        loading: true,
        summary: { salesData: [] },
        error: "",
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch({ type: "FETCH_REQUEST" });
                const { data } = await axios.get(`/api/admin/summary`);
                dispatch({ type: "FETCH_SUCCESS", payload: data });
            } catch (err) {
                dispatch({ type: "FETCH_FAIL", payload: getError(err) });
            }
        };

        fetchData();
    }, []);

    const data = {
        labels: summary.salesData.map((x) => x._id), // 2022/01 2022/03
        datasets: [
            {
                label: "Sales",
                backgroundColor: "rgba(162, 222, 208, 1)",
                data: summary.salesData.map((x) => x.totalSales),
            },
        ],
    };
    return (
        <AdminLayout title="Admin Dashboard">
            <div className="p-4">
                <h1 className="text-2xl mb-4 font-semibold">Admin Dashboard</h1>

                {loading ? (
                    <div>Loading...</div>
                ) : error ? (
                    <div className="alert-error">{error}</div>
                ) : (
                    <div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <Card className="p-4 flex flex-col justify-between items-center shadow-lg">
                                <p className="text-4xl mb-2">
                                    ₱{formatNumber(summary.ordersPrice)}
                                </p>
                                <p className="font-semibold mb-4">Sales</p>
                                <Link
                                    href="/admin/orders"
                                    className="text-blue-500 underline">
                                    View sales
                                </Link>
                            </Card>

                            <Card className="p-4 flex flex-col justify-between items-center shadow-lg">
                                <p className="text-4xl mb-2">
                                    {summary.ordersCount}
                                </p>
                                <p className="font-semibold mb-4">Orders</p>
                                <Link
                                    href="/admin/orders"
                                    className="text-blue-500 underline">
                                    View orders
                                </Link>
                            </Card>

                            <Card className="p-4 flex flex-col justify-between items-center shadow-lg">
                                <p className="text-4xl mb-2">
                                    {summary.productsCount}
                                </p>
                                <p className="font-semibold mb-4">Products</p>
                                <Link
                                    href="/admin/products"
                                    className="text-blue-500 underline">
                                    View products
                                </Link>
                            </Card>

                            <Card className="p-4 flex flex-col justify-between items-center shadow-lg">
                                <p className="text-4xl mb-2">
                                    {summary.usersCount}
                                </p>
                                <p className="font-semibold mb-4">Users</p>
                                <Link
                                    href="/admin/users"
                                    className="text-blue-500 underline">
                                    View users
                                </Link>
                            </Card>
                        </div>

                        <div className="mt-8">
                            <h2 className="text-xl mb-4 font-semibold">
                                Sales Report
                            </h2>
                            <div className="shadow-lg p-4 bg-white">
                                <Bar options={options} data={data} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

AdminDashboardScreen.auth = { adminOnly: true };
export default AdminDashboardScreen;
