import Testimonial from '../models/testimonialModel.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getAllTestimonials = asyncHandler(async (req, res) => {
  const activeOnly = req.query.active === 'true';
  const testimonials = await Testimonial.findAll({ activeOnly });
  res.json({ data: testimonials });
});

export const getTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);
  if (!testimonial) {
    return res.status(404).json({ message: 'Testimonial not found.' });
  }
  res.json({ data: testimonial });
});

export const createTestimonial = asyncHandler(async (req, res) => {
  const { fullName, company, role, testimonial, imageUrl, rating, is_active } = req.body;
  if (!fullName || !testimonial) {
    return res.status(400).json({ message: 'Full name and testimonial are required.' });
  }
  const t = await Testimonial.create({ fullName, company, role, testimonial, imageUrl, rating, is_active });
  res.status(201).json({ data: t });
});

export const updateTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);
  if (!testimonial) {
    return res.status(404).json({ message: 'Testimonial not found.' });
  }
  const updated = await Testimonial.update(req.params.id, req.body);
  res.json({ data: updated });
});

export const deleteTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);
  if (!testimonial) {
    return res.status(404).json({ message: 'Testimonial not found.' });
  }
  await Testimonial.delete(req.params.id);
  res.json({ message: 'Testimonial deleted successfully.' });
});
