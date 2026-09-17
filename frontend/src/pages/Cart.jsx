import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} from "../redux/cartSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector(
    (state) => state.cart.items
  );

  // =========================
  // CART TOTAL
  // =========================

  const totalAmount = cartItems.reduce(
    (total, item) =>
      total + Number(item.price) * item.quantity,
    0
  );

  // =========================
  // EMPTY CART
  // =========================

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">

        <div className="max-w-4xl mx-auto">

          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            Your Cart
          </h1>

          <div className="bg-white rounded-xl shadow-md p-10 text-center">

            <h2 className="text-xl font-semibold text-gray-700">
              Your cart is empty
            </h2>

            <p className="text-gray-500 mt-2">
              Add some delicious food to your cart.
            </p>

            <button
              onClick={() => {
                window.location.href = "/";
              }}
              className="mt-6 bg-[#ff4d2d] text-white px-6 py-3
              rounded-lg font-semibold hover:bg-orange-600"
            >
              Continue Shopping
            </button>

          </div>

        </div>

      </div>
    );
  }

  // =========================
  // CART
  // =========================

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">

      <div className="max-w-5xl mx-auto">

        {/* =========================
            HEADER
        ========================= */}

        <div className="flex justify-between items-center mb-8">

          <div className="flex items-center gap-4">

            <button
              onClick={() => {
                window.location.href = "/";
              }}
              className="bg-gray-200 text-gray-700
              px-4 py-2 rounded-lg font-semibold
              hover:bg-gray-300 transition"
            >
              ← Back
            </button>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Your Cart
            </h1>

          </div>

          <button
            onClick={() => dispatch(clearCart())}
            className="text-red-500 font-semibold
            hover:text-red-700"
          >
            Clear Cart
          </button>

        </div>

        {/* =========================
            CART ITEMS
        ========================= */}

        <div className="space-y-4">

          {cartItems.map((item) => {

            const hasDiscount =
              Number(item.discount || 0) > 0;

            return (

              <div
                key={item.itemId}
                className="bg-white rounded-xl shadow-md
                p-4 flex flex-col sm:flex-row
                sm:items-center gap-4"
              >

                {/* =========================
                    IMAGE
                ========================= */}

                <div className="relative flex-shrink-0">

                  <img
                    src={
                      item.image ||
                      "/default-food.jpg"
                    }
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />

                  {hasDiscount && (
                    <span
                      className="absolute -top-2 -right-2
                      bg-red-500 text-white
                      text-xs font-bold
                      px-2 py-1 rounded-full"
                    >
                      {item.discount}% OFF
                    </span>
                  )}

                </div>

                {/* =========================
                    ITEM INFORMATION
                ========================= */}

                <div className="flex-1">

                  <h2 className="text-lg font-bold text-gray-800">
                    {item.name}
                  </h2>

                  <p className="text-gray-500 text-sm">
                    {item.shopName}
                  </p>

                  <p className="text-gray-500 text-sm mt-1">
                    Unit: {item.unit}
                  </p>

                  {/* PRICE */}

                  <div className="flex items-center gap-2 mt-2">

                    {hasDiscount && (
                      <span
                        className="text-gray-400
                        line-through text-sm"
                      >
                        Rs.{Number(
                          item.originalPrice ||
                          item.price
                        ).toFixed(0)}
                      </span>
                    )}

                    <span
                      className="text-[#ff4d2d]
                      font-bold text-lg"
                    >
                      Rs.{Number(item.price).toFixed(0)}
                    </span>

                  </div>

                  {hasDiscount && (
                    <p className="text-green-600 text-xs font-semibold mt-1">
                      You save Rs.
                      {(
                        Number(item.originalPrice || item.price) -
                        Number(item.price)
                      ).toFixed(0)}
                    </p>
                  )}

                </div>

                {/* =========================
                    QUANTITY
                ========================= */}

                <div
                  className="flex items-center
                  justify-center gap-3"
                >

                  <button
                    onClick={() =>
                      dispatch(
                        decreaseQuantity(item.itemId)
                      )
                    }
                    className="w-8 h-8 rounded-full
                    bg-gray-200 font-bold
                    hover:bg-gray-300"
                  >
                    -
                  </button>

                  <span className="font-semibold min-w-[20px] text-center">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() =>
                      dispatch(
                        increaseQuantity(item.itemId)
                      )
                    }
                    className="w-8 h-8 rounded-full
                    bg-[#ff4d2d] text-white font-bold
                    hover:bg-orange-600"
                  >
                    +
                  </button>

                </div>

                {/* =========================
                    ITEM TOTAL
                ========================= */}

                <div
                  className="sm:w-28
                  text-left sm:text-right"
                >

                  <p className="text-xs text-gray-500">
                    Item Total
                  </p>

                  <p className="font-bold text-gray-800 text-lg">
                    Rs.
                    {(
                      Number(item.price) *
                      item.quantity
                    ).toFixed(0)}
                  </p>

                  <button
                    onClick={() =>
                      dispatch(
                        removeFromCart(item.itemId)
                      )
                    }
                    className="text-red-500 text-sm
                    mt-2 hover:text-red-700"
                  >
                    Remove
                  </button>

                </div>

              </div>

            );
          })}

        </div>

        {/* =========================
            TOTAL
        ========================= */}

        <div
          className="bg-white rounded-xl shadow-md
          p-6 mt-8"
        >

          <div className="flex justify-between
            text-xl font-bold"
          >
            <span>
              Subtotal
            </span>

            <span className="text-[#ff4d2d]">
              Rs.{totalAmount.toFixed(0)}
            </span>
          </div>

          <p className="text-sm text-gray-500 mt-2">
            Delivery charges will be calculated at checkout.
          </p>

          <button
            onClick={() => navigate("/checkout")}
            className="w-full mt-6
            bg-[#ff4d2d] text-white py-3
            rounded-lg font-semibold
            hover:bg-orange-600 transition"
          >
            Proceed to Checkout
          </button>

        </div>

      </div>

    </div>
  );
};

export default Cart;