import Media from '../models/mediaModel.js';
import asyncHandler from '../utils/asyncHandler.js';
import fs from 'fs';
import path from 'path';

export const getAllMedia = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
  const result = await Media.findAll({ page, limit });
  res.json({
    data: result.data,
    pagination: {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: Math.ceil(result.total / result.limit),
    },
  });
});

export const uploadMedia = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }
  const media = await Media.create({
    filename: req.file.filename,
    originalName: req.file.originalname,
    mimeType: req.file.mimetype,
    fileSize: req.file.size,
    url: `/uploads/${req.file.filename}`,
    altText: req.body.altText || '',
  });
  res.status(201).json({ data: media });
});

export const updateMediaAltText = asyncHandler(async (req, res) => {
  const { altText } = req.body;
  const media = await Media.updateAltText(req.params.id, altText);
  if (!media) {
    return res.status(404).json({ message: 'Media not found.' });
  }
  res.json({ data: media });
});

export const deleteMedia = asyncHandler(async (req, res) => {
  const media = await Media.findById(req.params.id);
  if (!media) {
    return res.status(404).json({ message: 'Media not found.' });
  }
  const filePath = path.join(process.cwd(), 'uploads', media.filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
  await Media.delete(req.params.id);
  res.json({ message: 'Media deleted successfully.' });
});
