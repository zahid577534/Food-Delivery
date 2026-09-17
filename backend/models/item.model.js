import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },

    category: {
      type: String,
      enum: [
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
      ],
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // ✅ Add this
    unit: {
      type: String,
      enum: [
        "kg",
        "g",
        "liter",
        "ml",
        "piece",
        "pack",
        "dozen",
        "loaf",
        "bottle",
        "box",
        "can",
      ],
      required: true,
    },

    foodType: {
      type: String,
      enum: ["veg", "non-veg"],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Item", itemSchema);