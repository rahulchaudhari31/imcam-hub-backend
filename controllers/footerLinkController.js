import FooterLink from '../models/footerLinkModel.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getAllFooterLinks = asyncHandler(async (req, res) => {
  const activeOnly = req.query.active === 'true';
  const links = activeOnly ? await FooterLink.findActive() : await FooterLink.findAll();
  res.json({ data: links });
});

export const getFooterLinksGrouped = asyncHandler(async (req, res) => {
  const grouped = await FooterLink.getAllGrouped();
  res.json({ data: grouped });
});

export const getFooterLinkById = asyncHandler(async (req, res) => {
  const link = await FooterLink.findById(req.params.id);
  if (!link) {
    return res.status(404).json({ message: 'Footer link not found.' });
  }
  res.json({ data: link });
});

export const createFooterLink = asyncHandler(async (req, res) => {
  const { group_key, label, url, display_order, is_active } = req.body;
  if (!group_key || !label) {
    return res.status(400).json({ message: 'Group key and label are required.' });
  }
  const link = await FooterLink.create({ group_key, label, url, display_order, is_active });
  res.status(201).json({ data: link });
});

export const updateFooterLink = asyncHandler(async (req, res) => {
  const link = await FooterLink.findById(req.params.id);
  if (!link) {
    return res.status(404).json({ message: 'Footer link not found.' });
  }
  const updated = await FooterLink.update(req.params.id, req.body);
  res.json({ data: updated });
});

export const deleteFooterLink = asyncHandler(async (req, res) => {
  const link = await FooterLink.findById(req.params.id);
  if (!link) {
    return res.status(404).json({ message: 'Footer link not found.' });
  }
  await FooterLink.delete(req.params.id);
  res.json({ message: 'Footer link deleted successfully.' });
});

export const reorderFooterLinks = asyncHandler(async (req, res) => {
  const { groupKey, items } = req.body;
  if (!groupKey || !Array.isArray(items)) {
    return res.status(400).json({ message: 'groupKey and items array are required.' });
  }
  await FooterLink.reorder(groupKey, items);
  res.json({ message: 'Footer links reordered successfully.' });
});