
import Shop from "../models/shop.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

// ==========================================
// CREATE OR EDIT SHOP
// ==========================================
export const createShop = async (req, res) => {
  try {
  const {
  name,
  mobile,
  facebookPage,
  whatsapp,
  city,
  state,
  address,
  deliveryCharge,
} = req.body;

    let image = "";

    if (req.file) {
      const uploadedImage =
        await uploadOnCloudinary(req.file.path);

      image = uploadedImage.secure_url;
    }

   const shop = await Shop.create({
  name,
  mobile,
  facebookPage,
  whatsapp,
  city,
  state,
  address,
  deliveryCharge: deliveryCharge ?? 100,
  image,
  owner: req.user.id,
  items: [],
});

    const populatedShop =
      await Shop.findById(shop._id)
        .populate("owner", "-password")
        .populate("items");

    return res.status(201).json({
      success: true,
      message: "Shop created successfully.",
      shop: populatedShop,
    });

  } catch (error) {
    console.error(
      "Create Shop Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ==========================================
// GET MY SHOP
// ==========================================

export const getMyShop = async (req, res) => {
  try {
    const userId = req.user.id;

    const shops = await Shop.find({
      owner: userId,
    })
      .populate("owner", "-password")
      .populate("items");

    return res.status(200).json({
      success: true,
      shops,
    });

  } catch (error) {
    console.error(
      "Get My Shops Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};




// ==========================================
// GET SHOPS BY CITY
// ==========================================
export const getShopsByCity = async (req, res) => {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({
        success: false,
        message: "City is required",
      });
    }

    const shops = await Shop.find({
      city: {
        $regex: `^${city}$`,
        $options: "i",
      },
    })
      .populate("owner", "-password")
      .populate("items");

    return res.status(200).json({
      success: true,
      count: shops.length,
      shops,
    });

  } catch (error) {
    console.error(
      "getShopsByCity ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ==========================================
// GET SHOP BY ID
// ==========================================

export const getShopById = async (req, res) => {
  try {
    const { shopId } = req.params;

    const shop = await Shop.findById(shopId);

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    return res.status(200).json({
      success: true,
      shop,
    });

  } catch (error) {
    console.error("getShopById ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ==========================================
// UPDATE EXISTING SHOP
// ==========================================
export const updateShop = async (req, res) => {
  try {
    const { shopId } = req.params;

    const {
  name,
  mobile,
  facebookPage,
  whatsapp,
  city,
  state,
  address,
  deliveryCharge,
} = req.body;
    const userId =
      req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid user in token",
      });
    }

    let image = null;

    if (req.file?.path) {
      image = await uploadOnCloudinary(
        req.file.path
      );
    }

    const updateData = {
  name,
  mobile,
  facebookPage,
  whatsapp,
  city,
  state,
  address,
  deliveryCharge:
    deliveryCharge !== undefined
      ? Number(deliveryCharge)
      : 100,
};

    // Only change image if a new image was uploaded
    if (image?.secure_url) {
      updateData.image = image.secure_url;
    }

    const shop = await Shop.findOneAndUpdate(
      {
        _id: shopId,
        owner: userId,
      },
      updateData,
      {
        new: true,
      }
    )
      .populate("owner", "-password")
      .populate("items");

    if (!shop) {
      return res.status(404).json({
        success: false,
        message:
          "Shop not found or you are not the owner",
      });
    }

    return res.status(200).json({
      success: true,
      shop,
    });

  } catch (error) {
    console.error(
      "updateShop ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ==========================================
// DELETE SHOP
// ==========================================
export const deleteShop = async (req, res) => {
  try {
    const { shopId } = req.params;

    const userId =
      req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid user in token",
      });
    }

    const shop = await Shop.findOneAndDelete({
      _id: shopId,
      owner: userId,
    });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message:
          "Shop not found or you are not the owner",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Shop deleted successfully.",
    });

  } catch (error) {
    console.error(
      "deleteShop ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};