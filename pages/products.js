import { useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import SearchIcon from "@mui/icons-material/Search";
import { Store } from "../utils/Store";
import Product from "../models/Product";
import db from "../utils/db";
import ReactStars from "react-stars";

export default function Home({ products }) {
    const [currentItems, setCurrentItems] = useState([]);
    const [filterType, setFilterType] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedBrand, setSelectedBrand] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const { state, dispatch } = useContext(Store);
    const { cart } = state;
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [loading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRating, setSelectedRating] = useState(0);
    const [itemsPerPage] = useState(8);

    useEffect(() => {
        let currentProducts = products;

        // First, filter by category if it's selected
        if (selectedCategory && selectedCategory !== "all-items") {
            currentProducts = products.filter(
                (product) => product.category.toUpperCase() === selectedCategory
            );
        }

        if (selectedBrand && selectedBrand !== "all-brands") {
            currentProducts = products.filter(
                (product) => product.brand.toUpperCase() === selectedBrand
            );
        }

        if (selectedRating) {
            currentProducts = products.filter(
                (product) => parseFloat(product.rating) >= selectedRating
            );
        }

        // Then, apply other filters
        switch (filterType) {
            case "low_to_high":
                currentProducts = currentProducts.sort(
                    (a, b) => a.price - b.price
                );
                break;
            case "high_to_low":
                currentProducts = currentProducts.sort(
                    (a, b) => b.price - a.price
                );
                break;
            case "search":
                currentProducts = currentProducts.filter((product) =>
                    product.name
                        .toLowerCase()
                        .includes(searchValue.toLowerCase())
                );
                break;
            default:
                currentProducts = currentProducts.sort((a, b) => a._id - b._id);
        }

        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const slicedItems = currentProducts.slice(
            indexOfFirstItem,
            indexOfLastItem
        );
        setCurrentItems(slicedItems);
    }, [
        currentPage,
        itemsPerPage,
        filterType,
        products,
        searchValue,
        selectedCategory,
        selectedRating,
        selectedBrand,
    ]);

    // update categories based on products
    useEffect(() => {
        const categories = products.map((product) =>
            product.category.toUpperCase()
        );
        const uniqueCategories = [...new Set(categories)];
        setCategories(uniqueCategories);

        const brands = products.map((product) => product.brand.toUpperCase());
        const uniqueBrands = [...new Set(brands)];
        setBrands(uniqueBrands);
    }, [products]);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const addToCartHandler = async (product) => {
        const existItem = cart.cartItems.find((x) => x.slug === product.slug);
        const quantity = existItem ? existItem.quantity + 1 : 1;

        if (product.countInStock < quantity) {
            return toast.error("Sorry. Product is out of stock");
        }
        dispatch({
            type: "CART_UPDATE_ITEM",
            payload: { ...product, quantity },
        });

        toast.success("Product added to the cart", { autoClose: 500 });
    };

    return (
        <>
            <Layout title="Products" bgImage={"/images/product-bg-min.png"}>
                <div className="container px-0 mx-0 text-center">
                    <p className="text-[#f44336] italic text-center py-2">
                        Home → Products
                    </p>
                    <p className="text-3xl text-center font-semibold py-2">
                        Products
                    </p>

                    <div className="flex flex-col md:flex-row">
                        <div className="w-full md:w-1/4 p-5 md:border-r">
                            <h3 className="text-xl font-bold mb-4">Filters</h3>

                            <div className="mb-4 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <SearchIcon className="text-gray-400 h-5 w-5" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search"
                                    className="py-2 px-5 pl-10 w-full border rounded-md"
                                    onChange={(e) => {
                                        setFilterType("search");
                                        setSearchValue(e.target.value);
                                    }}
                                />
                            </div>

                            <div className="mb-4">
                                <h4 className="font-semibold mb-2">
                                    Sort by Price:
                                </h4>
                                <select
                                    className="w-full py-2 px-4 border rounded-md"
                                    onChange={(e) =>
                                        setFilterType(e.target.value)
                                    }>
                                    <option value="default">Default</option>
                                    <option value="low_to_high">
                                        Low to High
                                    </option>
                                    <option value="high_to_low">
                                        High to Low
                                    </option>
                                </select>
                            </div>
                            <div className="mb-4 items-center justify-center flex flex-col">
                                <h4 className="font-semibold mb-2">
                                    Sort by Rating:
                                </h4>
                                <ReactStars
                                    count={5}
                                    size={24}
                                    color2={"#ffd700"}
                                    onChange={(newRating) =>
                                        setSelectedRating(newRating)
                                    }
                                    value={selectedRating}
                                />
                                <button
                                    onClick={() => setSelectedRating(0)}
                                    className="text-sm text-red-500">
                                    Reset
                                </button>
                            </div>

                            <div className="mb-4">
                                <h4 className="font-semibold mb-2">
                                    Categories:
                                </h4>
                                <select
                                    className="w-full py-2 px-4 border rounded-md"
                                    onChange={(e) => {
                                        setSelectedCategory(e.target.value);
                                    }}>
                                    <option value="all-items">
                                        All Categories
                                    </option>
                                    {categories.map((category, index) => (
                                        <option key={index} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4">
                                <h4 className="font-semibold mb-2">Brands:</h4>
                                <select
                                    className="w-full py-2 px-4 border rounded-md"
                                    onChange={(e) => {
                                        setSelectedBrand(e.target.value);
                                    }}>
                                    <option value="all-brands">
                                        All Brands
                                    </option>
                                    {brands.map((brand, index) => (
                                        <option
                                            key={index}
                                            value={brand}
                                            className="capitalize">
                                            {brand}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Product Grid */}
                        <div className="w-full md:w-3/4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-12 px-5">
                                {!loading &&
                                    products &&
                                    currentItems.map((product, index) => (
                                        <ProductCard
                                            key={index}
                                            product={product}
                                            addToCartHandler={addToCartHandler}
                                        />
                                    ))}
                            </div>
                            {loading && (
                                <div className="flex flex-row justify-center items-center text-center py-10">
                                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
                                </div>
                            )}
                            <Pagination
                                itemsPerPage={itemsPerPage}
                                totalItems={products.length}
                                paginate={paginate}
                                currentPage={currentPage}
                            />
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
}

export async function getServerSideProps() {
    await db.connect();
    const products = await Product.find().lean();
    await db.disconnect();
    return {
        props: {
            products: products.map(db.convertDocToObj),
        },
    };
}
