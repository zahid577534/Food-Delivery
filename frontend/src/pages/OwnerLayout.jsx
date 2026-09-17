import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Store,
  PlusCircle,
  LogOut,
} from "lucide-react";

const OwnerLayout = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/owner",
      icon: LayoutDashboard,
    },
    {
      name: "Orders",
      path: "/owner/orders",
      icon: ShoppingBag,
    },
    {
      name: "My Items",
      path: "/owner/items",
      icon: Package,
    },
    {
      name: "Shop Settings",
      path: "/create-edit-shop",
      icon: Store,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white shadow-md fixed left-0 top-0 bottom-0 z-40">

        {/* LOGO */}
        <div className="h-20 flex items-center px-6 border-b">
          <h1 className="text-2xl font-bold text-[#ff4d2d]">
            FoodDelivery
          </h1>
        </div>

        {/* MENU */}
        <nav className="p-4 space-y-2">

          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/owner"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    isActive
                      ? "bg-[#ff4d2d] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                <Icon size={20} />

                <span className="font-medium">
                  {item.name}
                </span>
              </NavLink>
            );
          })}

          {/* ADD ITEM */}
          <button
            onClick={() => navigate("/add-item")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition"
          >
            <PlusCircle size={20} />

            <span className="font-medium">
              Add Item
            </span>
          </button>
        </nav>

        {/* LOGOUT */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition"
          >
            <LogOut size={20} />

            <span className="font-medium">
              Logout
            </span>
          </button>

        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="ml-64 flex-1 min-h-screen">
        <Outlet />
      </main>

    </div>
  );
};

export default OwnerLayout;