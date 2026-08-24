import ContactInfo from '../models/contactInfoModel.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getContactInfo = asyncHandler(async (_req, res) => {
  const info = await ContactInfo.find();
  res.json({ data: info || {} });
});

export const updateContactInfo = asyncHandler(async (req, res) => {
  const { email, phone, address, business_hours, content } = req.body;
  const updated = await ContactInfo.update({ email, phone, address, business_hours, content });
  res.json({ data: updated });
});
