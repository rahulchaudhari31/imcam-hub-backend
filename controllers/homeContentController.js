import HomeContent from '../models/homeContentModel.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getAllSections = asyncHandler(async (_req, res) => {
  const sections = await HomeContent.findAll();
  res.json({ data: sections });
});

export const getSection = asyncHandler(async (req, res) => {
  const section = await HomeContent.findBySection(req.params.sectionKey);
  if (!section) {
    return res.status(404).json({ message: 'Section not found.' });
  }
  res.json({ data: section });
});

export const getSectionById = asyncHandler(async (req, res) => {
  const section = await HomeContent.findById(req.params.id);
  if (!section) {
    return res.status(404).json({ message: 'Section not found.' });
  }
  res.json({ data: section });
});

export const createSection = asyncHandler(async (req, res) => {
  const {
    sectionKey,
    section_key,
    title,
    description,
    imageUrl,
    image_url,
    button_text,
    button_link,
    secondaryButtonText,
    secondaryButtonLink,
    content,
    display_order,
    is_active,
  } = req.body;
  const normalizedSectionKey = sectionKey || section_key;
  if (!normalizedSectionKey) {
    return res.status(400).json({ message: 'Section key is required.' });
  }
  const existing = await HomeContent.findBySection(normalizedSectionKey);
  if (existing) {
    return res.status(409).json({ message: 'A section with this key already exists. Use update instead.' });
  }
  const section = await HomeContent.create({
    sectionKey: normalizedSectionKey,
    title,
    description,
    imageUrl: imageUrl ?? image_url,
    button_text,
    button_link,
    secondaryButtonText,
    secondaryButtonLink,
    content,
    display_order,
    is_active,
  });
  res.status(201).json({ data: section });
});

export const updateSection = asyncHandler(async (req, res) => {
  const section = await HomeContent.findById(req.params.id);
  if (!section) {
    return res.status(404).json({ message: 'Section not found.' });
  }
  const updated = await HomeContent.update(req.params.id, {
    ...req.body,
    imageUrl: req.body.imageUrl ?? req.body.image_url,
  });
  res.json({ data: updated });
});

export const deleteSection = asyncHandler(async (req, res) => {
  const section = await HomeContent.findById(req.params.id);
  if (!section) {
    return res.status(404).json({ message: 'Section not found.' });
  }
  await HomeContent.delete(req.params.id);
  res.json({ message: 'Section deleted successfully.' });
});
