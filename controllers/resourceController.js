import { ResourceCategory, Resource } from '../models/resourceModel.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getAllResourceCategories = asyncHandler(async (req, res) => {
  const activeOnly = req.query.active === 'true';
  const categories = activeOnly ? await ResourceCategory.findActive() : await ResourceCategory.findAll();
  res.json({ data: categories });
});

export const getResourceCategoryById = asyncHandler(async (req, res) => {
  const category = await ResourceCategory.findById(req.params.id);
  if (!category) {
    return res.status(404).json({ message: 'Resource category not found.' });
  }
  res.json({ data: category });
});

export const createResourceCategory = asyncHandler(async (req, res) => {
  const { key, label, bg_class, text_class, display_order, is_active } = req.body;
  if (!key || !label) {
    return res.status(400).json({ message: 'Key and label are required.' });
  }
  const category = await ResourceCategory.create({ key, label, bg_class, text_class, display_order, is_active });
  res.status(201).json({ data: category });
});

export const updateResourceCategory = asyncHandler(async (req, res) => {
  const category = await ResourceCategory.findById(req.params.id);
  if (!category) {
    return res.status(404).json({ message: 'Resource category not found.' });
  }
  const updated = await ResourceCategory.update(req.params.id, req.body);
  res.json({ data: updated });
});

export const deleteResourceCategory = asyncHandler(async (req, res) => {
  const category = await ResourceCategory.findById(req.params.id);
  if (!category) {
    return res.status(404).json({ message: 'Resource category not found.' });
  }
  await ResourceCategory.delete(req.params.id);
  res.json({ message: 'Resource category deleted successfully.' });
});

export const reorderResourceCategories = asyncHandler(async (req, res) => {
  const { items } = req.body;
  if (!Array.isArray(items)) {
    return res.status(400).json({ message: 'Items array is required.' });
  }
  await ResourceCategory.reorder(items);
  res.json({ message: 'Categories reordered successfully.' });
});

export const getAllResources = asyncHandler(async (req, res) => {
  const activeOnly = req.query.active === 'true';
  const categoryId = req.query.category_id;
  let resources;
  if (categoryId) {
    resources = await Resource.findByCategory(categoryId);
  } else {
    resources = activeOnly ? await Resource.findActive() : await Resource.findAll();
  }
  res.json({ data: resources });
});

export const getResourceById = asyncHandler(async (req, res) => {
  const resource = await Resource.findById(req.params.id);
  if (!resource) {
    return res.status(404).json({ message: 'Resource not found.' });
  }
  res.json({ data: resource });
});

export const createResource = asyncHandler(async (req, res) => {
  const { category_id, title, excerpt, content, image_url, read_time, published_at, is_active, display_order } = req.body;
  if (!title) {
    return res.status(400).json({ message: 'Title is required.' });
  }
  const resource = await Resource.create({ category_id, title, excerpt, content, image_url, read_time, published_at, is_active, display_order });
  res.status(201).json({ data: resource });
});

export const updateResource = asyncHandler(async (req, res) => {
  const resource = await Resource.findById(req.params.id);
  if (!resource) {
    return res.status(404).json({ message: 'Resource not found.' });
  }
  const updated = await Resource.update(req.params.id, req.body);
  res.json({ data: updated });
});

export const deleteResource = asyncHandler(async (req, res) => {
  const resource = await Resource.findById(req.params.id);
  if (!resource) {
    return res.status(404).json({ message: 'Resource not found.' });
  }
  await Resource.delete(req.params.id);
  res.json({ message: 'Resource deleted successfully.' });
});

export const reorderResources = asyncHandler(async (req, res) => {
  const { categoryId, items } = req.body;
  if (!categoryId || !Array.isArray(items)) {
    return res.status(400).json({ message: 'categoryId and items array are required.' });
  }
  await Resource.reorder(categoryId, items);
  res.json({ message: 'Resources reordered successfully.' });
});