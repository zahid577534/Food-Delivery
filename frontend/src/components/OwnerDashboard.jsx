import React, { useEffect, useState } from "react";
import { setMyShops } from "../redux/ownerSlice";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  ShoppingBag,
  Package,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  RefreshCw,
  PlusCircle,
  Store,
  Edit3,
  ArrowRight,
  MapPin,
  Layers,
} from "lucide-react";

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // ==========================================
  // OWNER SHOPS
  // ==========================================
  const { myShops } = useSelector(
    (state) => state.owner
  );

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const serverUrl =
    import.meta.env.VITE_SERVER_URL;

  // ==========================================
  // TOTAL ITEMS FROM ALL SHOPS
  // ==========================================
  const totalItems = myShops.reduce(
    (total, shop) =>
      total + (shop.items?.length || 0),
    0
  );

  // ==========================================
  // FETCH ORDERS
  // ==========================================
  const fetchOrders = async () => {
    try {
      setLoading(true);

      const token =
        localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `${serverUrl}/api/order/owner-orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      setOrders(
        response.data.orders || []
      );

    } catch (error) {
      console.log(
        "Error fetching owner orders:",
        error.response?.data || error
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDeleteShop = async (shopId) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this shop?"
  );

  if (!confirmed) {
    return;
  }

  try {
    const token =
      localStorage.getItem("token");

    if (!token) {
      alert("Please login again.");
      return;
    }

    const response = await axios.delete(
      `${serverUrl}/api/shop/delete/${shopId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );

    if (response.data.success) {

      // Remove deleted shop from Redux
      const updatedShops = myShops.filter(
        (shop) => shop._id !== shopId
      );

      dispatch(
        setMyShops(updatedShops)
      );

      alert("Shop deleted successfully.");
    }

  } catch (error) {

    console.error(
      "Delete shop error:",
      error.response?.data ||
        error.message
    );

    alert(
      error.response?.data?.message ||
        "Failed to delete shop."
    );
  }
};
  // ==========================================
  // ORDER STATISTICS
  // ==========================================
  const pending = orders.filter(
    (order) =>
      order.status === "pending"
  ).length;

  const confirmed = orders.filter(
    (order) =>
      order.status === "confirmed"
  ).length;

  const preparing = orders.filter(
    (order) =>
      order.status === "preparing"
  ).length;

  const outForDelivery = orders.filter(
    (order) =>
      order.status === "out-for-delivery"
  ).length;

  const delivered = orders.filter(
    (order) =>
      order.status === "delivered"
  ).length;

  const cancelled = orders.filter(
    (order) =>
      order.status === "cancelled"
  ).length;

  const activeOrders =
    confirmed +
    preparing +
    outForDelivery;

  const totalSales = orders
    .filter(
      (order) =>
        order.status === "delivered"
    )
    .reduce(
      (total, order) =>
        total +
        Number(
          order.totalAmount || 0
        ),
      0
    );

  // ==========================================
  // DASHBOARD STATISTICS
  // ==========================================
  const stats = [
    {
      title: "Total Orders",
      value: orders.length,
      icon: ShoppingBag,
      bg: "bg-blue-50",
      text: "text-blue-600",
    },
    {
      title: "Menu Items",
      value: totalItems,
      icon: Package,
      bg: "bg-orange-50",
      text: "text-orange-600",
    },
    {
      title: "Pending Orders",
      value: pending,
      icon: Clock,
      bg: "bg-yellow-50",
      text: "text-yellow-600",
    },
    {
      title: "Active Orders",
      value: activeOrders,
      icon: Truck,
      bg: "bg-purple-50",
      text: "text-purple-600",
    },
    {
      title: "Delivered",
      value: delivered,
      icon: CheckCircle,
      bg: "bg-green-50",
      text: "text-green-600",
    },
    {
      title: "Cancelled",
      value: cancelled,
      icon: XCircle,
      bg: "bg-red-50",
      text: "text-red-600",
    },
  ];

  // ==========================================
  // RETURN
  // ==========================================
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">

      {/* ======================================
          HEADER
      ====================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

        <div>
          <p className="text-sm text-orange-500 font-semibold">
            Welcome back
          </p>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Owner Dashboard
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Manage your shops, products and customer orders.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition shadow-sm"
        >
          <RefreshCw
            size={17}
            className={
              loading
                ? "animate-spin"
                : ""
            }
          />

          {loading
            ? "Refreshing..."
            : "Refresh"}
        </button>

      </div>

      {/* ======================================
          MY SHOPS
      ====================================== */}
      <div
        id="my-shops-section"
        className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 md:p-5 mb-6"
      >

        {/* HEADER */}
        <div className="flex items-center justify-between mb-5">

          <div>

            <div className="flex items-center gap-2">

              <Store
                size={20}
                className="text-orange-500"
              />

              <h2 className="text-lg font-bold text-gray-800">
                My Shops
              </h2>

              <span className="px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 text-xs font-semibold">
                {myShops.length}
              </span>

            </div>

            <p className="text-xs text-gray-500 mt-1">
              Manage all your shops
            </p>

          </div>

          {/* ADD SHOP */}
          <button
            onClick={() =>
              navigate("/owner/shop/add")
            }
            className="flex items-center gap-2 px-3 py-2 bg-[#ff4d2d] text-white rounded-lg text-sm font-semibold hover:bg-[#e63e20] transition"
          >
            <PlusCircle size={16} />
            Add Shop
          </button>

        </div>

        {/* SHOP CARDS */}
        {myShops.length === 0 ? (

          <div className="py-8 text-center">

            <Store
              size={40}
              className="mx-auto text-gray-300 mb-3"
            />

            <h3 className="text-sm font-semibold text-gray-700">
              No shops yet
            </h3>

            <p className="text-xs text-gray-400 mt-1 mb-4">
              Create your first shop to get started.
            </p>

            <button
              onClick={() =>
                navigate("/owner/shop/add")
              }
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#ff4d2d] text-white text-sm rounded-lg hover:bg-[#e63e20] transition"
            >
              <PlusCircle size={16} />
              Create Shop
            </button>

          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

            {myShops.map((shop) => (

              <div
                key={shop._id}
                className="border border-gray-200 rounded-xl p-3 hover:shadow-md transition"
              >

                {/* SHOP TOP */}
                <div className="flex gap-3">

                  {/* SHOP IMAGE */}
                  {shop.image ? (

                    <img
                      src={shop.image}
                      alt={shop.name}
                      className="w-20 h-20 rounded-xl object-cover border border-gray-100 flex-shrink-0"
                    />

                  ) : (

                    <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">

                      <Store
                        size={30}
                        className="text-gray-400"
                      />

                    </div>

                  )}

                  {/* SHOP DETAILS */}
                  <div className="flex-1 min-w-0">

                    <div className="flex items-center gap-2">

                      <h3 className="font-bold text-gray-800 truncate">
                        {shop.name}
                      </h3>

                      <span className="px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 text-[9px] font-semibold">
                        ACTIVE
                      </span>

                    </div>

                    <div className="flex items-center gap-1 mt-1">

                      <MapPin
                        size={12}
                        className="text-gray-400"
                      />

                      <span className="text-xs text-gray-500 truncate">
                        {shop.city}
                      </span>

                    </div>

                    <div className="flex items-center gap-1 mt-1">

                      <Package
                        size={12}
                        className="text-gray-400"
                      />

                      <span className="text-xs text-gray-500">
                        {shop.items?.length || 0} items
                      </span>

                    </div>

                  </div>

                </div>

                {/* ADDRESS */}
                {shop.address && (

                  <p className="text-xs text-gray-400 mt-3 truncate">
                    {shop.address}
                  </p>

                )}

                {/* ACTIONS */}
                <div className="flex gap-2 mt-3">

                  {/* EDIT SHOP */}
                  {/* ACTIONS */}
<div className="flex gap-2 mt-3">

  {/* EDIT SHOP */}
  <button
    onClick={() =>
      navigate(
        `/owner/shop/${shop._id}`
      )
    }
    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-orange-50 text-orange-600 rounded-lg text-xs font-semibold hover:bg-orange-100 transition"
  >
    <Edit3 size={14} />
    Edit
  </button>

  {/* ADD ITEM */}
  <button
    onClick={() =>
      navigate(
        `/owner/shop/${shop._id}/add-item`
      )
    }
    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-50 text-green-600 rounded-lg text-xs font-semibold hover:bg-green-100 transition"
  >
    <PlusCircle size={14} />
    Add Item
  </button>

  {/* DELETE SHOP */}
  <button
    onClick={() =>
      handleDeleteShop(shop._id)
    }
    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-100 transition"
  >
    <XCircle size={14} />
    Delete
  </button>

</div>

                  {/* ADD ITEM */}
                 

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

      {/* ======================================
          STATISTICS
      ====================================== */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4 mb-7">

        {stats.map((stat) => {

          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition"
            >

              <div className="flex items-start justify-between">

                <div className="min-w-0">

                  <p className="text-xs text-gray-500 truncate">
                    {stat.title}
                  </p>

                  <h2 className="text-2xl font-bold text-gray-800 mt-1">
                    {loading
                      ? "..."
                      : stat.value}
                  </h2>

                </div>

                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${stat.bg}`}
                >
                  <Icon
                    size={19}
                    className={stat.text}
                  />
                </div>

              </div>

            </div>
          );
        })}

      </div>

      {/* ======================================
          QUICK ACTIONS
      ====================================== */}
      <div>

        <div className="flex items-center justify-between mb-3">

          <div>

            <h2 className="text-lg font-bold text-gray-800">
              Quick Actions
            </h2>

            <p className="text-xs text-gray-500 mt-0.5">
              Frequently used shop management tools
            </p>

          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

          {/* MANAGE ORDERS */}
          <button
            onClick={() =>
              navigate("/owner/orders")
            }
            className="group bg-white border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md hover:border-orange-200 transition text-left"
          >

            <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center">

              <ShoppingBag
                className="text-orange-500"
                size={20}
              />

            </div>

            <h3 className="font-semibold text-sm text-gray-800 mt-3">
              Manage Orders
            </h3>

            <p className="text-xs text-gray-500 mt-1">
              Approve, cancel and update customer orders.
            </p>

            <div className="flex items-center gap-1 text-xs text-orange-500 font-medium mt-3">

              Open Orders

              <ArrowRight
                size={13}
                className="group-hover:translate-x-1 transition"
              />

            </div>

          </button>

          {/* MANAGE ITEMS */}
          <button
            onClick={() =>
              navigate("/owner/items")
            }
            className="group bg-white border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md hover:border-orange-200 transition text-left"
          >

            <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center">

              <Layers
                className="text-orange-500"
                size={20}
              />

            </div>

            <h3 className="font-semibold text-sm text-gray-800 mt-3">
              Manage Items
            </h3>

            <p className="text-xs text-gray-500 mt-1">
              Edit, remove and manage your menu items.
            </p>

            <div className="flex items-center gap-1 text-xs text-orange-500 font-medium mt-3">

              Manage Menu

              <ArrowRight
                size={13}
                className="group-hover:translate-x-1 transition"
              />

            </div>

          </button>

        </div>

      </div>

    </div>
  );
};

export default OwnerDashboard;
