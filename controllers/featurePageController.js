import { FeaturePage, FeaturePageFeature } from '../models/featurePageModel.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getAllFeaturePages = asyncHandler(async (req, res) => {
  const pages = await FeaturePage.findAll();
  res.json({ data: pages });
});

export const getFeaturePageByKey = asyncHandler(async (req, res) => {
  const page = await FeaturePage.findByPageKey(req.params.pageKey);
  if (!page) {
    return res.status(404).json({ message: 'Feature page not found.' });
  }
  const features = await FeaturePageFeature.findByPageId(page.id);
  res.json({ data: { ...page, features } });
});

export const getFeaturePageById = asyncHandler(async (req, res) => {
  const page = await FeaturePage.findById(req.params.id);
  if (!page) {
    return res.status(404).json({ message: 'Feature page not found.' });
  }
  const features = await FeaturePageFeature.findByPageId(page.id);
  res.json({ data: { ...page, features } });
});

export const createFeaturePage = asyncHandler(async (req, res) => {
  const { pageKey, roleName, bannerText, features, ...rest } = req.body;
  if (!pageKey || !roleName || !bannerText) {
    return res.status(400).json({ message: 'pageKey, roleName, and bannerText are required.' });
  }
  const existing = await FeaturePage.findByPageKey(pageKey);
  if (existing) {
    return res.status(409).json({ message: 'A feature page with this key already exists.' });
  }
  const page = await FeaturePage.create({ pageKey, roleName, bannerText, ...rest });
  if (features && Array.isArray(features)) {
    for (const feature of features) {
      await FeaturePageFeature.create({ featurePageId: page.id, ...feature });
    }
  }
  const createdFeatures = await FeaturePageFeature.findByPageId(page.id);
  res.status(201).json({ data: { ...page, features: createdFeatures } });
});

export const updateFeaturePage = asyncHandler(async (req, res) => {
  const page = await FeaturePage.findById(req.params.id);
  if (!page) {
    return res.status(404).json({ message: 'Feature page not found.' });
  }
  const { features, ...rest } = req.body;
  const updated = await FeaturePage.update(req.params.id, rest);
  if (features && Array.isArray(features)) {
    for (const feature of features) {
      if (feature.id) {
        await FeaturePageFeature.update(feature.id, feature);
      } else {
        await FeaturePageFeature.create({ featurePageId: page.id, ...feature });
      }
    }
  }
  const updatedFeatures = await FeaturePageFeature.findByPageId(page.id);
  res.json({ data: { ...updated, features: updatedFeatures } });
});

export const deleteFeaturePage = asyncHandler(async (req, res) => {
  const page = await FeaturePage.findById(req.params.id);
  if (!page) {
    return res.status(404).json({ message: 'Feature page not found.' });
  }
  await FeaturePage.delete(req.params.id);
  res.json({ message: 'Feature page deleted successfully.' });
});

export const reorderFeaturePageFeatures = asyncHandler(async (req, res) => {
  const { pageId, items } = req.body;
  if (!pageId || !Array.isArray(items)) {
    return res.status(400).json({ message: 'pageId and items array are required.' });
  }
  await FeaturePageFeature.reorder(pageId, items);
  res.json({ message: 'Features reordered successfully.' });
});

export const getFeaturePageFeatures = asyncHandler(async (req, res) => {
  const features = await FeaturePageFeature.findByPageId(req.params.pageId);
  res.json({ data: features });
});

export const createFeaturePageFeature = asyncHandler(async (req, res) => {
  const { featurePageId, icon, title, description, display_order, color_class } = req.body;
  if (!featurePageId || !icon || !title) {
    return res.status(400).json({ message: 'featurePageId, icon, and title are required.' });
  }
  const feature = await FeaturePageFeature.create({ featurePageId, icon, title, description, display_order, color_class });
  res.status(201).json({ data: feature });
});

export const updateFeaturePageFeature = asyncHandler(async (req, res) => {
  const { icon, title, description, display_order, color_class } = req.body;
  const feature = await FeaturePageFeature.update(req.params.id, { icon, title, description, display_order, color_class });
  if (!feature) {
    return res.status(404).json({ message: 'Feature not found.' });
  }
  res.json({ data: feature });
});

export const deleteFeaturePageFeature = asyncHandler(async (req, res) => {
  const feature = await FeaturePageFeature.delete(req.params.id);
  if (!feature) {
    return res.status(404).json({ message: 'Feature not found.' });
  }
  res.json({ message: 'Feature deleted successfully.' });
});