
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
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
  Tag,
  Layers,
} from "lucide-react";

const OwnerDashboard = () => {
  const navigate = useNavigate();

  const myShopData = useSelector((state) => state.owner);

  const shop = myShopData?.myShopData;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const serverUrl = import.meta.env.VITE_SERVER_URL;

  // ==========================================
  // TOTAL ITEMS
  // ==========================================
  const totalItems = shop?.items?.length || 0;

  // ==========================================
  // FETCH ORDERS
  // ==========================================
  const fetchOrders = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

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

      setOrders(response.data.orders || []);
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

  // ==========================================
  // ORDER STATISTICS
  // ==========================================
  const pending = orders.filter(
    (order) => order.status === "pending"
  ).length;

  const confirmed = orders.filter(
    (order) => order.status === "confirmed"
  ).length;

  const preparing = orders.filter(
    (order) => order.status === "preparing"
  ).length;

  const outForDelivery = orders.filter(
    (order) => order.status === "out-for-delivery"
  ).length;

  const delivered = orders.filter(
    (order) => order.status === "delivered"
  ).length;

  const cancelled = orders.filter(
    (order) => order.status === "cancelled"
  ).length;

  const activeOrders =
    confirmed + preparing + outForDelivery;

  const totalSales = orders
    .filter((order) => order.status === "delivered")
    .reduce(
      (total, order) =>
        total + Number(order.totalAmount || 0),
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
  // DISPLAY ITEMS
  // ==========================================
  const displayItems = shop?.items?.slice(0, 8) || [];

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
            Manage your shop, menu and customer orders.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition shadow-sm"
        >
          <RefreshCw
            size={17}
            className={loading ? "animate-spin" : ""}
          />

          {loading ? "Refreshing..." : "Refresh"}
        </button>

      </div>

      {/* ======================================
          SHOP INFORMATION CARD
      ====================================== */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 md:p-5 mb-6">

        <div className="flex flex-col sm:flex-row sm:items-center gap-4">

          {/* SHOP IMAGE */}
          {shop?.image ? (
            <img
              src={shop.image}
              alt={shop.name}
              className="w-20 h-20 rounded-xl object-cover border border-gray-100"
            />
          ) : (
            <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center">
              <Store
                size={32}
                className="text-gray-400"
              />
            </div>
          )}

          {/* SHOP DETAILS */}
          <div className="flex-1 min-w-0">

            <div className="flex items-center gap-2">

              <h2 className="text-xl font-bold text-gray-800 truncate">
                {shop?.name || "My Shop"}
              </h2>

              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-semibold">
                ACTIVE
              </span>

            </div>

            <div className="flex flex-wrap items-center gap-3 mt-1">

              <span className="flex items-center gap-1 text-xs text-gray-500">
                <MapPin size={13} />
                {shop?.city || "City not available"}
              </span>

              {shop?.address && (
                <span className="text-xs text-gray-400 truncate max-w-md">
                  {shop.address}
                </span>
              )}

            </div>

          </div>

          {/* EDIT SHOP */}
          <button
            onClick={() => navigate("/create-edit-shop")}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-[#ff4d2d] text-white rounded-lg text-sm font-semibold hover:bg-[#e63e20] transition"
          >
            <Edit3 size={16} />
            Edit Shop
          </button>

        </div>

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
                    {loading ? "..." : stat.value}
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
          MENU ITEMS SECTION
      ====================================== */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm mb-7">

        {/* SECTION HEADER */}
        <div className="flex items-center justify-between px-4 md:px-5 py-4 border-b border-gray-100">

          <div>

            <div className="flex items-center gap-2">

              <Package
                size={19}
                className="text-orange-500"
              />

              <h2 className="text-lg font-bold text-gray-800">
                My Menu Items
              </h2>

              <span className="px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 text-xs font-semibold">
                {totalItems}
              </span>

            </div>

            <p className="text-xs text-gray-500 mt-1">
              Items added to your shop menu
            </p>

          </div>

          <button
            onClick={() => navigate("/owner/items")}
            className="flex items-center gap-1 text-sm font-medium text-orange-600 hover:text-orange-700"
          >
            View All
            <ArrowRight size={15} />
          </button>

        </div>

        {/* ITEMS */}
        {totalItems === 0 ? (

          <div className="py-10 text-center">

            <Package
              size={40}
              className="mx-auto text-gray-300 mb-3"
            />

            <h3 className="text-sm font-semibold text-gray-700">
              No menu items yet
            </h3>

            <p className="text-xs text-gray-400 mt-1 mb-4">
              Start adding products to your shop menu.
            </p>

            <button
              onClick={() => navigate("/add-item")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#ff4d2d] text-white text-sm rounded-lg hover:bg-[#e63e20] transition"
            >
              <PlusCircle size={16} />
              Add First Item
            </button>

          </div>

        ) : (

          <div className="p-4">

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">

              {displayItems.map((item) => (

                <div
                  key={item._id}
                  className="border border-gray-200 rounded-xl p-2.5 hover:shadow-md transition bg-white"
                >

                  <div className="flex gap-3">

                    {/* ITEM IMAGE */}
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <Package
                          size={22}
                          className="text-gray-400"
                        />
                      </div>
                    )}

                    {/* ITEM INFO */}
                    <div className="flex-1 min-w-0">

                      <h3
                        className="text-sm font-semibold text-gray-800 truncate"
                        title={item.name}
                      >
                        {item.name}
                      </h3>

                      <div className="flex items-center gap-1 mt-1">

                        <Tag
                          size={11}
                          className="text-gray-400"
                        />

                        <span className="text-[11px] text-gray-500 truncate">
                          {item.category || "General"}
                        </span>

                      </div>

                      <div className="flex items-center justify-between mt-2">

                        <div>

                          <span className="text-sm font-bold text-orange-600">
                            Rs. {Number(item.price || 0).toLocaleString()}
                          </span>

                          {item.unit && (
                            <span className="text-[10px] text-gray-400 ml-1">
                              / {item.unit}
                            </span>
                          )}

                        </div>

                      </div>

                    </div>

                  </div>

                </div>

              ))}

            </div>

            {/* SHOW MORE */}
            {totalItems > 8 && (
              <div className="text-center mt-4">

                <button
                  onClick={() => navigate("/owner/items")}
                  className="text-sm font-medium text-orange-600 hover:text-orange-700"
                >
                  View all {totalItems} items →
                </button>

              </div>
            )}

          </div>

        )}

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

          {/* MANAGE ORDERS */}
          <button
            onClick={() => navigate("/owner/orders")}
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
            onClick={() => navigate("/owner/items")}
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

          {/* ADD ITEM */}
          <button
            onClick={() => navigate("/add-item")}
            className="group bg-white border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md hover:border-orange-200 transition text-left"
          >

            <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center">
              <PlusCircle
                className="text-orange-500"
                size={20}
              />
            </div>

            <h3 className="font-semibold text-sm text-gray-800 mt-3">
              Add New Item
            </h3>

            <p className="text-xs text-gray-500 mt-1">
              Add another product to your shop menu.
            </p>

            <div className="flex items-center gap-1 text-xs text-orange-500 font-medium mt-3">
              Add Item
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

