import mongoose from 'mongoose';

const salesDispatchSchema = new mongoose.Schema({
  challanNo: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String, default: '' },
  vehicleNo: { type: String, required: true },
  driverName: { type: String, default: '' },
  driverPhone: { type: String, default: '' },
  productName: { type: String, required: true },
  productId: { type: String },
  grossWeightMT: { type: Number, required: true },
  tareWeightMT: { type: Number, required: true },
  netWeightMT: { type: Number, required: true },
  ratePerMT: { type: Number, required: true },
  taxPercent: { type: Number, default: 5 },
  subTotal: { type: Number, required: true },
  taxAmount: { type: Number, required: true },
  finalAmount: { type: Number, required: true },
  paymentStatus: { 
    type: String, 
    enum: ['Paid', 'Pending', 'Partial'], 
    default: 'Pending' 
  },
  paidAmount: { type: Number, default: 0 },
  paymentMode: { 
    type: String, 
    enum: ['Cash', 'UPI/Online', 'Bank Transfer', 'Credit'], 
    default: 'Credit' 
  },
  gatePassStatus: { 
    type: String, 
    enum: ['Generated', 'Loaded', 'Dispatched', 'Cancelled'], 
    default: 'Dispatched' 
  },
  operatorName: { type: String, default: 'Weighbridge Desk' },
  notes: { type: String, default: '' },
  dispatchedAt: { type: Date, default: Date.now }
});

export const SalesDispatch = mongoose.model('SalesDispatch', salesDispatchSchema);
