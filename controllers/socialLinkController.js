import SocialLink from '../models/socialLinkModel.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getAllSocialLinks = asyncHandler(async (_req, res) => {
  const links = await SocialLink.findAll();
  res.json({ data: links });
});

export const getSocialLink = asyncHandler(async (req, res) => {
  const link = await SocialLink.findById(req.params.id);
  if (!link) {
    return res.status(404).json({ message: 'Social link not found.' });
  }
  res.json({ data: link });
});

export const createSocialLink = asyncHandler(async (req, res) => {
  const { platform, url, display_order, is_active } = req.body;
  if (!platform || !url) {
    return res.status(400).json({ message: 'Platform and URL are required.' });
  }
  const link = await SocialLink.create({ platform, url, display_order, is_active });
  res.status(201).json({ data: link });
});

export const updateSocialLink = asyncHandler(async (req, res) => {
  const link = await SocialLink.findById(req.params.id);
  if (!link) {
    return res.status(404).json({ message: 'Social link not found.' });
  }
  const updated = await SocialLink.update(req.params.id, req.body);
  res.json({ data: updated });
});

export const deleteSocialLink = asyncHandler(async (req, res) => {
  const link = await SocialLink.findById(req.params.id);
  if (!link) {
    return res.status(404).json({ message: 'Social link not found.' });
  }
  await SocialLink.delete(req.params.id);
  res.json({ message: 'Social link deleted successfully.' });
});
