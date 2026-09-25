
import React, { useEffect, useRef, useState } from "react";
import Toast from "../components/Toast";
import Navbar from "../components/Nav";
import { categories } from "../category";
import CategoryCard from "./CategoryCard";
import { useNavigate } from "react-router-dom";
import {
  FaChevronCircleRight,
  FaChevronCircleLeft,
  FaStar,
  FaMapMarkerAlt,
  FaClock,
  FaShoppingCart,
  FaPlus,
  FaFacebook,
  FaWhatsapp,
} from "react-icons/fa";

import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { addToCart } from "../redux/cartSlice";

const UserDashboard = () => {
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentCity, user } = useSelector(
    (state) => state.user
  );

  const cartItems = useSelector(
    (state) => state.cart.items
  );

  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });
  // =========================
  // CATEGORY SCROLL
  // =========================

  const checkScroll = () => {
    const element = scrollRef.current;

    if (!element) return;

    setShowLeftArrow(element.scrollLeft > 0);
    setShowRightArrow(
      element.scrollLeft + element.clientWidth <
      element.scrollWidth - 1
    );
  };

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({
      left: -300,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({
      left: 300,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const element = scrollRef.current;

    if (!element) return;

    checkScroll();

    element.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);

    return () => {
      element.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  // =========================
  // GET SHOPS
  // =========================

  useEffect(() => {
    const fetchShops = async () => {
      if (!currentCity) return;

      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please sign in to view shops.");
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/shop/get-shops`,
          {
            params: {
              city: currentCity,
            },

            headers: {
              Authorization: `Bearer ${token}`,
            },

            withCredentials: true,
          }
        );

        console.log("SHOPS:", response.data);

        setShops(response.data.shops || []);
      } catch (error) {
        console.error("Error fetching shops:", error);

        setError(
          error.response?.data?.message ||
          "Unable to load shops."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, [currentCity]);

  // =========================
  // ADD TO CART
  // =========================

  const handleAddToCart = (item, shop) => {
    // Check if cart already contains items
    if (cartItems.length > 0) {
      const existingShopId = cartItems[0].shopId;

      // Prevent ordering from different shop
      if (existingShopId !== shop._id) {
        setToast({
          show: true,
          message: `Your cart contains items from ${cartItems[0].shopName || "another shop"
            }. Please clear your cart first.`,
          type: "error",
        });

        return;
      }
    }

    // Calculate discounted price
    const originalPrice = Number(item.price);
    const discount = Number(item.discount || 0);

    const discountedPrice =
      originalPrice - (originalPrice * discount) / 100;

    const cartItem = {
      itemId: item._id,
      name: item.name,
      description: item.description,
      image: item.image,

      // Keep original price
      originalPrice: originalPrice,

      // Discount percentage
      discount: discount,

      // Actual price customer pays
      price: discountedPrice,

      unit: item.unit,
      category: item.category,
      shopId: shop._id,
      shopName: shop.name,
    };

    console.log("ADDING TO CART:", cartItem);

    dispatch(addToCart(cartItem));

    setToast({
      show: true,
      message: `${item.name} added to cart`,
      type: "success",
    });
  };

  // =========================
  // OPEN SHOP
  // =========================

  const openShop = (shopId) => {
    navigate(`/shop/${shopId}`);
  };
// =========================
// FACEBOOK
// =========================

const openFacebook = (facebookPage) => {
  if (!facebookPage) return;

  let url = facebookPage.trim();

  // Add https:// if owner entered only www.facebook.com/...
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = `https://${url}`;
  }

  window.open(url, "_blank", "noopener,noreferrer");
};

// =========================
// WHATSAPP
// =========================

const openWhatsApp = (whatsapp) => {
  if (!whatsapp) return;

  let number = whatsapp.replace(/\D/g, "");

  // Convert Pakistani number:
  // 03001234567 → 923001234567
  if (number.startsWith("03")) {
    number = `92${number.substring(1)}`;
  }

  // If owner already entered 92XXXXXXXXXX
  if (!number.startsWith("92")) {
    number = `92${number}`;
  }

  const whatsappUrl = `https://wa.me/${number}`;

  window.open(
    whatsappUrl,
    "_blank",
    "noopener,noreferrer"
  );
};
  // =========================
  // CART COUNT
  // =========================

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <>

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() =>
            setToast({
              show: false,
              message: "",
              type: "success",
            })
          }
        />
      )}
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-8 p-4">

        {/* =========================
            TOP HEADER
        ========================= */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          <div>
            <h1 className="text-gray-800 text-2xl sm:text-3xl font-bold">
              Inspiration for your first order
            </h1>

            {currentCity && (
              <p className="text-gray-500 mt-1">
                Discover Grocery near{" "}
                <span className="font-semibold text-gray-700">
                  {currentCity}
                </span>
              </p>
            )}
          </div>

          {/* CART BUTTON */}

          <button
            onClick={() => {
              navigate("/cart");
            }}
            className="relative flex items-center justify-center gap-2
            bg-[#ff4d2d] text-white px-5 py-3
            rounded-xl font-semibold hover:bg-orange-600
            transition"
          >
            <FaShoppingCart />

            Cart

            {cartCount > 0 && (
              <span
                className="absolute -top-2 -right-2
                bg-black text-white text-xs
                w-6 h-6 rounded-full
                flex items-center justify-center"
              >
                {cartCount}
              </span>
            )}
          </button>

        </div>

        {/* =========================
            CATEGORIES
        ========================= */}

        <div className="relative w-full">

          {showLeftArrow && (
            <button
              onClick={scrollLeft}
              className="absolute left-0 top-1/2
              -translate-y-1/2 z-10
              w-10 h-10 rounded-full bg-white
              shadow-lg flex items-center justify-center
              text-xl font-bold hover:bg-gray-100"
            >
              <FaChevronCircleLeft />
            </button>
          )}

          <div
            ref={scrollRef}
            className="category-scroll flex gap-5
            overflow-x-auto scroll-smooth
            px-12 py-2"
          >
            {categories.map((category, index) => (
              <CategoryCard
                key={index}
                data={category}
              />
            ))}
          </div>

          {showRightArrow && (
            <button
              onClick={scrollRight}
              className="absolute right-0 top-1/2
              -translate-y-1/2 z-10
              w-10 h-10 rounded-full bg-white
              shadow-lg flex items-center justify-center
              text-xl font-bold hover:bg-gray-100"
            >
              <FaChevronCircleRight />
            </button>
          )}

        </div>

        {/* =========================
            SHOPS
        ========================= */}

        <section>

          <div className="mb-5">

            <h2 className="text-gray-800 text-2xl
              sm:text-3xl font-bold"
            >
              Food Shops in {currentCity || "Your City"}
            </h2>

            <p className="text-gray-500 mt-1">
              Choose a shop and order your favorite food
            </p>

          </div>

          {/* LOADING */}

          {loading && (
            <div className="flex justify-center py-10">
              <div
                className="w-10 h-10 border-4
                border-gray-300 border-t-black
                rounded-full animate-spin"
              />
            </div>
          )}

          {/* ERROR */}

          {!loading && error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg">
              {error}
            </div>
          )}

          {/* NO SHOPS */}

          {!loading &&
            !error &&
            shops.length === 0 && (
              <div className="bg-gray-50 rounded-xl p-10 text-center">

                <h3 className="text-xl font-semibold text-gray-700">
                  No shops available
                </h3>

                <p className="text-gray-500 mt-2">
                  We couldn't find any food shops in{" "}
                  {currentCity}.
                </p>

              </div>
            )}

          {/* =========================
              SHOP CARDS
          ========================= */}

          {/* =========================
    SHOP CARDS - COMPACT
========================= */}

          {!loading && shops.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

              {shops.map((shop) => (

                <div
                  key={shop._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100
        overflow-hidden hover:shadow-md transition"
                >

                  {/* =========================
            SHOP HEADER
        ========================= */}

                  <div className="flex gap-3 p-3">

                    {/* SMALL SHOP IMAGE */}

                    <div
                      className="w-24 h-24 flex-shrink-0 rounded-lg
            overflow-hidden bg-gray-100 cursor-pointer"
                      onClick={() => openShop(shop._id)}
                    >

                      <img
                        src={shop.image || "/default-shop.jpg"}
                        alt={shop.name}
                        className="w-full h-full object-cover hover:scale-105 transition"
                      />

                    </div>

                    {/* SHOP DETAILS */}

                    <div className="flex-1 min-w-0">

                      <div className="flex items-start justify-between gap-2">

                        <h3 className="text-base font-bold text-gray-800 truncate">
                          {shop.name}
                        </h3>

                        {/* RATING */}

                        <div
                          className="flex-shrink-0 flex items-center gap-1
                bg-green-600 text-white px-1.5 py-0.5
                rounded text-xs"
                        >
                          <FaStar size={10} />

                          <span>
                            {shop.rating
                              ? Number(shop.rating).toFixed(1)
                              : "New"}
                          </span>
                        </div>

                      </div>

                      {/* ADDRESS */}

                      <div
                        className="flex items-start gap-1
              text-gray-500 text-xs mt-2"
                      >

                        <FaMapMarkerAlt
                          className="mt-0.5 flex-shrink-0"
                          size={11}
                        />

                        <span className="line-clamp-2">
                          {shop.address || currentCity}
                        </span>

                      </div>

                      {/* DELIVERY */}

                      <div
                        className="flex items-center gap-1
              text-gray-500 text-xs mt-1"
                      >

                        <FaClock size={11} />

                        <span>
                          {shop.deliveryTime || "30-40 min"}
                        </span>

                      </div>

                      {/* OPEN STATUS */}

                      <div className="mt-2">

                        {shop.isOpen !== false ? (
                          <span
                            className="inline-block bg-green-100
                  text-green-700 text-[10px]
                  font-semibold px-2 py-0.5 rounded-full"
                          >
                            OPEN
                          </span>
                        ) : (
                          <span
                            className="inline-block bg-red-100
                  text-red-700 text-[10px]
                  font-semibold px-2 py-0.5 rounded-full"
                          >
                            CLOSED
                          </span>
                        )}

                      </div>

                    </div>

                  </div>


                  {/* =========================
            VIEW FULL MENU
        ========================= */}

                  {/* =========================
    SHOP ACTIONS
========================= */}

<div className="px-3 pb-3">

  <div className="flex gap-2">

    {/* VIEW MENU */}

    <button
      onClick={() => openShop(shop._id)}
      className="flex-1 border border-[#ff4d2d]
      text-[#ff4d2d] py-2 rounded-lg
      text-sm font-semibold
      hover:bg-[#ff4d2d]
      hover:text-white transition"
    >
      View Full Menu
    </button>

    {/* WHATSAPP */}

    {shop.whatsapp && (
      <button
        onClick={(e) => {
          e.stopPropagation();
          openWhatsApp(shop.whatsapp);
        }}
        className="w-10 h-10 flex-shrink-0
        rounded-lg bg-green-50
        text-green-600
        flex items-center justify-center
        hover:bg-green-600
        hover:text-white
        transition"
        title="Contact on WhatsApp"
      >
        <FaWhatsapp size={20} />
      </button>
    )}

    {/* FACEBOOK */}

    {shop.facebookPage && (
      <button
        onClick={(e) => {
          e.stopPropagation();
          openFacebook(shop.facebookPage);
        }}
        className="w-10 h-10 flex-shrink-0
        rounded-lg bg-blue-50
        text-blue-600
        flex items-center justify-center
        hover:bg-blue-600
        hover:text-white
        transition"
        title="Visit Facebook Page"
      >
        <FaFacebook size={18} />
      </button>
    )}

  </div>

</div>


                  {/* =========================
            FOOD ITEMS
        ========================= */}

                  {shop.items && shop.items.length > 0 && (

                    <div className="px-3 pb-3">

                      <div className="flex items-center justify-between mb-2">

                        <h4 className="text-sm font-bold text-gray-800">
                          Popular Items
                        </h4>

                        <span className="text-[11px] text-gray-400">
                          {shop.items.length} items
                        </span>

                      </div>


                      <div className="space-y-1.5">

                        {shop.items
                          .slice(0, 6)
                          .map((item) => (

                            <div
                              key={item._id}
                              className="flex items-center gap-2
                    border border-gray-100 rounded-lg
                    p-1.5 hover:bg-gray-50 transition"
                            >

                              {/* ITEM THUMBNAIL */}

                              <div className="relative flex-shrink-0">

                                <img
                                  src={item.image || "/default-food.jpg"}
                                  alt={item.name}
                                  className="w-12 h-12 rounded-md
    object-cover"
                                />

                                {Number(item.discount || 0) > 0 && (
                                  <span
                                    className="absolute -top-1 -right-1
                                      bg-red-500 text-white
                                      text-[8px] font-bold
                                      px-1 py-0.5 rounded-full"
                                  >
                                    -{Number(item.discount)}%
                                  </span>
                                )}

                              </div>

                              {/* ITEM DETAILS */}

                              <div className="flex items-center gap-2 mt-0.5 flex-wrap">

                                {Number(item.discount || 0) > 0 ? (
                                  <>
                                    {/* ORIGINAL PRICE */}
                                    <span className="text-gray-400 text-xs line-through">
                                      Rs.{Number(item.price).toFixed(0)}
                                    </span>

                                    {/* DISCOUNTED PRICE */}
                                    <span className="text-[#ff4d2d] font-bold text-sm">
                                      Rs.
                                      {(
                                        Number(item.price) -
                                        (Number(item.price) * Number(item.discount)) / 100
                                      ).toFixed(0)}
                                    </span>

                                    {/* DISCOUNT BADGE */}
                                    <span
                                      className="bg-green-100 text-green-700
        text-[10px] font-bold px-1.5 py-0.5
        rounded-full"
                                    >
                                      {Number(item.discount)}% OFF
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-[#ff4d2d] font-bold text-sm">
                                    Rs.{Number(item.price).toFixed(0)}
                                  </span>
                                )}

                                {item.unit && (
                                  <span className="text-[11px] text-gray-400">
                                    / {item.unit}
                                  </span>
                                )}

                              </div>


                              {/* ADD BUTTON */}

                              <button
                                onClick={() =>
                                  handleAddToCart(item, shop)
                                }
                                className="w-8 h-8 flex-shrink-0
                      rounded-full
                      bg-[#ff4d2d] text-white
                      flex items-center justify-center
                      hover:bg-orange-600
                      active:scale-95 transition"
                                title={`Add ${item.name} to cart`}
                              >
                                <FaPlus size={12} />
                              </button>

                            </div>

                          ))}

                      </div>

                    </div>

                  )}

                </div>

              ))}

            </div>
          )}

        </section>

        {/* =========================
            RATE ORDER
        ========================= */}

        {user && (
          <section
            className="bg-gray-50 rounded-2xl
            p-6 mt-2"
          >

            <div
              className="flex flex-col sm:flex-row
              items-center justify-between
              gap-4"
            >

              <div>

                <h2 className="text-xl font-bold text-gray-800">
                  How was your food?
                </h2>

                <p className="text-gray-500 mt-1">
                  Rate your recent order and help
                  other customers.
                </p>

              </div>

              <button
                onClick={() =>
                  navigate("/my-orders")
                }
                className="flex items-center gap-2
                bg-yellow-500 text-white px-5 py-3
                rounded-lg font-semibold
                hover:bg-yellow-600"
              >
                <FaStar />
                Rate Your Order
              </button>

            </div>

          </section>
        )}

      </div>
    </>
  );
};

export default UserDashboard;
