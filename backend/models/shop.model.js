import mongoose from 'mongoose';
const shopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
image: {
    type: String,
    required: false
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,    
    ref: 'User',
    required: true
  },
  mobile: {
  type: String,
  required: false
},
facebookPage: {
  type: String,
  default: "",
},

whatsapp: {
  type: String,
  default: "",
},
  city: {
    type: String,
    required: true
    },
    state: {
    type: String,
    required: true
    },
    address: {
  type: String,
  required: true
},

deliveryCharge: {
  type: Number,
  default: 100,
  min: 0
},


    items: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item'
  }]
}, { timestamps: true });
const Shop = mongoose.model('Shop', shopSchema);
export default Shop;               