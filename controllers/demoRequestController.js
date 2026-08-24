import { validationResult } from 'express-validator';
import DemoRequest from '../models/demoRequestModel.js';
import asyncHandler from '../utils/asyncHandler.js';

// POST /api/demo-requests
export const createDemoRequest = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const { company, fullName, email, phone, firmSize, message } = req.body;

  const existing = await DemoRequest.findByEmail(email);
  if (existing) {
    return res.status(409).json({ message: 'A demo request with this email already exists.' });
  }

  const demoRequest = await DemoRequest.create({
    company,
    fullName,
    email,
    phone,
    firmSize,
    message,
  });

  res.status(201).json({ data: demoRequest });
});

// GET /api/demo-requests
export const listDemoRequests = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const rawLimit = parseInt(req.query.limit, 10);
  if (!Number.isNaN(rawLimit) && rawLimit < 0) {
    return res.status(400).json({ message: 'Limit must be greater than 0.' });
  }
  const limit = Math.min(rawLimit || 20, 100);
  const status = req.query.status || undefined;

  if (status && !['new', 'contacted', 'scheduled', 'closed'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status filter.' });
  }

  const result = await DemoRequest.findAll({ page, limit, status });

  res.json({
    data: result.data,
    pagination: {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: Math.ceil(result.total / result.limit),
    },
  });
});

// GET /api/demo-requests/:id
export const getDemoRequest = asyncHandler(async (req, res) => {
  const demoRequest = await DemoRequest.findById(req.params.id);

  if (!demoRequest) {
    return res.status(404).json({ message: 'Demo request not found.' });
  }

  res.json({ data: demoRequest });
});

// PATCH /api/demo-requests/:id
export const updateDemoRequest = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const demoRequest = await DemoRequest.findById(req.params.id);
  if (!demoRequest) {
    return res.status(404).json({ message: 'Demo request not found.' });
  }

  const updated = await DemoRequest.updateStatus(req.params.id, req.body.status);

  res.json({ data: updated });
});
