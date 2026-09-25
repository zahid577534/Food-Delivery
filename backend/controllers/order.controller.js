import Order from "../models/order.model.js";
import Shop from "../models/shop.model.js";

// ==========================================
// CREATE ORDER
// ==========================================
export const createOrder = async (req, res) => {
  try {
    const {
      shop,
      items,
      deliveryAddress,
      paymentMethod,
      paymentStatus,
    } = req.body;

    const userId =
      req.user?.id || req.user?._id;

    // ==========================================
    // CHECK LOGGED-IN USER
    // ==========================================
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid user in token",
      });
    }

    // ==========================================
    // VALIDATE SHOP
    // ==========================================
    if (!shop) {
      return res.status(400).json({
        success: false,
        message: "Shop is required",
      });
    }

    // ==========================================
    // VALIDATE ITEMS
    // ==========================================
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order must contain at least one item",
      });
    }

    // ==========================================
    // VALIDATE DELIVERY ADDRESS
    // ==========================================
    if (!deliveryAddress) {
      return res.status(400).json({
        success: false,
        message: "Delivery address is required",
      });
    }

    if (
      !deliveryAddress.fullName ||
      !deliveryAddress.phone ||
      !deliveryAddress.address ||
      !deliveryAddress.city
    ) {
      return res.status(400).json({
        success: false,
        message: "Complete delivery information is required",
      });
    }

    // ==========================================
    // CALCULATE ITEMS SUBTOTAL
    // ==========================================
    const itemsSubtotal = items.reduce(
      (total, item) => {
        return (
          total +
          item.price * item.quantity
        );
      },
      0
    );

    // ==========================================
    // INITIAL PRICING
    // OWNER WILL SET THESE WHEN APPROVING
    // ==========================================
    const deliveryCharges = 0;
    const discount = 0;

    const totalAmount =
      itemsSubtotal +
      deliveryCharges -
      discount;

    // ==========================================
    // CREATE ORDER
    // ==========================================
    const order = await Order.create({
      user: userId,
      shop,
      items,

      itemsSubtotal,
      deliveryCharges,
      discount,
      totalAmount,

      deliveryAddress,

      paymentMethod:
        paymentMethod || "cash",

      paymentStatus:
        paymentStatus || "unpaid",
    });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });

  } catch (error) {
    console.error(
      "createOrder ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// GET MY ORDERS
// CUSTOMER
// ==========================================
export const getMyOrders = async (
  req,
  res
) => {
  try {
    const userId =
      req.user?.id || req.user?._id;

    // ==========================================
    // CHECK LOGGED-IN USER
    // ==========================================
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid user in token",
      });
    }

    // ==========================================
    // FIND CUSTOMER ORDERS
    // ==========================================
    const orders = await Order.find({
      user: userId,
    })
      .populate("shop")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });

  } catch (error) {
    console.error(
      "getMyOrders ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// GET ALL ORDERS FROM ALL OWNER SHOPS
// OWNER
// ==========================================
export const getOwnerOrders = async (
  req,
  res
) => {
  try {
    const userId =
      req.user?.id || req.user?._id;

    // ==========================================
    // CHECK LOGGED-IN USER
    // ==========================================
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid user in token",
      });
    }

    // ==========================================
    // FIND ALL SHOPS BELONGING TO THIS OWNER
    // ==========================================
    const shops = await Shop.find({
      owner: userId,
    }).select("_id name");

    // ==========================================
    // OWNER HAS NO SHOPS
    // ==========================================
    if (shops.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        orders: [],
      });
    }

    // ==========================================
    // GET ALL SHOP IDs
    // ==========================================
    const shopIds = shops.map(
      (shop) => shop._id
    );

    // ==========================================
    // FIND ORDERS FROM ALL OWNER SHOPS
    // ==========================================
    const orders = await Order.find({
      shop: {
        $in: shopIds,
      },
    })
      .populate(
        "user",
        "-password"
      )
      .populate("shop")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });

  } catch (error) {
    console.error(
      "getOwnerOrders ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// UPDATE ORDER STATUS
// OWNER
// ==========================================
export const updateOrderStatus = async (
  req,
  res
) => {
  try {
    const { orderId } =
      req.params;

    const {
      status,
      deliveryCharges,
      discount,
    } = req.body;

    const userId =
      req.user?.id || req.user?._id;

    // ==========================================
    // CHECK LOGGED-IN USER
    // ==========================================
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid user in token",
      });
    }

    // ==========================================
    // VALIDATE ORDER STATUS
    // ==========================================
    const allowedStatuses = [
      "confirmed",
      "preparing",
      "out-for-delivery",
      "delivered",
      "cancelled",
    ];

    if (
      !allowedStatuses.includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    // ==========================================
    // FIND ALL SHOPS BELONGING TO OWNER
    // ==========================================
    const shops = await Shop.find({
      owner: userId,
    }).select("_id");

    // ==========================================
    // OWNER HAS NO SHOPS
    // ==========================================
    if (shops.length === 0) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to update orders",
      });
    }

    // ==========================================
    // GET ALL OWNER SHOP IDs
    // ==========================================
    const shopIds = shops.map(
      (shop) =>
        shop._id.toString()
    );

    // ==========================================
    // FIND ORDER
    // ==========================================
    const order =
      await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // ==========================================
    // VERIFY ORDER BELONGS TO ONE
    // OF OWNER'S SHOPS
    // ==========================================
    if (
      !shopIds.includes(
        order.shop.toString()
      )
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to update this order",
      });
    }

    // ==========================================
    // CONFIRM ORDER + SET PRICING
    // ==========================================
    if (
      status === "confirmed" &&
      order.status === "pending"
    ) {
      // ==========================================
      // CONVERT VALUES TO NUMBERS
      // ==========================================
      const finalDeliveryCharges =
        Number(
          deliveryCharges || 0
        );

      const finalDiscount =
        Number(
          discount || 0
        );

      // ==========================================
      // PREVENT NEGATIVE VALUES
      // ==========================================
      if (
        finalDeliveryCharges < 0 ||
        finalDiscount < 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Delivery charges and discount cannot be negative",
        });
      }

      // ==========================================
      // PREVENT DISCOUNT FROM EXCEEDING TOTAL
      // ==========================================
      if (
        finalDiscount >
        order.itemsSubtotal +
          finalDeliveryCharges
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Discount cannot be greater than order amount",
        });
      }

      // ==========================================
      // SAVE DELIVERY CHARGES
      // ==========================================
      order.deliveryCharges =
        finalDeliveryCharges;

      // ==========================================
      // SAVE DISCOUNT
      // ==========================================
      order.discount =
        finalDiscount;

      // ==========================================
      // CALCULATE FINAL TOTAL
      // ==========================================
      order.totalAmount =
        order.itemsSubtotal +
        finalDeliveryCharges -
        finalDiscount;

      // ==========================================
      // GENERATE RECEIPT NUMBER
      // ==========================================
      const receiptNumber =
        `FD-${Date.now()}-${Math.floor(
          1000 +
            Math.random() * 9000
        )}`;

      order.receiptNumber =
        receiptNumber;

      // ==========================================
      // PAYMENT INFORMATION
      // ==========================================
      order.paymentStatus =
        "unpaid";

      order.paymentMethod =
        "cash";

      // ==========================================
      // SAVE APPROVAL DATE
      // ==========================================
      order.approvedAt =
        new Date();
    }

    // ==========================================
    // UPDATE ORDER STATUS
    // ==========================================
    order.status = status;

    await order.save();

    // ==========================================
    // RETURN UPDATED ORDER
    // ==========================================
    return res.status(200).json({
      success: true,

      message:
        status === "confirmed"
          ? "Order approved and payment receipt generated"
          : "Order status updated successfully",

      order,
    });

  } catch (error) {
    console.error(
      "Update Order Status Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
