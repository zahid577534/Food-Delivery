import React from "react";
import {
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useSelector } from "react-redux";

// ===============================
// NAVBAR
// ===============================
import Nav from "./components/Nav";

// ===============================
// CUSTOMER PAGES
// ===============================
import ShopMenu from "./pages/ShopMenu";
import Cart from "./pages/Cart";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Forgotpassword from "./pages/Forgotpassword";
import Home from "./pages/Home";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrder";

// ===============================
// OWNER PAGES
// ===============================
import OwnerItem from "./pages/OwnerItem";
import OwnerLayout from "./pages/OwnerLayout";
import OwnerOrder from "./pages/OwnerOrder";
import OwnerDashboard from "./components/OwnerDashboard";

// ===============================
// SHOP / ITEM PAGES
// ===============================
import CreateEditShop from "./pages/CreateEditShop";
import AddItem from "./pages/AddItem";

// ===============================
// HOOKS
// ===============================
import useGetCity from "./hooks/useGetCity";
import useGetCurrentUser from "./hooks/useGetCurrentUser";
import useGetMyShop from "./hooks/useGetMyShop";


// ======================================================
// CUSTOMER LAYOUT
// Navbar appears on customer pages
// ======================================================
const CustomerLayout = () => {
  return (
    <>
      <Nav />

      {/* Navbar is fixed, so add top padding */}
      <main className="pt-[75px] min-h-screen">
        <Outlet />
      </main>
    </>
  );
};


// ======================================================
// APP
// ======================================================
const App = () => {

  const { user } = useSelector(
    (state) => state.user
  );

  // ===============================
  // LOAD APPLICATION DATA
  // ===============================
  useGetCurrentUser();
  useGetCity();
  useGetMyShop();


  return (
    <Routes>

      {/* =================================================
          AUTHENTICATION PAGES
          NO NAVBAR
      ================================================= */}

      <Route
        path="/signin"
        element={
          !user ? (
            <SignIn />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      <Route
        path="/signup"
        element={
          !user ? (
            <SignUp />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      <Route
        path="/forgot-password"
        element={
          !user ? (
            <Forgotpassword />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />


      {/* =================================================
          CUSTOMER SECTION
          NAVBAR INCLUDED
      ================================================= */}

      <Route
        element={
          user ? (
            <CustomerLayout />
          ) : (
            <Navigate
              to="/signin"
              replace
            />
          )
        }
      >

        {/* ===============================
            HOME
        =============================== */}

        <Route
          path="/"
          element={<Home />}
        />


        {/* ===============================
            SHOP MENU
        =============================== */}

        <Route
          path="/shop/:shopId"
          element={<ShopMenu />}
        />


        {/* ===============================
            CART
        =============================== */}

        <Route
          path="/cart"
          element={<Cart />}
        />


        {/* ===============================
            MY ORDERS
        =============================== */}

        <Route
          path="/my-orders"
          element={<MyOrders />}
        />


        {/* ===============================
            CHECKOUT
        =============================== */}

        <Route
          path="/checkout"
          element={<Checkout />}
        />


        {/* ===============================
            CREATE / EDIT SHOP
        =============================== */}

        <Route
          path="/create-edit-shop"
          element={<CreateEditShop />}
        />


        {/* ===============================
            ADD ITEM
        =============================== */}

        <Route
          path="/add-item"
          element={<AddItem />}
        />

      </Route>


      {/* =================================================
          OWNER SECTION
          SIDEBAR INCLUDED
      ================================================= */}

      <Route
        path="/owner"
        element={
          user?.role === "owner" ? (
            <OwnerLayout />
          ) : (
            <Navigate
              to="/"
              replace
            />
          )
        }
      >

        {/* ===============================
            OWNER DASHBOARD
        =============================== */}

        <Route
          index
          element={
            <OwnerDashboard />
          }
        />


        {/* ===============================
            ADD SHOP
        =============================== */}

        <Route
          path="shop/add"
          element={
            <CreateEditShop />
          }
        />


        {/* ===============================
            EDIT SHOP
        =============================== */}

        <Route
          path="shop/:shopId"
          element={
            <CreateEditShop />
          }
        />


        {/* ===============================
            ADD ITEM TO SPECIFIC SHOP
        =============================== */}

        <Route
          path="shop/:shopId/add-item"
          element={
            <AddItem />
          }
        />


        {/* ===============================
            OWNER ORDERS
        =============================== */}

        <Route
          path="orders"
          element={
            <OwnerOrder />
          }
        />


        {/* ===============================
            OWNER ITEMS
        =============================== */}

        <Route
          path="items"
          element={
            <OwnerItem />
          }
        />

      </Route>


      {/* =================================================
          FALLBACK
      ================================================= */}

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />

    </Routes>
  );
};

export default App;