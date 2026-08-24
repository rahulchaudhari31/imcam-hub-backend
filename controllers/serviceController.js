import Service from '../models/serviceModel.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getAllServices = asyncHandler(async (req, res) => {
  const activeOnly = req.query.active === 'true';
  const services = await Service.findAll({ activeOnly });
  res.json({ data: services });
});

export const getService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) {
    return res.status(404).json({ message: 'Service not found.' });
  }
  res.json({ data: service });
});

export const createService = asyncHandler(async (req, res) => {
  const { title, description, imageUrl, image_url, icon, display_order, is_active } = req.body;
  if (!title) {
    return res.status(400).json({ message: 'Title is required.' });
  }
  const service = await Service.create({
    title,
    description,
    imageUrl: imageUrl ?? image_url,
    icon,
    display_order,
    is_active,
  });
  res.status(201).json({ data: service });
});

export const updateService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) {
    return res.status(404).json({ message: 'Service not found.' });
  }
  const updated = await Service.update(req.params.id, {
    ...req.body,
    imageUrl: req.body.imageUrl ?? req.body.image_url,
  });
  res.json({ data: updated });
});

export const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) {
    return res.status(404).json({ message: 'Service not found.' });
  }
  await Service.delete(req.params.id);
  res.json({ message: 'Service deleted successfully.' });
});
