import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
deliveryAddress: {
  fullName: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
    required: true,
  },

  address: {
    type: String,
    required: true,
  },

  city: {
    type: String,
    required: true,
  },
},
    items: [
      {
        itemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Item",
          required: true,
        },

        name: {
          type: String,
          required: true,
        },

        image: {
          type: String,
          required: true,
        },

        price: {
          type: Number,
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
          min: 1,
        },

        unit: {
          type: String,
          required: true,
        },
      },
    ],

   itemsSubtotal: {
  type: Number,
  required: true,
},

deliveryCharges: {
  type: Number,
  default: 0,
  min: 0,
},

discount: {
  type: Number,
  default: 0,
  min: 0,
},

totalAmount: {
  type: Number,
  required: true,
  min: 0,
},


paymentStatus: {
  type: String,
  enum: ["unpaid", "paid", "failed"],
  default: "unpaid",
},

paymentMethod: {
  type: String,
  enum: ["cash", "online"],
  default: "cash",
},

receiptNumber: {
  type: String,
  default: null,
},

approvedAt: {
  type: Date,
  default: null,
},

status: {
  type: String,
  enum: [
    "pending",
    "confirmed",
    "preparing",
    "out-for-delivery",
    "delivered",
    "cancelled",
  ],
  default: "pending",
},

    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },

    review: {
      type: String,
      default: "",
    },

    ratedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;