import React, { useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { IoCartSharp } from "react-icons/io5";
import { FiMenu, FiX } from "react-icons/fi";
import { FaCalendarPlus } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import Input from "../Input";
import { logout } from "../redux/userSlice";

const Nav = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux data
  const { myShopData } = useSelector((state) => state.owner);
  const { user, currentCity } = useSelector((state) => state.user);
  const cartItems = useSelector((state) => state.cart.items);
  // Local states
  const [menuOpen, setMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const cartCount = cartItems?.reduce(
  (total, item) => total + item.quantity,
  0
);
  // Logout
  const handleLogout = () => {
    dispatch(logout());
    setShowUserMenu(false);
    setMenuOpen(false);

    navigate("/signin");
  };

  // Navigate and close mobile menu
  const handleNavigation = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <div className="fixed top-0 left-0 right-0 w-full z-50 bg-white shadow-md border-b">

      {/* =========================
          MAIN NAVBAR
      ========================= */}

      <div className="flex items-center justify-between px-4 md:px-8 h-[75px]">

        {/* =========================
            LOGO
        ========================= */}

        <h1
          onClick={() =>
            handleNavigation(
              user?.role === "owner"
                ? "/owner-dashboard"
                : "/"
            )
          }
          className="text-2xl md:text-3xl font-bold text-[#ff4d2d] cursor-pointer"
        >
          Food Delivery
        </h1>


        {/* =========================
            USER SEARCH
        ========================= */}

        {user?.role === "user" && (
          <div className="hidden md:flex items-center gap-4 bg-gray-50 border rounded-xl px-4 py-2 w-[55%]">

            {/* Location */}

            <div className="flex items-center gap-2">

              <FaLocationDot className="text-[#ff4d2d]" />

              <span className="text-sm font-medium">
                {currentCity || "Select City"}
              </span>

            </div>


            {/* Divider */}

            <div className="h-5 w-[1px] bg-gray-300" />


            {/* Search */}

            <div className="flex items-center gap-2 w-full">

              <FaSearch className="text-[#ff4d2d]" />

              <Input
                placeholder="Search restaurants, dishes..."
                className="outline-none w-full bg-transparent"
              />

            </div>

          </div>
        )}


        {/* =========================
            OWNER ACTIONS - DESKTOP
        ========================= */}

        {user?.role === "owner" && myShopData && (

          <div className="hidden md:flex items-center gap-3">

            {/* Add Food */}

            <button
              onClick={() =>
                handleNavigation("/add-item")
              }
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#ff4d2d] text-white font-medium hover:bg-[#e6451f] transition"
            >

              <FaCalendarPlus />

              Add Food Item

            </button>


            {/* My Orders */}

            <button
              onClick={() =>
                handleNavigation("/orders")
              }
              className="relative px-4 py-2 bg-[#ff4d2d] text-white rounded-lg hover:bg-[#e6451f] transition"
            >

              My Orders

              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                0
              </span>

            </button>

          </div>

        )}


        {/* =========================
            RIGHT SIDE
        ========================= */}

        <div className="flex items-center gap-4">

          {/* =========================
              CART - USER ONLY
          ========================= */}

          {user?.role === "user" && (

            <div
              onClick={() =>
                handleNavigation("/cart")
              }
              className="relative cursor-pointer"
            >

              <IoCartSharp
                size={24}
                className="text-[#ff4d2d]"
              />

              {user?.role === "user" && (
  <div
    onClick={() => handleNavigation("/cart")}
    className="relative cursor-pointer"
  >
   

    <span className="absolute -top-2 -right-2 bg-[#ff4d2d] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
      {cartCount}
    </span>
  </div>
)}

            </div>

          )}


          {/* =========================
              MY ORDERS - USER ONLY
          ========================= */}

          {user?.role === "user" && (

            <button
              onClick={() =>
                handleNavigation("/orders")
              }
              className="relative hidden sm:block px-4 py-2 bg-[#ff4d2d] text-white rounded-lg hover:bg-[#e6451f] transition"
            >

              My Orders

              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                0
              </span>

            </button>

          )}


          {/* =========================
              USER AVATAR
          ========================= */}

          <div className="relative">

            <div
              onClick={() =>
                setShowUserMenu(!showUserMenu)
              }
              className="w-9 h-9 flex items-center justify-center bg-gray-200 rounded-full font-semibold cursor-pointer hover:bg-gray-300"
            >

              {user?.fullName
                ? user.fullName.slice(0, 2).toUpperCase()
                : "U"}

            </div>


            {/* =========================
                USER DROPDOWN
            ========================= */}

            {showUserMenu && (

              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-xl overflow-hidden border">

                <div className="px-4 py-2 font-semibold border-b">

                  {user?.fullName || "User"}

                </div>


                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                >
                  Logout
                </button>

              </div>

            )}

          </div>


          {/* =========================
              MOBILE MENU BUTTON
          ========================= */}

          <div className="md:hidden">

            <button
              onClick={() =>
                setMenuOpen(!menuOpen)
              }
            >

              {menuOpen
                ? <FiX size={24} />
                : <FiMenu size={24} />
              }

            </button>

          </div>

        </div>

      </div>


      {/* =========================
          MOBILE MENU
      ========================= */}

      {menuOpen && (

        <div className="md:hidden px-4 pb-4 space-y-3 bg-white">

          {/* =========================
              USER MOBILE
          ========================= */}

          {user?.role === "user" && (

            <>

              {/* Location */}

              <div className="flex items-center gap-2 bg-gray-50 border rounded-lg px-3 py-2">

                <FaLocationDot className="text-[#ff4d2d]" />

                <span>
                  {currentCity || "City"}
                </span>

              </div>


              {/* Search */}

              <div className="flex items-center gap-2 bg-gray-50 border rounded-lg px-3 py-2">

                <FaSearch className="text-[#ff4d2d]" />

                <Input
                  placeholder="Search..."
                  className="w-full"
                />

              </div>


              {/* Cart */}

              <button
                onClick={() =>
                  handleNavigation("/cart")
                }
                className="w-full flex items-center justify-center gap-2 px-4 py-2 border rounded-lg"
              >

                <IoCartSharp className="text-[#ff4d2d]" />

                Cart

              </button>


              {/* My Orders */}

              <button
                onClick={() =>
                  handleNavigation("/orders")
                }
                className="w-full px-4 py-2 bg-[#ff4d2d] text-white rounded-lg"
              >

                My Orders

              </button>

            </>

          )}


          {/* =========================
              OWNER MOBILE
          ========================= */}

          {user?.role === "owner" && (

            <>

              {/* Add Food */}

              <button
                onClick={() =>
                  handleNavigation("/add-item")
                }
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#ff4d2d] text-white rounded-lg"
              >

                <FaCalendarPlus />

                Add Food Item

              </button>


              {/* My Orders */}

              <button
                onClick={() =>
                  handleNavigation("/orders")
                }
                className="w-full px-4 py-2 bg-[#ff4d2d] text-white rounded-lg"
              >

                My Orders

              </button>

            </>

          )}

        </div>

      )}

    </div>
  );
};

export default Nav;