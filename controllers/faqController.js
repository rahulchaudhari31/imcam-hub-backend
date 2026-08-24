import Faq from '../models/faqModel.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getAllFaqs = asyncHandler(async (req, res) => {
  const activeOnly = req.query.active === 'true';
  const faqs = await Faq.findAll({ activeOnly });
  res.json({ data: faqs });
});

export const getFaq = asyncHandler(async (req, res) => {
  const faq = await Faq.findById(req.params.id);
  if (!faq) {
    return res.status(404).json({ message: 'FAQ not found.' });
  }
  res.json({ data: faq });
});

export const createFaq = asyncHandler(async (req, res) => {
  const { question, answer, display_order, is_active } = req.body;
  if (!question || !answer) {
    return res.status(400).json({ message: 'Question and answer are required.' });
  }
  const faq = await Faq.create({ question, answer, display_order, is_active });
  res.status(201).json({ data: faq });
});

export const updateFaq = asyncHandler(async (req, res) => {
  const faq = await Faq.findById(req.params.id);
  if (!faq) {
    return res.status(404).json({ message: 'FAQ not found.' });
  }
  const updated = await Faq.update(req.params.id, req.body);
  res.json({ data: updated });
});

export const deleteFaq = asyncHandler(async (req, res) => {
  const faq = await Faq.findById(req.params.id);
  if (!faq) {
    return res.status(404).json({ message: 'FAQ not found.' });
  }
  await Faq.delete(req.params.id);
  res.json({ message: 'FAQ deleted successfully.' });
});
