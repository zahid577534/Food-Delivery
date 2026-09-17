import React, { useState } from "react";
import { IoIosSkipBackward } from "react-icons/io";
import { FaShoppingBasket } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../config";
import { useDispatch } from "react-redux";
import { setMyShopData } from "../redux/ownerSlice";

const categories = [
  "Fruits & Vegetables",
  "Dairy & Eggs",
  "Bakery",
  "Meat & Poultry",
  "Seafood",
  "Snacks",
  "Beverages",
  "Frozen Foods",
  "Rice & Grains",
  "Pasta & Noodles",
  "Cooking Essentials",
  "Spices & Seasonings",
  "Breakfast",
  "Canned Foods",
  "Sauces & Condiments",
  "Sweets & Desserts",
  "Tea & Coffee",
  "Organic",
  "Baby Care",
  "Personal Care",
  "Household Items",
  "Cleaning Supplies",
  "Pet Supplies",
];

const unitOptions = {
  "Fruits & Vegetables": ["kg", "g", "piece"],
  "Dairy & Eggs": ["liter", "ml", "dozen", "piece"],
  Bakery: ["loaf", "piece", "pack"],
  "Meat & Poultry": ["kg", "g"],
  Seafood: ["kg", "g"],
  Snacks: ["pack", "box"],
  Beverages: ["liter", "ml", "bottle", "can"],
  "Frozen Foods": ["kg", "pack"],
  "Rice & Grains": ["kg", "g"],
  "Pasta & Noodles": ["pack", "box"],
  "Cooking Essentials": ["liter", "ml", "kg"],
  "Spices & Seasonings": ["g", "kg", "pack"],
  Breakfast: ["box", "pack"],
  "Canned Foods": ["can", "piece"],
  "Sauces & Condiments": ["bottle", "pack"],
  "Sweets & Desserts": ["kg", "box", "piece"],
  "Tea & Coffee": ["g", "kg", "pack"],
  Organic: ["kg", "g", "piece"],
  "Baby Care": ["pack", "piece"],
  "Personal Care": ["piece", "bottle"],
  "Household Items": ["piece", "pack"],
  "Cleaning Supplies": ["bottle", "pack"],
  "Pet Supplies": ["kg", "pack"],
};

const AddItem = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("0");
  const [category, setCategory] = useState("");
  const [unit, setUnit] = useState("");
  const [foodType, setFoodType] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const dispatch = useDispatch();
  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const formData = new FormData();

      formData.append("name", name);
      formData.append("price", price);
      formData.append("discount", discount);
      formData.append("category", category);
      formData.append("foodType", foodType);
      formData.append("unit", unit);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await axios.post(
        `${serverUrl}/api/item/add-item`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        dispatch(setMyShopData(response.data));

        alert("Item added successfully!");

        navigate("/");
      }
    } catch (error) {
      console.log(error.response);

      if (error.response) {
        console.log("Status:", error.response.status);
        console.log("Data:", error.response.data);

        alert(error.response.data.message);
      } else {
        alert("Something went wrong.");
      }
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-orange-50 p-6">
      <div
        className="absolute top-5 left-5 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <IoIosSkipBackward
          size={28}
          className="text-[#ff4d2d]"
        />
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex bg-orange-100 rounded-full p-4">
            <FaShoppingBasket className="w-14 h-14 text-[#ff4d2d]" />
          </div>

          <h1 className="text-3xl font-bold mt-4">
            Add Grocery Item
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* Item Name */}
          <div>
            <label className="block mb-2">
              Item Name
            </label>

            <input
              type="text"
              className="w-full border rounded-lg p-3"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              required
            />
          </div>

          {/* Price */}
          <div>
            <label className="block mb-2">
              Price (Rs.)
            </label>

            <input
              type="number"
              min="0"
              step="0.01"
              className="w-full border rounded-lg p-3"
              value={price}
              onChange={(e) =>
                setPrice(e.target.value)
              }
              required
            />
          </div>
          {/* Discount */}
          <div>
            <label className="block mb-2">
              Discount (%)
            </label>

            <input
              type="number"
              min="0"
              max="100"
              step="1"
              className="w-full border rounded-lg p-3"
              value={discount}
              onChange={(e) =>
                setDiscount(e.target.value)
              }
              placeholder="0"
            />

            <p className="text-xs text-gray-500 mt-1">
              Enter 0 for no discount.
            </p>
          </div>

          {/* Category */}
          <div>
            <label className="block mb-2">
              Category
            </label>

            <select
              className="w-full border rounded-lg p-3"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setUnit("");
              }}
              required
            >
              <option value="">
                Select Category
              </option>

              {categories.map((cat) => (
                <option
                  key={cat}
                  value={cat}
                >
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Unit */}
          <div>
            <label className="block mb-2">
              Unit
            </label>

            <select
              className="w-full border rounded-lg p-3"
              value={unit}
              onChange={(e) =>
                setUnit(e.target.value)
              }
              required
              disabled={!category}
            >
              <option value="">
                Select Unit
              </option>

              {(unitOptions[category] || []).map(
                (u) => (
                  <option
                    key={u}
                    value={u}
                  >
                    {u}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Food Type */}
          <div>
            <label className="block mb-2">
              Food Type
            </label>

            <select
              className="w-full border rounded-lg p-3"
              value={foodType}
              onChange={(e) =>
                setFoodType(
                  e.target.value
                )
              }
              required
            >
              <option value="">
                Select Food Type
              </option>

              <option value="veg">
                Veg
              </option>

              <option value="non-veg">
                Non Veg
              </option>
            </select>
          </div>

          {/* Image */}
          <div>
            <label className="block mb-2">
              Item Image
            </label>

            <input
              type="file"
              accept="image/*"
              className="w-full border rounded-lg p-2"
              onChange={handleImage}
              required
            />

            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg mt-4"
              />
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 text-white transition ${loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#ff4d2d] hover:bg-[#e84320]"
              }`}
          >
            {loading && (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}

            {loading ? "Saving Item..." : "Save Item"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddItem;