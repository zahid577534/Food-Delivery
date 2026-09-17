
import Shop from "../models/shop.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

// ==========================================
// CREATE OR EDIT SHOP
// ==========================================
export const createEditShop = async (req, res) => {
  try {
   const {
  name,
  mobile,
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

    let shop = await Shop.findOne({
      owner: userId,
    });

    // CREATE SHOP
    if (!shop) {
      shop = await Shop.create({
        name,
        mobile,
        city,
        state,
        address,
       deliveryCharge:
        deliveryCharge !== undefined
        ? Number(deliveryCharge)
       : 100,
        image: image?.secure_url,
        owner: userId,
      });
    }

    // EDIT SHOP
    else {
      shop = await Shop.findOneAndUpdate(
        { owner: userId },
        {
          name,
          mobile,
          city,
          state,
          address,
          deliveryCharge:
          deliveryCharge !== undefined
          ? Number(deliveryCharge)
          : 100,
          ...(image && {
            image: image.secure_url,
          }),
        },
        {
          new: true,
        }
      );
    }

    await shop.populate([
      {
        path: "owner",
        select: "-password",
      },
      {
        path: "items",
      },
    ]);

    return res.status(200).json({
      success: true,
      shop,
    });

  } catch (error) {
    console.error(
      "createEditShop ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// GET MY SHOP
// ==========================================
export const getMyShop = async (req, res) => {
  try {
    const userId =
      req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid user in token",
      });
    }

    const shop = await Shop.findOne({
      owner: userId,
    })
      .populate("owner", "-password")
      .populate("items");

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
    console.error(
      "getMyShop ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
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
