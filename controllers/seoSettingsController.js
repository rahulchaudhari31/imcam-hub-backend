import SeoSettings from '../models/seoSettingsModel.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getAllSeo = asyncHandler(async (_req, res) => {
  const settings = await SeoSettings.findAll();
  res.json({ data: settings });
});

export const getSeoByPage = asyncHandler(async (req, res) => {
  const settings = await SeoSettings.findByPageKey(req.params.pageKey);
  res.json({ data: settings || {} });
});

export const upsertSeo = asyncHandler(async (req, res) => {
  const { page_key, page_title, meta_description, meta_keywords, og_title, og_description, og_image } = req.body;
  if (!page_key) {
    return res.status(400).json({ message: 'Page key is required.' });
  }
  const settings = await SeoSettings.upsert({ page_key, page_title, meta_description, meta_keywords, og_title, og_description, og_image });
  res.json({ data: settings });
});
