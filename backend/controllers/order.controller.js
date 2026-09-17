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

    const userId = req.user?.id || req.user?._id;

    // Check logged-in user
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid user in token",
      });
    }

    // Validate shop
    if (!shop) {
      return res.status(400).json({
        success: false,
        message: "Shop is required",
      });
    }

    // Validate items
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order must contain at least one item",
      });
    }

    // Validate delivery address
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

    // Calculate items subtotal on server
    const itemsSubtotal = items.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    // Initially owner has not added any charges or discount
    const deliveryCharges = 0;
    const discount = 0;

    // Initial total
    const totalAmount =
      itemsSubtotal + deliveryCharges - discount;

    // Create order
    const order = await Order.create({
      user: userId,
      shop,
      items,

      itemsSubtotal,
      deliveryCharges,
      discount,
      totalAmount,

      deliveryAddress,

      paymentMethod: paymentMethod || "cash",
      paymentStatus: paymentStatus || "unpaid",
    });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });

  } catch (error) {
    console.error("createOrder ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// GET MY ORDERS
// ==========================================
export const getMyOrders = async (req, res) => {
  try {
    const userId =
      req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid user in token",
      });
    }

    const orders = await Order.find({
      user: userId,
    })
      .populate("shop")
      .sort({ createdAt: -1 });

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
// GET OWNER ORDERS
// ==========================================
export const getOwnerOrders = async (req, res) => {
  try {
    const userId =
      req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid user in token",
      });
    }

    // Find owner's shop
    const shop = await Shop.findOne({
      owner: userId,
    });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    // Find orders for this shop
    const orders = await Order.find({
      shop: shop._id,
    })
      .populate("user", "-password")
      .populate("shop")
      .sort({ createdAt: -1 });

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
// UPDATE ORDER STATUS - OWNER
// ==========================================

// ==========================================
// UPDATE ORDER STATUS - OWNER
// ==========================================



// ==========================================
// UPDATE ORDER STATUS - OWNER
// ==========================================
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
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
    if (
      ![
        "confirmed",
        "preparing",
        "out-for-delivery",
        "delivered",
        "cancelled",
      ].includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    // ==========================================
    // FIND OWNER'S SHOP
    // ==========================================
    const shop = await Shop.findOne({
      owner: userId,
    });

    if (!shop) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update orders",
      });
    }

    // ==========================================
    // FIND ORDER
    // ==========================================
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // ==========================================
    // VERIFY ORDER BELONGS TO OWNER'S SHOP
    // ==========================================
    if (
      order.shop.toString() !==
      shop._id.toString()
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
      const finalDeliveryCharges =
        Number(deliveryCharges || 0);

      const finalDiscount =
        Number(discount || 0);

      // Prevent negative values
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

      // Prevent discount greater than subtotal + delivery
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

      // Save pricing
      order.deliveryCharges =
        finalDeliveryCharges;

      order.discount =
        finalDiscount;

      order.totalAmount =
        order.itemsSubtotal +
        finalDeliveryCharges -
        finalDiscount;

      // Generate receipt
      const receiptNumber =
        `FD-${Date.now()}-${Math.floor(
          1000 + Math.random() * 9000
        )}`;

      order.receiptNumber =
        receiptNumber;

      order.paymentStatus =
        "unpaid";

      order.paymentMethod =
        "cash";

      order.approvedAt =
        new Date();
    }

    // ==========================================
    // UPDATE ORDER STATUS
    // ==========================================
    order.status = status;

    await order.save();

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



