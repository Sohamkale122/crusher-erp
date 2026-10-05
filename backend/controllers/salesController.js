import { repo } from '../data/repo.js';

export const getDispatches = async (req, res) => {
  try {
    const { paymentStatus, gatePassStatus } = req.query;
    const dispatches = await repo.getDispatches({ paymentStatus, gatePassStatus });
    res.json({ success: true, count: dispatches.length, dispatches });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getDispatchById = async (req, res) => {
  try {
    const dispatch = await repo.getDispatchById(req.params.id);
    if (!dispatch) {
      return res.status(404).json({ success: false, message: 'Dispatch challan not found' });
    }
    res.json({ success: true, dispatch });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createDispatch = async (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      vehicleNo,
      driverName,
      driverPhone,
      productName,
      productId,
      grossWeightMT,
      tareWeightMT,
      ratePerMT,
      taxPercent = 5,
      paymentStatus = 'Pending',
      paidAmount = 0,
      paymentMode = 'Credit',
      notes = ''
    } = req.body;

    if (!customerName || !vehicleNo || !productName || grossWeightMT === undefined || tareWeightMT === undefined || ratePerMT === undefined) {
      return res.status(400).json({ success: false, message: 'Please provide all weighbridge measurements and customer details' });
    }

    const gross = Number(grossWeightMT);
    const tare = Number(tareWeightMT);
    const net = Math.max(0, parseFloat((gross - tare).toFixed(2)));
    const rate = Number(ratePerMT);
    const tax = Number(taxPercent);

    const subTotal = parseFloat((net * rate).toFixed(2));
    const taxAmount = parseFloat(((subTotal * tax) / 100).toFixed(2));
    const finalAmount = parseFloat((subTotal + taxAmount).toFixed(2));

    const challanNo = `CH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const dispatch = await repo.createDispatch({
      challanNo,
      customerName,
      customerPhone,
      vehicleNo: vehicleNo.toUpperCase(),
      driverName,
      driverPhone,
      productName,
      productId,
      grossWeightMT: gross,
      tareWeightMT: tare,
      netWeightMT: net,
      ratePerMT: rate,
      taxPercent: tax,
      subTotal,
      taxAmount,
      finalAmount,
      paymentStatus,
      paidAmount: paymentStatus === 'Paid' ? finalAmount : Number(paidAmount),
      paymentMode,
      gatePassStatus: 'Dispatched',
      operatorName: req.user ? req.user.name : 'Weighbridge Desk',
      notes,
      dispatchedAt: new Date()
    });

    res.status(201).json({ success: true, message: 'Gate pass generated and stock deducted', dispatch });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateDispatch = async (req, res) => {
  try {
    const { paymentStatus, paidAmount, paymentMode, gatePassStatus, notes } = req.body;
    const updates = {};
    if (paymentStatus) updates.paymentStatus = paymentStatus;
    if (paidAmount !== undefined) updates.paidAmount = Number(paidAmount);
    if (paymentMode) updates.paymentMode = paymentMode;
    if (gatePassStatus) updates.gatePassStatus = gatePassStatus;
    if (notes !== undefined) updates.notes = notes;

    const updated = await repo.updateDispatch(req.params.id, updates);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Dispatch challan not found' });
    }
    res.json({ success: true, message: 'Dispatch updated successfully', dispatch: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
