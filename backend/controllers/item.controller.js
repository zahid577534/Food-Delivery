import Item from "../models/item.model.js";
import Shop from "../models/shop.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

// ======================
// Add Item
// ======================
export const addItem = async (req, res) => {
  try {
    const {
  name,
  category,
  foodType,
  price,
  unit,
  discount,
} = req.body;

    let image = "";

    if (req.file) {
  const uploadedImage = await uploadOnCloudinary(req.file.path);
  image = uploadedImage.secure_url;
}

    const shop = await Shop.findOne({ owner: req.user.id });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found.",
      });
    }

  const item = await Item.create({
  name,
  category,
  foodType,
  price,
  unit,
  discount: discount ?? 0,
  image,
  shop: shop._id,
});

// Add item to the shop's items array
await Shop.findByIdAndUpdate(shop._id, {
  $addToSet: {
    items: item._id,
  },
});

const updatedShop = await Shop.findById(shop._id)
  .populate("owner", "-password")
  .populate("items");

return res.status(201).json({
  success: true,
  message: "Item added successfully.",
  item,
  shop: updatedShop,
});
  } catch (error) {
    console.error("Add Item Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


// delete item
export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    // Find owner's shop
    const shop = await Shop.findOne({ owner: req.user.id });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found.",
      });
    }

    // Find the item belonging to this shop
    const item = await Item.findOne({
      _id: id,
      shop: shop._id,
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found.",
      });
    }

    // Remove item from shop's items array
    await Shop.findByIdAndUpdate(shop._id, {
      $pull: {
        items: item._id,
      },
    });

    // Delete item
    await Item.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Item deleted successfully.",
    });

  } catch (error) {
    console.error("Delete Item Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
// ======================
// Edit Item
// ======================
export const editItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { name, category, foodType, price, unit, discount } = req.body;

    const shop = await Shop.findOne({ owner: req.user.id });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found.",
      });
    }

    const item = await Item.findOne({
      _id: itemId,
      shop: shop._id,
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found.",
      });
    }

    if (req.file) {
      const uploadedImage = await uploadOnCloudinary(req.file.path);
       item.image = uploadedImage.secure_url;
    }

    item.name = name ?? item.name;
item.category = category ?? item.category;
item.foodType = foodType ?? item.foodType;
item.price = price ?? item.price;
item.unit = unit ?? item.unit;
item.discount = discount ?? item.discount;

    await item.save();

    return res.status(200).json({
      success: true,
      message: "Item updated successfully.",
      item,
    });

  } catch (error) {
    console.error("Edit Item Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
    
  }
  
};