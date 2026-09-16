import SolutionsContent from '../models/solutionsModel.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getAllSolutions = asyncHandler(async (req, res) => {
  const activeOnly = req.query.active === 'true';
  const sections = activeOnly ? await SolutionsContent.findActive() : await SolutionsContent.findAll();
  res.json({ data: sections });
});

export const getSolutionsBySectionKey = asyncHandler(async (req, res) => {
  const section = await SolutionsContent.findBySectionKey(req.params.sectionKey);
  if (!section) {
    return res.status(404).json({ message: 'Solutions section not found.' });
  }
  res.json({ data: section });
});

export const getSolutionsById = asyncHandler(async (req, res) => {
  const section = await SolutionsContent.findById(req.params.id);
  if (!section) {
    return res.status(404).json({ message: 'Solutions section not found.' });
  }
  res.json({ data: section });
});

export const createSolutions = asyncHandler(async (req, res) => {
  const { sectionKey, title, description, content, display_order, is_active } = req.body;
  if (!sectionKey) {
    return res.status(400).json({ message: 'Section key is required.' });
  }
  const existing = await SolutionsContent.findBySectionKey(sectionKey);
  if (existing) {
    return res.status(409).json({ message: 'A section with this key already exists. Use update instead.' });
  }
  const section = await SolutionsContent.create({ sectionKey, title, description, content, display_order, is_active });
  res.status(201).json({ data: section });
});

export const updateSolutions = asyncHandler(async (req, res) => {
  const section = await SolutionsContent.findById(req.params.id);
  if (!section) {
    return res.status(404).json({ message: 'Solutions section not found.' });
  }
  const updated = await SolutionsContent.update(req.params.id, req.body);
  res.json({ data: updated });
});

export const deleteSolutions = asyncHandler(async (req, res) => {
  const section = await SolutionsContent.findById(req.params.id);
  if (!section) {
    return res.status(404).json({ message: 'Solutions section not found.' });
  }
  await SolutionsContent.delete(req.params.id);
  res.json({ message: 'Solutions section deleted successfully.' });
});