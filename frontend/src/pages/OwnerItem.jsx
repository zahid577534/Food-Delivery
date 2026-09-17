import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Package } from "lucide-react";

import OwnerItemCard from "../components/OwnerItemCard";
const OwnerItems = () => {
  const navigate = useNavigate();

  const myShopData = useSelector((state) => state.owner.myShopData);

  const reduxItems = myShopData?.items || [];

  const [items, setItems] = useState(reduxItems);

  useEffect(() => {
    setItems(reduxItems);
  }, [reduxItems]);

  const handleDelete = (itemId) => {
    setItems((prevItems) =>
      prevItems.filter(
        (item) => item._id !== itemId
      )
    );
  };

  return (
    <div className="p-6 md:p-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            My Items
          </h1>

          <p className="text-gray-500 mt-1">
            Manage the items available in your shop.
          </p>
        </div>

        <button
          onClick={() => navigate("/add-item")}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-[#ff4d2d] text-white rounded-lg hover:bg-[#e63e20]"
        >
          <PlusCircle size={20} />
          Add Item
        </button>
      </div>

      {/* ITEM COUNT */}
      <div className="bg-white rounded-xl shadow-sm p-5 mb-6 flex items-center gap-4">
        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
          <Package
            className="text-[#ff4d2d]"
            size={24}
          />
        </div>

        <div>
          <p className="text-gray-500 text-sm">
            Total Items
          </p>

          <h2 className="text-2xl font-bold">
            {items.length}
          </h2>
        </div>
      </div>

      {/* ITEMS */}
      {items.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <Package
            size={50}
            className="mx-auto text-gray-300"
          />

          <h2 className="text-xl font-semibold mt-4">
            No items found
          </h2>

          <p className="text-gray-500 mt-2">
            Start adding items to your shop.
          </p>

          <button
            onClick={() => navigate("/add-item")}
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
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerItems;