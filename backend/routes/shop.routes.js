
import express from "express";

import {
  createShop,
  updateShop,
  deleteShop,
  getMyShop,
  getShopsByCity,
  getShopById,
} from "../controllers/shop.controller.js";

import isAuth from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js";

const shopRouter = express.Router();


// ==========================================
// CREATE NEW SHOP
// ==========================================
shopRouter.post(
  "/create",
  isAuth,
  upload.single("image"),
  createShop
);


// ==========================================
// UPDATE EXISTING SHOP
// ==========================================
shopRouter.put(
  "/update/:shopId",
  isAuth,
  upload.single("image"),
  updateShop
);


// ==========================================
// GET ALL SHOPS OF LOGGED-IN OWNER
// ==========================================
shopRouter.get(
  "/get-my",
  isAuth,
  getMyShop
);


// ==========================================
// GET SHOPS BY CITY
// ==========================================
shopRouter.get(
  "/get-shops",
  isAuth,
  getShopsByCity
);


// ==========================================
// GET ONE SHOP BY ID
// ==========================================
shopRouter.get(
  "/get-shop/:shopId",
  getShopById
);
// ==========================================
// DELETE SHOP
// ==========================================

shopRouter.delete(
  "/delete/:shopId",
  isAuth,
  deleteShop
);

export default shopRouter;

