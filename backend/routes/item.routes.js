import express from "express";
import isAuth from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js";
import {
  addItem,
  editItem,
  deleteItem,
} from "../controllers/item.controller.js";
const itemRouter = express.Router();

console.log("Item routes loaded");

itemRouter.get("/test", (req, res) => {
  res.json({ message: "Working" });
});

itemRouter.post(
  "/add-item/:shopId",
  isAuth,
  upload.single("image"),
  addItem
);

itemRouter.post(
  "/edit-item/:itemId",
  isAuth,
  upload.single("image"),
  editItem
);

itemRouter.delete(
  "/delete/:id",
  isAuth,
  deleteItem
);
export default itemRouter;