import { body, param } from 'express-validator';

const validCaseTypes = ['skilled_worker', 'sponsor_licence', 'ilr', 'british_citizenship', 'family_visa', 'student_visa', 'visitor_visa', 'other'];
const validStatuses = ['pending', 'active', 'on_hold', 'completed', 'closed'];
const validPriorities = ['low', 'medium', 'high', 'urgent'];

export const createCaseValidation = [
  body('clientId')
    .notEmpty().withMessage('Client is required.')
    .isInt({ min: 1 }).withMessage('Invalid client ID format.'),
  body('caseworkerId')
    .optional()
    .isInt({ min: 1 }).withMessage('Invalid caseworker ID format.'),
  body('caseType')
    .notEmpty().withMessage('Case type is required.')
    .isIn(validCaseTypes).withMessage('Invalid case type.'),
  body('priority')
    .optional()
    .isIn(validPriorities).withMessage('Invalid priority.'),
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required.')
    .isLength({ max: 200 }).withMessage('Title must be 200 characters or fewer.'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 5000 }).withMessage('Description must be 5000 characters or fewer.'),
  body('status')
    .optional()
    .isIn(validStatuses).withMessage('Invalid status.'),
];

export const updateCaseValidation = [
  param('id').isUUID().withMessage('Invalid case ID format.'),
  body('caseworkerId')
    .optional()
    .isInt({ min: 1 }).withMessage('Invalid caseworker ID format.'),
  body('status')
    .optional()
    .isIn(validStatuses).withMessage('Invalid status.'),
  body('priority')
    .optional()
    .isIn(validPriorities).withMessage('Invalid priority.'),
  body('caseType')
    .optional()
    .isIn(validCaseTypes).withMessage('Invalid case type.'),
  body('title')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Title must be 200 characters or fewer.'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 5000 }).withMessage('Description must be 5000 characters or fewer.'),
];

export const getCaseValidation = [
  param('id').isUUID().withMessage('Invalid case ID format.'),
];

export const listCasesValidation = [
  // Query params validation handled in controller
];