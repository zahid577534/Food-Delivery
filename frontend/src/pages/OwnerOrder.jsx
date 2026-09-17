import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  ChefHat, 
  Truck, 
  PackageCheck, 
  RefreshCw, 
  Printer,
  ShoppingBag,
} from "lucide-react";

const OwnerOrders = () => {
  const serverUrl = import.meta.env.VITE_SERVER_URL;

  const [orders, setOrders] = useState([]);
const [loading, setLoading] = useState(true);
const [updatingOrder, setUpdatingOrder] = useState(null);

const [deliveryCharges, setDeliveryCharges] = useState({});
const [discount, setDiscount] = useState({});

  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${serverUrl}/api/order/owner-orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      setOrders(response.data.orders || []);
    } catch (error) {
      console.log(
        "Error fetching orders:",
        error.response?.data || error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (
  orderId,
  status
) => {
  try {
    setUpdatingOrder(orderId);

    const response = await axios.put(
      `${serverUrl}/api/order/update-status/${orderId}`,
      {
        status,

        // Send pricing information only when approving
        deliveryCharges:
          status === "confirmed"
            ? Number(deliveryCharges[orderId] || 0)
            : undefined,

        discount:
          status === "confirmed"
            ? Number(discount[orderId] || 0)
            : undefined,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );

    const updatedOrder = response.data.order;

    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order._id === orderId
          ? updatedOrder
          : order
      )
    );
  } catch (error) {
    console.log(
      "Error updating order:",
      error.response?.data || error
    );

    alert(
      error.response?.data?.message ||
        "Failed to update order"
    );
  } finally {
    setUpdatingOrder(null);
  }
};

  const printReceipt = (order) => {
    const receiptWindow = window.open(
      "",
      "_blank",
      "width=800,height=900"
    );

    if (!receiptWindow) {
      alert("Please allow popups to print receipt.");
      return;
    }

    const shopName =
      order.shop?.name || "FoodDelivery Shop";

    const customerName =
      order.user?.name || "Customer";

    const customerMobile =
      order.user?.mobile || "";

    const receiptNumber =
      order.receiptNumber || order._id;

    const orderDate = order.createdAt
      ? new Date(order.createdAt).toLocaleString()
      : "";

    const itemsHtml = (
      order.items || []
    )
      .map(
        (item) => `
          <tr>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>Rs.${item.price}</td>
            <td>Rs.${
              Number(item.price) *
              Number(item.quantity)
            }</td>
          </tr>
        `
      )
      .join("");

    receiptWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Receipt</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 30px;
            color: #222;
          }

          h1 {
            text-align: center;
            margin-bottom: 5px;
          }

          .center {
            text-align: center;
          }

          .info {
            margin: 20px 0;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }

          th, td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
          }

          th {
            background: #f5f5f5;
          }

          .total {
            text-align: right;
            font-size: 20px;
            font-weight: bold;
            margin-top: 20px;
          }

          .footer {
            text-align: center;
            margin-top: 40px;
            color: #666;
          }
        </style>
      </head>

      <body>
        <h1>${shopName}</h1>

        <div class="center">
          <p>Order Receipt</p>
        </div>

        <div class="info">
          <strong>Receipt:</strong>
          ${receiptNumber}
          <br />

          <strong>Customer:</strong>
          ${customerName}
          <br />

          <strong>Mobile:</strong>
          ${customerMobile}
          <br />

          <strong>Date:</strong>
          ${orderDate}
          <br />

          <strong>Payment:</strong>
          ${order.paymentMethod || "N/A"}
        </div>

        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>

          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div class="total">
          Total: Rs.${Number(
            order.totalAmount || 0
          ).toLocaleString()}
        </div>

        <div class="footer">
          Thank you for ordering!
        </div>

        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
      </html>
    `);

    receiptWindow.document.close();
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "confirmed":
        return "bg-blue-100 text-blue-700";

      case "preparing":
        return "bg-purple-100 text-purple-700";

      case "out-for-delivery":
        return "bg-orange-100 text-orange-700";

      case "delivered":
        return "bg-green-100 text-green-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Pending";

      case "confirmed":
        return "Confirmed";

      case "preparing":
        return "Preparing";

      case "out-for-delivery":
        return "Out for Delivery";

      case "delivered":
        return "Delivered";

      case "cancelled":
        return "Cancelled";

      default:
        return status;
    }
  };

  const renderActions = (order) => {
    const isUpdating =
      updatingOrder === order._id;

    if (order.status === "pending") {
  const currentDelivery =
    deliveryCharges[order._id] ?? "";

  const currentDiscount =
    discount[order._id] ?? "";

  const itemsSubtotal =
    Number(order.itemsSubtotal || 0);

  const delivery =
    Number(currentDelivery || 0);

  const discountAmount =
    Number(currentDiscount || 0);

  const finalTotal =
    itemsSubtotal +
    delivery -
    discountAmount;

  return (
    <div className="w-full space-y-4">

      {/* PRICING */}
      <div className="bg-gray-50 rounded-lg p-4 border">
        <h3 className="font-semibold text-gray-800 mb-3">
          Order Pricing
        </h3>

        {/* ITEMS SUBTOTAL */}
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">
            Items Subtotal
          </span>

          <span className="font-medium">
            Rs.{itemsSubtotal.toLocaleString()}
          </span>
        </div>

        {/* DELIVERY CHARGES */}
        <div className="flex items-center justify-between gap-4 mb-3">
          <label className="text-gray-600">
            Delivery Charges
          </label>

          <input
            type="number"
            min="0"
            value={currentDelivery}
            onChange={(e) =>
              setDeliveryCharges((prev) => ({
                ...prev,
                [order._id]: e.target.value,
              }))
            }
            placeholder="0"
            className="w-32 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* DISCOUNT */}
        <div className="flex items-center justify-between gap-4 mb-3">
          <label className="text-gray-600">
            Discount
          </label>

          <input
            type="number"
            min="0"
            value={currentDiscount}
            onChange={(e) =>
              setDiscount((prev) => ({
                ...prev,
                [order._id]: e.target.value,
              }))
            }
            placeholder="0"
            className="w-32 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* FINAL TOTAL */}
        <div className="border-t pt-3 flex justify-between">
          <span className="font-bold text-gray-800">
            Final Total
          </span>

          <span className="font-bold text-xl text-[#ff4d2d]">
            Rs.{Math.max(0, finalTotal).toLocaleString()}
          </span>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex flex-wrap gap-2">

        <button
          disabled={isUpdating}
          onClick={() =>
            updateOrderStatus(
              order._id,
              "confirmed"
            )
          }
          className="flex items-center gap-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
        >
          <CheckCircle size={17} />
          Approve
        </button>

        <button
          disabled={isUpdating}
          onClick={() => {
            const confirmCancel =
              window.confirm(
                "Are you sure you want to cancel this order?"
              );

            if (confirmCancel) {
              updateOrderStatus(
                order._id,
                "cancelled"
              );
            }
          }}
          className="flex items-center gap-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
        >
          <XCircle size={17} />
          Cancel
        </button>

      </div>
    </div>
  );
}

    if (order.status === "confirmed") {
      return (
        <button
          disabled={isUpdating}
          onClick={() =>
            updateOrderStatus(
              order._id,
              "preparing"
            )
          }
          className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50"
        >
          <ChefHat size={17} />
          Start Preparing
        </button>
      );
    }

    if (order.status === "preparing") {
      return (
        <button
          disabled={isUpdating}
          onClick={() =>
            updateOrderStatus(
              order._id,
              "out-for-delivery"
            )
          }
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
        >
          <Truck size={17} />
          Out for Delivery
        </button>
      );
    }

    if (order.status === "out-for-delivery") {
      return (
        <button
          disabled={isUpdating}
          onClick={() =>
            updateOrderStatus(
              order._id,
              "delivered"
            )
          }
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
        >
          <PackageCheck size={17} />
          Mark Delivered
        </button>
      );
    }

    return null;
  };

  return (
    <div className="p-6 md:p-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Customer Orders
          </h1>

          <p className="text-gray-500 mt-1">
            Manage and update customer orders.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50"
        >
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="bg-white rounded-xl p-12 text-center">
          <p className="text-gray-500">
            Loading orders...
          </p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center">
          <ShoppingBag
            size={55}
            className="mx-auto text-gray-300"
          />

          <h2 className="text-xl font-semibold mt-4">
            No orders yet
          </h2>

          <p className="text-gray-500 mt-2">
            Customer orders will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              {/* TOP */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b pb-5">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">
                    Order #
                    {order.receiptNumber ||
                      order._id.slice(-6)}
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    {order.createdAt
                      ? new Date(
                          order.createdAt
                        ).toLocaleString()
                      : ""}
                  </p>
                </div>

                <div
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusStyle(
                    order.status
                  )}`}
                >
                  {getStatusText(order.status)}
                </div>
              </div>

              {/* CUSTOMER */}
              <div className="py-5 border-b">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Customer
                </h3>

                <p className="text-gray-600">
                  {order.user?.name ||
                    "Customer"}
                </p>

                {order.user?.mobile && (
                  <p className="text-sm text-gray-500">
                    {order.user.mobile}
                  </p>
                )}

                {order.deliveryAddress  && (
  <div className="text-sm text-gray-500 mt-1">
    <p>
      <strong>Customer:</strong>{" "}
      {order.deliveryAddress.fullName}
    </p>

    <p>
      <strong>Phone:</strong>{" "}
      {order.deliveryAddress.phone}
    </p>

    <p>
      <strong>Address:</strong>{" "}
      {order.deliveryAddress.address}
    </p>

    <p>
      <strong>City:</strong>{" "}
      {order.deliveryAddress.city}
    </p>
  </div>
)}
              </div>

              {/* ITEMS */}
              <div className="py-5 border-b">
                <h3 className="font-semibold text-gray-800 mb-3">
                  Items
                </h3>

                <div className="space-y-3">
                  {(order.items || []).map(
                    (item, index) => (
                      <div
                        key={
                          item._id || index
                        }
                        className="flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          )}

                          <div>
                            <p className="font-medium">
                              {item.name}
                            </p>

                            <p className="text-sm text-gray-500">
                              Qty:{" "}
                              {item.quantity}
                            </p>
                          </div>
                        </div>

                        <p className="font-semibold">
                          Rs.
                          {(
                            Number(
                              item.price || 0
                            ) *
                            Number(
                              item.quantity || 0
                            )
                          ).toLocaleString()}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* BOTTOM */}
              <div className="pt-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500">
                    Payment:{" "}
                    <span className="font-medium text-gray-700">
                      {order.paymentMethod ||
                        "N/A"}
                    </span>
                  </p>

                  <p className="text-2xl font-bold text-[#ff4d2d] mt-1">
                    Rs.
                    {Number(
                      order.totalAmount || 0
                    ).toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {renderActions(order)}

                  <button
                    onClick={() =>
                      printReceipt(order)
                    }
                    className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800"
                  >
                    <Printer size={17} />
                    Receipt
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerOrders;