
import React from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa";

const OwnerItemCard = ({ item, onDelete }) => {
  const serverUrl = import.meta.env.VITE_SERVER_URL;

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );

    if (!confirmDelete) return;

    try {
      const res = await axios.delete(
        `${serverUrl}/api/item/delete/${item._id}`,
        {
          withCredentials: true,
        }
      );

      alert(res.data.message);

      if (onDelete) {
        onDelete(item._id);
      }
    } catch (error) {
      console.log("Status:", error.response?.status);
      console.log("Response:", error.response?.data);
      console.log("Error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to delete item"
      );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition relative">

      {/* Delete Button */}
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition z-10"
      >
        <FaTrash size={14} />
      </button>

      {/* Item Image */}
      <img
        src={item.image}
        alt={item.name}
        className="w-full h-36 object-cover"
      />

      {/* Item Details */}
      <div className="p-3">

        <h2 className="text-base font-semibold truncate">
          {item.name}
        </h2>

        <p className="text-gray-500 text-xs mt-1 line-clamp-2">
          {item.description}
        </p>

        <div className="flex justify-between items-center mt-3">

          <div className="flex items-center gap-2">
  {item.discount > 0 && (
    <span className="text-gray-400 text-xs line-through">
      Rs.{item.price}
    </span>
  )}

  <span className="text-[#ff4d2d] font-bold text-sm">
    Rs.{item.price - (item.price * item.discount) / 100}
  </span>

  {item.discount > 0 && (
    <span className="text-green-600 text-xs font-semibold">
      {item.discount}% OFF
    </span>
  )}
</div>

          <span className="text-xs text-gray-500 truncate ml-2">
            {item.category}
          </span>

        </div>
      </div>
    </div>
  );
};

export default OwnerItemCard;

