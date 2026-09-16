import { PricingPlan, PricingFeature, PricingComparison } from '../models/pricingModel.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getAllPricingPlans = asyncHandler(async (req, res) => {
  const activeOnly = req.query.active === 'true';
  const plans = activeOnly ? await PricingPlan.findActive() : await PricingPlan.findAll();
  for (const plan of plans) {
    plan.features = await PricingFeature.findByPlanId(plan.id);
  }
  const comparison = await PricingComparison.findAll();
  res.json({ data: { plans, comparison } });
});

export const getPricingPlanById = asyncHandler(async (req, res) => {
  const plan = await PricingPlan.findById(req.params.id);
  if (!plan) {
    return res.status(404).json({ message: 'Pricing plan not found.' });
  }
  plan.features = await PricingFeature.findByPlanId(plan.id);
  res.json({ data: plan });
});

export const createPricingPlan = asyncHandler(async (req, res) => {
  const { features, ...planData } = req.body;
  if (!planData.name || !planData.monthly_price || !planData.annual_price || !planData.cta_text) {
    return res.status(400).json({ message: 'Name, monthly_price, annual_price, and cta_text are required.' });
  }
  const plan = await PricingPlan.create(planData);
  if (features && Array.isArray(features)) {
    for (const feature of features) {
      await PricingFeature.create({ pricingPlanId: plan.id, ...feature });
    }
  }
  plan.features = await PricingFeature.findByPlanId(plan.id);
  res.status(201).json({ data: plan });
});

export const updatePricingPlan = asyncHandler(async (req, res) => {
  const plan = await PricingPlan.findById(req.params.id);
  if (!plan) {
    return res.status(404).json({ message: 'Pricing plan not found.' });
  }
  const { features, ...planData } = req.body;
  const updated = await PricingPlan.update(req.params.id, planData);
  if (features && Array.isArray(features)) {
    for (const feature of features) {
      if (feature.id) {
        await PricingFeature.update(feature.id, feature);
      } else {
        await PricingFeature.create({ pricingPlanId: plan.id, ...feature });
      }
    }
  }
  updated.features = await PricingFeature.findByPlanId(plan.id);
  res.json({ data: updated });
});

export const deletePricingPlan = asyncHandler(async (req, res) => {
  const plan = await PricingPlan.findById(req.params.id);
  if (!plan) {
    return res.status(404).json({ message: 'Pricing plan not found.' });
  }
  await PricingPlan.delete(req.params.id);
  res.json({ message: 'Pricing plan deleted successfully.' });
});

export const reorderPricingPlanFeatures = asyncHandler(async (req, res) => {
  const { planId, items } = req.body;
  if (!planId || !Array.isArray(items)) {
    return res.status(400).json({ message: 'planId and items array are required.' });
  }
  await PricingFeature.reorder(planId, items);
  res.json({ message: 'Features reordered successfully.' });
});

export const getPricingComparison = asyncHandler(async (req, res) => {
  const comparison = await PricingComparison.findAll();
  res.json({ data: comparison });
});

export const createPricingComparison = asyncHandler(async (req, res) => {
  const { label, standard_value, pro_value, display_order } = req.body;
  if (!label) {
    return res.status(400).json({ message: 'Label is required.' });
  }
  const item = await PricingComparison.create({ label, standard_value, pro_value, display_order });
  res.status(201).json({ data: item });
});

export const updatePricingComparison = asyncHandler(async (req, res) => {
  const item = await PricingComparison.update(req.params.id, req.body);
  if (!item) {
    return res.status(404).json({ message: 'Comparison item not found.' });
  }
  res.json({ data: item });
});

export const deletePricingComparison = asyncHandler(async (req, res) => {
  const item = await PricingComparison.delete(req.params.id);
  if (!item) {
    return res.status(404).json({ message: 'Comparison item not found.' });
  }
  res.json({ message: 'Comparison item deleted successfully.' });
});

export const reorderPricingComparison = asyncHandler(async (req, res) => {
  const { items } = req.body;
  if (!Array.isArray(items)) {
    return res.status(400).json({ message: 'Items array is required.' });
  }
  await PricingComparison.reorder(items);
  res.json({ message: 'Comparison reordered successfully.' });
});