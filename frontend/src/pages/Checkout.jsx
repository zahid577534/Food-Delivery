
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../redux/cartSlice";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deliveryCharge, setDeliveryCharge] = useState(100);
  const [shopLoading, setShopLoading] = useState(true);
  const [deliveryInfo, setDeliveryInfo] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
  });

  const cartItems = useSelector(
    (state) => state.cart.items
  );
  useEffect(() => {
    const fetchShop = async () => {
      try {
        if (cartItems.length === 0) {
          setShopLoading(false);
          return;
        }

        const shopId = cartItems[0].shopId;

        const result = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/shop/get-shop/${shopId}`
        );

        const charge = Number(
          result.data.shop?.deliveryCharge ?? 100
        );

        setDeliveryCharge(charge);

      } catch (error) {
        console.error(
          "Failed to fetch shop delivery charge:",
          error.response?.data || error.message
        );

        setDeliveryCharge(100);

      } finally {
        setShopLoading(false);
      }
    };

    fetchShop();
  }, [cartItems]);
  console.log("CART ITEMS:", cartItems);

  const totalAmount = cartItems.reduce(
    (total, item) =>
      total + Number(item.price) * item.quantity,
    0
  );
  const finalTotal = totalAmount + deliveryCharge;

  // Empty cart
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto text-center mt-20">

          <h1 className="text-3xl font-bold text-gray-800">
            Your cart is empty
          </h1>

          <button
            onClick={() => navigate("/")}
            className="mt-6 bg-[#ff4d2d] text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600"
          >
            Go to Home
          </button>

        </div>
      </div>
    );
  }

  // ============================
  // PLACE ORDER
  // ============================
  const handlePlaceOrder = async () => {
    console.log("CART ITEMS BEFORE ORDER:", cartItems);
    try {
      setLoading(true);
      setError("");
      if (
        !deliveryInfo.fullName ||
        !deliveryInfo.phone ||
        !deliveryInfo.address ||
        !deliveryInfo.city
      ) {
        setError("Please fill in all delivery information.");
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please sign in again.");
        return;
      }

      // Prepare order items
      const items = cartItems.map((item) => ({
        itemId: item.itemId,
        name: item.name,
        image: item.image,
        price: Number(item.price),
        quantity: item.quantity,
        unit: item.unit,
      }));

      // Shop ID
      const shop = cartItems[0].shopId;

      // Send order to backend
      console.log("ORDER ITEMS BEING SENT:", items);
      const result = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/order/create`,
        {
          shop,
          items,
          totalAmount: finalTotal,


          deliveryAddress: {
            fullName: deliveryInfo.fullName,
            phone: deliveryInfo.phone,
            address: deliveryInfo.address,
            city: deliveryInfo.city,
          },

          paymentMethod: "cash",
          paymentStatus: "unpaid",
        },


        {
          headers: {
            Authorization: `Bearer ${token}`,
          },

          withCredentials: true,
        }
      );

      console.log("ORDER CREATED:", result.data);

      // Clear cart after successful order
      dispatch(clearCart());

      // Go to My Orders
      navigate("/my-orders");

    } catch (error) {
      console.error(
        "Place order error:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
        "Failed to place order."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">

          <button
            onClick={() => navigate("/cart")}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300"
          >
            ← Back
          </button>

          <h1 className="text-3xl font-bold text-gray-800">
            Checkout
          </h1>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">

            {/* Delivery Information */}
            <div className="bg-white rounded-xl shadow-md p-6">

              <h2 className="text-xl font-bold text-gray-800 mb-5">
                Delivery Information
              </h2>

              <div className="space-y-4">

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Full Name
                  </label>

                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={deliveryInfo.fullName}
                    onChange={(e) =>
                      setDeliveryInfo({
                        ...deliveryInfo,
                        fullName: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    placeholder="03XX-XXXXXXX"
                    value={deliveryInfo.phone}
                    onChange={(e) =>
                      setDeliveryInfo({
                        ...deliveryInfo,
                        phone: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Delivery Address
                  </label>

                  <textarea
                    rows="3"
                    placeholder="Enter your complete delivery address"
                    value={deliveryInfo.address}
                    onChange={(e) =>
                      setDeliveryInfo({
                        ...deliveryInfo,
                        address: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-3"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    City
                  </label>

                  <input
                    type="text"
                    placeholder="Enter your city"
                    value={deliveryInfo.city}
                    onChange={(e) =>
                      setDeliveryInfo({
                        ...deliveryInfo,
                        city: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-3"
                  />
                </div>

              </div>
            </div>

            {/* PAYMENT */}
            <div className="bg-white rounded-xl shadow-md p-6">

              <h2 className="text-xl font-bold text-gray-800 mb-5">
                Payment Method
              </h2>

              <label className="flex items-center gap-3 border border-gray-300 rounded-lg p-4">

                <input
                  type="radio"
                  name="payment"
                  value="cash"
                  defaultChecked
                  className="w-5 h-5"
                />

                <div>
                  <p className="font-semibold text-gray-800">
                    Cash on Delivery
                  </p>

                  <p className="text-sm text-gray-500">
                    Pay when your order is delivered.
                  </p>
                </div>

              </label>

            </div>

          </div>

          {/* RIGHT */}
          <div>

            <div className="bg-white rounded-xl shadow-md p-6">

              <h2 className="text-xl font-bold text-gray-800 mb-5">
                Order Summary
              </h2>

              <div className="space-y-4">

                {cartItems.map((item) => (

                  <div
                    key={item.itemId}
                    className="flex items-center gap-3 border-b pb-4"
                  >

                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />

                    <div className="flex-1">

                      <h3 className="font-semibold text-gray-800">
                        {item.name}
                      </h3>

                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>

                    </div>

                    <p className="font-semibold text-gray-800">
                      Rs.{" "}
                      {Number(item.price) * item.quantity}
                    </p>

                  </div>

                ))}

              </div>

              {/* PRICE */}
              <div className="mt-6 space-y-3">

                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>Rs. {totalAmount}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span>
                    {shopLoading
                      ? "Loading..."
                      : `Rs. ${deliveryCharge}`}
                  </span>
                </div>

                <div className="border-t pt-4 flex justify-between text-xl font-bold">

                  <span className="text-[#ff4d2d]">
                    {shopLoading
                      ? "Loading..."
                      : `Rs. ${finalTotal}`}
                  </span>

                </div>

              </div>

              {/* ERROR */}
              {error && (
                <p className="text-red-500 text-sm mt-4">
                  {error}
                </p>
              )}

              {/* PLACE ORDER */}
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full mt-6 bg-[#ff4d2d] text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition disabled:opacity-50"
              >
                {loading
                  ? "Placing Order..."
                  : "Place Order"}
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Checkout;
