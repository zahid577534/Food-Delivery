import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Store,
  PlusCircle,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const OwnerLayout = () => {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

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

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* ==========================================
          MOBILE TOP BAR
      ========================================== */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white shadow-md z-50 flex items-center justify-between px-4">

        <h1 className="text-xl font-bold text-[#ff4d2d]">
          FoodDelivery
        </h1>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 transition"
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <X size={26} className="text-gray-700" />
          ) : (
            <Menu size={26} className="text-gray-700" />
          )}
        </button>

      </div>


      {/* ==========================================
          MOBILE OVERLAY
      ========================================== */}
      {menuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-40"
          onClick={closeMenu}
        />
      )}


      {/* ==========================================
          SIDEBAR
      ========================================== */}
      <aside
        className={`
          w-64 bg-white shadow-md fixed left-0 top-0 bottom-0 z-50
          transform transition-transform duration-300

          md:translate-x-0

          ${
            menuOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >

        {/* LOGO */}
        <div className="h-20 flex items-center justify-between px-6 border-b">

          <h1 className="text-2xl font-bold text-[#ff4d2d]">
            FoodDelivery
          </h1>

          {/* MOBILE CLOSE BUTTON */}
          <button
            onClick={closeMenu}
            className="md:hidden p-1 rounded-lg hover:bg-gray-100"
          >
            <X size={24} />
          </button>

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
                onClick={closeMenu}
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
            onClick={() => {
              navigate("/add-item");
              closeMenu();
            }}
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
            onClick={() => {
              handleLogout();
              closeMenu();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition"
          >
            <LogOut size={20} />

            <span className="font-medium">
              Logout
            </span>
          </button>

        </div>

      </aside>


      {/* ==========================================
          MAIN CONTENT
      ========================================== */}
      <main className="ml-0 md:ml-64 flex-1 min-h-screen pt-16 md:pt-0">
        <Outlet />
      </main>

    </div>
  );
};

export default OwnerLayout;