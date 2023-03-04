import React, { useState, useEffect, useContext } from "react";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { toast } from "react-toastify";

import { TransitionScroll } from "react-transition-scroll";
import "react-transition-scroll/dist/index.css";
import useWindowDimensions from "../utils/useWindowDimensions";

// Icons
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import FacebookIcon from "@mui/icons-material/Facebook";
import MapIcon from "@mui/icons-material/Map";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
} from "@material-tailwind/react";

// Utilities
import { Store } from "../utils/Store";
import { formatNumber } from "../utils/utils";

// Components
import Modal from "../components/Modal";

// Styles
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Cookies from "js-cookie";
import dynamic from "next/dynamic";

function Layout({ title, smallHeader, children, bgImage }) {
  const { status, data: session } = useSession();
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const [openSidebar, setOpenSidebar] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [modalDetail, setModalDetail] = useState({
    message: "",
    status: "",
    show: false,
    action: () => {},
  });

  const logoutClickHandler = () => {
    Cookies.remove("cart");
    dispatch({ type: "CART_RESET" });
    signOut({ callbackUrl: "/login" });
  };

  const cartQuantityActionHandler = async (product, action) => {
    const existItem = state.cart.cartItems.find((x) => x.slug === product.slug);
    let quantity;

    switch (action) {
      case "add":
        quantity = existItem ? existItem.quantity + 1 : 1;
        break;
      case "remove":
        quantity = existItem ? existItem.quantity - 1 : 1;
        break;
      default:
        return false;
    }

    if (product.countInStock < quantity) {
      return toast.error("Sorry. Product is out of stock", { autoClose: 500 });
    }

    // If quantity is 0, show modal messag for confirmation
    if (quantity === 0) {
      setModalDetail({
        message: "Are you sure you want to remove this item from the cart?",
        status: "warning",
        show: true,
        action: () => {
          dispatch({
            type: "CART_UPDATE_ITEM",
            payload: { ...product, quantity: quantity },
          });
        },
      });
      return false;
    }

    dispatch({
      type: "CART_UPDATE_ITEM",
      payload: { ...product, quantity: quantity },
    });
  };

  const { height, width } = useWindowDimensions();
  const [isPortrait, setIsPortrait] = useState(height > width);

  useEffect(() => {
    setIsPortrait(height > width);
  }, [height, width]);

  useEffect(() => {
    setCartItemCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0));
  }, [cart.cartItems]);

  useEffect(() => {
    if (
      (title === "Product" || title === "Products") &&
      cart.cartItems.length > 0
    )
      setOpenCart(true);
  }, [cart, title]);

  return (
    <>
      <ToastContainer position='bottom-center' />
      <style jsx>
        {`
          .custom-text-title:before {
            content: "";
            position: absolute;
            bottom: -5px;
            left: 0;
            width: 50px;
            height: 2px;
            background: #f00;
          }

          footer .custom-text-title {
            display: inline-block;
            font-size: 1.5em;
            position: relative;
            margin-block-start: 0.83em;
            margin-block-end: 0.83em;
            margin-inline-start: 0px;
            margin-inline-end: 0px;
            font-weight: 500;
            margin-bottom: 15px;
          }

          .bg-image {
            background-image: linear-gradient(
                rgba(4, 9, 30, 0.7),
                rgba(4, 9, 30, 0.7)
              ),
              url(${bgImage});
            min-height: ${title === "Home"
              ? "100vh"
              : smallHeader
              ? 0
              : "50vh"};
            width: 100%;
            background-position: center;
            background-size: cover;
            position: relative;
          }

          .center-div {
            width: 90%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
          }
        `}
      </style>
      <Head>
        <title>{title ? `${title} | Cabsfour SSS` : "Cabsfour SSS"}</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className='flex min-h-screen flex-col justify-between'>
        <header>
          {/* Banner */}
          {title === "Home" && !isPortrait && (
            <nav
              className={`hidden text-sm lg:flex lg:h-10 h-5 items-center px-4 lg:px-10 lg:justify-between shadow-md bg-[#f44336] text-white`}
            >
              <div className='flex items-center'>
                <LocationOnIcon />
                #067 Overland Subd Bagac, 2107 Bataan
              </div>
              <div className='lg:ml-2 m-0 lg:flex'>
                <p className='mr-0 xl:mr-10 flex items-center'>
                  <PhoneIcon />
                  (+63) 975-491-8698 | (+63) 920-584-3000
                </p>
                <p className='wrap flex items-center'>
                  <MailIcon />
                  Email: cabsfourss@gmail.com
                </p>
              </div>
            </nav>
          )}

          {/* Navbar */}
          <TransitionScroll
            hiddenStyle={{
              opacity: 50,
              filter: "blur(2px)",
            }}
          >
            <nav
              className={`lg:px-10 ${
                smallHeader ? "py-0" : "lg:py-5"
              } shadow-md bg-image text-white`}
            >
              {/* Navbar */}
              <div className='flex justify-between items-center px-8 lg:px-16'>
                <Image
                  src='/images/cabsfour_logo.png'
                  alt='logo'
                  width={smallHeader ? 100 : 150}
                  height={smallHeader ? 100 : 150}
                />

                {/* Menus */}
                <div className='text-sm hidden lg:flex flex-row items-center'>
                  {title !== "Home" && (
                    <Link href='/' className='p-2 custom-hover'>
                      Home
                    </Link>
                  )}
                  <Link href='/about' className='p-2 custom-hover'>
                    About
                  </Link>
                  <Link href='/services' className='p-2 custom-hover'>
                    Services
                  </Link>
                  <Link href='/projects' className='p-2 custom-hover'>
                    Projects
                  </Link>
                  <Link href='/products' className='p-2 custom-hover'>
                    Products
                  </Link>
                  <Link href='/contact' className='p-2 custom-hover'>
                    Contact Us
                  </Link>
                  {status === "loading" ? (
                    <Link href='/login' className='p-2 custom-hover'>
                      Loading...
                    </Link>
                  ) : session?.user ? (
                    <Menu>
                      <MenuHandler>
                        <Button variant='gradient' color='white' size='sm'>
                          {session.user.userName}
                        </Button>
                      </MenuHandler>
                      <MenuList>
                        <MenuItem>
                          <Link href='/profile'>Profile</Link>
                        </MenuItem>
                        <MenuItem>
                          <Link href='/order-history'>Order History</Link>
                        </MenuItem>
                        {session.user.isAdmin && (
                          <MenuItem>
                            <Link
                              href='admin/dashboard'
                              className='text-red-500'
                            >
                              Admin Panel
                            </Link>
                          </MenuItem>
                        )}
                        <MenuItem>
                          <button onClick={logoutClickHandler}>Logout</button>
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  ) : (
                    <Link href='/login' className='p-2 custom-hover'>
                      Login
                    </Link>
                  )}
                  <button
                    className='p-2 custom-hover'
                    onClick={() => {
                      setOpenCart(true);
                    }}
                  >
                    <ShoppingCartIcon />
                    {cart.cartItems.length > 0 && (
                      <span className='ml-1 rounded-full bg-[#f44336] text-white px-2 py-1 text-xs font-bold'>
                        {cartItemCount}
                      </span>
                    )}
                  </button>
                </div>
                <div className='lg:hidden z-50'>
                  <button
                    className='p-2'
                    onClick={() => {
                      setOpenSidebar(true);
                    }}
                  >
                    <MenuIcon />
                  </button>
                </div>
              </div>

              {title === "Home" && (
                <div className='center-div'>
                  <h1 className='text-2xl mt-20 lg:mt-0 md:text-5xl lg:text-6xl font-bold mb-16'>
                    Why Choose Us?
                  </h1>
                  <p className='text-sm lg:text-lg xl:px-96'>
                    We ensure that we provide our clients the best security and
                    protection that we can give Our workers are highly trained
                    and our equipment are guaranteed top-notch. All of these are
                    maintained well to perform at their best. Because at
                    Cabsfour Security Systems Services, We care for your safety
                  </p>
                </div>
              )}
              {!smallHeader && title !== "Home" && (
                <div className='center-div'>
                  <h1 className='text-4xl font-bold mb-16'>{title}</h1>
                </div>
              )}
            </nav>
          </TransitionScroll>
        </header>

        {/* Sidebar */}
        <div
          className={`${
            openSidebar ? "opacity-95" : "opacity-10  translate-x-full"
          } fixed bg-[#f44336] text-white z-50 right-0 top-0 h-full w-1/2 lg:w-1/4 shadow-md transition-all duration-500`}
        >
          <button
            className='absolute top-0 left-0 p-2'
            onClick={() => {
              setOpenSidebar(false);
            }}
          >
            <CloseIcon />
          </button>

          <div className='flex flex-col mt-24'>
            {title !== "Home" && (
              <Link href='/' className='p-2 custom-hover'>
                Home
              </Link>
            )}
            <Link href='/about' className='p-2 custom-hover'>
              About
            </Link>
            <Link href='/services' className='p-2 custom-hover'>
              Services
            </Link>
            <Link href='/projects' className='p-2 custom-hover'>
              Projects
            </Link>
            <Link href='/products' className='p-2 custom-hover'>
              Products
            </Link>
            <Link href='/contact' className='p-2 custom-hover'>
              Contact Us
            </Link>
            {status === "loading" ? (
              <Link href='/login' className='p-2 custom-hover'>
                Loading...
              </Link>
            ) : session?.user ? (
              <Menu>
                <MenuHandler>
                  <Button color='white' size='sm'>
                    {session.user.userName}
                  </Button>
                </MenuHandler>
                <MenuList>
                  <MenuItem>
                    <Link href='/profile'>Profile</Link>
                  </MenuItem>
                  <MenuItem>
                    <Link href='/order-history'>Order History</Link>
                  </MenuItem>
                  {session.user.isAdmin && (
                    <MenuItem>
                      <Link href='admin/dashboard' className='text-red-500'>
                        Admin Panel
                      </Link>
                    </MenuItem>
                  )}
                  <MenuItem>
                    <button onClick={logoutClickHandler}>Logout</button>
                  </MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <Link href='/login' className='p-2 custom-hover'>
                Login
              </Link>
            )}
            <button
              className='p-2 custom-hover'
              onClick={() => {
                setOpenCart(true);
              }}
            >
              <ShoppingCartIcon />
              {cart.cartItems.length > 0 && (
                <span className='ml-1 rounded-full bg-[#f44336] text-white px-2 py-1 text-xs font-bold'>
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Side Cart */}
        <div
          className={`${
            openCart ? "opacity-95" : "opacity-10  translate-x-full"
          } fixed bg-white z-50 right-0 top-0 h-full w-3/4 lg:w-1/3 shadow-md transition-all duration-500 overflow-x-scroll`}
        >
          <button
            className='absolute top-0 left-0 p-2'
            onClick={() => {
              setOpenCart(false);
            }}
          >
            <CloseIcon />
          </button>
          <div className='text-center mt-10 mb-4 text-2xl font-bold'>
            Your Cart
          </div>
          <div className='flex flex-row justify-between items-center p-4 border border-y-[#f44336]'>
            <p className='font-semibold'>Total:</p>
            <p className='font-semibold'>
              {formatNumber(
                cart.cartItems.reduce((a, c) => a + c.price * c.quantity, 0)
              )}{" "}
              PHP
            </p>
            <div>
              <Link href='/cart'>
                <button className='bg-[#f44336] text-white px-4 py-2 rounded-md'>
                  View Cart
                </button>
              </Link>
            </div>
          </div>

          {cart.cartItems.length === 0 && (
            <div className='text-center'>Cart is empty</div>
          )}
          {cart.cartItems.length > 0 && (
            <div className='flex flex-col'>
              {cart.cartItems.map((item, index) => (
                <div
                  key={index}
                  className='flex flex-row justify-between items-center p-4 border border-b-[#f44336]'
                >
                  <div className='flex flex-row items-center'>
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={50}
                      height={50}
                    />
                    <div className='ml-4'>
                      <div>{item.name}</div>
                      <div className='text-[#999999]  flex flex-row justify-between'>
                        <span className='flex flex-row'>
                          <span>
                            {item.quantity} x ₱{formatNumber(item.price)}
                            {" = "}
                          </span>
                          <span className='text-[#f44336]'>
                            ₱{formatNumber(item.quantity * item.price)}
                          </span>
                        </span>
                        <div className='flex flex-row'>
                          <button
                            className='ml-2'
                            onClick={() => {
                              cartQuantityActionHandler(item, "remove");
                            }}
                          >
                            <RemoveIcon />
                          </button>
                          <button
                            className='ml-2 text-[#f44336] hover:transform hover:scale-110'
                            onClick={() => {
                              cartQuantityActionHandler(item, "add");
                            }}
                          >
                            <AddIcon />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <main className='mt-4 flex justify-center min-h-screen'>
          {children}
        </main>

        <footer className='shadow-md'>
          <div className='flex flex-wrap justify-between px-10 lg:px-20 pt-8 bg-[#111111] text-white shadow-inner pb-5'>
            <div className='w-full lg:w-1/3'>
              <div className='custom-text-title'>About</div>
              <p className='text-[#999999]'>
                Cabsfour Security Systems Services is a Filipino owned company
                formed by dedicated entrepreneurs more than two Decades work
                experience in electronic security system integration. We are
                engaged in integrating various Electronic Security products such
                as Business Security System, Biometrics Access Controls, FDAS,
                IPBX, Electric Fence, Structured Cabling, Solar System Public
                Address System, Electrical, Alarm and CCTV.
              </p>

              <div className='flex mt-5'>
                <Link
                  href='https://www.facebook.com/cabsfour/'
                  target='_blank'
                  className='mr-5'
                >
                  <FacebookIcon />
                </Link>
                <Link
                  href='https://vymaps.com/PH/Cabsfour-Security-System-Services-1213493655491211/'
                  target='_blank '
                  className='mr-5'
                >
                  <MapIcon />
                </Link>
                <Link
                  href='https://ph-check.com/item/cabsfour-security-systems-services/519037.html'
                  target='_blank'
                  className='mr-5'
                >
                  <CheckBoxIcon />
                </Link>
              </div>
            </div>
            <div className='w-full lg:w-1/5 mt-5 lg:mt-0'>
              <span className='custom-text-title'>Quick Links</span>
              <ul className='text-[#999999]'>
                <li>
                  <Link href='/about' className='hover:text-[#fff]'>
                    About
                  </Link>
                </li>
                <li>
                  <Link href='/services' className='hover:text-[#fff]'>
                    Services
                  </Link>
                </li>
                <li>
                  <Link href='/projects' className='hover:text-[#fff]'>
                    Projects
                  </Link>
                </li>
                <li>
                  <Link href='/products' className='hover:text-[#fff]'>
                    Products
                  </Link>
                </li>
                <li>
                  <Link href='/contact' className='hover:text-[#fff]'>
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href='/account' className='hover:text-[#fff]'>
                    Account
                  </Link>
                </li>
              </ul>
            </div>
            <div className='w-full lg:w-1/3 my-5 lg:mt-0'>
              <span className='custom-text-title'>Contact Info</span>
              <ul className='text-[#999999]'>
                <li className='flex py-2'>
                  <LocationOnIcon className='text-white mr-2' />
                  <p>#067 Overland Subd Bagac, 2107 Bataan, Philippines</p>
                </li>
                <li className='flex py-2'>
                  <PhoneIcon className='text-white mr-2' />
                  <Link href='' className='hover:text-[#fff]'>
                    +63 9754918698
                  </Link>
                </li>
                <li className='flex py-2'>
                  <MailIcon className='text-white mr-2' />
                  <Link
                    href='mailto:cabantacet@gmail.com'
                    className='hover:text-[#fff]'
                  >
                    cabantacet@gmail.com
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className='w-full bg-[#181818] text-white text-center p-2'>
            Copyright 2022. All Rights Reserved{" "}
          </div>
        </footer>
      </div>{" "}
      <Modal modalDetail={modalDetail} setModalDetail={setModalDetail} />
    </>
  );
}

export default dynamic(() => Promise.resolve(Layout), { ssr: false });
