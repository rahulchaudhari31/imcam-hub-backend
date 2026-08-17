import { body } from 'express-validator';

export const createDemoRequestValidation = [
  body('company')
    .trim()
    .notEmpty().withMessage('Company name is required.')
    .isLength({ max: 200 }).withMessage('Company name must be 200 characters or fewer.'),
  body('fullName')
    .trim()
    .notEmpty().withMessage('Full name is required.')
    .isLength({ max: 100 }).withMessage('Full name must be 100 characters or fewer.'),
  body('email')
    .trim()
    .isEmail().withMessage('Please provide a valid email address.')
    .normalizeEmail(),
  body('phone')
    .optional({ values: 'null' })
    .trim()
    .isLength({ max: 30 }).withMessage('Phone must be 30 characters or fewer.'),
  body('firmSize')
    .isIn(['1-10', '11-50', '51-200', '201-1000', '1000+']).withMessage('Invalid firm size.'),
  body('message')
    .optional({ values: 'null' })
    .trim()
    .isLength({ max: 2000 }).withMessage('Message must be 2000 characters or fewer.'),
];

export const updateDemoRequestValidation = [
  body('status')
    .isIn(['new', 'contacted', 'scheduled', 'closed']).withMessage('Invalid status value.'),
];
