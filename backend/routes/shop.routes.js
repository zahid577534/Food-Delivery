import express from "express";

import {
  createEditShop,
  getMyShop,
  getShopsByCity,
  getShopById,
} from "../controllers/shop.controller.js";

import isAuth from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js";

const shopRouter = express.Router();

// Owner creates/edits shop
shopRouter.post(
  "/create-edit",
  isAuth,
  upload.single("image"),
  createEditShop
);

// Owner gets his shop
shopRouter.get(
  "/get-my",
  isAuth,
  getMyShop
);

// User gets shops in his city
shopRouter.get(
  "/get-shops",
  isAuth,
  getShopsByCity
);

// User gets a single shop by ID
shopRouter.get(
  "/get-shop/:shopId",
  getShopById
);

export default shopRouter;