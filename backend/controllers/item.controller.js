import Item from "../models/item.model.js";
import Shop from "../models/shop.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

// ======================
// Add Item

export const addItem = async (req, res) => {
  try {
    const { shopId } = req.params;

    const {
      name,
      category,
      foodType,
      price,
      unit,
      discount,
    } = req.body;

    // Find the specific shop AND make sure it belongs to this owner
    const shop = await Shop.findOne({
      _id: shopId,
      owner: req.user.id,
    });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found or you are not the owner.",
      });
    }

    let image = "";

    if (req.file) {
      const uploadedImage = await uploadOnCloudinary(
        req.file.path
      );

      image = uploadedImage.secure_url;
    }

    // Create item for this specific shop
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

    // Add item to this shop's items array
    await Shop.findByIdAndUpdate(shop._id, {
      $addToSet: {
        items: item._id,
      },
    });

    // Get updated shop
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
// ======================
// Delete Item
// ======================
export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the item first
    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found.",
      });
    }

    // Check that the item's shop belongs to the logged-in owner
    const shop = await Shop.findOne({
      _id: item.shop,
      owner: req.user.id,
    });

    if (!shop) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this item.",
      });
    }

    // Remove item from this shop's items array
    await Shop.findByIdAndUpdate(shop._id, {
      $pull: {
        items: item._id,
      },
    });

    // Delete the item
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
// ======================
// Edit Item
// ======================
export const editItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    const {
      name,
      category,
      foodType,
      price,
      unit,
      discount,
    } = req.body;

    // Find item first
    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found.",
      });
    }

    // Check that this item belongs to a shop owned by the logged-in user
    const shop = await Shop.findOne({
      _id: item.shop,
      owner: req.user.id,
    });

    if (!shop) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to edit this item.",
      });
    }

    // Upload new image if provided
    if (req.file) {
      const uploadedImage = await uploadOnCloudinary(
        req.file.path
      );

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