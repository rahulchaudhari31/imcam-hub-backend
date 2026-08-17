const errorHandler = (err, req, res, _next) => {
  console.error('Unhandled error:', err);

  if (err.code === '23505') {
    return res.status(409).json({ message: 'A record with this value already exists.' });
  }

  if (err.code === '22P02') {
    return res.status(400).json({ message: 'Invalid input format.' });
  }

  res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
};

export default errorHandler;
