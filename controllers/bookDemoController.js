import BookDemoConfig from '../models/bookDemoModel.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getBookDemoConfig = asyncHandler(async (req, res) => {
  const config = await BookDemoConfig.find();
  if (!config) {
    return res.status(404).json({ message: 'Book demo config not found.' });
  }
  res.json({ data: config });
});

export const createOrUpdateBookDemoConfig = asyncHandler(async (req, res) => {
  const config = await BookDemoConfig.upsert(req.body);
  res.json({ data: config });
});