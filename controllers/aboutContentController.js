import AboutContent from '../models/aboutContentModel.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getAboutContent = asyncHandler(async (_req, res) => {
  const content = await AboutContent.find();
  res.json({ data: content || {} });
});

export const updateAboutContent = asyncHandler(async (req, res) => {
  const { heading, description, mission, vision, values, imageUrl, image_url, content } = req.body;
  const updated = await AboutContent.update({
    heading,
    description,
    mission,
    vision,
    values,
    imageUrl: imageUrl ?? image_url,
    content,
  });
  res.json({ data: updated });
});
