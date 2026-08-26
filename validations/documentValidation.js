import { body, param, query } from 'express-validator';

const validDocumentTypes = [
  'passport',
  'identity_document',
  'education_document',
  'employment_document',
  'financial_document',
  'visa_document',
  'application_form',
  'other',
];

const validStatuses = ['pending', 'approved', 'rejected'];

export const uploadDocumentValidation = [
  param('caseId').isUUID().withMessage('Invalid case ID format.'),
  body('documentType')
    .notEmpty().withMessage('Document type is required.')
    .isIn(validDocumentTypes).withMessage('Invalid document type.'),
];

export const listDocumentsValidation = [
  param('caseId').isUUID().withMessage('Invalid case ID format.'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer.'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100.'),
];

export const getDocumentValidation = [
  param('id').isUUID().withMessage('Invalid document ID format.'),
];

export const updateDocumentValidation = [
  param('id').isUUID().withMessage('Invalid document ID format.'),
  body('status')
    .optional()
    .isIn(validStatuses).withMessage('Invalid status.'),
  body('documentType')
    .optional()
    .isIn(validDocumentTypes).withMessage('Invalid document type.'),
];

export const deleteDocumentValidation = [
  param('id').isUUID().withMessage('Invalid document ID format.'),
];