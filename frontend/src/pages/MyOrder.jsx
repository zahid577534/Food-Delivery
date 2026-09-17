
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const serverUrl = import.meta.env.VITE_SERVER_URL;
  const navigate = useNavigate();

  // ==========================================
  // FETCH CUSTOMER ORDERS
  // ==========================================
  const fetchOrders = useCallback(async (isAutoRefresh = false) => {
    try {
      if (isAutoRefresh) {
        setRefreshing(true);
      }

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login first.");
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const result = await axios.get(
        `${serverUrl}/api/order/my-orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      setOrders(result.data.orders || []);
      setError("");
    } catch (error) {
      console.error(
        "Error fetching orders:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Failed to load orders"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [serverUrl]);

  // ==========================================
  // INITIAL LOAD + AUTO REFRESH
  // ==========================================
  useEffect(() => {
    fetchOrders();

    // Refresh every 10 seconds
    const interval = setInterval(() => {
      fetchOrders(true);
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchOrders]);

  // ==========================================
  // ORDER TRACKING
  // ==========================================
  const trackingSteps = [
    {
      status: "pending",
      label: "Order Placed",
      icon: "📝",
    },
    {
      status: "confirmed",
      label: "Order Confirmed",
      icon: "✅",
    },
    {
      status: "preparing",
      label: "Preparing",
      icon: "👨‍🍳",
    },
    {
      status: "out-for-delivery",
      label: "Out for Delivery",
      icon: "🚚",
    },
    {
      status: "delivered",
      label: "Delivered",
      icon: "🎉",
    },
  ];

  const getTrackingProgress = (status) => {
    const index = trackingSteps.findIndex(
      (step) => step.status === status
    );

    return index;
  };

  // ==========================================
  // PRINT RECEIPT
  // ==========================================
  const printReceipt = (order) => {
    const receiptWindow = window.open(
      "",
      "_blank",
      "width=700,height=800"
    );

    if (!receiptWindow) {
      alert("Please allow popups to print the receipt.");
      return;
    }

    receiptWindow.document.write(`
      <html>
        <head>
          <title>Payment Receipt - ${order.receiptNumber || order._id}</title>

          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 30px;
              color: #222;
            }

            .receipt {
              max-width: 650px;
              margin: auto;
              border: 1px solid #ddd;
              padding: 30px;
              border-radius: 10px;
            }

            .header {
              text-align: center;
              margin-bottom: 25px;
            }

            .header h1 {
              margin-bottom: 5px;
            }

            .header p {
              color: #777;
            }

            .row {
              display: flex;
              justify-content: space-between;
              margin: 8px 0;
            }

            .items {
              margin-top: 25px;
              border-top: 1px solid #ddd;
              border-bottom: 1px solid #ddd;
              padding: 15px 0;
            }

            .total {
              font-size: 20px;
              font-weight: bold;
              margin-top: 20px;
            }

            .status {
              text-align: center;
              margin-top: 25px;
              padding: 12px;
              background: #fff3cd;
              border-radius: 8px;
              font-weight: bold;
            }

            .footer {
              text-align: center;
              margin-top: 30px;
              color: #777;
              font-size: 13px;
            }
          </style>
        </head>

        <body>

          <div class="receipt">

            <div class="header">
              <h1>Shukar Din Stores</h1>
              <p>Payment Receipt</p>
            </div>

            <div class="row">
              <strong>Receipt No:</strong>
              <span>${order.receiptNumber || "Not generated"}</span>
            </div>

            <div class="row">
              <strong>Order ID:</strong>
              <span>${order._id}</span>
            </div>

            <div class="row">
              <strong>Shop:</strong>
              <span>${order.shop?.name || "Shop"}</span>
            </div>

            <div class="row">
              <strong>Date:</strong>
              <span>
                ${new Date(order.createdAt).toLocaleString()}
              </span>
            </div>

            <div class="items">

              ${order.items
                .map(
                  (item) => `
                    <div class="row">
                      <span>
                        ${item.name}
                        (${item.quantity} × Rs. ${item.price})
                      </span>

                      <strong>
                        Rs. ${item.price * item.quantity}
                      </strong>
                    </div>
                  `
                )
                .join("")}

            </div>

            <div class="row total">
              <span>Total Payable</span>
              <span>Rs. ${order.totalAmount}</span>
            </div>

            <div class="status">
              Payment Status:
              ${(order.paymentStatus || "unpaid").toUpperCase()}
            </div>

            <div class="footer">
              Thank you for using Food Delivery.
            </div>

          </div>

          <script>
            window.onload = function () {
              window.print();
            };
          </script>

        </body>
      </html>
    `);

    receiptWindow.document.close();
  };

  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">
          Loading your orders...
        </p>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">

        <p className="text-red-500">
          {error}
        </p>

        <button
          onClick={() => navigate("/")}
          className="px-5 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
        >
          ← Back to Home
        </button>

      </div>
    );
  }

  // ==========================================
  // MAIN
  // ==========================================
  return (
    <div className="min-h-screen bg-[#fff9f6] pt-[110px] px-4 pb-10">

      <div className="max-w-4xl mx-auto">

        {/* Back Button + Refresh */}
        <div className="flex justify-between items-center mb-5">

          <button
            onClick={() => navigate("/")}
            className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg
            font-medium hover:bg-gray-300 transition"
          >
            ← Back to Home
          </button>

          <button
            onClick={() => fetchOrders(true)}
            disabled={refreshing}
            className="px-4 py-2.5 bg-white border border-gray-300
            text-gray-700 rounded-lg hover:bg-gray-50 transition
            disabled:opacity-50"
          >
            {refreshing ? "Refreshing..." : "🔄 Refresh"}
          </button>

        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">

          <div>
            <h1 className="text-3xl font-bold">
              My Orders
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Order status updates automatically every 10 seconds.
            </p>
          </div>

        </div>

        {orders.length === 0 ? (

          <div className="bg-white rounded-xl p-8 text-center shadow">

            <p className="text-gray-500">
              You haven't placed any orders yet.
            </p>

            <button
              onClick={() => navigate("/")}
              className="mt-5 px-5 py-2.5 bg-orange-500
              text-white rounded-lg hover:bg-orange-600 transition"
            >
              Start Shopping
            </button>

          </div>

        ) : (

          <div className="space-y-5">

            {orders.map((order) => {

              const currentProgress =
                getTrackingProgress(order.status);

              const isCancelled =
                order.status === "cancelled";

              return (

                <div
                  key={order._id}
                  className="bg-white rounded-xl shadow p-5"
                >

                  {/* ======================================
                      SHOP + STATUS
                  ====================================== */}
                  <div className="flex justify-between items-center mb-5">

                    <div>

                      <h2 className="text-xl font-semibold">
                        {order.shop?.name || "Shop"}
                      </h2>

                      <p className="text-sm text-gray-500">
                        Order ID: {order._id}
                      </p>

                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-sm
                      font-medium ${
                        order.status === "confirmed"
                          ? "bg-green-100 text-green-700"
                          : order.status === "preparing"
                          ? "bg-blue-100 text-blue-700"
                          : order.status === "out-for-delivery"
                          ? "bg-purple-100 text-purple-700"
                          : order.status === "delivered"
                          ? "bg-green-100 text-green-700"
                          : order.status === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-orange-100 text-orange-600"
                      }`}
                    >
                      {order.status}
                    </span>

                  </div>


                  {/* ======================================
                      ORDER TRACKING
                  ====================================== */}

                  <div className="border rounded-xl p-5 bg-gray-50 mb-6">

                    <div className="flex items-center justify-between mb-5">

                      <h3 className="font-bold text-lg">
                        Order Tracking
                      </h3>

                      {refreshing && (
                        <span className="text-xs text-gray-500">
                          Updating...
                        </span>
                      )}

                    </div>

                    {isCancelled ? (

                      <div className="bg-red-50 border border-red-200
                      rounded-lg p-4 text-center">

                        <div className="text-3xl mb-2">
                          ❌
                        </div>

                        <h4 className="font-bold text-red-700">
                          Order Cancelled
                        </h4>

                        <p className="text-sm text-red-600 mt-1">
                          This order has been cancelled by the shop.
                        </p>

                      </div>

                    ) : (

                      <div className="space-y-4">

                        {trackingSteps.map((step, index) => {

                          const isCompleted =
                            currentProgress >= index;

                          const isCurrent =
                            currentProgress === index;

                          return (

                            <div
                              key={step.status}
                              className="flex items-center"
                            >

                              {/* Icon */}
                              <div
                                className={`w-10 h-10 rounded-full
                                flex items-center justify-center
                                text-lg flex-shrink-0 ${
                                  isCompleted
                                    ? "bg-green-500 text-white"
                                    : "bg-gray-200 text-gray-500"
                                } ${
                                  isCurrent
                                    ? "ring-4 ring-green-100"
                                    : ""
                                }`}
                              >
                                {step.icon}
                              </div>


                              {/* Text */}
                              <div className="ml-4">

                                <p
                                  className={`font-semibold ${
                                    isCompleted
                                      ? "text-green-700"
                                      : "text-gray-400"
                                  }`}
                                >
                                  {step.label}
                                </p>

                                {isCurrent && (
                                  <p className="text-xs text-orange-600 mt-1">
                                    Current Status
                                  </p>
                                )}

                              </div>

                            </div>

                          );
                        })}

                      </div>

                    )}

                  </div>


                  {/* ======================================
                      ITEMS
                  ====================================== */}

                  <div className="space-y-3">

                    {order.items.map((item) => (

                      <div
                        key={item.itemId}
                        className="flex items-center gap-3
                        border-b pb-3"
                      >

                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />

                        <div className="flex-1">

                          <h3 className="font-medium">
                            {item.name}
                          </h3>

                          <p className="text-sm text-gray-500">
                            {item.quantity} × Rs. {item.price}
                          </p>

                          <p className="text-gray-500 text-sm mt-1">
                            Unit: {item.unit}
                          </p>

                        </div>

                        <p className="font-semibold">
                          Rs.{" "}
                          {item.price * item.quantity}
                        </p>

                      </div>

                    ))}

                  </div>


                  {/* ======================================
                      TOTAL
                  ====================================== */}

                  <div className="flex justify-between items-center mt-4">

                    <span className="font-semibold">
                      Total
                    </span>

                    <span className="text-lg font-bold">
                      Rs. {order.totalAmount}
                    </span>

                  </div>


                  {/* ======================================
                      DATE
                  ====================================== */}

                  <p className="text-sm text-gray-400 mt-2">
                    {new Date(
                      order.createdAt
                    ).toLocaleString()}
                  </p>


                  {/* ======================================
                      PAYMENT RECEIPT
                  ====================================== */}

                  {order.status === "confirmed" && (

                    <div className="mt-5 border-t pt-5">

                      <div className="bg-green-50 border border-green-200 rounded-xl p-4">

                        <div className="flex items-center justify-between">

                          <div>

                            <h3 className="text-lg font-bold text-green-700">
                              Order Approved ✓
                            </h3>

                            <p className="text-sm text-gray-600 mt-1">
                              Your payment receipt is ready.
                            </p>

                          </div>

                          <div className="text-right">

                            <p className="text-sm text-gray-500">
                              Payment
                            </p>

                            <p className="font-bold text-orange-600">
                              {(order.paymentStatus || "unpaid").toUpperCase()}
                            </p>

                          </div>

                        </div>


                        <div className="mt-4 bg-white rounded-lg p-3">

                          <div className="flex justify-between">

                            <span className="text-gray-500">
                              Receipt No.
                            </span>

                            <span className="font-semibold">
                              {order.receiptNumber || "Pending"}
                            </span>

                          </div>

                          <div className="flex justify-between mt-2">

                            <span className="text-gray-500">
                              Amount Payable
                            </span>

                            <span className="font-bold">
                              Rs. {order.totalAmount}
                            </span>

                          </div>

                        </div>


                        <div className="flex gap-3 mt-4">

                          <button
                            onClick={() =>
                              printReceipt(order)
                            }
                            className="flex-1 px-4 py-2.5
                            bg-gray-800 text-white rounded-lg
                            hover:bg-gray-900 transition"
                          >
                            🧾 Print Receipt
                          </button>

                          <button
                            onClick={() =>
                              alert(
                                "Online payment will be connected next."
                              )
                            }
                            className="flex-1 px-4 py-2.5
                            bg-orange-500 text-white rounded-lg
                            hover:bg-orange-600 transition"
                          >
                            💳 Pay Now
                          </button>

                        </div>

                      </div>

                    </div>

                  )}

                </div>

              );
            })}

          </div>

        )}

      </div>

    </div>
  );
}

export default MyOrders;

