import WebsiteSettings from '../models/websiteSettingsModel.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getAllSettings = asyncHandler(async (_req, res) => {
  const settings = await WebsiteSettings.findAll();
  const mapped = {};
  for (const s of settings) {
    mapped[s.setting_key] = s.setting_value;
  }
  res.json({ data: mapped });
});

export const getSetting = asyncHandler(async (req, res) => {
  const setting = await WebsiteSettings.findByKey(req.params.key);
  if (!setting) {
    return res.status(404).json({ message: 'Setting not found.' });
  }
  res.json({ data: setting });
});

export const updateSetting = asyncHandler(async (req, res) => {
  const { value } = req.body;
  if (value === undefined) {
    return res.status(400).json({ message: 'Value is required.' });
  }
  const setting = await WebsiteSettings.upsert(req.params.key, value);
  res.json({ data: setting });
});

export const bulkUpdateSettings = asyncHandler(async (req, res) => {
  const { settings } = req.body;
  if (!settings || !Array.isArray(settings)) {
    return res.status(400).json({ message: 'Settings array is required.' });
  }
  const results = await WebsiteSettings.bulkUpsert(settings);
  res.json({ data: results });
});
