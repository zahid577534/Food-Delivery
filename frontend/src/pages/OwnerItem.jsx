import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  PlusCircle,
  Package,
} from "lucide-react";

import OwnerItemCard from "../components/OwnerItemCard";

const OwnerItems = () => {
  const navigate = useNavigate();

  // Get all shops from Redux
  const myShops = useSelector(
    (state) => state.owner.myShops || []
  );

  // Delete item from local display
  const handleDelete = (shopId, itemId) => {
    // We will handle Redux update properly later
    console.log(
      "Delete item:",
      itemId,
      "from shop:",
      shopId
    );
  };

  return (
    <div className="p-6 md:p-8">

      {/* ===============================
          HEADER
      =============================== */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          My Items
        </h1>

        <p className="text-gray-500 mt-1">
          Manage the items available in each of your shops.
        </p>
      </div>


      {/* ===============================
          NO SHOPS
      =============================== */}

      {myShops.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">

          <Package
            size={50}
            className="mx-auto text-gray-300"
          />

          <h2 className="text-xl font-semibold mt-4">
            No shops found
          </h2>

          <p className="text-gray-500 mt-2">
            Create a shop first before adding items.
          </p>

          <button
            onClick={() =>
              navigate("/owner/shop/add")
            }
            className="mt-5 px-5 py-2.5 bg-[#ff4d2d] text-white rounded-lg"
          >
            Add Shop
          </button>

        </div>
      ) : (

        /* ===============================
           ALL SHOPS
        =============================== */

        <div className="space-y-10">

          {myShops.map((shop) => {

            const items = shop.items || [];

            return (
              <div
                key={shop._id}
                className="bg-gray-50 rounded-2xl p-5 md:p-6"
              >

                {/* ===============================
                    SHOP HEADER
                =============================== */}

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

                  <div>

                    <h2 className="text-2xl font-bold text-gray-800">
                      {shop.name}
                    </h2>

                    <p className="text-gray-500 mt-1">
                      {items.length}{" "}
                      {items.length === 1
                        ? "item"
                        : "items"}
                    </p>

                  </div>


                  {/* ADD ITEM BUTTON */}

                  <button
                    onClick={() =>
                      navigate(
                        `/owner/shop/${shop._id}/add-item`
                      )
                    }
                    className="flex items-center justify-center gap-2 px-5 py-3 bg-[#ff4d2d] text-white rounded-lg hover:bg-[#e63e20]"
                  >
                    <PlusCircle size={20} />

                    Add Item
                  </button>

                </div>


                {/* ===============================
                    ITEMS
                =============================== */}

                {items.length === 0 ? (

                  <div className="bg-white rounded-xl shadow-sm p-10 text-center">

                    <Package
                      size={45}
                      className="mx-auto text-gray-300"
                    />

                    <h3 className="text-lg font-semibold mt-4">
                      No items in this shop
                    </h3>

                    <p className="text-gray-500 mt-2">
                      Start adding items to{" "}
                      {shop.name}.
                    </p>

                    <button
                      onClick={() =>
                        navigate(
                          `/owner/shop/${shop._id}/add-item`
                        )
                      }
                      className="mt-5 px-5 py-2.5 bg-[#ff4d2d] text-white rounded-lg"
                    >
                      Add Your First Item
                    </button>

                  </div>

                ) : (

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                    {items.map((item) => (

                      <OwnerItemCard
                        key={item._id}
                        item={item}
                        onDelete={() =>
                          handleDelete(
                            shop._id,
                            item._id
                          )
                        }
                      />

                    ))}

                  </div>

                )}

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
};

export default OwnerItems;