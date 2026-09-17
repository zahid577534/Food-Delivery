
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import Toast from "../components/Toast";

const ShopMenu = () => {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentCity } = useSelector((state) => state.user);

  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // ==========================================
  // FETCH SHOP
  // ==========================================
  useEffect(() => {
    const fetchShop = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please sign in again.");
          setLoading(false);
          return;
        }

        if (!currentCity) {
          setError("City information not available.");
          setLoading(false);
          return;
        }

        console.log("Fetching shops for city:", currentCity);

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

        const shops = response.data.shops || [];

        const selectedShop = shops.find(
          (item) => item._id === shopId
        );

        console.log("SELECTED SHOP:", selectedShop);

        if (!selectedShop) {
          setError("Shop not found.");
          setLoading(false);
          return;
        }

        setShop(selectedShop);
      } catch (error) {
        console.error("Error fetching shop:", error);

        if (error.response?.status === 401) {
          setError(
            "Your session has expired. Please sign in again."
          );
        } else {
          setError(
            error.response?.data?.message ||
              "Unable to load shop."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    if (currentCity) {
      fetchShop();
    }
  }, [shopId, currentCity]);

  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>

          <p className="text-sm text-gray-500">
            Loading menu...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <p className="text-red-500 text-sm">
          {error}
        </p>

        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition"
        >
          Back to Home
        </button>
      </div>
    );
  }

  // ==========================================
  // SHOP MENU
  // ==========================================
  return (
    <div className="min-h-screen bg-gray-50 px-3 sm:px-5 py-4">

      {/* ======================================
          TOAST
      ====================================== */}
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

      {/* ======================================
          TOP BAR
      ====================================== */}
      <div className="max-w-7xl mx-auto mb-4">

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-orange-600 transition"
        >
          <span className="text-lg">←</span>
          Back
        </button>

      </div>

      {/* ======================================
          COMPACT SHOP HEADER
      ====================================== */}
      <div className="max-w-7xl mx-auto">

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-3 mb-5">

          <div className="flex items-center gap-3">

            {/* SHOP THUMBNAIL */}
            <img
              src={shop.image}
              alt={shop.name}
              className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg flex-shrink-0"
            />

            {/* SHOP INFORMATION */}
            <div className="flex-1 min-w-0">

              <div className="flex items-center gap-2">

                <h1 className="text-base sm:text-lg font-bold text-gray-800 truncate">
                  {shop.name}
                </h1>

                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold bg-green-100 text-green-700 rounded-full">
                  OPEN
                </span>

              </div>

              <p className="text-xs text-gray-500 truncate mt-0.5">
                {shop.address}
              </p>

              <div className="flex items-center gap-3 mt-1.5">

                <span className="text-xs font-medium text-yellow-600">
                  ⭐ {shop.rating || "4.5"}
                </span>

                <span className="text-xs text-gray-500">
                  🚚 Fast Delivery
                </span>

                <span className="text-xs text-gray-500">
                  📍 {shop.city}
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ======================================
          MENU CONTENT
      ====================================== */}
      <div className="max-w-7xl mx-auto">

        {/* MENU TITLE */}
        <div className="flex items-center justify-between mb-3">

          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              Menu
            </h2>

            <p className="text-xs text-gray-500 mt-0.5">
              {shop.items?.length || 0} items available
            </p>
          </div>

        </div>

        {/* ====================================
            EMPTY MENU
        ==================================== */}
        {!shop.items || shop.items.length === 0 ? (

          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">

            <div className="text-3xl mb-2">
              🛒
            </div>

            <p className="text-sm text-gray-500">
              No items available in this shop.
            </p>

          </div>

        ) : (

          /* ====================================
             COMPACT PRODUCT GRID
          ==================================== */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">

            {shop.items.map((item) => (

              <div
                key={item._id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition duration-200"
              >

                {/* PRODUCT CONTENT */}
                <div className="p-2.5 flex gap-3">

                  {/* PRODUCT THUMBNAIL */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 sm:w-[72px] sm:h-[72px] object-cover rounded-lg flex-shrink-0"
                  />

                  {/* PRODUCT INFORMATION */}
                  <div className="flex-1 min-w-0">

                    {/* NAME */}
                    <h3
                      className="text-sm font-semibold text-gray-800 truncate"
                      title={item.name}
                    >
                      {item.name}
                    </h3>

                    {/* CATEGORY */}
                    <p className="text-[11px] text-gray-400 truncate mt-0.5">
                      {item.category || "General"}
                    </p>

                    {/* DESCRIPTION */}
                    {item.description && (
                      <p className="text-[11px] text-gray-500 line-clamp-2 mt-1 leading-4">
                        {item.description}
                      </p>
                    )}

                    {/* PRICE + UNIT */}
                    <div className="flex items-center justify-between mt-2">

                      <div className="min-w-0">

                        <span className="text-sm font-bold text-orange-600">
                          Rs. {item.price}
                        </span>

                        {item.unit && (
                          <span className="text-[10px] text-gray-400 ml-1">
                            / {item.unit}
                          </span>
                        )}

                      </div>

                      {/* ADD BUTTON */}
                      <button
                        onClick={() => {

                          const cartItem = {
                            itemId: item._id,
                            name: item.name,
                            description: item.description,
                            image: item.image,
                            price: Number(item.price),
                            unit: item.unit,
                            category: item.category,
                            shopId: shop._id,
                            shopName: shop.name,
                          };

                          console.log(
                            "ADDING TO CART:",
                            cartItem
                          );

                          dispatch(addToCart(cartItem));

                          setToast({
                            show: true,
                            message: `${item.name} added to cart`,
                            type: "success",
                          });

                        }}
                        className="w-7 h-7 flex items-center justify-center bg-orange-500 text-white rounded-full hover:bg-orange-600 active:scale-95 transition flex-shrink-0"
                        title="Add to cart"
                      >
                        +
                      </button>

                    </div>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
};

export default ShopMenu;

