import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";

import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import shopRouter from "./routes/shop.routes.js";
import itemRouter from "./routes/item.routes.js";
import orderRouter from "./routes/orderRouter.js";


dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

// DB FIRST
connectDB();

// MIDDLEWARES
app.use(cors({
origin: "http://localhost:5173",
credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ROUTES
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/shop", shopRouter);
app.use("/api/item", itemRouter);
app.use("/api/order", orderRouter);
// SERVER
app.listen(port, () => {
console.log(`Server is running on port ${port}`);
console.log(
"Cloud:",
process.env.CLOUDINARY_CLOUD_NAME
);
});
