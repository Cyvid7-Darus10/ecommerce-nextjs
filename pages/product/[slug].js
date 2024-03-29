import React, { useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import data from "../../utils/data";
import { Store } from "../../utils/Store";
import { formatNumber } from "../../utils/utils";
import Layout from "../../components/Layout";
import CommentForm from "../../components/pages/product/CommentForm";
import Comments from "../../components/pages/product/Comments";
import { toast } from "react-toastify";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Product from "../../models/Product";
import axios from "axios";
import db from "../../utils/db";
import ReactStars from "react-stars";
import { useSession } from "next-auth/react";

export default function ProductScreen({ product }) {
    const { state, dispatch } = useContext(Store);
    const { query } = useRouter();
    const { slug } = query;
    const [comments, setComments] = useState([]);
    const [randomProducts, setRandomProducts] = useState([]);
    const { data: session } = useSession();

    useEffect(() => {
        const randommizedProducts = data.products.sort(
            () => Math.random() - 0.5
        );
        const randomFourProducts = randommizedProducts.slice(0, 4);
        setRandomProducts(randomFourProducts);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get(
                    `/api/comments?productId=${product._id}`
                );

                setComments(data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slug]);

    if (!product) {
        return <div>Product Not Found</div>;
    }

    const addToCartHandler = () => {
        const existItem = state.cart.cartItems.find((x) => x.slug === slug);

        const quantity = existItem ? existItem.quantity + 1 : 1;

        if (product.countInStock < quantity) {
            toast.error("Sorry. Product is out of stock.");
            return;
        }

        dispatch({
            type: "CART_UPDATE_ITEM",
            payload: { ...product, quantity: quantity },
        });
    };

    return (
        <>
            <Layout title="Product" smallHeader={true}>
                <div className="container px-0 mx-0 mb-5">
                    <div className="flex items-center py-2 px-5">
                        <Link href="/products">
                            <div className="flex items-center">
                                <ArrowBackIcon className="text-[#f44336] text-2xl mr-2" />
                                <p className="text-[#f44336] text-xl">
                                    Back to Products
                                </p>
                            </div>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-12 px-5">
                        <div className="flex flex-col items-center">
                            <div className="w-100 h-100">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    width={500}
                                    height={500}
                                    className="w-100 h-100"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-100 h-100">
                                <h1 className="text-3xl font-semibold">
                                    {product.name}
                                </h1>
                                <p className="text-2xl font-semibold py-2">
                                    Price: ₱{formatNumber(product.price)}
                                </p>
                                <p className="text-2xl font-semibold py-2 flex items-center gap-2">
                                    Rating:
                                    <ReactStars
                                        count={5}
                                        size={24}
                                        color2={"#ffd700"}
                                        edit={false}
                                        value={product.rating}
                                    />
                                </p>
                                <p className="text-xl font-semibold py-2">
                                    Description:
                                </p>
                                <p className="text-lg py-2">
                                    {product.description
                                        .split(",")
                                        .map((item, index) => (
                                            <span key={index}>
                                                • {item}
                                                <br />
                                            </span>
                                        ))}
                                </p>
                            </div>

                            <button
                                className="bg-[#f44336] text-white px-5 py-2 rounded-md mt-auto"
                                onClick={addToCartHandler}>
                                <AddShoppingCartIcon className="text-white text-2xl" />
                                Add to Cart
                            </button>
                        </div>
                    </div>

                    <p className="text-xl font-semibold px-5 py-5">
                        Similar Items
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-12 px-5">
                        {randomProducts.map((product) => (
                            <div
                                className="flex flex-col items-center py-10 px-5 border border-gray-200 rounded-md shadow-md"
                                key={product.id}>
                                <Link href={`/product/${product.slug}`}>
                                    <div className="w-100 h-100 hover:transform hover:scale-110 transition duration-500 ease-in-out">
                                        <Image
                                            src={product.image}
                                            alt="CCTV"
                                            className=""
                                            width={250}
                                            height={250}
                                        />
                                    </div>
                                </Link>

                                <p className="text-xl font-bold text-left mt-auto">
                                    {product.name}
                                </p>
                                <p className="py-5 text-[#f44336] mt-auto">
                                    ₱ {formatNumber(product.price)}
                                </p>
                            </div>
                        ))}
                    </div>
                    <div className="px-5 py-5">
                        {session?.user && <CommentForm product={product} />}

                        <Comments comments={comments} />
                    </div>
                </div>
            </Layout>
        </>
    );
}

export async function getServerSideProps(context) {
    const { params } = context;
    const { slug } = params;

    await db.connect();
    const product = await Product.findOne({ slug }).lean();

    await db.disconnect();
    return {
        props: {
            product: product ? db.convertDocToObj(product) : null,
        },
    };
}
