import Navigation from '../models/navigationModel.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getAllNavigation = asyncHandler(async (req, res) => {
  const activeOnly = req.query.active === 'true';
  const items = activeOnly ? await Navigation.findActive() : await Navigation.findAll();
  res.json({ data: items });
});

export const getNavigationById = asyncHandler(async (req, res) => {
  const item = await Navigation.findById(req.params.id);
  if (!item) {
    return res.status(404).json({ message: 'Navigation item not found.' });
  }
  res.json({ data: item });
});

export const createNavigation = asyncHandler(async (req, res) => {
  const { label, url, parent_id, display_order, is_active, target_blank, icon } = req.body;
  if (!label) {
    return res.status(400).json({ message: 'Label is required.' });
  }
  const item = await Navigation.create({ label, url, parent_id, display_order, is_active, target_blank, icon });
  res.status(201).json({ data: item });
});

export const updateNavigation = asyncHandler(async (req, res) => {
  const item = await Navigation.findById(req.params.id);
  if (!item) {
    return res.status(404).json({ message: 'Navigation item not found.' });
  }
  const updated = await Navigation.update(req.params.id, req.body);
  res.json({ data: updated });
});

export const deleteNavigation = asyncHandler(async (req, res) => {
  const item = await Navigation.findById(req.params.id);
  if (!item) {
    return res.status(404).json({ message: 'Navigation item not found.' });
  }
  await Navigation.delete(req.params.id);
  res.json({ message: 'Navigation item deleted successfully.' });
});

export const reorderNavigation = asyncHandler(async (req, res) => {
  const { items } = req.body;
  if (!Array.isArray(items)) {
    return res.status(400).json({ message: 'Items array is required.' });
  }
  await Navigation.reorder(items);
  res.json({ message: 'Navigation reordered successfully.' });
});